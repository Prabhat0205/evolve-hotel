import React, { useState } from 'react';
import { useApp, normalizePhone, normalizeGuestCode } from '../context/AppContext';
import { Reservation } from '../types';
import { 
  AlertCircle, ShieldCheck, Sparkles, Lock, ArrowRight, X, ArrowLeft, 
  CheckCircle2, CreditCard, Calendar, Check, Info, ArrowUpRight
} from 'lucide-react';

export const MyStaysPage: React.FC = () => {
  const { 
    reservations, cancelReservation, updateReservation, navigateTo, addToast,
    currentUser, currentPersona, activeGuestCode, activeGuestPhone,
    openAuthModal, loginAs, loginAsGuest
  } = useApp();

  // Primary page view: 'list' (all stays) | 'change_stay' (Screenshot 2) | 'modify_checkout' (Checkout flow)
  const [pageView, setPageView] = useState<'list' | 'change_stay' | 'modify_checkout'>('list');
  const [tab, setTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED' | 'MISSING'>('UPCOMING');

  // Active reservation being viewed / modified / cancelled
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Modal states (for cancel options)
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [modalSubView, setModalSubView] = useState<'options' | 'cancel_dates' | 'confirm_cancel'>('options');

  // Form states for "Change your stay" (Screenshot 2)
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [selectedGuests, setSelectedGuests] = useState('2 adults');
  const [selectedSuiteType, setSelectedSuiteType] = useState('King Suite');

  // Availability check state
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  // Checkout flow states (modify_checkout)
  const [useCardOnFile, setUseCardOnFile] = useState(true);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [newCardZip, setNewCardZip] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Filter reservations based on active session
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

  // Suite rates helper
  const getSuiteNightlyRate = (suiteName: string, baseRate: number) => {
    const s = (suiteName || '').toLowerCase();
    if (s.includes('king')) return 144;
    if (s.includes('queen')) return 138;
    if (s.includes('one bedroom') || s.includes('one-bedroom')) return 185;
    if (s.includes('executive')) return 230;
    if (s.includes('penthouse')) return 360;
    return baseRate || 144;
  };

  // Price difference calculation matching Screenshot 1
  const calculateModificationDifference = () => {
    if (!selectedRes || !newCheckIn || !newCheckOut) {
      return { 
        newNights: 0, newSubtotal: 0, newTaxes: 0, newTotal: 0, 
        diffAmount: 0, isIncrease: false, isDecrease: false, 
        nightsDiff: 0, nightlyRate: 144 
      };
    }
    const d1 = new Date(newCheckIn);
    const d2 = new Date(newCheckOut);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) {
      return { 
        newNights: 0, newSubtotal: 0, newTaxes: 0, newTotal: 0, 
        diffAmount: 0, isIncrease: false, isDecrease: false, 
        nightsDiff: 0, nightlyRate: 144 
      };
    }
    const newNights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const nightlyRate = getSuiteNightlyRate(selectedSuiteType, selectedRes.nightlyRate);
    const newSubtotal = nightlyRate * newNights;
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
      nightsDiff: newNights - selectedRes.nightsCount,
      nightlyRate
    };
  };

  // Open modal from card
  const handleOpenOptions = (res: Reservation) => {
    setSelectedRes(res);
    setNewCheckIn(res.checkInDate);
    setNewCheckOut(res.checkOutDate);
    setSelectedSuiteType(res.roomName || 'King Suite');
    setSelectedGuests(`${res.guestsCount?.adults || 2} adults`);
    setModalSubView('options');
    setOptionsModalOpen(true);
  };

  // Open "Change your stay" dedicated view (matching Screenshot 2)
  const handleStartModification = (res: Reservation) => {
    setSelectedRes(res);
    setNewCheckIn(res.checkInDate);
    setNewCheckOut(res.checkOutDate);
    setSelectedSuiteType(res.roomName || 'King Suite');
    setSelectedGuests(`${res.guestsCount?.adults || 2} adults`);
    setAvailabilityChecked(false);
    setIsCheckingAvailability(false);
    setOptionsModalOpen(false);
    setPageView('change_stay');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check Availability & Rates action
  const handleCheckAvailability = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedRes || !newCheckIn || !newCheckOut) {
      addToast('warning', 'Missing Dates', 'Please specify both check-in and check-out dates.');
      return;
    }
    const d1 = new Date(newCheckIn);
    const d2 = new Date(newCheckOut);
    if (d2 <= d1) {
      addToast('error', 'Invalid Stay Dates', 'Check-out date must be after check-in date.');
      return;
    }
    setIsCheckingAvailability(true);
    setTimeout(() => {
      setIsCheckingAvailability(false);
      setAvailabilityChecked(true);
    }, 400);
  };

  // Proceed to Checkout flow
  const handleProceedToCheckout = () => {
    const { newNights } = calculateModificationDifference();
    if (newNights <= 0) {
      addToast('error', 'Invalid Stay Dates', 'Please select valid stay dates before proceeding.');
      return;
    }
    setAgreedToTerms(false);
    setUseCardOnFile(true);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvc('');
    setNewCardZip('');
    setPageView('modify_checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute payment & confirmation in Checkout flow
  const handleExecuteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    if (!agreedToTerms) {
      addToast('warning', 'Policy Agreement Required', 'Please confirm that you agree to the cancellation policy.');
      return;
    }

    const { newNights, newTotal, diffAmount } = calculateModificationDifference();

    if (!useCardOnFile && diffAmount > 0) {
      if (!newCardNumber || !newCardExpiry || !newCardCvc) {
        addToast('error', 'Payment Details Incomplete', 'Please enter your complete card number, expiry, and CVC.');
        return;
      }
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      const updatedPaymentMethod = useCardOnFile 
        ? (selectedRes.paymentMethod || { brand: 'amex', last4: '1004' })
        : { brand: 'visa', last4: newCardNumber.slice(-4) || '8831' };

      const parsedAdults = parseInt(selectedGuests.split(' ')[0]) || 2;

      const updated: Reservation = {
        ...selectedRes,
        checkInDate: newCheckIn,
        checkOutDate: newCheckOut,
        nightsCount: newNights,
        roomName: selectedSuiteType,
        guestsCount: { adults: parsedAdults, children: selectedRes.guestsCount?.children || 0 },
        totalAmount: newTotal,
        paymentMethod: updatedPaymentMethod
      };

      updateReservation(updated);
      setSelectedRes(updated);
      setIsProcessingPayment(false);
      setPageView('list');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (diffAmount > 0) {
        addToast(
          'success', 
          'Payment Authorized & Reservation Updated', 
          `Additional charge of $${diffAmount} USD successfully processed on ${updatedPaymentMethod.brand.toUpperCase()} ending ${updatedPaymentMethod.last4}. Reservation ${updated.confirmationCode} updated.`
        );
      } else if (diffAmount < 0) {
        addToast(
          'success', 
          'Refund Processed & Reservation Updated', 
          `Refund of $${Math.abs(diffAmount)} USD issued to ${updatedPaymentMethod.brand.toUpperCase()} ending ${updatedPaymentMethod.last4}. Reservation ${updated.confirmationCode} updated.`
        );
      } else {
        addToast(
          'success', 
          'Stay Modification Confirmed', 
          `Reservation ${updated.confirmationCode} updated to ${newCheckIn} → ${newCheckOut} with $0 additional charge.`
        );
      }
    }, 950);
  };

  // Cancel reservation handlers
  const handleConfirmCancelEntire = () => {
    if (!selectedRes) return;
    cancelReservation(selectedRes.id);
    setOptionsModalOpen(false);
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

  // Date Formatting Helpers
  const formatStayIndividualDates = (checkIn: string, checkOut: string) => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) return `${checkIn}, ${checkOut}`;
      const dates: string[] = [];
      const curr = new Date(d1);
      while (curr < d2) {
        dates.push(curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        curr.setDate(curr.getDate() + 1);
      }
      return dates.join(', ');
    } catch {
      return `${checkIn}, ${checkOut}`;
    }
  };

  const formatCancellationDeadlineWithYear = (checkIn: string) => {
    try {
      const date = new Date(checkIn);
      if (isNaN(date.getTime())) return 'the day before arrival at 4:00 PM Central Time';
      date.setDate(date.getDate() - 1);
      const m = date.toLocaleDateString('en-US', { month: 'long' });
      const d = date.getDate();
      const y = date.getFullYear();
      return `${m} ${d}, ${y} at 4:00 PM Central Time`;
    } catch {
      return 'the day before arrival at 4:00 PM Central Time';
    }
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
  const diffInfo = calculateModificationDifference();

  // =========================================================================
  // VIEW 1: DEDICATED "CHANGE YOUR STAY" PAGE (Matches Screenshot 2)
  // =========================================================================
  if (pageView === 'change_stay' && selectedRes) {
    return (
      <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '50px 20px 80px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          {/* Breadcrumb / Back button */}
          <button
            onClick={() => setPageView('list')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#173f34',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={18} /> Back to My Stays
          </button>

          {/* Heading matching Screenshot 2 */}
          <h1 style={{ 
            fontFamily: 'Playfair Display, Georgia, serif', 
            fontSize: '3rem', 
            fontWeight: 700, 
            color: '#17271f', 
            margin: '0 0 36px 0',
            lineHeight: 1.15
          }}>
            Change your stay
          </h1>

          {/* 2-Column Grid Layout matching Screenshot 2 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
            gap: '32px', 
            alignItems: 'start' 
          }}>
            
            {/* LEFT CARD: Reservation EV-XXXX Inputs */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #eeece5',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              <h2 style={{ 
                fontSize: '1.45rem', 
                fontWeight: 800, 
                color: '#17271f', 
                margin: '0 0 24px 0' 
              }}>
                Reservation {selectedRes.confirmationCode}
              </h2>

              <form onSubmit={handleCheckAvailability}>
                {/* Row 1: Check in & Check out */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>
                      Check in
                    </label>
                    <input 
                      type="date"
                      value={newCheckIn}
                      onChange={(e) => {
                        setNewCheckIn(e.target.value);
                        setAvailabilityChecked(false);
                      }}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #c9c7be',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#17271f',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>
                      Check out
                    </label>
                    <input 
                      type="date"
                      value={newCheckOut}
                      onChange={(e) => {
                        setNewCheckOut(e.target.value);
                        setAvailabilityChecked(false);
                      }}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #c9c7be',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#17271f',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Row 2: Guests & Suite type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>
                      Guests
                    </label>
                    <select
                      value={selectedGuests}
                      onChange={(e) => {
                        setSelectedGuests(e.target.value);
                        setAvailabilityChecked(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #c9c7be',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#17271f',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="1 adult">1 adult</option>
                      <option value="2 adults">2 adults</option>
                      <option value="3 adults">3 adults</option>
                      <option value="4 adults">4 adults</option>
                      <option value="2 adults, 1 child">2 adults, 1 child</option>
                      <option value="2 adults, 2 children">2 adults, 2 children</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>
                      Suite type
                    </label>
                    <select
                      value={selectedSuiteType}
                      onChange={(e) => {
                        setSelectedSuiteType(e.target.value);
                        setAvailabilityChecked(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #c9c7be',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#17271f',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="King Suite">King Suite</option>
                      <option value="Queen Suite">Queen Suite</option>
                      <option value="One Bedroom Suite">One Bedroom Suite</option>
                      <option value="Executive Suite">Executive Suite</option>
                      <option value="Penthouse Suite">Penthouse Suite</option>
                    </select>
                  </div>
                </div>

                {/* Amber / Yellow Callout Note matching Screenshot 2 */}
                <div style={{
                  backgroundColor: '#fef9ee',
                  borderLeft: '4px solid #dda943',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  marginBottom: '22px',
                  fontSize: '0.875rem',
                  color: '#3d3322',
                  lineHeight: 1.5
                }}>
                  New rates, availability and any price difference will be shown before confirmation. Your existing reservation remains unchanged until you confirm.
                </div>

                {/* Dark Green Full-Width Button matching Screenshot 2 */}
                <button
                  type="submit"
                  disabled={isCheckingAvailability}
                  style={{
                    width: '100%',
                    backgroundColor: '#173f34',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px 20px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: isCheckingAvailability ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    transition: 'background-color 0.2s ease',
                    boxShadow: '0 2px 8px rgba(23, 63, 52, 0.15)'
                  }}
                  onMouseEnter={(e) => !isCheckingAvailability && (e.currentTarget.style.backgroundColor = '#102d25')}
                  onMouseLeave={(e) => !isCheckingAvailability && (e.currentTarget.style.backgroundColor = '#173f34')}
                >
                  {isCheckingAvailability ? 'Checking Availability & Rates...' : 'Check Availability & Rates'}
                </button>
              </form>

              {/* SCREENSHOT 1: PRICE DIFFERENCE CARD & PROCEED TO CHECKOUT */}
              {availabilityChecked && (
                <div style={{ marginTop: '24px', animation: 'fadeIn 0.3s ease' }}>
                  {/* Card with amber border matching Screenshot 1 */}
                  <div style={{
                    border: '1.5px solid #f2c979',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '22px 24px',
                    boxShadow: '0 6px 24px rgba(221, 169, 67, 0.08)'
                  }}>
                    {/* Original Stay line */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '8px',
                      fontSize: '1.05rem',
                      color: '#717d78',
                      fontWeight: 400
                    }}>
                      <span>Original Stay:</span>
                      <span>{selectedRes.nightsCount} Nights (${selectedRes.totalAmount} USD)</span>
                    </div>

                    {/* Modified Stay line */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '16px',
                      fontSize: '1.15rem',
                      color: '#17271f',
                      fontWeight: 800
                    }}>
                      <span>Modified Stay:</span>
                      <span>{diffInfo.newNights} Nights (${diffInfo.newTotal} USD)</span>
                    </div>

                    {/* Dashed Separator */}
                    <div style={{ borderTop: '1px dashed #dcd8cf', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ 
                          fontSize: '0.95rem', 
                          fontWeight: 800, 
                          color: diffInfo.diffAmount > 0 ? '#a05615' : diffInfo.diffAmount < 0 ? '#17653e' : '#17271f',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase'
                        }}>
                          {diffInfo.diffAmount > 0 
                            ? 'ADDITIONAL AMOUNT DUE' 
                            : diffInfo.diffAmount < 0 
                            ? 'REFUND AMOUNT DUE' 
                            : 'NO ADDITIONAL AMOUNT DUE'}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#717d78', marginTop: '4px' }}>
                          {diffInfo.diffAmount > 0 
                            ? `+${Math.max(0, diffInfo.nightsDiff)} night(s) at $${diffInfo.nightlyRate}/night + taxes` 
                            : diffInfo.diffAmount < 0 
                            ? `${Math.abs(diffInfo.nightsDiff)} fewer night(s) credited` 
                            : 'Same duration and rate'}
                        </div>
                      </div>

                      {/* Large Difference Amount */}
                      <div style={{ 
                        fontSize: '1.9rem', 
                        fontWeight: 800, 
                        color: diffInfo.diffAmount > 0 ? '#a05615' : diffInfo.diffAmount < 0 ? '#17653e' : '#17271f',
                        whiteSpace: 'nowrap'
                      }}>
                        {diffInfo.diffAmount > 0 
                          ? `+$${diffInfo.diffAmount} USD` 
                          : diffInfo.diffAmount < 0 
                          ? `-$${Math.abs(diffInfo.diffAmount)} USD` 
                          : '$0 USD'}
                      </div>
                    </div>
                  </div>

                  {/* Proceed to Checkout Flow Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    style={{
                      marginTop: '16px',
                      width: '100%',
                      backgroundColor: '#173f34',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 24px',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      boxShadow: '0 4px 16px rgba(23, 63, 52, 0.2)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#102d25')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173f34')}
                  >
                    Proceed to Checkout Flow <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT CARD: Current Reservation Summary matching Screenshot 2 */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #eeece5',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 800, 
                color: '#17271f', 
                margin: '0 0 24px 0' 
              }}>
                Current reservation
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9375rem' }}>
                  <span style={{ color: '#4a5753' }}>Confirmation</span>
                  <span style={{ fontWeight: 800, color: '#17271f' }}>{selectedRes.confirmationCode}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.9375rem', gap: '16px' }}>
                  <span style={{ color: '#4a5753', whiteSpace: 'nowrap' }}>Current dates</span>
                  <span style={{ fontWeight: 800, color: '#17271f', textAlign: 'right', lineHeight: 1.45 }}>
                    {formatStayIndividualDates(selectedRes.checkInDate, selectedRes.checkOutDate)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9375rem' }}>
                  <span style={{ color: '#4a5753' }}>Current total</span>
                  <span style={{ fontWeight: 800, color: '#17271f' }}>${selectedRes.totalAmount.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.9375rem', gap: '16px' }}>
                  <span style={{ color: '#4a5753', whiteSpace: 'nowrap' }}>Cancellation deadline</span>
                  <span style={{ fontWeight: 800, color: '#17271f', textAlign: 'right', lineHeight: 1.45 }}>
                    {formatCancellationDeadlineWithYear(selectedRes.checkInDate)}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  fontSize: '0.9375rem', 
                  paddingTop: '12px', 
                  borderTop: '1px solid #f3f0ea' 
                }}>
                  <span style={{ color: '#4a5753' }}>Penalty after deadline</span>
                  <span style={{ fontWeight: 800, color: '#17271f' }}>One night + tax</span>
                </div>
              </div>

              {/* Property Snapshot info */}
              <div style={{
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px dashed #dcd8cf',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <img 
                  src={selectedRes.propertyImage} 
                  alt={selectedRes.propertyName}
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, color: '#17271f', fontSize: '0.9375rem' }}>{selectedRes.propertyName}</div>
                  <div style={{ color: '#6e7a76', fontSize: '0.8125rem', marginTop: '2px' }}>{selectedRes.propertyCity}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: MODIFICATION CHECKOUT FLOW (Matches Proceed to Checkout Flow)
  // =========================================================================
  if (pageView === 'modify_checkout' && selectedRes) {
    return (
      <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '50px 20px 80px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          {/* Breadcrumb back to change stay */}
          <button
            onClick={() => setPageView('change_stay')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#173f34',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={18} /> Back to Change Stay
          </button>

          <div style={{ marginBottom: '32px' }}>
            <span style={{ 
              fontSize: '0.8125rem', 
              fontWeight: 800, 
              color: '#997125', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '6px'
            }}>
              FINAL STEP · PAYMENT & CONFIRMATION
            </span>
            <h1 style={{ 
              fontFamily: 'Playfair Display, Georgia, serif', 
              fontSize: '2.75rem', 
              fontWeight: 700, 
              color: '#17271f', 
              margin: '0 0 8px 0' 
            }}>
              Modification Checkout
            </h1>
            <p style={{ color: '#6e7a76', fontSize: '1.05rem', margin: 0 }}>
              Review your modified itinerary, authorize payment for the rate difference, and confirm your updated Cloudbeds reservation.
            </p>
          </div>

          <form onSubmit={handleExecuteCheckout}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
              gap: '32px', 
              alignItems: 'start' 
            }}>
              
              {/* LEFT COLUMN: Checkout Form & Payment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Stay Summary Card */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #eeece5',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#173f34', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                    1. Reservation Changes
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.875rem' }}>
                    <div style={{ backgroundColor: '#f8f7f4', borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ color: '#6e7a76', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Original Stay</div>
                      <div style={{ fontWeight: 700, color: '#17271f' }}>{formatStayDates(selectedRes.checkInDate, selectedRes.checkOutDate)}</div>
                      <div style={{ color: '#6e7a76', fontSize: '0.8125rem', marginTop: '2px' }}>{selectedRes.nightsCount} Nights · {selectedRes.roomName}</div>
                    </div>

                    <div style={{ backgroundColor: '#eaf5ee', border: '1px solid #a3d9b8', borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ color: '#17653e', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Modified Stay</div>
                      <div style={{ fontWeight: 800, color: '#17271f' }}>{formatStayDates(newCheckIn, newCheckOut)}</div>
                      <div style={{ color: '#17271f', fontSize: '0.8125rem', marginTop: '2px' }}>{diffInfo.newNights} Nights · {selectedSuiteType}</div>
                    </div>
                  </div>
                </div>

                {/* 2. Guest Information */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #eeece5',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#173f34', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                    2. Primary Guest Details
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6e7a76', marginBottom: '4px' }}>Guest Name</label>
                      <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9375rem' }}>
                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest Traveler'}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6e7a76', marginBottom: '4px' }}>Contact</label>
                      <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9375rem' }}>
                        {currentUser?.email || selectedRes.guestPhone || '+1 (555) 234-5678'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #eeece5',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#173f34', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                    3. Payment & Settlement
                  </div>

                  {diffInfo.diffAmount > 0 ? (
                    <div>
                      <div style={{
                        backgroundColor: '#fcf6eb',
                        border: '1px solid #dda943',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        marginBottom: '18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase' }}>Additional Amount Due</span>
                          <div style={{ fontSize: '0.8125rem', color: '#17271f' }}>Charged immediately upon confirmation</div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
                          +${diffInfo.diffAmount} USD
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Radio 1: Card on File */}
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: useCardOnFile ? '2px solid #173f34' : '1px solid #d8d6cf',
                          backgroundColor: useCardOnFile ? '#f0f5f2' : '#ffffff',
                          cursor: 'pointer'
                        }}>
                          <input 
                            type="radio"
                            name="modifyCheckoutPayment"
                            checked={useCardOnFile}
                            onChange={() => setUseCardOnFile(true)}
                          />
                          <CreditCard size={22} color="#173f34" />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#17271f' }}>
                              Card on File ({selectedRes.paymentMethod?.brand?.toUpperCase() || 'AMEX'} ending {selectedRes.paymentMethod?.last4 || '1004'})
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: '#6e7a76' }}>
                              Primary method used for booking · Instant authorization
                            </div>
                          </div>
                        </label>

                        {/* Radio 2: New Card */}
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: !useCardOnFile ? '2px solid #173f34' : '1px solid #d8d6cf',
                          backgroundColor: !useCardOnFile ? '#f0f5f2' : '#ffffff',
                          cursor: 'pointer'
                        }}>
                          <input 
                            type="radio"
                            name="modifyCheckoutPayment"
                            checked={!useCardOnFile}
                            onChange={() => setUseCardOnFile(false)}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#17271f' }}>
                              Use a New Credit or Debit Card
                            </div>
                          </div>
                        </label>

                        {!useCardOnFile && (
                          <div style={{
                            backgroundColor: '#faf9f6',
                            border: '1px solid #eeece5',
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>Card Number</label>
                              <input 
                                type="text"
                                className="form-input"
                                placeholder="4000 1234 5678 9010"
                                value={newCardNumber}
                                onChange={(e) => setNewCardNumber(e.target.value)}
                                required={!useCardOnFile}
                                style={{ padding: '10px 12px' }}
                              />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>Expiry (MM/YY)</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  placeholder="MM/YY"
                                  value={newCardExpiry}
                                  onChange={(e) => setNewCardExpiry(e.target.value)}
                                  required={!useCardOnFile}
                                  style={{ padding: '10px 12px' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>CVC</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  placeholder="123"
                                  value={newCardCvc}
                                  onChange={(e) => setNewCardCvc(e.target.value)}
                                  required={!useCardOnFile}
                                  style={{ padding: '10px 12px' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>Billing ZIP</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  placeholder="90210"
                                  value={newCardZip}
                                  onChange={(e) => setNewCardZip(e.target.value)}
                                  style={{ padding: '10px 12px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : diffInfo.diffAmount < 0 ? (
                    <div style={{
                      backgroundColor: '#eaf5ee',
                      border: '1px solid #a3d9b8',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <CheckCircle2 size={24} color="#17653e" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#17653e', fontSize: '0.9375rem' }}>
                          Refund Due: ${Math.abs(diffInfo.diffAmount)} USD
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#17271f', marginTop: '2px' }}>
                          A credit of ${Math.abs(diffInfo.diffAmount)} USD will be automatically returned to your original card ({selectedRes.paymentMethod?.brand?.toUpperCase() || 'AMEX'} ending {selectedRes.paymentMethod?.last4 || '1004'}).
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: '#f8f7f4',
                      border: '1px solid #eeece5',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <CheckCircle2 size={24} color="#173f34" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#17271f', fontSize: '0.9375rem' }}>
                          No Additional Payment Required ($0.00 USD)
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '2px' }}>
                          Your modified reservation dates and suite type will be updated instantly at no extra cost.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Policy Agreement & Consent */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #eeece5',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: '#173f34' }}
                    />
                    <div style={{ fontSize: '0.875rem', color: '#17271f', lineHeight: 1.5 }}>
                      I agree to the updated Evolve Cancellation Policy. I understand that the new cancellation deadline is <strong>{formatCancellationDeadlineWithYear(newCheckIn)}</strong>, after which the penalty is one night's rate plus tax.
                    </div>
                  </label>
                </div>

                {/* Confirm & Authorize Button */}
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  style={{
                    width: '100%',
                    backgroundColor: '#173f34',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '18px 24px',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 16px rgba(23, 63, 52, 0.25)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => !isProcessingPayment && (e.currentTarget.style.backgroundColor = '#102d25')}
                  onMouseLeave={(e) => !isProcessingPayment && (e.currentTarget.style.backgroundColor = '#173f34')}
                >
                  {isProcessingPayment ? (
                    'Processing Modification in Cloudbeds...'
                  ) : diffInfo.diffAmount > 0 ? (
                    `Authorize Payment of $${diffInfo.diffAmount} USD & Confirm Modification`
                  ) : diffInfo.diffAmount < 0 ? (
                    `Confirm Modification & Process $${Math.abs(diffInfo.diffAmount)} Refund`
                  ) : (
                    'Confirm Stay Modification ($0 USD Due)'
                  )}
                </button>

              </div>

              {/* RIGHT COLUMN: Order Summary Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid #eeece5',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                position: 'sticky',
                top: '20px'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17271f', margin: '0 0 20px 0' }}>
                  Summary of Charges
                </h3>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f3f0ea' }}>
                  <img 
                    src={selectedRes.propertyImage} 
                    alt={selectedRes.propertyName}
                    style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: '#17271f', fontSize: '0.95rem' }}>{selectedRes.propertyName}</div>
                    <div style={{ color: '#6e7a76', fontSize: '0.8125rem', marginTop: '2px' }}>{selectedSuiteType} · {selectedGuests}</div>
                    <div style={{ color: '#173f34', fontWeight: 700, fontSize: '0.75rem', marginTop: '4px' }}>Confirmation {selectedRes.confirmationCode}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76' }}>
                    <span>Original Stay Total</span>
                    <span>${selectedRes.totalAmount.toFixed(2)} USD</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#17653e' }}>
                    <span>Original Payment Credit</span>
                    <span>-${selectedRes.totalAmount.toFixed(2)} USD</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76' }}>
                    <span>Revised Stay ({diffInfo.newNights} Nights × ${diffInfo.nightlyRate})</span>
                    <span>${diffInfo.newSubtotal.toFixed(2)} USD</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e7a76' }}>
                    <span>Estimated Taxes & Fees (12%)</span>
                    <span>${diffInfo.newTaxes.toFixed(2)} USD</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#17271f', fontWeight: 700, paddingTop: '8px', borderTop: '1px solid #f3f0ea' }}>
                    <span>Revised Total Amount</span>
                    <span>${diffInfo.newTotal.toFixed(2)} USD</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '14px', 
                    borderTop: '2px solid #17271f',
                    color: diffInfo.diffAmount > 0 ? '#b45309' : diffInfo.diffAmount < 0 ? '#17653e' : '#17271f',
                    fontWeight: 800,
                    fontSize: '1.05rem'
                  }}>
                    <span>{diffInfo.diffAmount > 0 ? 'Total Due Today' : diffInfo.diffAmount < 0 ? 'Refund Credited' : 'Net Due Today'}</span>
                    <span style={{ fontSize: '1.35rem' }}>
                      {diffInfo.diffAmount > 0 
                        ? `+$${diffInfo.diffAmount} USD` 
                        : diffInfo.diffAmount < 0 
                        ? `-$${Math.abs(diffInfo.diffAmount)} USD` 
                        : '$0.00 USD'}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '24px', 
                  paddingTop: '18px', 
                  borderTop: '1px dashed #dcd8cf',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.75rem', 
                  color: '#6e7a76' 
                }}>
                  <ShieldCheck size={16} color="#17653e" />
                  <span>256-Bit SSL Encrypted · Instant Cloudbeds synchronization</span>
                </div>
              </div>

            </div>
          </form>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: STANDARD MY STAYS LIST PAGE
  // =========================================================================
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
              Modify or cancel the full reservation by 4:00 PM Central Time on the day before arrival to avoid a penalty. For an individual booked night, the deadline is 4:00 PM Central Time on the day before that selected date. After the applicable deadline, the penalty is one night's room rate plus applicable taxes.
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
                  <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>Reservation EV-2041 (King Suite, Sep 19–22)</div>
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
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                          <button 
                            onClick={() => handleOpenOptions(stay)} 
                            style={{ 
                              backgroundColor: '#ffffff', 
                              color: '#173f34', 
                              border: '1px solid #eeece5', 
                              borderRadius: '8px', 
                              padding: '8px 16px', 
                              fontSize: '0.875rem', 
                              fontWeight: 700, 
                              cursor: 'pointer' 
                            }}
                          >
                            Modify or Cancel
                          </button>
                          <button
                            onClick={() => handleStartModification(stay)}
                            style={{
                              backgroundColor: '#173f34',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            Change Stay <ArrowRight size={14} />
                          </button>
                        </div>
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

              {/* VIEW 1: Main Reservation Options */}
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
                      onClick={() => handleStartModification(selectedRes)}
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
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#102d25')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173f34')}
                    >
                      Modify dates or reservation <ArrowRight size={16} />
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

              {/* VIEW 2: Cancel Selected Dates (Shorten Stay) */}
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
                        Confirm Cancellation
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 3: Confirm Entire Cancellation */}
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
