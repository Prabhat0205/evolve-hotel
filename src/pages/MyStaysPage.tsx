import React, { useState } from 'react';
import { useApp, normalizePhone, normalizeGuestCode } from '../context/AppContext';
import { Reservation } from '../types';
import { mockProperties } from '../data/mockProperties';
import { 
  AlertCircle, ShieldCheck, Sparkles, Lock, ArrowRight, X, ArrowLeft, 
  CheckCircle2, CreditCard, Calendar, Check, Info, ArrowUpRight, HelpCircle, Phone,
  Clock
} from 'lucide-react';

export interface MissingStayRequestItem {
  id: string;
  refCode: string;
  property: string;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  bookedChannel: string;
  notes: string;
  submittedAt: string;
  status: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export const MyStaysPage: React.FC = () => {
  const { 
    reservations, cancelReservation, navigateTo, addToast, setSelectedProperty,
    currentUser, currentPersona, activeGuestCode, activeGuestPhone,
    openAuthModal, loginAs
  } = useApp();

  // Active tab
  const [tab, setTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED' | 'MISSING'>('UPCOMING');

  // Active reservation being viewed / cancelled
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Modal states for cancellation & policy views
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [modalSubView, setModalSubView] = useState<'options' | 'confirm_cancel' | 'locked_24h'>('options');

  // Confirmation Popup Modal
  const [confirmationModal, setConfirmationModal] = useState<{
    tag: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    redirectTab?: 'UPCOMING' | 'CANCELLED' | 'MISSING';
  } | null>(null);

  // Missing stay modal states
  const [reportMissingModalOpen, setReportMissingModalOpen] = useState(false);
  const [missingProperty, setMissingProperty] = useState('Evolve Hotels & Suites · Texarkana');
  const [missingConfirmation, setMissingConfirmation] = useState('');
  const [missingCheckIn, setMissingCheckIn] = useState('');
  const [missingCheckOut, setMissingCheckOut] = useState('');
  const [missingBookedChannel, setMissingBookedChannel] = useState('Evolve website');
  const [missingNotes, setMissingNotes] = useState('');
  const [isSubmittingMissing, setIsSubmittingMissing] = useState(false);

  // Missing stay requests stored in localStorage
  const [missingStayRequests, setMissingStayRequests] = useState<MissingStayRequestItem[]>(() => {
    try {
      const saved = localStorage.getItem('evolve_missing_stays_v1');
      if (saved) {
        return JSON.parse(saved);
      }
      return [
        {
          id: 'req-sample-4013',
          refCode: 'MS-4013',
          property: 'Evolve Hotels & Suites · Texarkana',
          confirmationNumber: 'EV-4218',
          checkIn: '2026-09-12',
          checkOut: '2026-09-14',
          bookedChannel: 'Evolve website',
          notes: 'Completed 2-night stay with confirmation EV-4218. Stays and points have not appeared in my account yet.',
          submittedAt: 'Oct 13, 2026',
          status: 'Resolved',
          resolutionNotes: 'Cloudbeds reservation #EV-4218 verified against folio records. 2 qualifying Reward Nights credited to your member account.',
          resolvedAt: 'Oct 13, 2026'
        }
      ];
    } catch {
      return [];
    }
  });

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

  // 24-Hour Policy Window calculation helper
  // Policy rule: Reservations can only be cancelled until 24 hours prior to check-in start date (4:00 PM Central Time the day before arrival).
  // Once within the 24-hour window (<24h left), cancellations are locked.
  // Note: No upfront payment is taken at booking, so there is zero cancellation fee and no amount refund.
  const getCancellationPolicyStatus = (checkInDateStr: string) => {
    try {
      const now = Date.now();
      const [y, m, d] = checkInDateStr.split('-').map(Number);
      if (!y || !m || !d) {
        return { isLocked: false, hoursRemaining: 999, deadlineText: '24 hours prior to check-in' };
      }

      // Check-in standard is 4:00 PM (16:00) Central on the check-in date
      const checkInDateTime = new Date(y, m - 1, d, 16, 0, 0);
      const checkInTimestamp = checkInDateTime.getTime();
      const msLeft = checkInTimestamp - now;
      const hoursRemaining = msLeft / (1000 * 60 * 60);

      // The 24-hour cutoff: 4:00 PM Central on the calendar day before check-in (d - 1)
      const cutoffDate = new Date(y, m - 1, d - 1, 16, 0, 0);
      const cutoffTimestamp = cutoffDate.getTime();

      const mStr = cutoffDate.toLocaleDateString('en-US', { month: 'short' });
      const dNum = cutoffDate.getDate();
      const deadlineText = `${mStr} ${dNum} at 4:00 PM Central Time`;

      // Locked if under 24 hours until check-in (or cutoff has passed)
      const isLocked = hoursRemaining <= 24 || now >= cutoffTimestamp;

      return {
        isLocked,
        hoursRemaining: Math.max(0, Math.round(hoursRemaining)),
        deadlineText
      };
    } catch {
      return { isLocked: false, hoursRemaining: 999, deadlineText: '24 hours prior to check-in' };
    }
  };

  // Open modal for a reservation (routes to 24h locked view if <= 24h left, otherwise options view)
  const handleOpenOptions = (res: Reservation) => {
    setSelectedRes(res);
    const policy = getCancellationPolicyStatus(res.checkInDate);
    if (policy.isLocked) {
      setModalSubView('locked_24h');
    } else {
      setModalSubView('options');
    }
    setOptionsModalOpen(true);
  };

  // Cancel & Rebook Action: Cancels current reservation with zero fee and redirects immediately to the hotel booking page
  const handleCancelAndRebook = (res: Reservation) => {
    const resCode = res.confirmationCode;
    const propName = res.propertyName;
    cancelReservation(res.id);
    setOptionsModalOpen(false);

    // Set matching property in context so property-detail page opens this hotel
    const matchedProp = mockProperties.find(p => p.id === res.propertyId || p.name.toLowerCase() === res.propertyName.toLowerCase()) || mockProperties[0];
    if (matchedProp) {
      setSelectedProperty(matchedProp);
    }

    addToast('success', 'Reservation Cancelled for Rebooking', `Reservation ${resCode} at ${propName} was cancelled with zero fee. Select your new dates to book.`);
    navigateTo('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Reservation Only Action (Zero Fee): Cancels current reservation and takes user directly to Cancelled reservations tab
  const handleConfirmCancelOnly = (res: Reservation) => {
    const resCode = res.confirmationCode;
    cancelReservation(res.id);
    setOptionsModalOpen(false);
    setTab('CANCELLED');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('success', 'Reservation Cancelled', `Reservation ${resCode} has been cancelled with zero fee. Viewing your Cancelled reservations.`);
  };

  // Missing Stay Submission Handler
  const handleSubmitMissingStay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missingProperty) {
      addToast('error', 'Missing Property', 'Please select a hotel property.');
      return;
    }
    if (!missingConfirmation && (!missingCheckIn || !missingCheckOut)) {
      addToast('error', 'Incomplete Details', 'Please provide a confirmation number or stay dates.');
      return;
    }

    setIsSubmittingMissing(true);
    setTimeout(() => {
      const refCode = `MS-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const newRequest: MissingStayRequestItem = {
        id: `req-${Date.now()}`,
        refCode,
        property: missingProperty,
        confirmationNumber: missingConfirmation || 'Pending Search',
        checkIn: missingCheckIn || 'Recent stay',
        checkOut: missingCheckOut || 'Recent stay',
        bookedChannel: missingBookedChannel,
        notes: missingNotes,
        submittedAt: nowStr,
        status: 'Pending Verification · Cloudbeds Match in Progress'
      };

      const updated = [newRequest, ...missingStayRequests];
      setMissingStayRequests(updated);
      try {
        localStorage.setItem('evolve_missing_stays_v1', JSON.stringify(updated));
      } catch {}

      setIsSubmittingMissing(false);
      setReportMissingModalOpen(false);

      // Reset form fields
      setMissingConfirmation('');
      setMissingCheckIn('');
      setMissingCheckOut('');
      setMissingNotes('');

      // Show confirmation popup
      setConfirmationModal({
        tag: 'STAY ASSISTANCE CONFIRMATION',
        title: 'Missing stay reported',
        description: `Cloudbeds confirmed receipt of missing stay request ${refCode} for ${missingProperty}. Staff will verify your booking against your phone records and credit any eligible Reward Nights.`,
        redirectTab: 'MISSING'
      });
      setTab('MISSING');
    }, 700);
  };

  const memberDisplayName = currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}` 
    : currentPersona === 'guest' && activeGuestCode 
    ? `Guest ${activeGuestCode}` 
    : 'John Parker';

  const memberDisplayPhone = currentUser?.phone || activeGuestPhone || '(555) 123-4567';

  // Timezone-safe local date parser to prevent UTC offset shifting days backwards
  const parseLocalDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d, 12, 0, 0);
      }
    }
    return new Date(dateStr);
  };

  // Date Formatting Helpers
  const formatStayDates = (checkIn: string, checkOut: string) => {
    try {
      const d1 = parseLocalDate(checkIn);
      const d2 = parseLocalDate(checkOut);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${checkIn}, ${checkOut}`;
      const opt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${d1.toLocaleDateString('en-US', opt)} – ${d2.toLocaleDateString('en-US', opt)}`;
    } catch {
      return `${checkIn}, ${checkOut}`;
    }
  };

  const getMonthAndDay = (dateStr: string) => {
    try {
      const date = parseLocalDate(dateStr);
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
      const d1 = parseLocalDate(checkIn);
      const d2 = parseLocalDate(checkOut);
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

  const getTabContent = () => {
    if (tab === 'MISSING') return [];
    if (tab === 'CANCELLED') return cancelledStays;
    if (tab === 'PAST') return pastStays;
    return upcomingStays;
  };

  const currentStays = getTabContent();

  // Render Confirmation Modal component
  const renderConfirmationModal = () => {
    if (!confirmationModal) return null;
    return (
      <div 
        className="modal-overlay" 
        onClick={() => {
          if (confirmationModal.redirectTab) {
            setTab(confirmationModal.redirectTab);
          }
          setConfirmationModal(null);
          setOptionsModalOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{ 
          zIndex: 3000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(3px)'
        }}
      >
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()} 
          style={{ 
            maxWidth: '520px', 
            width: '100%', 
            padding: '38px 34px 32px', 
            borderRadius: '24px', 
            backgroundColor: '#ffffff',
            boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
            position: 'relative'
          }}
        >
          <span style={{ 
            fontSize: '0.8125rem', 
            fontWeight: 800, 
            color: '#997125', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            display: 'block', 
            marginBottom: '10px' 
          }}>
            {confirmationModal.tag}
          </span>

          <h2 style={{ 
            fontFamily: 'Playfair Display, Georgia, serif', 
            fontSize: '2.2rem', 
            fontWeight: 700, 
            color: '#17271f', 
            margin: '0 0 16px 0',
            lineHeight: 1.15
          }}>
            {confirmationModal.title}
          </h2>

          <p style={{ 
            color: '#17271f', 
            fontSize: '1.02rem', 
            lineHeight: 1.55, 
            margin: '0 0 28px 0' 
          }}>
            {confirmationModal.description}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            {confirmationModal.actionLabel && confirmationModal.onAction && (
              <button
                type="button"
                onClick={() => {
                  const action = confirmationModal.onAction;
                  setConfirmationModal(null);
                  if (action) action();
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#173f34',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(23, 63, 52, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={18} /> {confirmationModal.actionLabel}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (confirmationModal.redirectTab) {
                  setTab(confirmationModal.redirectTab);
                }
                setConfirmationModal(null);
                setOptionsModalOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                width: '100%',
                backgroundColor: confirmationModal.actionLabel ? '#ffffff' : '#173f34',
                color: confirmationModal.actionLabel ? '#17271f' : '#ffffff',
                border: confirmationModal.actionLabel ? '1.5px solid #d8d6cf' : 'none',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {confirmationModal.actionLabel ? 'View Stays' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // STANDARD MY STAYS LIST VIEW
  // =========================================================================
  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '60px 20px' }}>
      {renderConfirmationModal()}
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
          <button 
            onClick={() => setReportMissingModalOpen(true)}
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#173f34', 
              border: '1px solid #eeece5', 
              borderRadius: '8px', 
              padding: '14px 24px', 
              fontSize: '1rem', 
              fontWeight: 700, 
              cursor: 'pointer', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
          >
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

        {/* Info Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#f0f5f2', borderLeft: '4px solid #173f34', borderRadius: '0 8px 8px 0', padding: '16px 20px' }}>
            <h4 style={{ color: '#17271f', margin: '0 0 4px 0', fontSize: '0.9375rem', fontWeight: 800 }}>Which stays can be managed here?</h4>
            <p style={{ color: '#17271f', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
              Direct reservations made through the Evolve website, Evolve Guest App, hotel phone line or property front desk can be cancelled with zero fee and rebooked before 24 hours of check-in time. Cancellations are only permitted before 24 hours of check-in time, not after that. No upfront payment was taken. In-place mid-stay date edits are disabled. Third-party reservations appear as view-only and must be handled via the original provider.
            </p>
          </div>
        </div>

        {/* Persona quick switch for easy testing */}
        {!currentUser && currentPersona === 'guest' ? (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eeece5',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '32px',
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
                <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>EV-347691 (&lt;24h locked) &amp; EV-424857 (&gt;24h cancellable)</div>
              </button>

              <button
                onClick={() => loginAs('member_prestige')}
                style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2ded5', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9rem' }}>Member: Alexander Wright</div>
                <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>Texarkana Active Stay &amp; Dallas Upcoming</div>
              </button>
            </div>
          </div>
        ) : null}

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
            const policy = getCancellationPolicyStatus(stay.checkInDate);
            
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
            } else if (tab === 'UPCOMING' && stay.status !== 'CANCELLED' && !isViewOnly) {
              if (policy.isLocked) {
                badgeText = 'No Cancellations';
                badgeStyle = { bg: '#fef2f2', color: '#b91c1c' };
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

                  {tab === 'UPCOMING' && !isViewOnly && stay.status !== 'CANCELLED' && (
                    policy.isLocked ? (
                      <button 
                        onClick={() => handleOpenOptions(stay)} 
                        style={{ 
                          alignSelf: 'flex-start',
                          backgroundColor: '#fbfaf8', 
                          color: '#8c4848', 
                          border: '1px solid #fecaca', 
                          borderRadius: '8px', 
                          padding: '8px 16px', 
                          fontSize: '0.875rem', 
                          fontWeight: 700, 
                          cursor: 'pointer',
                          marginBottom: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Lock size={14} color="#b91c1c" /> No Cancellations
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOpenOptions(stay)} 
                        style={{ 
                          alignSelf: 'flex-start',
                          backgroundColor: '#ffffff', 
                          color: '#173f34', 
                          border: '1.5px solid #173f34', 
                          borderRadius: '8px', 
                          padding: '8px 18px', 
                          fontSize: '0.875rem', 
                          fontWeight: 700, 
                          cursor: 'pointer',
                          marginBottom: '16px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#173f34';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#173f34';
                        }}
                      >
                        Cancel or Rebook Stay
                      </button>
                    )
                  )}

                  <p style={{ color: '#6e7a76', fontSize: '0.9375rem', margin: 0, lineHeight: 1.5 }}>
                    {stay.status === 'CANCELLED' ? (
                      <span style={{ color: '#b91c1c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span><strong>Reservation cancelled on record.</strong> Zero cancellation fee · No charges were incurred.</span>
                      </span>
                    ) : isPast ? (
                      isViewOnly ? (
                        <span style={{ color: '#17271f' }}>This reservation was booked through a third party and was not eligible for Reward Nights.</span>
                      ) : (
                        <span style={{ color: '#17271f' }}>Completed eligible stay · {stay.nightsCount} Reward Nights credited</span>
                      )
                    ) : isViewOnly ? (
                      <><strong style={{ color: '#17271f' }}>View only.</strong> Contact original booking provider to cancel this reservation.</>
                    ) : policy.isLocked ? (
                      <span style={{ color: '#b91c1c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={14} style={{ flexShrink: 0 }} />
                        <span><strong>No cancellations:</strong> Cancellation window is closed. Cancellations are only permitted before 24 hours of check-in time, not after that.</span>
                      </span>
                    ) : (
                      <span style={{ color: '#17653e', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={15} style={{ flexShrink: 0 }} />
                        <span><strong>Free cancellation:</strong> You can cancel only before 24 hours of check-in time (until {policy.deadlineText}). Zero cancellation fee.</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
          
          {tab === 'MISSING' ? (
            missingStayRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '14px', border: '1px solid #eeece5', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.95rem', color: '#17271f', fontWeight: 600 }}>
                    Showing <strong>{missingStayRequests.length}</strong> missing stay claim{missingStayRequests.length > 1 ? 's' : ''} submitted
                  </div>
                  <button 
                    onClick={() => setReportMissingModalOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                  >
                    + Submit Another Stay
                  </button>
                </div>

                {missingStayRequests.map(req => {
                  const isResolved = req.status.toLowerCase().includes('resolved');
                  const resolutionNotesText = req.resolutionNotes || (isResolved 
                    ? 'Cloudbeds reservation #EV-4218 verified against folio records. 2 qualifying Reward Nights credited to your member account.' 
                    : null);

                  return (
                    <div key={req.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            REQUEST #{req.refCode}
                          </span>
                          <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: '4px 0 0', fontWeight: 800 }}>
                            {req.property}
                          </h3>
                        </div>
                        <span style={{ 
                          backgroundColor: isResolved ? '#dcfce7' : '#fef3c7', 
                          color: isResolved ? '#15803d' : '#92400e', 
                          padding: '6px 14px', 
                          borderRadius: '999px', 
                          fontSize: '0.8125rem', 
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {isResolved ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                          {isResolved ? 'Resolved' : req.status}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', margin: '16px 0', padding: '14px', backgroundColor: '#fbfaf8', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6e7a76', textTransform: 'uppercase', fontWeight: 700 }}>Confirmation Number</div>
                          <div style={{ fontSize: '0.95rem', color: '#17271f', fontWeight: 700, marginTop: '2px' }}>{req.confirmationNumber}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6e7a76', textTransform: 'uppercase', fontWeight: 700 }}>Stay Dates</div>
                          <div style={{ fontSize: '0.95rem', color: '#17271f', fontWeight: 600, marginTop: '2px' }}>{req.checkIn} – {req.checkOut}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6e7a76', textTransform: 'uppercase', fontWeight: 700 }}>Booking Channel</div>
                          <div style={{ fontSize: '0.95rem', color: '#17271f', fontWeight: 600, marginTop: '2px' }}>{req.bookedChannel}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6e7a76', textTransform: 'uppercase', fontWeight: 700 }}>Submitted Date</div>
                          <div style={{ fontSize: '0.95rem', color: '#17271f', fontWeight: 600, marginTop: '2px' }}>{req.submittedAt}</div>
                        </div>
                      </div>

                      {req.notes && (
                        <p style={{ fontSize: '0.875rem', color: '#4a5753', margin: '0 0 14px', backgroundColor: '#f6f3ec', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #dda943' }}>
                          <strong>Guest notes:</strong> {req.notes}
                        </p>
                      )}

                      {/* RESOLUTION NOTES ON CUSTOMER END */}
                      {isResolved ? (
                        <div style={{ 
                          backgroundColor: '#f0fdf4', 
                          border: '1.5px solid #86efac', 
                          borderRadius: '12px', 
                          padding: '16px 18px', 
                          marginBottom: '16px' 
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                            <CheckCircle2 size={16} /> Resolution Notes:
                          </div>
                          <div style={{ fontSize: '0.92rem', color: '#14532d', lineHeight: 1.5 }}>
                            {resolutionNotesText}
                          </div>
                          {req.resolvedAt && (
                            <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '6px' }}>
                              Resolved on {req.resolvedAt}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ 
                          backgroundColor: '#fbfaf8', 
                          border: '1px solid #eeece5', 
                          borderRadius: '12px', 
                          padding: '14px 18px', 
                          marginBottom: '16px',
                          fontSize: '0.875rem',
                          color: '#6e7a76',
                          lineHeight: 1.5
                        }}>
                          <strong style={{ color: '#17271f' }}>Resolution notes:</strong> Under review. Staff matches reservations daily.
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#173f34', fontSize: '0.85rem', fontWeight: 600 }}>
                        <CheckCircle2 size={16} /> Cloudbeds system audit in queue. Staff matches reservations daily.
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', border: '1px solid #eeece5' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f6f3ec', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#173f34' }}>
                  <HelpCircle size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17271f', margin: '0 0 8px' }}>No Missing Stay Requests</h3>
                <p style={{ color: '#6e7a76', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                  Did you complete a stay that isn't showing in your account? Submit the confirmation details and our team will match it to your profile.
                </p>
                <button 
                  onClick={() => setReportMissingModalOpen(true)}
                  style={{ backgroundColor: '#173f34', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Report a Missing Stay
                </button>
              </div>
            )
          ) : currentStays.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', border: '1px solid #eeece5' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f6f3ec', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#6e7a76' }}>
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17271f', margin: '0 0 8px' }}>
                No {tab.toLowerCase()} stays found
              </h3>
              <p style={{ color: '#6e7a76', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                {tab === 'CANCELLED' 
                  ? 'You have not cancelled any bookings.' 
                  : tab === 'PAST' 
                  ? 'You have no completed previous stays on record.' 
                  : 'You have no confirmed upcoming bookings at this time.'}
              </p>
              {tab === 'UPCOMING' && (
                <button
                  onClick={() => navigateTo('landing')}
                  style={{ backgroundColor: '#173f34', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Explore Hotels &amp; Book
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* CANCELLATION & 24-HOUR POLICY MODAL */}
        {optionsModalOpen && selectedRes && (
          <div 
            className="modal-overlay" 
            onClick={() => setOptionsModalOpen(false)} 
            style={{ 
              zIndex: 1200, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(3px)'
            }}
          >
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                maxWidth: '560px', 
                width: '100%', 
                padding: '36px 32px 32px', 
                borderRadius: '24px', 
                backgroundColor: '#ffffff',
                boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
                position: 'relative',
                maxHeight: '92vh',
                overflowY: 'auto'
              }}
            >
              <button 
                onClick={() => setOptionsModalOpen(false)} 
                style={{ 
                  position: 'absolute', 
                  top: '24px', 
                  right: '24px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#6e7a76', 
                  padding: '4px' 
                }}
              >
                <X size={20} />
              </button>

              {/* VIEW 1: LOCKED UNDER 24 HOURS */}
              {modalSubView === 'locked_24h' && (() => {
                const policy = getCancellationPolicyStatus(selectedRes.checkInDate);
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          CANCELLATION POLICY
                        </span>
                        <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.85rem', fontWeight: 700, color: '#17271f', margin: 0, lineHeight: 1.2 }}>
                          No Cancellations
                        </h3>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.9375rem', color: '#55655f', lineHeight: 1.55, margin: '0 0 18px 0' }}>
                      Reservation <strong>#{selectedRes.confirmationCode}</strong> at <strong>{selectedRes.propertyName}</strong> is within 24 hours of check-in.
                    </p>

                    <div style={{
                      backgroundColor: '#fef2f2',
                      border: '1.5px solid #fecaca',
                      borderRadius: '14px',
                      padding: '16px 18px',
                      marginBottom: '18px'
                    }}>
                      <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={16} /> Cancellation Window Closed
                      </div>
                      <div style={{ color: '#7f1d1d', fontSize: '0.85rem', lineHeight: 1.5 }}>
                        Cancellations are only permitted before 24 hours of check-in time, not after that. Because this reservation is within 24 hours of check-in, cancellations are closed.
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#f8f7f3',
                      borderRadius: '14px',
                      padding: '16px 18px',
                      marginBottom: '22px',
                      fontSize: '0.875rem',
                      color: '#17271f',
                      lineHeight: 1.5
                    }}>
                      <strong>Need urgent assistance with your arrival?</strong>
                      <div style={{ color: '#55655f', marginTop: '4px' }}>
                        Please reach out to the hotel front desk directly at <strong>+1 (903) 555-0100</strong> or submit an urgent support inquiry.
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setOptionsModalOpen(false);
                          navigateTo('support');
                        }}
                        style={{
                          flex: 1.3,
                          backgroundColor: '#173f34',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Contact Support Desk
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptionsModalOpen(false)}
                        style={{
                          flex: 1,
                          backgroundColor: '#ffffff',
                          color: '#17271f',
                          border: '1.5px solid #d8d6cf',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* VIEW 2: OPTIONS (>24H ELIGIBLE - CANCEL & REBOOK OR CANCEL ONLY) */}
              {modalSubView === 'options' && (() => {
                const policy = getCancellationPolicyStatus(selectedRes.checkInDate);
                return (
                  <div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      color: '#997125', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em', 
                      display: 'block', 
                      marginBottom: '6px' 
                    }}>
                      RESERVATION MANAGEMENT
                    </span>
                    <h3 style={{ 
                      fontFamily: 'Playfair Display, Georgia, serif', 
                      fontSize: '2rem', 
                      fontWeight: 700, 
                      color: '#17271f', 
                      margin: '0 0 10px 0',
                      lineHeight: 1.2
                    }}>
                      Cancel or Rebook Stay
                    </h3>
                    <p style={{ 
                      fontSize: '0.9375rem', 
                      color: '#6e7a76', 
                      marginBottom: '20px', 
                      lineHeight: 1.5 
                    }}>
                      Direct in-place date edits are disabled. If you wish to adjust your stay dates or room type, you can cancel this reservation with zero fee and make a new booking.
                    </p>

                    {/* Reservation and Suite Details Card */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #eceae3',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      marginBottom: '16px'
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
                        <strong style={{ color: '#17271f', fontWeight: 800 }}>{selectedRes.confirmationCode}</strong>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #f3f0ea',
                        fontSize: '0.9375rem'
                      }}>
                        <span style={{ color: '#17271f' }}>Suite &amp; Property</span>
                        <strong style={{ color: '#17271f', fontWeight: 800, textAlign: 'right' }}>
                          {selectedRes.roomName} · {selectedRes.propertyName}
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
                        <span style={{ color: '#17271f' }}>Stay Dates</span>
                        <strong style={{ color: '#17271f', fontWeight: 800 }}>
                          {formatStayDates(selectedRes.checkInDate, selectedRes.checkOutDate)} ({selectedRes.nightsCount} nights)
                        </strong>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: '12px',
                        fontSize: '0.9375rem'
                      }}>
                        <span style={{ color: '#17271f' }}>Cancellation Fee</span>
                        <strong style={{ color: '#17653e', fontWeight: 800, fontSize: '1.05rem' }}>
                          $0.00 USD (Zero Fee)
                        </strong>
                      </div>
                    </div>

                    {/* Free Cancellation Window Active Box */}
                    <div style={{
                      backgroundColor: '#eaf5ee',
                      border: '1.5px solid #a3d9b8',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      marginBottom: '22px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17653e', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                        <ShieldCheck size={20} /> Free Cancellation Window Active (&gt;24h)
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#17271f', lineHeight: 1.5 }}>
                        You are outside the 24-hour cutoff (deadline: {policy.deadlineText}). You can cancel only before 24 hours of check-in time. Cancellation fee is <strong>$0 USD (Zero penalty)</strong>. Your reservation will simply be cancelled with zero charge.
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => handleCancelAndRebook(selectedRes)}
                        style={{
                          backgroundColor: '#173f34',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          fontSize: '1rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: '0 4px 12px rgba(23, 63, 52, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#102d25')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173f34')}
                      >
                        <Sparkles size={18} /> Cancel Reservation &amp; Rebook New Dates
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalSubView('confirm_cancel')}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#b91c1c',
                          border: '1.5px solid #fecaca',
                          borderRadius: '12px',
                          padding: '14px 20px',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                      >
                        Cancel Reservation Only (Zero Fee)
                      </button>

                      <button
                        type="button"
                        onClick={() => setOptionsModalOpen(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#173f34',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          textAlign: 'center',
                          padding: '6px 2px 0'
                        }}
                      >
                        Keep Reservation
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* VIEW 3: CONFIRM ENTIRE CANCELLATION */}
              {modalSubView === 'confirm_cancel' && (
                <div>
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
                      <ShieldCheck size={18} /> Free Cancellation Active (&gt;24h)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#17271f', lineHeight: 1.5 }}>
                      Cancellation fee: <strong>$0 USD (Zero fee)</strong>. Cancellations are permitted only before 24 hours of check-in time. Your reservation will simply be cancelled with zero charges.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      type="button"
                      onClick={() => setModalSubView('options')} 
                      style={{ 
                        flex: 1, 
                        backgroundColor: '#ffffff',
                        color: '#17271f',
                        border: '1.5px solid #d8d6cf',
                        borderRadius: '12px',
                        padding: '13px', 
                        fontSize: '0.95rem', 
                        fontWeight: 700,
                        cursor: 'pointer' 
                      }}
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleConfirmCancelOnly(selectedRes)} 
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

        {/* REPORT A MISSING STAY POPUP MODAL */}
        {reportMissingModalOpen && (
          <div 
            className="modal-overlay" 
            onClick={() => setReportMissingModalOpen(false)} 
            style={{ 
              zIndex: 1100, 
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
                maxWidth: '500px', 
                width: '100%', 
                padding: '36px 32px 32px', 
                borderRadius: '24px', 
                backgroundColor: '#ffffff',
                boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
                position: 'relative',
                maxHeight: '92vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                STAY ASSISTANCE
              </div>

              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.1rem', color: '#17271f', margin: '0 0 14px 0', fontWeight: 700, lineHeight: 1.2 }}>
                Report a Missing Stay
              </h2>

              <p style={{ fontSize: '0.9375rem', color: '#55655f', lineHeight: 1.55, margin: '0 0 20px 0' }}>
                Submit any completed stay that is not showing in My Stays. Staff will match the reservation using your verified phone number. Eligible direct stays earn Reward Nights; third-party stays are recorded as Not Eligible.
              </p>

              {/* Signed-in member callout box */}
              <div style={{
                backgroundColor: '#edf5f0',
                borderLeft: '4px solid #173f34',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '20px'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#17271f', marginBottom: '3px' }}>
                  Signed-in member
                </div>
                <div style={{ fontSize: '0.875rem', color: '#17271f', lineHeight: 1.45 }}>
                  {memberDisplayName} · {memberDisplayPhone}. Staff will use this phone number to locate and verify the reservation.
                </div>
              </div>

              <form onSubmit={handleSubmitMissingStay}>
                {/* Hotel property */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                    Hotel property
                  </label>
                  <select
                    value={missingProperty}
                    onChange={(e) => setMissingProperty(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #dddbd2',
                      backgroundColor: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#17271f',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Evolve Hotels & Suites · Texarkana">Evolve Hotels & Suites · Texarkana</option>
                    <option value="Evolve Uptown · Dallas">Evolve Uptown · Dallas</option>
                    <option value="Evolve Medical Center · Houston">Evolve Medical Center · Houston</option>
                    <option value="Evolve Riverfront · Little Rock">Evolve Riverfront · Little Rock</option>
                    <option value="Evolve Downtown · Austin">Evolve Downtown · Austin</option>
                  </select>
                </div>

                {/* Hotel confirmation number */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                    Hotel confirmation number
                  </label>
                  <input
                    type="text"
                    value={missingConfirmation}
                    onChange={(e) => setMissingConfirmation(e.target.value)}
                    placeholder="Enter confirmation number"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #dddbd2',
                      backgroundColor: '#ffffff',
                      fontSize: '0.95rem',
                      color: '#17271f',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Check-in date */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                    Check-in date
                  </label>
                  <input
                    type="date"
                    value={missingCheckIn}
                    onChange={(e) => setMissingCheckIn(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #dddbd2',
                      backgroundColor: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#17271f',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Check-out date */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                    Check-out date
                  </label>
                  <input
                    type="date"
                    value={missingCheckOut}
                    onChange={(e) => setMissingCheckOut(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #dddbd2',
                      backgroundColor: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#17271f',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* How was it booked? */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                    How was it booked?
                  </label>
                  <select
                    value={missingBookedChannel}
                    onChange={(e) => setMissingBookedChannel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #dddbd2',
                      backgroundColor: '#ffffff',
                      fontSize: '0.95rem',
                      color: '#17271f',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Evolve website">Evolve website</option>
                    <option value="Evolve Guest App">Evolve Guest App</option>
                    <option value="Hotel phone reservation">Hotel phone reservation</option>
                    <option value="Hotel front desk / property direct">Hotel front desk / property direct</option>
                    <option value="Booking.com / Expedia / Third-party">Booking.com / Expedia / Third-party</option>
                  </select>
                </div>

                {/* Additional information */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                    Additional information
                  </label>
                  <textarea
                    value={missingNotes}
                    onChange={(e) => setMissingNotes(e.target.value)}
                    placeholder="Optional details that may help staff find the stay"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #dddbd2',
                      backgroundColor: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      color: '#17271f',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingMissing}
                  style={{
                    width: '100%',
                    backgroundColor: '#173f34',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px 20px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: isSubmittingMissing ? 'not-allowed' : 'pointer',
                    opacity: isSubmittingMissing ? 0.75 : 1,
                    boxShadow: '0 4px 14px rgba(23,63,52,0.2)',
                    marginBottom: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSubmittingMissing ? 'Submitting to Cloudbeds...' : 'Submit Missing Stay Request'}
                </button>

                {/* Cancel button */}
                <button
                  type="button"
                  onClick={() => setReportMissingModalOpen(false)}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#17271f',
                    border: '1px solid #dddbd2',
                    borderRadius: '10px',
                    padding: '14px 20px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
