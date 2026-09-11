import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, ShieldCheck, Lock, Calendar, Users, 
  Sparkles, CheckCircle2, ArrowLeft, Bed, Info, LogIn, UserPlus, UserCircle2, Check 
} from 'lucide-react';
import { Reservation } from '../types';

export const CheckoutPage: React.FC = () => {
  const { 
    selectedProperty, selectedRoom, selectedRate, 
    searchDates, currentUser, isMember, navigateTo, 
    setLastConfirmedReservation, addToast, openAuthModal,
    activeGuestCode, activeGuestPhone, addReservation
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
  const [checkoutMode, setCheckoutMode] = useState<'prompt' | 'guest' | 'authenticated'>('prompt');
  
  useEffect(() => {
    if (currentUser) {
      setCheckoutMode('authenticated');
    } else if (checkoutMode !== 'guest') {
      setCheckoutMode('prompt');
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

  const nights = 4;
  const freeNightDiscount = (useFreeNight && !isGuestCheckout) ? rate.nightlyPrice : 0;
  const subtotal = Math.max(0, rate.nightlyPrice * nights - freeNightDiscount);
  const taxesAndFees = Math.round(subtotal * 0.12);
  const total = subtotal + taxesAndFees;

  // Form states
  const [firstName, setFirstName] = useState(currentUser?.firstName || 'Alexander');
  const [lastName, setLastName] = useState(currentUser?.lastName || 'Wright');
  const [email, setEmail] = useState(currentUser?.email || 'alexander.wright@luxury.io');
  const [phone, setPhone] = useState(currentUser?.phone || '+44 20 7946 0912');
  const [specialRequests, setSpecialRequests] = useState('High floor, quiet room facing zen garden requested.');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 1004');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('884');
  const [agreedToPolicies, setAgreedToPolicies] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Sync current user fields when user logs in during checkout
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicies) {
      addToast('error', 'Policy Acknowledgment Required', 'Please review and accept the cancellation policy.');
      return;
    }

    if (checkoutMode === 'guest' && !phone) {
      addToast('error', 'Phone Required', 'A mobile number is required for guest bookings.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const code = `EV-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedGuestCode = checkoutMode === 'guest' ? `GUEST-${Math.floor(100000 + Math.random() * 900000)}` : undefined;

      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        confirmationCode: code,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyCity: `${selectedProperty.city}, ${selectedProperty.country}`,
        propertyAddress: selectedProperty.address,
        propertyImage: selectedProperty.heroImage,
        roomName: room.name,
        roomCategory: room.category,
        checkInDate: searchDates.checkIn,
        checkOutDate: searchDates.checkOut,
        nightsCount: nights,
        guestsCount: { adults: searchDates.adults, children: searchDates.children },
        status: 'CONFIRMED',
        rateType: rate.title,
        nightlyRate: rate.nightlyPrice,
        taxesAndFees,
        totalAmount: total,
        currency: 'USD',
        paymentMethod: { brand: 'amex', last4: '1004' },
        cancellationDeadline: '48 hours prior to check-in (15:00 local time)',
        specialRequests: `${spaAccessSelected && !isGuestCheckout ? 'Hydrotherapy Spa Access included. ' : ''}${specialRequests}`,
        guestPhone: checkoutMode === 'guest' ? phone : undefined,
        guestCode: generatedGuestCode,
        userId: currentUser ? currentUser.id : undefined
      };

      setLastConfirmedReservation(newReservation);
      addReservation(newReservation);
      setSubmitting(false);

      if (checkoutMode === 'guest' && generatedGuestCode) {
        addToast('success', 'Guest Booking Confirmed!', `Your Guest Code is: ${generatedGuestCode}. Save this to view your reservation later.`);
      } else {
        addToast('success', 'Reservation Confirmed!', `Booking reference: ${code}`);
      }
      
      navigateTo('confirmation');
    }, 600);
  };

  if (checkoutMode === 'prompt') {
    return (
      <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '60px 20px 80px', display: 'flex', justifyContent: 'center' }}>
        <div className="evolve-card" style={{ maxWidth: '600px', width: '100%', padding: '48px', textAlign: 'center' }}>
          <span className="eyebrow-text">ALMOST THERE</span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#17271f', margin: '8px 0 16px' }}>
            How would you like to continue?
          </h2>
          <p style={{ color: '#6e7a76', fontSize: '1.05rem', marginBottom: '40px' }}>
            Sign in to access your saved details and earn Reward Nights, or proceed as a guest.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              onClick={() => openAuthModal('signin')}
              className="btn btn-primary"
              style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}
            >
              <LogIn size={20} /> Sign In
            </button>
            <button 
              onClick={() => openAuthModal('signup')}
              className="btn btn-secondary"
              style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}
            >
              <UserPlus size={20} /> Create an Account
            </button>
            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#d8d6cf' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2ded5' }}></div>
              <span style={{ margin: '0 16px', color: '#8c8a82', fontSize: '0.875rem', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2ded5' }}></div>
            </div>
            <button 
              onClick={() => setCheckoutMode('guest')}
              className="btn btn-outline"
              style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem', backgroundColor: '#ffffff' }}
            >
              <UserCircle2 size={20} /> Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div className="app-container" style={{ maxWidth: '1100px' }}>
        <button
          onClick={() => {
            if (checkoutMode === 'guest' && !currentUser) {
              setCheckoutMode('prompt');
            } else {
              navigateTo('property-detail');
            }
          }}
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
          <ArrowLeft size={16} /> {checkoutMode === 'guest' && !currentUser ? 'Back to Sign In Options' : 'Back to Room Selection'}
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
              <div className="evolve-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#17271f', marginBottom: '20px' }}>
                  1. Contact Information
                </h3>

                {checkoutMode === 'authenticated' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address (For Confirmation & Folio)</label>
                      <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                  {checkoutMode === 'guest' && (
                    <p style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '6px', marginBottom: 0 }}>
                      This number is required to access your guest booking later.
                    </p>
                  )}
                </div>

                {checkoutMode === 'authenticated' && (
                  <div className="form-group">
                    <label className="form-label">Special Requests (Optional)</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="E.g., high floor, quiet zone, feather-free pillows, late check-in..."
                    />
                  </div>
                )}
              </div>

              <div className="evolve-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: 0 }}>
                    2. Payment & Guarantee
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#17653e', fontWeight: 700 }}>
                    <Lock size={13} /> 256-Bit SSL Encrypted
                  </div>
                </div>

                {/* Member Only: Enhance your stay section (matches user screenshot) */}
                {!isGuestCheckout && (
                  <div style={{ marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #eeece5' }}>
                    <h3 style={{ fontSize: '1.45rem', color: '#17271f', margin: '0 0 6px 0', fontWeight: 700 }}>
                      Enhance your stay
                    </h3>
                    <p style={{ color: '#6e7a76', fontSize: '0.9375rem', margin: '0 0 18px 0' }}>
                      Choose any optional benefits for this stay.
                    </p>

                    {/* Option 1: Hydrotherapy Spa Access (Checked / Included) */}
                    <div 
                      onClick={() => setSpaAccessSelected(!spaAccessSelected)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border: spaAccessSelected ? '2px solid #173f34' : '1.5px solid #d8d6cf',
                        backgroundColor: spaAccessSelected ? '#edf5f0' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '5px',
                        backgroundColor: spaAccessSelected ? '#9aa9a1' : '#ffffff',
                        border: spaAccessSelected ? 'none' : '1.5px solid #cccccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {spaAccessSelected && <Check size={15} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17271f' }}>
                          Hydrotherapy Spa Access
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#55655f', marginTop: '3px' }}>
                          Included automatically with your Evolve membership
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Use 1 Free Night */}
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
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border: useFreeNight ? '2px solid #173f34' : '1.5px solid #e2ded4',
                        backgroundColor: useFreeNight ? '#edf5f0' : '#f8f9fa',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        marginBottom: '14px'
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '5px',
                        backgroundColor: useFreeNight ? '#173f34' : '#ffffff',
                        border: useFreeNight ? 'none' : '1.5px solid #cccccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {useFreeNight && <Check size={15} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: useFreeNight ? '#17271f' : '#8a9490' }}>
                          Use 1 Free Night
                        </div>
                        <div style={{ fontSize: '0.875rem', color: useFreeNight ? '#17653e' : '#8a9490', marginTop: '3px' }}>
                          {useFreeNight ? `Reward applied (-$${rate.nightlyPrice})` : 'Unlock after 9 qualifying nights'}
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Callout Banner */}
                    <div style={{
                      backgroundColor: '#fdf8ec',
                      borderLeft: '4px solid #dda943',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      fontSize: '0.875rem',
                      color: '#17271f',
                      lineHeight: 1.5
                    }}>
                      <strong>Cancellation:</strong> Cancel by {getCancellationDateStr(searchDates.checkIn)} at 4:00 PM Central Time. After that deadline, the penalty is one night’s room rate plus applicable taxes.
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                    <CreditCard size={18} color="#6e7a76" style={{ position: 'absolute', right: '14px', top: '14px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-input"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Security CVC</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="3 or 4 digits"
                      required
                    />
                  </div>
                </div>

                {/* For guest checkout, show cancellation banner below card */}
                {isGuestCheckout && (
                  <div style={{
                    backgroundColor: '#fdf8ec',
                    borderLeft: '4px solid #dda943',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    marginTop: '16px',
                    fontSize: '0.875rem',
                    color: '#17271f',
                    lineHeight: 1.5
                  }}>
                    <strong>Cancellation:</strong> Cancel by {getCancellationDateStr(searchDates.checkIn)} at 4:00 PM Central Time. After that deadline, the penalty is one night’s room rate plus applicable taxes.
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '20px' }}>
                  <input
                    type="checkbox"
                    id="policyCheck"
                    checked={agreedToPolicies}
                    onChange={(e) => setAgreedToPolicies(e.target.checked)}
                    style={{ marginTop: '4px', accentColor: '#173f34', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="policyCheck" style={{ fontSize: '0.8125rem', color: '#17271f', cursor: 'pointer' }}>
                    I acknowledge and agree to the <strong>Hotel Cancellation Policy</strong>, <strong>Terms of Service</strong>, and understand that my card will guarantee this reservation.
                  </label>
                </div>
              </div>
            </div>

            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="evolve-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#17271f', marginBottom: '16px' }}>
                  Reservation Summary
                </h3>

                <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eeece5' }}>
                  <img
                    src={selectedProperty.heroImage}
                    alt={selectedProperty.name}
                    style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#17271f', margin: 0 }}>
                      {selectedProperty.name}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#997125', fontWeight: 600, marginTop: '2px' }}>
                      {room.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '4px' }}>
                      {searchDates.checkIn} → {searchDates.checkOut} ({nights} Nights)
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f6f3ec',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8125rem',
                  color: '#173f34',
                  fontWeight: 600,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={14} color="#dda943" />
                  <span>{rate.title}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76' }}>
                    <span>${rate.nightlyPrice} × {nights} Nights</span>
                    <span>${subtotal}</span>
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
    </div>
  );
};
