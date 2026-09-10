import React, { useState } from 'react';
import { useApp, normalizePhone, normalizeGuestCode } from '../context/AppContext';
import { Reservation } from '../types';
import { 
  AlertCircle, ShieldCheck, Sparkles, UserCheck, Lock, ArrowRight
} from 'lucide-react';

export const MyStaysPage: React.FC = () => {
  const { 
    reservations, cancelReservation, navigateTo, addToast,
    currentUser, currentPersona, activeGuestCode, activeGuestPhone,
    openAuthModal, loginAs, loginAsGuest
  } = useApp();
  const [tab, setTab] = useState<'UPCOMING' | 'PAST' | 'CANCELLED' | 'MISSING'>('UPCOMING');

  // Modal states
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');

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

  const handleOpenCancel = (res: Reservation) => {
    setSelectedRes(res);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedRes) return;
    cancelReservation(selectedRes.id);
    setCancelModalOpen(false);
  };

  const handleOpenModify = (res: Reservation) => {
    setSelectedRes(res);
    setNewCheckIn(res.checkInDate);
    setNewCheckOut(res.checkOutDate);
    setModifyModalOpen(true);
  };

  const handleConfirmModify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    selectedRes.checkInDate = newCheckIn;
    selectedRes.checkOutDate = newCheckOut;
    setModifyModalOpen(false);
    addToast('success', 'Reservation Modified', `Dates updated to ${newCheckIn} → ${newCheckOut}.`);
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
                      onClick={() => handleOpenModify(stay)} 
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


        {/* CANCEL MODAL */}
        {cancelModalOpen && selectedRes && (
          <div className="modal-overlay" onClick={() => setCancelModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <AlertCircle size={24} color="#b91c1c" />
                <h3 style={{ fontSize: '1.35rem', color: '#17271f', margin: 0 }}>
                  Cancel Reservation #{selectedRes.confirmationCode}
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.6, marginBottom: '20px' }}>
                Are you sure you wish to cancel your stay at <strong>{selectedRes.propertyName}</strong> ({selectedRes.checkInDate} → {selectedRes.checkOutDate})?
              </p>
              <div style={{
                backgroundColor: '#eaf5ee',
                border: '1.5px solid #a3d9b8',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#17653e', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
                  <ShieldCheck size={16} /> Free Cancellation Window Active
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#17271f' }}>
                  Cancellation penalty: <strong>$0 USD (Zero penalty)</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setCancelModalOpen(false)} className="btn btn-outline" style={{ padding: '10px 18px' }}>Keep Reservation</button>
                <button onClick={handleConfirmCancel} style={{ backgroundColor: '#b91c1c', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODIFY MODAL */}
        {modifyModalOpen && selectedRes && (
          <div className="modal-overlay" onClick={() => setModifyModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#17271f', marginBottom: '8px' }}>Modify Stay Dates</h3>
              <p style={{ fontSize: '0.875rem', color: '#6e7a76', marginBottom: '20px' }}>
                {selectedRes.propertyName} — {selectedRes.roomName}
              </p>
              <form onSubmit={handleConfirmModify}>
                <div className="form-group">
                  <label className="form-label">New Check-In Date</label>
                  <input type="date" className="form-input" value={newCheckIn} onChange={(e) => setNewCheckIn(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Check-Out Date</label>
                  <input type="date" className="form-input" value={newCheckOut} onChange={(e) => setNewCheckOut(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button type="button" onClick={() => handleOpenCancel(selectedRes)} className="btn btn-outline" style={{ color: '#b91c1c', borderColor: '#fca5a5' }}>Cancel Booking Instead</button>
                  <div style={{ flex: 1 }}></div>
                  <button type="button" onClick={() => setModifyModalOpen(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
