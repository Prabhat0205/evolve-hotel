import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, ArrowLeft, Clock, Utensils, Sparkles 
} from 'lucide-react';

export const InStayBreakfastPage: React.FC = () => {
  const { currentUser, navigateTo } = useApp();

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '40px 20px 90px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb / Back button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => navigateTo(currentUser ? 'stays' : 'property-detail')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#5b6763',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#173f34')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#5b6763')}
          >
            <ArrowLeft size={16} />
            <span>Back to {currentUser ? 'My Bookings & Stays' : 'Suites'}</span>
          </button>
        </div>

        {/* PRIMARY HERO CARD - Matches user reference screenshot */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '44px 48px',
          boxShadow: '0 8px 30px rgba(23, 39, 31, 0.06)',
          border: '1px solid #eeece5',
          marginBottom: '32px'
        }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: '0.8125rem',
            letterSpacing: '0.12em',
            fontWeight: 800,
            color: '#997125',
            textTransform: 'uppercase',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Smartphone size={16} color="#997125" />
            <span>EXCLUSIVE MOBILE EXPERIENCE</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#17271f',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            marginBottom: '18px'
          }}>
            Breakfast ordering is available through the Evolve Guest App.
          </h1>

          {/* Subtitle / Description */}
          <p style={{
            fontSize: '1.0625rem',
            color: '#5b6763',
            lineHeight: 1.6,
            marginBottom: '28px',
            maxWidth: '820px'
          }}>
            Use your phone to choose freshly made breakfast plates, select a pickup time, make changes before the 4:00 AM cutoff, and follow your order status.
          </p>

          {/* Callout Box matching Screenshot 2 */}
          <div style={{
            backgroundColor: '#f2f6f4',
            borderLeft: '4px solid #173f34',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px'
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: '#17271f',
              marginBottom: '6px'
            }}>
              Open Evolve on your phone
            </div>
            <div style={{
              fontSize: '0.9375rem',
              color: '#4e5b57',
              lineHeight: 1.55
            }}>
              At launch, this screen will provide a QR code and direct App Store or Google Play links. Breakfast ordering remains unavailable from the desktop website.
            </div>
          </div>

          {/* App Store & Google Play Store Links + QR Code Card */}
          <div style={{
            backgroundColor: '#faf8f5',
            borderRadius: '16px',
            padding: '24px 28px',
            border: '1px solid #eeece5',
            marginBottom: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                GET THE APP
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#17271f', fontWeight: 700, margin: '0 0 8px' }}>
                Download Evolve Guest App
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.5, margin: '0 0 16px' }}>
                Order in-suite breakfast, customize delivery windows, and track kitchen prep live on your smartphone.
              </p>

              {/* Direct Store Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {/* Apple App Store */}
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 12px rgba(23, 39, 31, 0.15)',
                    transition: 'transform 0.2s, background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#173f34';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#17271f';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.58-.71.97-1.7.86-2.69-.83.03-1.85.55-2.44 1.25-.53.61-.99 1.62-.87 2.59 1.02.08 1.88-.44 2.45-1.15z"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.8 }}>
                      Download on the
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.1 }}>
                      App Store
                    </div>
                  </div>
                </a>

                {/* Google Play Store */}
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 12px rgba(23, 39, 31, 0.15)',
                    transition: 'transform 0.2s, background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#173f34';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#17271f';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.94 1.94 0 0 1-.22-.924V2.738c0-.342.08-.655.219-.924zm11.238 11.241l2.428-2.429L5.344 3.738l9.503 9.317zm0 1.89L5.344 20.262l11.93-6.887-2.427-2.428zm3.504-2.029l3.076 1.776a1.144 1.144 0 0 1 0 1.984l-3.076 1.776-2.05-2.05 2.05-2.05z"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.8 }}>
                      GET IT ON
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.1 }}>
                      Google Play
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* QR Code Container */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '16px 20px',
              border: '1px solid #e2ded5',
              display: 'flex',
              alignItems: 'center',
              gap: '18px'
            }}>
              {/* SVG Styled QR Code */}
              <div style={{
                width: '90px',
                height: '90px',
                flexShrink: 0,
                backgroundColor: '#ffffff',
                border: '2px solid #173f34',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <svg viewBox="0 0 100 100" width="100%" height="100%" fill="#173f34">
                  {/* Outer corner markers */}
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="10" y="10" width="10" height="10" rx="2" />

                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="80" y="10" width="10" height="10" rx="2" />

                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="10" y="80" width="10" height="10" rx="2" />

                  {/* QR Data Dots */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="6" height="6" />
                  <rect x="56" y="8" width="6" height="6" />
                  <rect x="36" y="18" width="6" height="6" />
                  <rect x="50" y="24" width="6" height="6" />

                  <rect x="8" y="38" width="6" height="6" />
                  <rect x="18" y="44" width="6" height="6" />
                  <rect x="8" y="52" width="6" height="6" />

                  <rect x="36" y="36" width="28" height="28" rx="4" fill="#dda943" />
                  <text x="50" y="54" fontSize="12" fontWeight="900" fill="#17271f" textAnchor="middle" fontFamily="sans-serif">E</text>

                  <rect x="72" y="38" width="6" height="6" />
                  <rect x="84" y="44" width="6" height="6" />
                  <rect x="72" y="54" width="6" height="6" />
                  <rect x="84" y="58" width="6" height="6" />

                  <rect x="36" y="72" width="6" height="6" />
                  <rect x="48" y="78" width="6" height="6" />
                  <rect x="60" y="72" width="6" height="6" />
                  <rect x="42" y="86" width="6" height="6" />
                  <rect x="54" y="86" width="6" height="6" />
                  <rect x="74" y="80" width="8" height="8" />
                  <rect x="86" y="72" width="6" height="6" />
                  <rect x="86" y="86" width="6" height="6" />
                </svg>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '2px' }}>
                  Scan to Download
                </div>
                <div style={{ fontSize: '0.78125rem', color: '#6e7a76', lineHeight: 1.4 }}>
                  Aim your phone camera at the QR code to open the Evolve Guest App store page directly.
                </div>
              </div>
            </div>
          </div>

          {/* Return to Rewards Dashboard button - matching Screenshot 2 */}
          <button
            onClick={() => navigateTo('membership')}
            style={{
              width: '100%',
              padding: '16px 24px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #dcd7ce',
              borderRadius: '12px',
              color: '#173f34',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f6f3ec';
              e.currentTarget.style.borderColor = '#173f34';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#dcd7ce';
            }}
          >
            Return to Rewards Dashboard
          </button>
        </div>

        {/* INFORMATIVE SECTION: BREAKFAST DETAILS & POLICIES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Card 1: Service Hours */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #eeece5',
            boxShadow: '0 2px 8px rgba(23, 39, 31, 0.03)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fcf6eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              border: '1px solid #dda943'
            }}>
              <Clock size={20} color="#997125" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#17271f', margin: '0 0 6px' }}>
              Service Windows & Timing
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.5, margin: 0 }}>
              Breakfast is prepared fresh daily and served from <strong>6:00 AM to 10:30 AM</strong>. Custom in-suite dining slots can be reserved in the mobile app.
            </p>
          </div>

          {/* Card 2: 4:00 AM Cutoff */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #eeece5',
            boxShadow: '0 2px 8px rgba(23, 39, 31, 0.03)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eaf5ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              border: '1px solid #17653e'
            }}>
              <Utensils size={20} color="#17653e" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#17271f', margin: '0 0 6px' }}>
              4:00 AM Pre-Order Cutoff
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.5, margin: 0 }}>
              To ensure farm-to-table sourcing and artisanal freshness, custom orders and dietary adjustments close at <strong>4:00 AM</strong> each morning.
            </p>
          </div>

          {/* Card 3: Member Privilege */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #eeece5',
            boxShadow: '0 2px 8px rgba(23, 39, 31, 0.03)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eef4f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              border: '1px solid #173f34'
            }}>
              <Sparkles size={20} color="#173f34" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#17271f', margin: '0 0 6px' }}>
              Complimentary for Members
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.5, margin: 0 }}>
              Executive chef-curated morning dining is complimentary with all Evolve Member suite bookings. Sign in on the app with your member account to access.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default InStayBreakfastPage;
