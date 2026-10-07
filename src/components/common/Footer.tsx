import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer style={{
      backgroundColor: '#161c19',
      color: '#d2dbd7',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '24px 5vw',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 20
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Left: Evolve Logo with Seal & Subtitle */}
        <div 
          onClick={() => navigateTo('landing')}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img 
            src="/evolve-logo.png" 
            alt="Evolve Hotels & Suites — Fine Dining & Spa" 
            style={{ 
              height: '52px', 
              width: 'auto', 
              objectFit: 'contain',
              display: 'block'
            }} 
          />
        </div>

        {/* Center: Copyright */}
        <p style={{
          margin: 0,
          color: '#c2ccc8',
          fontSize: '0.875rem',
          textAlign: 'center',
          letterSpacing: '0.01em'
        }}>
          © 2026 Evolve Hotels &amp; Suites. All rights reserved.
        </p>

        {/* Right: Legal Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '0.875rem'
        }}>
          <span
            onClick={() => navigateTo('support')}
            style={{
              color: '#c2ccc8',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#dda943')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#c2ccc8')}
          >
            Terms of use
          </span>
          <span
            onClick={() => navigateTo('support')}
            style={{
              color: '#c2ccc8',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#dda943')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#c2ccc8')}
          >
            Privacy &amp; security
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div {
            flex-direction: column !important;
            text-align: center !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
