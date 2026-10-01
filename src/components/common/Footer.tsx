import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, MapPin, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    addToast('success', 'Subscribed', 'Thank you for subscribing to Evolve Private Reserve dispatches.');
  };

  return (
    <footer style={{
      backgroundColor: '#17271f',
      color: '#ffffff',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '64px',
      paddingBottom: '40px',
      marginTop: 'auto',
    }}>
      <div className="app-container-wide">
        {/* Top 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#dda943',
                color: '#17271f',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontSize: '1.25rem'
              }}>
                E
              </div>
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#ffffff'
              }}>
                EVOLVE
              </span>
            </div>

            <p style={{ color: '#929b98', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '20px' }}>
              More than a stay. A distinguished collective of bespoke hotels, overwater retreats, and grand alpine lodges curated for the discerning traveler.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dda943', fontSize: '0.8125rem', fontWeight: 600 }}>
              <Award size={16} />
              <span>Official Best Rate & Direct Booking Guarantee</span>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 style={{ color: '#dda943', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px', fontWeight: 700 }}>
              Curated Destinations
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#dbdedd' }}>
              <li>
                <button onClick={() => navigateTo('search')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  The Evolve Grand Palace — Kyoto, Japan
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('search')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  Evolve Sanctuary Maldives — Baa Atoll
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('search')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  The Evolve Metropolis — Fifth Ave, New York
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('search')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  Evolve Alpine Lodge — St. Moritz, Switzerland
                </button>
              </li>
            </ul>
          </div>

          {/* Evolve Rewards & Guest Services */}
          <div>
            <h4 style={{ color: '#dda943', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px', fontWeight: 700 }}>
              Loyalty & Services
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#dbdedd' }}>
              <li>
                <button onClick={() => navigateTo('membership')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  Evolve Rewards Program Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('membership')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  Tier Progression (Member → Prestige → Legacy)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('search')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  Corporate & Military Negotiated Rates
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('support')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  Concierge Support & Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('in-stay-breakfast')} style={{ color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                  In-Stay In-Room Dining Menu
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: '#dda943', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px', fontWeight: 700 }}>
              Private Dispatches
            </h4>
            <p style={{ color: '#929b98', fontSize: '0.8125rem', marginBottom: '14px', lineHeight: 1.6 }}>
              Receive invitation-only private retreat previews, seasonal culinary menus, and tier-exclusive offers.
            </p>

            {subscribed ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dda943',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(221, 169, 67, 0.1)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(221, 169, 67, 0.3)'
              }}>
                <CheckCircle2 size={18} />
                <span>You are on our private registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#dda943',
                    color: '#17271f',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Join Registry
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#6e7a76',
          gap: '16px'
        }}>
          <div>
            © {new Date().getFullYear()} Evolve Hotels & Resorts International. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cancellation Policies</span>
            <span>Accessibility</span>
            <span>Security & 2FA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
