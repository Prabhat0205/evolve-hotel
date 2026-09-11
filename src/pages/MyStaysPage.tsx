import React, { useState } from 'react';
import { useApp, normalizePhone, normalizeGuestCode } from '../context/AppContext';
import { Reservation } from '../types';
import { 
  AlertCircle, ShieldCheck, Sparkles, UserCheck, Lock, ArrowRight, X, ArrowLeft, Calendar, CheckCircle2, CreditCard
} from 'lucide-react';

export const MyStaysPage: React.FC = () => {
  const { 
    reservations, cancelReservation, updateReservation, navigateTo, addToast,
    currentUser, currentPersona, activeGuestCode, activeGuestPhone,
    openAuthModal, loginAs, loginAsGuest
  } = useApp();
  const [tab, setTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED' | 'MISSING'>('UPCOMING');

  // Modal states
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [modalSubView, setModalSubView] = useState<'options' | 'modify_dates' | 'cancel_dates' | 'confirm_cancel'>('options');
  const [modifyStep, setModifyStep] = useState<'dates' | 'payment'>('dates');
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [useCardOnFile, setUseCardOnFile] = useState(true);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const userReservations = reservations.filter(r => {
    if (currentPersona === 'guest' && activeGuestCode && activeGuestPhone) {
      const codeMatch = normalizeGuestCode(r.guestCode) === normalizeGuestCode(activeGuestCode);
      const phoneMatch = normalizePhone(r.guestPhone) === normalizePhone(activeGuestPhone);
      return codeMatch && phoneMatch;
    }
    if (currentUser) {
      return r.userId === currentUser.id;
    }
    return false;
  });

  const upcomingStays = userReservations.filter(r => r.status === 'CONFIRMED' || r.status === 'CHECKED_IN');
  const pastStays = userReservations.filter(r => r.status === 'COMPLETED');
  const cancelledStays = userReservations.filter(r => r.status === 'CANCELLED');

  const handleOpenOptions = (res: Reservation) => {
    setSelectedRes(res);
    setNewCheckIn(res.checkInDate);
    setNewCheckOut(res.checkOutDate);
    setModalSubView('options');
    setModifyStep('dates');
    setUseCardOnFile(true);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvc('');
    setIsProcessingPayment(false);
    setOptionsModalOpen(true);
  };

  const calculateModificationDifference = () => {
    if (!selectedRes || !newCheckIn || !newCheckOut) {
      return { newNights: 0, newSubtotal: 0, newTaxes: 0, newTotal: 0, diffAmount: 0, isIncrease: false, isDecrease: false, nightsDiff: 0 };
    }
    const d1 = new Date(newCheckIn);
    const d2 = new Date(newCheckOut);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) {
      return { newNights: 0, newSubtotal: 0, newTaxes: 0, newTotal: 0, diffAmount: 0, isIncrease: false, isDecrease: false, nightsDiff: 0 };
    }
    const newNights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const newSubtotal = selectedRes.nightlyRate * newNights;
    const newTaxes = Math.round(newSubtotal * 0.12);
    const newTotal = newSubtotal + newTaxes;
    const diffAmount = newTotal - selectedRes.totalAmount;
    return {
      newNights,
      newSubtotal,
      newTaxes,
      newTotal,
      diffAmount,
      isIncrease: diffAmount > 0,
      isDecrease: diffAmount < 0,
      nightsDiff: newNights - selectedRes.nightsCount
    };
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    const d1 = new Date(newCheckIn);
    const d2 = new Date(newCheckOut);
    if (d2 <= d1) {
      addToast('error', 'Invalid Stay Dates', 'Check-out date must be after check-in date.');
      return;
    }
    setModifyStep('payment');
  };

  const handleExecuteModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    const { newNights, newTotal, diffAmount } = calculateModificationDifference();

    if (!useCardOnFile && diffAmount > 0) {
      if (!newCardNumber || !newCardExpiry || !newCardCvc) {
        addToast('error', 'Payment Details Missing', 'Please enter your credit card details to complete payment.');
        return;
      }
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      const updatedPaymentMethod = useCardOnFile 
        ? (selectedRes.paymentMethod || { brand: 'amex', last4: '1004' })
        : { brand: 'visa', last4: newCardNumber.slice(-4) || '8831' };

      const updated: Reservation = {
        ...selectedRes,
        checkInDate: newCheckIn,
        checkOutDate: newCheckOut,
        nightsCount: newNights,
        totalAmount: newTotal,
        paymentMethod: updatedPaymentMethod
      };

      updateReservation(updated);
      setSelectedRes(updated);
      setIsProcessingPayment(false);
      setOptionsModalOpen(false);
      setModifyStep('dates');

      if (diffAmount > 0) {
        addToast(
          'success', 
          'Payment Authorized & Reservation Updated', 
          `Additional charge of $${diffAmount} USD successfully processed on ${updatedPaymentMethod.brand.toUpperCase()} ending ${updatedPaymentMethod.last4}.`
        );
      } else if (diffAmount < 0) {
        addToast(
          'success', 
          'Refund Initiated & Reservation Updated', 
          `Refund of $${Math.abs(diffAmount)} USD issued to ${updatedPaymentMethod.brand.toUpperCase()} ending ${updatedPaymentMethod.last4}.`
        );
      } else {
        addToast('success', 'Reservation Modified', `Dates updated to ${newCheckIn} → ${newCheckOut} with $0 additional charge.`);
      }
    }, 900);
  };

  const handleConfirmCancelEntire = () => {
    if (!selectedRes) return;
    cancelReservation(selectedRes.id);
    setOptionsModalOpen(false);
  };

  const handleConfirmModifyDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    const d1 = new Date(newCheckIn);
    const d2 = new Date(newCheckOut);
    if (d2 <= d1) {
      addToast('error', 'Invalid Stay Dates', 'Check-out date must be after check-in date.');
      return;
    }
    const diffNights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const updated: Reservation = {
      ...selectedRes,
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      nightsCount: diffNights,
      totalAmount: selectedRes.nightlyRate * diffNights + selectedRes.taxesAndFees
    };
    updateReservation(updated);
    setSelectedRes(updated);
    setOptionsModalOpen(false);
    addToast('success', 'Reservation Modified', `Dates updated to ${newCheckIn} → ${newCheckOut} (${diffNights} nights).`);
  };

  const handleConfirmCancelSelectedDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    const d1 = new Date(newCheckIn);
    const d2 = new Date(newCheckOut);
    if (d2 <= d1) {
      addToast('error', 'Invalid Stay Dates', 'Check-out date must be after check-in date.');
      return;
    }
    const diffNights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const updated: Reservation = {
      ...selectedRes,
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      nightsCount: diffNights,
      totalAmount: selectedRes.nightlyRate * diffNights + selectedRes.taxesAndFees
    };
    updateReservation(updated);
    setSelectedRes(updated);
    setOptionsModalOpen(false);
    addToast('success', 'Selected Dates Cancelled', `Your reservation has been shortened to ${newCheckIn} → ${newCheckOut}.`);
  };

  const formatStayDates = (checkIn: string, checkOut: string) => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${checkIn}, ${checkOut}`;
      const opt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${d1.toLocaleDateString('en-US', opt)}, ${d2.toLocaleDateString('en-US', opt)}`;
    } catch {
      return `${checkIn}, ${checkOut}`;
    }
  };

  const formatCancellationDeadlineFull = (checkIn: string) => {
    try {
      const date = new Date(checkIn);
      if (isNaN(date.getTime())) return 'the day before arrival';
      date.setDate(date.getDate() - 1);
      const m = date.toLocaleDateString('en-US', { month: 'long' });
      const d = date.getDate();
      return `${m} ${d}`;
    } catch {
      return 'the day before arrival';
    }
  };

  const getMonthAndDay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { month: 'TBD', day: '--' };
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = date.getDate().toString().padStart(2, '0');
      return { month, day };
    } catch {
      return { month: 'TBD', day: '--' };
    }
  };

  const formatShortDateRange = (checkIn: string, checkOut: string) => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${checkIn}—${checkOut}`;
      const m1 = d1.toLocaleDateString('en-US', { month: 'short' });
      const day1 = d1.getDate();
      const m2 = d2.toLocaleDateString('en-US', { month: 'short' });
      const day2 = d2.getDate();
      
      if (m1 === m2) {
        return `${m1} ${day1}–${day2}`;
      } else {
        return `${m1} ${day1}–${m2} ${day2}`;
      }
    } catch {
      return `${checkIn}—${checkOut}`;
    }
  };

  const getCancelDeadline = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'the day before arrival';
      date.setDate(date.getDate() - 1);
      const m = date.toLocaleDateString('en-US', { month: 'short' });
      const d = date.getDate();
      return `${m} ${d}`;
    } catch {
      return 'the day before arrival';
    }
  };

  const getTabContent = () => {
    if (tab === 'MISSING') return [];
    if (tab === 'CANCELLED') return cancelledStays;
    if (tab === 'PAST') return pastStays;
    return upcomingStays;
  };

  const currentStays = getTabContent();

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '60px 20px' }}>
      <div className="app-container-wide" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: '#17271f', margin: '0 0 12px 0' }}>
              My Stays
            </h1>
            <p style={{ color: '#6e7a76', fontSize: '1.05rem', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
              View every stay matched to your Evolve account. Cloudbeds is the source of truth for reservation dates, rates and status.
            </p>
          </div>
          <button style={{ backgroundColor: '#ffffff', color: '#173f34', border: '1px solid #eeece5', borderRadius: '8px', padding: '14px 24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            Report a Missing Stay
          </button>
        </div>

        {/* Guest Session Upgrade Banner */}
        {currentPersona === 'guest' && activeGuestCode && (
          <div style={{
            backgroundColor: '#fcf6eb',
            border: '1.5px solid #dda943',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ backgroundColor: '#dda943', color: '#17271f', padding: '10px', borderRadius: '50%' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#17271f', fontWeight: 800 }}>
                  Guest Session Active · Code: {activeGuestCode}
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6e7a76' }}>
                  Upgrade to a free Evolve Rewards member account to keep your bookings and unlock member rates.
                </p>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('convert_to_member')}
              className="btn btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
            >
              Upgrade to Member
            </button>
          </div>
        )}

        {/* Info Boxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#f0f5f2', borderLeft: '4px solid #173f34', borderRadius: '0 8px 8px 0', padding: '16px 20px' }}>
            <h4 style={{ color: '#17271f', margin: '0 0 4px 0', fontSize: '0.9375rem', fontWeight: 800 }}>Which stays can be managed here?</h4>
            <p style={{ color: '#17271f', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
              Direct reservations made through the Evolve website, Evolve Guest App, hotel phone line or property/front desk can be modified or cancelled when the rate and cancellation rules allow it. Third-party reservations may appear in My Stays, but remain view-only and must be changed through the original booking provider.
            </p>
          </div>
          
          <div style={{ backgroundColor: '#fdf6e3', borderLeft: '4px solid #dda943', borderRadius: '0 8px 8px 0', padding: '16px 20px' }}>
            <h4 style={{ color: '#17271f', margin: '0 0 4px 0', fontSize: '0.9375rem', fontWeight: 800 }}>Cancellation period</h4>
            <p style={{ color: '#17271f', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
              Modify or cancel the full reservation by 4:00 PM Central Time on the day before arrival to avoid a penalty. For an individual booked night, the deadline is 4:00 PM Central Time on the day before that selected date. After the applicable deadline, the penalty is one night's room rate plus applicable taxes; cancelling a selected Free Night date after its deadline forfeits the 9 Reward Nights used.
            </p>
          </div>
        </div>

        {/* If neither Member nor Guest logged in, show clear Sign In Prompt Card */}
        {!currentUser && currentPersona !== 'guest' ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '50px 32px',
            textAlign: 'center',
            border: '1px solid #eeece5',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#f6f3ec',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#173f34'
            }}>
              <Lock size={32} />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#17271f', marginBottom: '12px' }}>
              Sign In to View Your Bookings
            </h2>
            <p style={{ color: '#6e7a76', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              Sign in with your member credentials or enter your unique Guest Code and mobile phone number to view and manage your reservations.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <button 
                onClick={() => openAuthModal('signin')}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Sign In as Member
              </button>
              <button 
                onClick={() => openAuthModal('guest_login')}
                className="btn btn-outline"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Access with Guest Code
              </button>
            </div>

            {/* Quick Testing Shortcuts Box */}
            <div style={{
              backgroundColor: '#faf9f5',
              borderRadius: '16px',
              padding: '24px',
              border: '1px dashed #dda943',
              maxWidth: '680px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={16} color="#dda943" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  One-Click Testing Shortcuts
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <button
                  onClick={() => loginAs('member_classic')}
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2ded5', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9rem' }}>Member: Julian Hayes</div>
                  <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>Houston Medical Center Stay (1 Booking)</div>
                </button>

                <button
                  onClick={() => loginAs('member_prestige')}
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2ded5', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9rem' }}>Member: Alexander Wright</div>
                  <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>Texarkana & Dallas Stays (2 Bookings)</div>
                </button>

                <button
                  onClick={() => loginAsGuest('GUEST-101010', '5552345678')}
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2ded5', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9rem' }}>Guest 1: GUEST-101010</div>
                  <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>Houston Medical + Dallas (2 Bookings)</div>
                </button>

                <button
                  onClick={() => loginAsGuest('GUEST-202020', '5559876543')}
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2ded5', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9rem' }}>Guest 2: GUEST-202020</div>
                  <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>Texarkana Retreat (1 Booking)</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {['Upcoming', 'Past Stays', 'Cancelled', 'Missing Stay Requests'].map(tabLabel => {
                const tabKey = tabLabel.split(' ')[0].toUpperCase() as any;
                const isActive = tab === tabKey;
                
                return (
                  <button
                    key={tabKey}
                    onClick={() => setTab(tabKey)}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '9999px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      backgroundColor: isActive ? '#173f34' : '#ffffff',
                      color: isActive ? '#ffffff' : '#17271f',
                      border: isActive ? 'none' : '1px solid #eeece5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: isActive ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    {tabLabel}
                  </button>
                );
              })}
            </div>

            {/* Stays List */}
            <div>
          {currentStays.map((stay, index) => {
            const { month, day } = getMonthAndDay(stay.checkInDate);
            const shortDates = formatShortDateRange(stay.checkInDate, stay.checkOutDate);
            const cancelDeadline = getCancelDeadline(stay.checkInDate);
            
            // Mocking the tag/status logic based on index or properties to match mockup variety
            let tag = 'WEBSITE DIRECT · CLOUDBEDS';
            let badgeText = 'Confirmed';
            let badgeStyle = { bg: '#eaf5ee', color: '#17653e' };
            let isViewOnly = false;

            if (index % 3 === 1) {
              tag = 'PROPERTY DIRECT · CLOUDBEDS';
              badgeText = 'Upcoming';
            } else if (index % 3 === 2) {
              tag = 'THIRD-PARTY · CLOUDBEDS';
              badgeText = 'View Only';
              badgeStyle = { bg: '#f2ece4', color: '#665c52' };
              isViewOnly = true;
            }

            if (stay.status === 'CANCELLED') {
              badgeText = 'Cancelled';
              badgeStyle = { bg: '#fef2f2', color: '#b91c1c' };
            }

            const isPast = tab === 'PAST';

            if (isPast) {
              if (isViewOnly) {
                badgeText = 'Not Eligible';
                badgeStyle = { bg: '#f2ece4', color: '#665c52' };
              } else {
                badgeText = `Credited +${stay.nightsCount}`;
                badgeStyle = { bg: '#eaf5ee', color: '#17653e' };
              }
            }

            return (
              <div key={stay.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', marginBottom: '16px', display: 'flex', gap: '24px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                {/* Left Date Box & Hotel Thumbnail */}
                <div style={{ display: 'flex', gap: '14px', flexShrink: 0 }}>
                  <div style={{ backgroundColor: '#eeece5', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6e7a76', textTransform: 'uppercase' }}>{month}</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17271f', lineHeight: 1 }}>{day}</span>
                  </div>
                  {stay.propertyImage && (
                    <div style={{ width: '110px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid #eeece5' }}>
                      <img src={stay.propertyImage} alt={stay.propertyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                {/* Right Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '1.125rem', color: '#17271f', margin: 0, fontWeight: 800 }}>{stay.roomName} · {stay.propertyName}</h2>
                    <span style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color, padding: '4px 12px', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 700 }}>
                      {badgeText}
                    </span>
                  </div>
                  
                  <p style={{ color: '#6e7a76', fontSize: '0.9375rem', margin: isPast ? '4px 0' : '0 0 12px 0' }}>
                    {shortDates} · Confirmation {stay.confirmationCode}
                  </p>

                  {!isPast && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ backgroundColor: '#f6f3ec', color: '#4a5753', padding: '4px 12px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                        {tag}
                      </span>
                    </div>
                  )}

                  {tab === 'UPCOMING' && !isViewOnly && (
                    <button 
                      onClick={() => handleOpenOptions(stay)} 
                      style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', color: '#173f34', border: '1px solid #eeece5', borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}
                    >
                      Modify or Cancel
                    </button>
                  )}

                  <p style={{ color: '#6e7a76', fontSize: '0.9375rem', margin: 0, lineHeight: 1.5 }}>
                    {isPast ? (
                      isViewOnly ? (
                        <span style={{ color: '#17271f' }}>This reservation was booked through a third party and was not eligible for Reward Nights.</span>
                      ) : (
                        <span style={{ color: '#17271f' }}>Completed eligible stay · {stay.nightsCount} Reward Nights added</span>
                      )
                    ) : (
                      isViewOnly ? (
                        <><strong style={{ color: '#17271f' }}>View only.</strong> Contact the original booking provider to modify or cancel this reservation.</>
                      ) : (
                        <><strong style={{ color: '#6e7a76' }}>Cancel by {cancelDeadline} at 4:00 PM Central Time</strong> to avoid a penalty.</>
                      )
                    )}
                  </p>
                </div>
              </div>
            );
          })}
          
          {currentStays.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6e7a76', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eeece5' }}>
              No reservations found in this section.
            </div>
          )}
        </div>
      </>
    )}


        {/* UNIFIED MODIFY OR CANCEL POPUP MODAL */}
        {optionsModalOpen && selectedRes && (
          <div className="modal-overlay" onClick={() => setOptionsModalOpen(false)} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                maxWidth: '480px', 
                width: '100%', 
                padding: '36px 32px 32px', 
                borderRadius: '24px', 
                backgroundColor: '#ffffff',
                boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setOptionsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: '#6e7a76',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f6f3ec')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <X size={20} />
              </button>

              {/* VIEW 1: Main Reservation Options Matching User Mockup */}
              {modalSubView === 'options' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      color: '#997125', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      display: 'block',
                      marginBottom: '6px'
                    }}>
                      RESERVATION OPTIONS
                    </span>
                    <h2 style={{ 
                      fontFamily: 'Playfair Display, serif', 
                      fontSize: '2.15rem', 
                      fontWeight: 700, 
                      color: '#17271f', 
                      margin: '0 0 10px 0',
                      lineHeight: 1.15
                    }}>
                      Modify or cancel
                    </h2>
                    <p style={{ 
                      color: '#6e7a76', 
                      fontSize: '0.9375rem', 
                      lineHeight: 1.45, 
                      margin: 0 
                    }}>
                      Changes are subject to availability, current rates and the cancellation deadline.
                    </p>
                  </div>

                  {/* Box 1: Reservation Details */}
                  <div style={{
                    border: '1.5px solid #eceae3',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    marginBottom: '14px',
                    backgroundColor: '#ffffff'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #f3f0ea',
                      fontSize: '0.9375rem'
                    }}>
                      <span style={{ color: '#17271f' }}>Reservation</span>
                      <strong style={{ color: '#17271f', fontWeight: 800, fontSize: '1rem' }}>
                        {selectedRes.confirmationCode}
                      </strong>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid #f3f0ea',
                      fontSize: '0.9375rem'
                    }}>
                      <span style={{ color: '#17271f' }}>Stay</span>
                      <strong style={{ color: '#17271f', fontWeight: 800, textAlign: 'right' }}>
                        {selectedRes.roomName} · {formatStayDates(selectedRes.checkInDate, selectedRes.checkOutDate)}
                      </strong>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '12px',
                      fontSize: '0.9375rem'
                    }}>
                      <span style={{ color: '#17271f' }}>Reservation system</span>
                      <strong style={{ color: '#17271f', fontWeight: 800 }}>
                        Cloudbeds source · Website Direct
                      </strong>
                    </div>
                  </div>

                  {/* Box 2: Cancellation deadline */}
                  <div style={{
                    backgroundColor: '#f6f4ee',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ fontWeight: 800, color: '#17271f', fontSize: '0.95rem', marginBottom: '4px' }}>
                      Cancellation deadline
                    </div>
                    <div style={{ color: '#17271f', fontSize: '0.875rem', lineHeight: 1.45 }}>
                      Cancel by {formatCancellationDeadlineFull(selectedRes.checkInDate)} at 4:00 PM Central Time with no late penalty.
                    </div>
                  </div>

                  {/* Box 3: Penalty after deadline */}
                  <div style={{
                    backgroundColor: '#f6f4ee',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ fontWeight: 800, color: '#17271f', fontSize: '0.95rem', marginBottom: '4px' }}>
                      Penalty after deadline
                    </div>
                    <div style={{ color: '#17271f', fontSize: '0.875rem', lineHeight: 1.45 }}>
                      One night’s room rate plus applicable taxes.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      onClick={() => setModalSubView('modify_dates')}
                      style={{
                        backgroundColor: '#173f34',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '15px 20px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(23, 63, 52, 0.15)',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#102d25')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173f34')}
                    >
                      Modify dates or reservation
                    </button>

                    <button
                      onClick={() => setModalSubView('cancel_dates')}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#17271f',
                        border: '1.5px solid #d8d6cf',
                        borderRadius: '12px',
                        padding: '13px 20px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f6f3ec')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      Cancel selected date(s)
                    </button>

                    <button
                      onClick={() => setModalSubView('confirm_cancel')}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#17271f',
                        border: '1.5px solid #d8d6cf',
                        borderRadius: '12px',
                        padding: '13px 20px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f6f3ec')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      Cancel Entire Reservation
                    </button>

                    <button
                      onClick={() => setOptionsModalOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#173f34',
                        fontSize: '1rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: '6px 2px 0',
                        marginTop: '4px'
                      }}
                    >
                      Keep reservation
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 2: Modify Stay Dates with Additional Payment Flow */}
              {modalSubView === 'modify_dates' && (
                <div>
                  {modifyStep === 'dates' ? (
                    <div>
                      <button
                        onClick={() => setModalSubView('options')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'none',
                          border: 'none',
                          color: '#173f34',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          padding: 0,
                          marginBottom: '16px'
                        }}
                      >
                        <ArrowLeft size={16} /> Back to reservation options
                      </button>

                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                        STEP 1 OF 2 · DATE MODIFICATION
                      </span>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#17271f', margin: '0 0 6px 0' }}>
                        Modify Stay Dates
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6e7a76', marginBottom: '18px', lineHeight: 1.5 }}>
                        {selectedRes.propertyName} — <strong>{selectedRes.roomName}</strong>
                      </p>

                      <form onSubmit={handleProceedToPayment}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>New Check-In</label>
                            <input 
                              type="date" 
                              className="form-input" 
                              value={newCheckIn} 
                              onChange={(e) => setNewCheckIn(e.target.value)} 
                              required 
                              style={{ padding: '10px 12px' }}
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>New Check-Out</label>
                            <input 
                              type="date" 
                              className="form-input" 
                              value={newCheckOut} 
                              onChange={(e) => setNewCheckOut(e.target.value)} 
                              required 
                              style={{ padding: '10px 12px' }}
                            />
                          </div>
                        </div>

                        {/* Live Price Comparison & Difference Card */}
                        {(() => {
                          const { newNights, newTotal, diffAmount, isIncrease, isDecrease, nightsDiff } = calculateModificationDifference();
                          return (
                            <div style={{
                              border: isIncrease ? '1.5px solid #f2c979' : isDecrease ? '1.5px solid #a3d9b8' : '1px solid #eeece5',
                              backgroundColor: isIncrease ? '#fcf9f2' : isDecrease ? '#f0f7f3' : '#f8f7f4',
                              borderRadius: '14px',
                              padding: '16px',
                              marginBottom: '22px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#6e7a76', marginBottom: '6px' }}>
                                <span>Original Stay:</span>
                                <span>{selectedRes.nightsCount} Nights (${selectedRes.totalAmount} USD)</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#17271f', fontWeight: 700, marginBottom: '10px' }}>
                                <span>Modified Stay:</span>
                                <span>{newNights > 0 ? `${newNights} Nights ($${newTotal} USD)` : 'Select valid dates'}</span>
                              </div>

                              <div style={{
                                paddingTop: '10px',
                                borderTop: '1px dashed #dcd8cf',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <div>
                                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800, color: isIncrease ? '#997125' : isDecrease ? '#17653e' : '#6e7a76' }}>
                                    {isIncrease ? 'Additional Amount Due' : isDecrease ? 'Refund Due to Original Card' : 'Price Difference'}
                                  </span>
                                  <div style={{ fontSize: '0.75rem', color: '#6e7a76' }}>
                                    {isIncrease ? `+${nightsDiff} night(s) at $${selectedRes.nightlyRate}/night + taxes` : isDecrease ? `${Math.abs(nightsDiff)} fewer night(s)` : 'No charge for equal night duration'}
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: '1.25rem',
                                  fontWeight: 800,
                                  color: isIncrease ? '#b45309' : isDecrease ? '#17653e' : '#17271f'
                                }}>
                                  {isIncrease ? `+$${diffAmount} USD` : isDecrease ? `-$${Math.abs(diffAmount)} USD` : '$0.00 USD'}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button 
                            type="button" 
                            onClick={() => setModalSubView('options')} 
                            className="btn btn-outline" 
                            style={{ flex: 1, padding: '12px', fontSize: '0.95rem' }}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ flex: 1.6, padding: '12px', fontSize: '0.95rem', fontWeight: 700 }}
                          >
                            Continue to Payment & Review →
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      {/* STEP 2: Payment & Authorization Step */}
                      <button
                        onClick={() => setModifyStep('dates')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'none',
                          border: 'none',
                          color: '#173f34',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          padding: 0,
                          marginBottom: '16px'
                        }}
                      >
                        <ArrowLeft size={16} /> Back to date selection
                      </button>

                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                        STEP 2 OF 2 · AUTHORIZATION & CONFIRMATION
                      </span>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#17271f', margin: '0 0 6px 0' }}>
                        Confirm Modification
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6e7a76', marginBottom: '18px', lineHeight: 1.5 }}>
                        Review your modification charges and authorize payment.
                      </p>

                      {(() => {
                        const { newNights, newSubtotal, newTaxes, newTotal, diffAmount, isIncrease, isDecrease } = calculateModificationDifference();

                        return (
                          <form onSubmit={handleExecuteModification}>
                            {/* Breakdown Summary */}
                            <div style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #eeece5',
                              borderRadius: '14px',
                              padding: '16px 18px',
                              marginBottom: '16px',
                              fontSize: '0.875rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76', marginBottom: '6px' }}>
                                <span>Original Stay Total</span>
                                <span>${selectedRes.totalAmount} USD</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76', marginBottom: '6px' }}>
                                <span>Revised Stay ({newNights} Nights)</span>
                                <span>${newSubtotal} + ${newTaxes} taxes</span>
                              </div>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '8px',
                                borderTop: '1px solid #f3f0ea',
                                color: isIncrease ? '#b45309' : isDecrease ? '#17653e' : '#17271f',
                                fontWeight: 800
                              }}>
                                <span>{isIncrease ? 'Additional Amount Due Today' : isDecrease ? 'Refund Credited to Original Card' : 'Net Adjustment Due'}</span>
                                <span>{isIncrease ? `+$${diffAmount} USD` : isDecrease ? `-$${Math.abs(diffAmount)} USD` : '$0.00 USD'}</span>
                              </div>
                            </div>

                            {/* Payment Method Selection (Shown when additional payment is required) */}
                            {diffAmount > 0 && (
                              <div style={{ marginBottom: '18px' }}>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#17271f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                                  Select Payment Method
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  {/* Card on File */}
                                  <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 14px',
                                    borderRadius: '12px',
                                    border: useCardOnFile ? '1.5px solid #173f34' : '1px solid #d8d6cf',
                                    backgroundColor: useCardOnFile ? '#f0f5f2' : '#ffffff',
                                    cursor: 'pointer'
                                  }}>
                                    <input 
                                      type="radio" 
                                      name="modifyPaymentMethod" 
                                      checked={useCardOnFile} 
                                      onChange={() => setUseCardOnFile(true)} 
                                    />
                                    <CreditCard size={20} color="#173f34" />
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17271f' }}>
                                        Card on File ({selectedRes.paymentMethod?.brand?.toUpperCase() || 'AMEX'} ending {selectedRes.paymentMethod?.last4 || '1004'})
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: '#6e7a76' }}>
                                        Expires 10/28 · Used for original booking
                                      </div>
                                    </div>
                                  </label>

                                  {/* New Card Option */}
                                  <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 14px',
                                    borderRadius: '12px',
                                    border: !useCardOnFile ? '1.5px solid #173f34' : '1px solid #d8d6cf',
                                    backgroundColor: !useCardOnFile ? '#f0f5f2' : '#ffffff',
                                    cursor: 'pointer'
                                  }}>
                                    <input 
                                      type="radio" 
                                      name="modifyPaymentMethod" 
                                      checked={!useCardOnFile} 
                                      onChange={() => setUseCardOnFile(false)} 
                                    />
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17271f' }}>
                                      Use a Different Credit or Debit Card
                                    </div>
                                  </label>

                                  {!useCardOnFile && (
                                    <div style={{
                                      backgroundColor: '#faf9f6',
                                      border: '1px solid #eeece5',
                                      borderRadius: '12px',
                                      padding: '14px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '10px'
                                    }}>
                                      <div>
                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Card Number</label>
                                        <input 
                                          type="text" 
                                          className="form-input" 
                                          placeholder="4000 1234 5678 9010" 
                                          value={newCardNumber} 
                                          onChange={(e) => setNewCardNumber(e.target.value)} 
                                          required={!useCardOnFile}
                                          style={{ padding: '8px 10px', fontSize: '0.875rem' }}
                                        />
                                      </div>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div>
                                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Expiry (MM/YY)</label>
                                          <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="MM/YY" 
                                            value={newCardExpiry} 
                                            onChange={(e) => setNewCardExpiry(e.target.value)} 
                                            required={!useCardOnFile}
                                            style={{ padding: '8px 10px', fontSize: '0.875rem' }}
                                          />
                                        </div>
                                        <div>
                                          <label className="form-label" style={{ fontSize: '0.75rem' }}>CVC</label>
                                          <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="123" 
                                            value={newCardCvc} 
                                            onChange={(e) => setNewCardCvc(e.target.value)} 
                                            required={!useCardOnFile}
                                            style={{ padding: '8px 10px', fontSize: '0.875rem' }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Refund explanation if stay shortened */}
                            {diffAmount < 0 && (
                              <div style={{
                                backgroundColor: '#f0f7f3',
                                border: '1px solid #a3d9b8',
                                borderRadius: '12px',
                                padding: '14px 16px',
                                marginBottom: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                              }}>
                                <CheckCircle2 size={20} color="#17653e" />
                                <div style={{ fontSize: '0.8125rem', color: '#17271f', lineHeight: 1.4 }}>
                                  A refund of <strong>${Math.abs(diffAmount)} USD</strong> will be automatically credited back to your {selectedRes.paymentMethod?.brand?.toUpperCase() || 'AMEX'} ending in {selectedRes.paymentMethod?.last4 || '1004'}.
                                </div>
                              </div>
                            )}

                            {/* Security Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#6e7a76', marginBottom: '18px' }}>
                              <ShieldCheck size={15} color="#17653e" />
                              <span>256-Bit SSL Encrypted • Instant digital voucher re-dispatched</span>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button 
                                type="button" 
                                onClick={() => setModifyStep('dates')} 
                                className="btn btn-outline" 
                                style={{ flex: 1, padding: '13px', fontSize: '0.95rem' }}
                                disabled={isProcessingPayment}
                              >
                                Back
                              </button>
                              <button 
                                type="submit" 
                                className="btn btn-primary" 
                                style={{ flex: 1.7, padding: '13px', fontSize: '0.95rem', fontWeight: 700 }}
                                disabled={isProcessingPayment}
                              >
                                {isProcessingPayment ? (
                                  'Authorizing Payment...'
                                ) : diffAmount > 0 ? (
                                  `Pay $${diffAmount} USD & Confirm`
                                ) : diffAmount < 0 ? (
                                  `Confirm & Process Refund ($${Math.abs(diffAmount)})`
                                ) : (
                                  'Confirm Modification ($0 Due)'
                                )}
                              </button>
                            </div>
                          </form>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 3: Cancel Selected Dates (Shorten Stay) */}
              {modalSubView === 'cancel_dates' && (
                <div>
                  <button
                    onClick={() => setModalSubView('options')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#173f34',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      padding: 0,
                      marginBottom: '16px'
                    }}
                  >
                    <ArrowLeft size={16} /> Back to reservation options
                  </button>

                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                    PARTIAL STAY CANCELLATION
                  </span>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#17271f', margin: '0 0 8px 0' }}>
                    Cancel Selected Date(s)
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6e7a76', marginBottom: '20px', lineHeight: 1.5 }}>
                    Adjust your arrival or departure dates to cancel individual nights without losing your entire reservation.
                  </p>

                  <form onSubmit={handleConfirmCancelSelectedDates}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Revised Check-In</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={newCheckIn} 
                          onChange={(e) => setNewCheckIn(e.target.value)} 
                          required 
                          style={{ padding: '10px 12px' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Revised Check-Out</label>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={newCheckOut} 
                          onChange={(e) => setNewCheckOut(e.target.value)} 
                          required 
                          style={{ padding: '10px 12px' }}
                        />
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#eaf5ee', border: '1px solid #a3d9b8', borderRadius: '12px', padding: '14px 16px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#17653e', fontWeight: 700, fontSize: '0.875rem', marginBottom: '4px' }}>
                        <CheckCircle2 size={16} /> Free Partial Cancellation Window Active
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#17271f', lineHeight: 1.4 }}>
                        Cancelled dates will be released and your stay total recalculated with $0 penalty fee.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setModalSubView('options')} 
                        className="btn btn-outline" 
                        style={{ flex: 1, padding: '12px', fontSize: '0.95rem' }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ flex: 1.5, padding: '12px', fontSize: '0.95rem', fontWeight: 700 }}
                      >
                        Confirm Cancellation of Selected Dates
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 4: Confirm Entire Cancellation */}
              {modalSubView === 'confirm_cancel' && (
                <div>
                  <button
                    onClick={() => setModalSubView('options')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#173f34',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      padding: 0,
                      marginBottom: '16px'
                    }}
                  >
                    <ArrowLeft size={16} /> Back to reservation options
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '50%' }}>
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        FINAL CONFIRMATION
                      </span>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#17271f', margin: 0 }}>
                        Cancel Entire Reservation?
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9375rem', color: '#6e7a76', lineHeight: 1.6, margin: '16px 0 20px' }}>
                    Are you sure you wish to cancel reservation <strong>#{selectedRes.confirmationCode}</strong> at <strong>{selectedRes.propertyName}</strong> ({selectedRes.checkInDate} → {selectedRes.checkOutDate})?
                  </p>

                  <div style={{
                    backgroundColor: '#eaf5ee',
                    border: '1.5px solid #a3d9b8',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#17653e', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                      <ShieldCheck size={18} /> Free Cancellation Window Active
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#17271f', lineHeight: 1.5 }}>
                      Cancellation penalty: <strong>$0 USD (Zero penalty)</strong>. Full refund will be automatically credited to your original payment method.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => setModalSubView('options')} 
                      className="btn btn-outline" 
                      style={{ flex: 1, padding: '13px', fontSize: '0.95rem', fontWeight: 700 }}
                    >
                      Keep Reservation
                    </button>
                    <button 
                      onClick={handleConfirmCancelEntire} 
                      style={{ 
                        flex: 1.4, 
                        backgroundColor: '#b91c1c', 
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '12px', 
                        padding: '13px', 
                        fontWeight: 700, 
                        fontSize: '0.95rem', 
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(185, 28, 28, 0.25)'
                      }}
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
