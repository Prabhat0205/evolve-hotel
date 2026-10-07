import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, ShieldCheck, Lock, Calendar, Users, 
  Sparkles, CheckCircle2, ArrowLeft, Bed, Info, LogIn, UserPlus, UserCircle2, Check,
  ShoppingBag, Plus, Minus, Trash2, X
} from 'lucide-react';
import { Reservation, User } from '../types';

export const CheckoutPage: React.FC = () => {
  const { 
    selectedProperty, selectedRoom, selectedRate, 
    selectedRooms, removeRoomFromOrder, updateRoomQuantity, clearRoomOrder,
    searchDates, currentUser, isMember, navigateTo, 
    setLastConfirmedReservation, addToast, openAuthModal,
    activeGuestCode, activeGuestPhone, addReservation, loginUser
  } = useApp();

  // If no room selected, fallback to first room
  const room = selectedRoom || {
    id: 'kyoto-imperial-suite',
    name: 'Imperial Higashiyama Suite',
    category: 'SUITE',
    sizeSqm: 88,
    bedConfig: '1 King Bed',
    rates: [],
    propertyId: selectedProperty?.id || 'p1',
    description: '',
    maxGuests: 3,
    images: [selectedProperty?.heroImage || ''],
    amenities: []
  };

  // Checkout Mode Logic
  const [checkoutMode, setCheckoutMode] = useState<'guest' | 'authenticated'>(currentUser ? 'authenticated' : 'guest');
  
  useEffect(() => {
    if (currentUser) {
      setCheckoutMode('authenticated');
    }
  }, [currentUser]);

  const isGuestCheckout = checkoutMode === 'guest' || !currentUser?.isMember;

  const rawRate = selectedRate || {
    id: 'rate-1',
    rateType: 'MEMBER_EXCLUSIVE',
    title: 'Evolve Member Privilege Suite Rate',
    nightlyPrice: selectedProperty?.startingRate || 480,
    cancellationPolicy: {
      isFreeCancellation: true,
      deadlineHoursPrior: 48,
      penaltyDescription: 'Free cancellation up to 48h prior to arrival.'
    },
    includesBreakfast: true,
    bonusPoints: 960,
    description: ''
  };

  const rate = isGuestCheckout ? {
    ...rawRate,
    title: checkoutMode === 'guest' ? 'Standard Guest Rate (Room Only)' : (rawRate.title.includes('Member') ? 'Standard Suite Rate (Room Only)' : rawRate.title),
    includesBreakfast: false,
    bonusPoints: 0
  } : rawRate;

  // Enhancement states (matches screenshot for member login)
  const [spaAccessSelected, setSpaAccessSelected] = useState(true);
  const [useFreeNight, setUseFreeNight] = useState(false);

  // Cancellation date calculation helper (48h prior to check-in)
  const getCancellationDateStr = (dateStr?: string) => {
    try {
      if (!dateStr) return 'September 17';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        d.setDate(d.getDate() - 2);
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }
      return 'September 17';
    } catch {
      return 'September 17';
    }
  };

  // Resolve order items from multi-room selection or fallback to current single selection
  const fallbackOrderItem = {
    id: 'single-room-selection',
    room,
    rate,
    quantity: 1
  };

  const calculateNights = (inDateStr?: string, outDateStr?: string): number => {
    try {
      if (!inDateStr || !outDateStr) return 1;
      const dIn = new Date(inDateStr);
      const dOut = new Date(outDateStr);
      const diff = Math.round((dOut.getTime() - dIn.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights(searchDates.checkIn, searchDates.checkOut);

  // Sync order items: if member, ensure room uses member rate; if guest, standard rate
  const resolvedOrderItems = (selectedRooms.length > 0 ? selectedRooms : [fallbackOrderItem]).map(item => {
    if (!isGuestCheckout) {
      const memberRate = item.room.rates.find(r => r.rateType === 'MEMBER_EXCLUSIVE');
      if (memberRate && item.rate.rateType !== 'MEMBER_EXCLUSIVE') {
        return { ...item, rate: memberRate };
      }
    } else if (checkoutMode === 'guest') {
      const standardRate = item.room.rates.find(r => r.rateType === 'BEST_AVAILABLE') || item.room.rates[0];
      if (standardRate && item.rate.rateType !== 'BEST_AVAILABLE') {
        return { ...item, rate: standardRate };
      }
    }
    return item;
  });

  const orderItems = resolvedOrderItems;
  const totalRoomsCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  const nightlySubtotal = orderItems.reduce((acc, item) => {
    return acc + item.rate.nightlyPrice * item.quantity;
  }, 0);

  const freeNightDiscount = (useFreeNight && !isGuestCheckout) ? (orderItems[0]?.rate.nightlyPrice || 480) : 0;
  const subtotal = Math.max(0, nightlySubtotal * nights - freeNightDiscount);
  const taxesAndFees = Math.round(subtotal * 0.12);
  const total = subtotal + taxesAndFees;

  // Form states
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToPolicies, setAgreedToPolicies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  // Sync current user fields when user logs in during checkout
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const executeFinalizeBooking = (userToAttach?: User | null) => {
    setSubmitting(true);
    setTimeout(() => {
      const code = `EV-${Math.floor(100000 + Math.random() * 900000)}`;

      const bookedRoomsList = orderItems.map(item => ({
        roomName: item.room.name,
        bedConfig: item.room.bedConfig,
        rateTitle: item.rate.title,
        nightlyRate: item.rate.nightlyPrice,
        quantity: item.quantity
      }));

      const primaryRoomTitle = orderItems.length === 1
        ? `${orderItems[0].quantity > 1 ? `${orderItems[0].quantity}× ` : ''}${orderItems[0].room.name}`
        : `${totalRoomsCount} Rooms (${orderItems.map(i => `${i.quantity}× ${i.room.name}`).join(', ')})`;

      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        confirmationCode: code,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyCity: `${selectedProperty.city}, ${selectedProperty.country}`,
        propertyAddress: selectedProperty.address,
        propertyImage: selectedProperty.heroImage,
        roomName: primaryRoomTitle,
        roomCategory: orderItems[0]?.room.category || 'SUITE',
        checkInDate: searchDates.checkIn,
        checkOutDate: searchDates.checkOut,
        nightsCount: nights,
        guestsCount: { adults: searchDates.adults, children: searchDates.children },
        status: 'CONFIRMED',
        rateType: orderItems.length === 1 ? orderItems[0].rate.title : `${totalRoomsCount} Suites Combined Rate`,
        nightlyRate: nightlySubtotal,
        taxesAndFees,
        totalAmount: total,
        currency: 'USD',
        paymentMethod: { brand: 'visa', last4: '4242' },
        cancellationDeadline: '48 hours prior to check-in (15:00 local time)',
        specialRequests: `${spaAccessSelected && userToAttach?.isMember ? 'Hydrotherapy Spa Access included. ' : ''}${specialRequests}`,
        guestPhone: phone,
        guestEmail: email,
        guestName: `${firstName} ${lastName}`.trim(),
        userId: userToAttach ? userToAttach.id : (currentUser ? currentUser.id : undefined),
        bookedRooms: bookedRoomsList
      };

      setLastConfirmedReservation(newReservation);
      addReservation(newReservation);
      clearRoomOrder();
      setSubmitting(false);

      if (userToAttach?.isMember) {
        addToast('success', 'Evolve Rewards Member Booking!', `Reservation confirmed! Booking reference: ${code}`);
      } else {
        addToast('success', 'Reservation Confirmed!', `Booking reference: ${code}`);
      }
      
      navigateTo('confirmation');
    }, 400);
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      addToast('error', 'Name Required', 'Please enter your first and last name.');
      return;
    }
    if (!phone.trim()) {
      addToast('error', 'Phone Required', 'A mobile phone number is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      addToast('error', 'Email Required', 'Please enter a valid email address.');
      return;
    }
    if (!agreedToPolicies) {
      addToast('error', 'Policy Acknowledgment Required', 'Please acknowledge the hotel cancellation policy.');
      return;
    }

    // If user is not already a member, show the Evolve Rewards modal (Screenshot 3)
    if (!currentUser?.isMember) {
      setShowRewardsModal(true);
      return;
    }

    executeFinalizeBooking(currentUser);
  };

  const handleJoinFree = () => {
    setShowRewardsModal(false);
    const memberId = `EV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMemberUser: User = {
      id: `member-${Date.now()}`,
      customerId: memberId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      isEmailVerified: true,
      isPhoneVerified: true,
      isMember: true,
      memberProfile: {
        memberId,
        tier: 'MEMBER',
        unusedRewardNights: 0,
        qualifyingNightsThisYear: nights,
        qualifyingNightsNeededForNextTier: Math.max(0, 9 - nights),
        lifetimeQualifyingNights: nights,
        memberSinceYear: new Date().getFullYear(),
      },
      paymentMethods: [],
      preferences: { quietRoom: true }
    };
    loginUser(newMemberUser);
    executeFinalizeBooking(newMemberUser);
  };

  const handleNoThanks = () => {
    setShowRewardsModal(false);
    executeFinalizeBooking(null);
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div className="app-container" style={{ maxWidth: '1100px' }}>
        <button
          onClick={() => navigateTo('property-detail')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#173f34',
            fontWeight: 700,
            fontSize: '0.875rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} /> Back to Room Selection
        </button>

        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow-text">SECURE CHECKOUT</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#17271f' }}>
            Finalize Your Reservation
          </h1>
          <p style={{ color: '#6e7a76', fontSize: '0.9375rem' }}>
            {checkoutMode === 'guest' ? 'You are booking as a guest. A Guest Code will be provided after confirmation.' : 'Direct booking with Best Available Rate guarantee and immediate voucher issuance.'}
          </p>
        </div>

        <form onSubmit={handleCompleteBooking}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Multi-Room Order Breakdown Card */}
              <div className="evolve-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: 0, fontWeight: 700 }}>
                      Selected Suites & Rooms in Order ({totalRoomsCount})
                    </h3>
                    <p style={{ color: '#6e7a76', fontSize: '0.8125rem', margin: '4px 0 0 0' }}>
                      All accommodations below will be guaranteed together on this reservation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('property-detail')}
                    style={{
                      backgroundColor: '#f6f3ec',
                      color: '#173f34',
                      border: '1.5px solid #173f34',
                      borderRadius: '9999px',
                      padding: '7px 14px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} /> Add Another Suite
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orderItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderRadius: '14px',
                        backgroundColor: '#faf9f5',
                        border: '1px solid #eeece5',
                        gap: '14px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px', flex: 1 }}>
                        <img
                          src={item.room.images[0] || selectedProperty.heroImage}
                          alt={item.room.name}
                          style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#17271f', margin: 0 }}>
                            {item.room.name}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Bed size={13} color="#dda943" /> {item.room.bedConfig}
                            </span>
                            <span>•</span>
                            <span>{item.room.maxGuests} Guests Max</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#997125', fontWeight: 600, marginTop: '2px' }}>
                            {item.rate.title} · ${item.rate.nightlyPrice}/night
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        {selectedRooms.length > 0 && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #d8d6cf',
                            borderRadius: '8px',
                            padding: '4px 8px'
                          }}>
                            <button
                              type="button"
                              onClick={() => updateRoomQuantity(item.id, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#17271f' }}
                              title="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateRoomQuantity(item.id, item.quantity + 1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#17271f' }}
                              title="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}

                        <div style={{ textAlign: 'right', minWidth: '90px' }}>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#17271f' }}>
                            ${item.quantity * item.rate.nightlyPrice * nights}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: '#6e7a76' }}>
                            ${item.quantity * item.rate.nightlyPrice}/nt ({nights}N)
                          </div>
                        </div>

                        {selectedRooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoomFromOrder(item.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53929', padding: '4px' }}
                            title="Remove room from order"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who's Checking In Card (Matching User Screenshot) */}
              <div className="evolve-card" style={{ padding: '32px' }}>
                <h2 style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  color: '#17271f',
                  margin: '0 0 24px 0',
                  fontWeight: 700
                }}>
                  Who’s Checking In?
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, color: '#17271f', fontSize: '0.875rem', marginBottom: '6px' }}>
                      First name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      required
                      style={{ borderRadius: '10px', padding: '12px 14px', border: '1.5px solid #dcd7cb' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, color: '#17271f', fontSize: '0.875rem', marginBottom: '6px' }}>
                      Last name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      required
                      style={{ borderRadius: '10px', padding: '12px 14px', border: '1.5px solid #dcd7cb' }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, color: '#17271f', fontSize: '0.875rem', marginBottom: '6px' }}>
                      Mobile phone
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                      style={{ borderRadius: '10px', padding: '12px 14px', border: '1.5px solid #dcd7cb' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, color: '#17271f', fontSize: '0.875rem', marginBottom: '6px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="guest@example.com"
                      required
                      style={{ borderRadius: '10px', padding: '12px 14px', border: '1.5px solid #dcd7cb' }}
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#55655f', fontSize: '0.8125rem', marginBottom: '6px' }}>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g., high floor, quiet zone, feather-free pillows, late arrival..."
                    style={{ borderRadius: '10px', padding: '10px 14px', border: '1.5px solid #dcd7cb' }}
                  />
                </div>

                {/* Member Only: Enhance your stay section */}
                {!isGuestCheckout && (
                  <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #eeece5' }}>
                    <h4 style={{ fontSize: '1.15rem', color: '#17271f', margin: '0 0 6px 0', fontWeight: 700 }}>
                      Enhance your stay
                    </h4>
                    <p style={{ color: '#6e7a76', fontSize: '0.875rem', margin: '0 0 16px 0' }}>
                      Choose any optional benefits for this stay.
                    </p>

                    <div 
                      onClick={() => setSpaAccessSelected(!spaAccessSelected)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: spaAccessSelected ? '2px solid #173f34' : '1.5px solid #d8d6cf',
                        backgroundColor: spaAccessSelected ? '#edf5f0' : '#ffffff',
                        cursor: 'pointer',
                        marginBottom: '10px'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        backgroundColor: spaAccessSelected ? '#9aa9a1' : '#ffffff',
                        border: spaAccessSelected ? 'none' : '1.5px solid #cccccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {spaAccessSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17271f' }}>
                          Hydrotherapy Spa Access
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#55655f' }}>
                          Included automatically with your Evolve membership
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        const hasRewardNight = (currentUser?.memberProfile?.unusedRewardNights || 0) > 0;
                        const qualifyingNights = currentUser?.memberProfile?.qualifyingNightsThisYear || 4;
                        if (hasRewardNight || qualifyingNights >= 9) {
                          setUseFreeNight(!useFreeNight);
                          addToast('success', useFreeNight ? 'Reward Removed' : 'Free Night Applied', useFreeNight ? 'Standard rate restored.' : `1 Free Night reward applied (-$${rate.nightlyPrice}).`);
                        } else {
                          addToast('info', 'Free Night Locked', `Unlock after 9 qualifying nights. You currently have ${qualifyingNights}/9 qualifying nights.`);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: useFreeNight ? '2px solid #173f34' : '1.5px solid #e2ded4',
                        backgroundColor: useFreeNight ? '#edf5f0' : '#f8f9fa',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        backgroundColor: useFreeNight ? '#173f34' : '#ffffff',
                        border: useFreeNight ? 'none' : '1.5px solid #cccccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {useFreeNight && <Check size={14} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: useFreeNight ? '#17271f' : '#8a9490' }}>
                          Use 1 Free Night
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: useFreeNight ? '#17653e' : '#8a9490' }}>
                          {useFreeNight ? `Reward applied (-$${rate.nightlyPrice})` : 'Unlock after 9 qualifying nights'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cancellation Callout Banner */}
                <div style={{
                  backgroundColor: '#fdf8ec',
                  borderLeft: '4px solid #dda943',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  fontSize: '0.875rem',
                  color: '#17271f',
                  lineHeight: 1.5,
                  marginBottom: '18px'
                }}>
                  <strong>Cancellation:</strong> Cancel by {getCancellationDateStr(searchDates.checkIn)} at 4:00 PM Central Time. After that deadline, the penalty is one night’s room rate plus applicable taxes.
                </div>

                {/* Policy Agreement Checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="policyCheck"
                    checked={agreedToPolicies}
                    onChange={(e) => setAgreedToPolicies(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#173f34', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="policyCheck" style={{ fontSize: '0.8125rem', color: '#17271f', cursor: 'pointer', lineHeight: 1.4 }}>
                    I acknowledge and agree to the <strong>Hotel Cancellation Policy</strong> and <strong>Terms of Service</strong>.
                  </label>
                </div>
              </div>
            </div>

            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="evolve-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#17271f', marginBottom: '16px' }}>
                  Reservation Summary
                </h3>

                <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #eeece5' }}>
                  <img
                    src={selectedProperty.heroImage}
                    alt={selectedProperty.name}
                    style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#17271f', margin: 0, fontWeight: 700 }}>
                      {selectedProperty.name}
                    </h4>
                    <div style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '4px' }}>
                      {searchDates.checkIn} → {searchDates.checkOut} ({nights} Nights)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#997125', fontWeight: 700, marginTop: '4px' }}>
                      {totalRoomsCount} Room{totalRoomsCount > 1 ? 's' : ''} in Order
                    </div>
                  </div>
                </div>

                {/* Ordered Rooms Breakdown */}
                <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #eeece5' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Suites & Rates in this Order:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {orderItems.map((item, idx) => (
                      <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.8125rem' }}>
                        <div style={{ maxWidth: '65%' }}>
                          <div style={{ fontWeight: 700, color: '#17271f' }}>
                            {item.quantity}× {item.room.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#997125' }}>
                            {item.rate.title.split(' • ')[0]} · ${item.rate.nightlyPrice}/nt
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 700, color: '#17271f' }}>
                          ${item.quantity * item.rate.nightlyPrice * nights}
                          <div style={{ fontSize: '0.6875rem', color: '#6e7a76', fontWeight: 400 }}>
                            {item.quantity} × {nights}N
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76' }}>
                    <span>Combined Room Subtotal ({nights} Nights)</span>
                    <span>${nightlySubtotal * nights}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76' }}>
                    <span>Estimated Local Taxes & Hospitality Fees (12%)</span>
                    <span>${taxesAndFees}</span>
                  </div>
                  {rate.includesBreakfast && !isGuestCheckout && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#17653e', fontWeight: 600 }}>
                      <span>Complimentary Morning Breakfast</span>
                      <span>$0 (Included)</span>
                    </div>
                  )}
                  {spaAccessSelected && !isGuestCheckout && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#17653e', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} color="#dda943" /> Hydrotherapy Spa Access
                      </span>
                      <span>$0 (Included)</span>
                    </div>
                  )}
                  {useFreeNight && !isGuestCheckout && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#17653e', fontWeight: 700 }}>
                      <span>1 Free Night Reward Applied</span>
                      <span>-${rate.nightlyPrice}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1.5px solid #17271f',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#17271f'
                  }}>
                    <span>Total Due</span>
                    <span>${total} USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={submitting}
                  style={{ padding: '16px', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  {submitting ? 'Confirming Reservation...' : `Confirm & Pay $${total}`}
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.75rem', color: '#929b98' }}>
                  Instant digital voucher & SMS confirmation will be dispatched immediately.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Rewards Enrollment Dialog (Screenshot 3) */}
      {showRewardsModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowRewardsModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 39, 31, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '36px 32px',
              maxWidth: '460px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.22)',
              border: 'none',
              textAlign: 'left'
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowRewardsModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#17271f',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Eyebrow */}
            <span style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#997125',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              EVOLVE REWARDS
            </span>

            {/* Title */}
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '1.95rem',
              fontWeight: 700,
              color: '#17271f',
              lineHeight: 1.25,
              margin: '0 0 14px 0'
            }}>
              Don’t let this stay go unrewarded.
            </h2>

            {/* Body */}
            <p style={{
              fontSize: '0.9375rem',
              color: '#55655f',
              lineHeight: 1.55,
              margin: '0 0 28px 0'
            }}>
              Join Evolve Rewards FREE and earn Reward Nights toward Free Nights, Fine Dining Experiences, or $70 Gift Cards.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={handleJoinFree}
                style={{
                  width: '100%',
                  backgroundColor: '#173f34',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f2d24'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#173f34'}
              >
                Join Free
              </button>

              <button
                type="button"
                onClick={handleNoThanks}
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  color: '#17271f',
                  border: '1.5px solid #dcd7cb',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f6f3ec'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
