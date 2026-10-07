import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, Calendar, MapPin, Download, 
  ArrowRight, Mail, Share2, Sparkles 
} from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const { lastConfirmedReservation, navigateTo, currentUser } = useApp();

  // Fallback reservation if accessed directly
  const res = lastConfirmedReservation || {
    id: 'res-sample',
    confirmationCode: 'EV-892410',
    propertyId: 'evolve-kyoto',
    propertyName: 'The Evolve Grand Palace',
    propertyCity: 'Kyoto, Japan',
    propertyAddress: '24-1 Higashiyama-ku, Kyoto 605-0073, Japan',
    propertyImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    roomName: 'Imperial Higashiyama Suite',
    roomCategory: 'SUITE',
    checkInDate: '2026-10-14',
    checkOutDate: '2026-10-18',
    nightsCount: 4,
    guestsCount: { adults: 2, children: 0 },
    status: 'CONFIRMED',
    rateType: 'Evolve Member Privilege Suite Rate',
    nightlyRate: 663,
    taxesAndFees: 318,
    totalAmount: 2970,
    currency: 'USD',
    paymentMethod: { brand: 'amex', last4: '1004' },
    cancellationDeadline: '48 hours prior to check-in',
    specialRequests: 'High floor, feather pillows, late check-out requested.',
  };



  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div className="app-container" style={{ maxWidth: '800px' }}>
        {/* Success Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#eaf5ee',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid #17653e'
          }}>
            <CheckCircle2 size={36} color="#17653e" />
          </div>

          <span className="eyebrow-text">CONFIRMATION VOUCHER</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#17271f', marginTop: '4px' }}>
            Your Sanctuary is Reserved.
          </h1>
          <p style={{ color: '#6e7a76', fontSize: '1rem', marginTop: '6px' }}>
            Confirmation voucher dispatched to <strong>{res.guestEmail || currentUser?.email || 'guest@evolvehotels.com'}</strong>.
          </p>
        </div>

        {/* Voucher Ticket Card */}
        <div className="evolve-card" style={{ padding: '36px', position: 'relative', overflow: 'hidden', marginBottom: '32px' }}>
          {/* Top Gold Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#dda943'
          }} />

          {/* Reference Code Header */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '24px',
            borderBottom: '1px dashed #e2ded5',
            marginBottom: '24px',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Booking Reference
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#173f34', letterSpacing: '0.05em' }}>
                {res.confirmationCode}
              </div>
            </div>

            <div style={{
              backgroundColor: '#eaf5ee',
              color: '#17653e',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={14} /> Confirmed & Guaranteed
            </div>
          </div>

          {/* Hotel & Stay Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Property
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#17271f' }}>
                {res.propertyName}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '2px' }}>
                {res.propertyAddress}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Suite Category
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#17271f' }}>
                {res.roomName}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#997125', fontWeight: 600, marginTop: '2px' }}>
                {res.rateType}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Dates & Duration
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#17271f' }}>
                {res.checkInDate} → {res.checkOutDate}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '2px' }}>
                {res.nightsCount} Nights • {res.guestsCount.adults} Adults
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Total Paid (Guaranteed)
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#17271f' }}>
                ${res.totalAmount} USD
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '2px' }}>
                Charged to {res.paymentMethod.brand.toUpperCase()} ending {res.paymentMethod.last4}
              </div>
            </div>
          </div>

          {/* If multi-room reservation, show all booked rooms */}
          {res.bookedRooms && res.bookedRooms.length > 0 && (
            <div style={{
              backgroundColor: '#faf9f5',
              borderRadius: '14px',
              padding: '20px 24px',
              border: '1px solid #eeece5',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#17271f', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                All Reserved Suites in this Order ({res.bookedRooms.reduce((s, r) => s + r.quantity, 0)} Total Rooms):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {res.bookedRooms.map((r, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: idx < res.bookedRooms!.length - 1 ? '1px dashed #e2ded5' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9375rem' }}>
                        {r.quantity}× {r.roomName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6e7a76' }}>
                        {r.bedConfig} • {r.rateTitle}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 700, color: '#17271f', fontSize: '0.9375rem' }}>
                      ${r.nightlyRate}/night
                      <div style={{ fontSize: '0.6875rem', color: '#997125' }}>
                        ${r.nightlyRate * r.quantity * res.nightsCount} ({res.nightsCount} Nights)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Policy summary */}
          <div style={{
            backgroundColor: '#faf9f5',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid #eeece5',
            fontSize: '0.8125rem',
            color: '#6e7a76',
            lineHeight: 1.6
          }}>
            <strong style={{ color: '#17271f' }}>Cancellation Policy:</strong> Free cancellation permitted until 48 hours prior to check-in date. Self-service modifications and cancellations are available inside the <strong style={{ color: '#173f34' }}>My Bookings</strong> portal.
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '28px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: '#f6f3ec',
                color: '#173f34',
                border: '1px solid #e2ded5',
                borderRadius: '10px',
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} /> Print / Save Voucher
            </button>

            <button
              onClick={() => navigateTo('stays')}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <span>View In My Bookings</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
