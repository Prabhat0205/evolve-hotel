import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, Sparkles, Award, ShieldCheck, Coffee, 
  Bed, Compass, Check, Search, ChevronDown
} from 'lucide-react';
import { mockProperties } from '../data/mockProperties';

export const LandingPage: React.FC = () => {
  const { 
    navigateTo, setSelectedProperty, searchDates, 
    setSearchDates, openAuthModal, switchPersona,
    addToast, currentUser, isMember
  } = useApp();

  // Date State
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(searchDates.checkIn || fmt(today));
  const [checkOutDate, setCheckOutDate] = useState(searchDates.checkOut || fmt(tomorrow));
  const [adults, setAdults] = useState(searchDates.adults || 2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [rateType, setRateType] = useState('Best Available Rate');
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const [suitesDropdownOpen, setSuitesDropdownOpen] = useState(false);

  const counterBtnStyle = {
    width: '32px', 
    height: '32px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    border: '1.5px solid #173f34', 
    color: '#173f34', 
    backgroundColor: '#fff', 
    fontSize: '1.25rem', 
    fontWeight: 700, 
    cursor: 'pointer'
  };

  const searchSectionRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDates({
      ...searchDates,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults,
    });
    navigateTo('search');
  };

  const handleGuestEntry = () => {
    switchPersona('guest');
    addToast('info', 'Guest Session Activated', 'You are browsing as an esteemed Guest. Enjoy searching our sanctuaries.');
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const searchBarForm = (
    <form
      onSubmit={handleSearchSubmit}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e0ddd6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              overflow: 'visible',
            }}
          >
            {/* CHECK IN */}
            <div style={{
              flex: '1 1 140px',
              padding: '12px 20px',
              borderRight: '1px solid #e0ddd6',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '130px',
            }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6e7a76', textTransform: 'uppercase' }}>
                Check in
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#17271f',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: '100%',
                }}
              />
            </div>

            {/* CHECK OUT */}
            <div style={{
              flex: '1 1 140px',
              padding: '12px 20px',
              borderRight: '1px solid #e0ddd6',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '130px',
            }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6e7a76', textTransform: 'uppercase' }}>
                Check out
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#17271f',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: '100%',
                }}
              />
            </div>

            {/* GUESTS */}
            <div style={{
              position: 'relative',
              flex: '1 1 160px',
              padding: '12px 20px',
              borderRight: '1px solid #e0ddd6',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '140px',
            }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6e7a76', textTransform: 'uppercase' }}>
                Guests
              </label>
              <button 
                type="button" 
                onClick={() => { setGuestsDropdownOpen(!guestsDropdownOpen); setSuitesDropdownOpen(false); }}
                style={{ 
                  background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                  fontSize: '1rem', fontWeight: 600, color: '#17271f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' 
                }}
              >
                <span>{adults + childrenCount} guest{adults + childrenCount > 1 ? 's' : ''}</span>
                <ChevronDown size={14} color="#6e7a76" />
              </button>

              {guestsDropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setGuestsDropdownOpen(false)} />
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '320px', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 100, border: '1px solid #e0ddd6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4a4a4a' }}>Adults per Room</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} style={counterBtnStyle}>-</button>
                          <span style={{ fontSize: '1.25rem', fontWeight: 500, width: '16px', textAlign: 'center' }}>{adults}</span>
                          <button type="button" onClick={() => setAdults(adults + 1)} style={counterBtnStyle}>+</button>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #eee', margin: '16px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4a4a4a' }}>Children per Room</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} style={counterBtnStyle}>-</button>
                          <span style={{ fontSize: '1.25rem', fontWeight: 500, width: '16px', textAlign: 'center' }}>{childrenCount}</span>
                          <button type="button" onClick={() => setChildrenCount(childrenCount + 1)} style={counterBtnStyle}>+</button>
                        </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* SUITES */}
            <div style={{
              position: 'relative',
              flex: '1 1 160px',
              padding: '12px 20px',
              borderRight: '1px solid #e0ddd6',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '140px',
            }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6e7a76', textTransform: 'uppercase' }}>
                Suites
              </label>
              <button 
                type="button" 
                onClick={() => { setSuitesDropdownOpen(!suitesDropdownOpen); setGuestsDropdownOpen(false); }}
                style={{ 
                  background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                  fontSize: '1rem', fontWeight: 600, color: '#17271f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' 
                }}
              >
                <span>{roomsCount} suite{roomsCount > 1 ? 's' : ''}</span>
                <ChevronDown size={14} color="#6e7a76" />
              </button>

              {suitesDropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setSuitesDropdownOpen(false)} />
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '280px', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 100, border: '1px solid #e0ddd6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4a4a4a' }}>Rooms</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button type="button" onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))} style={counterBtnStyle}>-</button>
                          <span style={{ fontSize: '1.25rem', fontWeight: 500, width: '16px', textAlign: 'center' }}>{roomsCount}</span>
                          <button type="button" onClick={() => setRoomsCount(roomsCount + 1)} style={counterBtnStyle}>+</button>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.9375rem', color: '#173f34', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Need more than 9 rooms?</div>
                  </div>
                </>
              )}
            </div>

            {/* RATE */}
            <div style={{
              flex: '1 1 200px',
              padding: '12px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '160px',
            }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6e7a76', textTransform: 'uppercase' }}>
                Rate Type
              </label>
              <select
                value={rateType}
                onChange={(e) => setRateType(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#17271f',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: '100%',
                }}
              >
                <option value="Best Available Rate">Best Available Rate</option>
                {isMember && <option value="Rewards Member Rate">Rewards Member Rate</option>}
                <option value="Government / Military">Government / Military</option>
                <option value="Senior / AARP">Senior / AARP</option>

              </select>
            </div>

            {/* SEARCH BUTTON */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
              <button
                type="submit"
                id="hero-search-btn"
                style={{
                  backgroundColor: '#dda943',
                  color: '#17271f',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                  height: '100%',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c99632';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dda943';
                }}
              >
                Search suites <span style={{fontSize: '1.2rem', lineHeight: 1}}>↗</span>
              </button>
            </div>
          </form>
  );

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', overflowX: 'hidden' }}>
      {currentUser ? (
        <>
          <section style={{ padding: '40px 24px 0', backgroundColor: '#f6f3ec', position: 'relative' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', borderRadius: '24px', overflow: 'hidden', height: '460px', position: 'relative', zIndex: 1 }}>
              <div style={{ flex: '1 1 50%', backgroundColor: '#173f34', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dda943', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>The experience goes beyond a stay</span>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: '#ffffff', lineHeight: 1.1, marginBottom: '24px' }}>Comfort, dining<br/>and rewards—<br/>evolved.</h1>
                <p style={{ color: '#e2ded5', fontSize: '1.05rem', marginBottom: '32px', maxWidth: '400px' }}>Book direct for our lowest available rate and unlock useful rewards without confusing points.</p>
                <div>
                  <button onClick={() => navigateTo('search')} style={{ backgroundColor: '#dda943', color: '#17271f', padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Find a room</button>
                </div>
              </div>
              <div style={{ flex: '1 1 50%', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" 
                  alt="Evolve Hotels & Suites Luxury Exterior and Hospital-Grade Sanitation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', backgroundColor: 'rgba(23, 39, 31, 0.85)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '20px', color: '#fff' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', marginBottom: '4px' }}>Hospital-grade cleaning</h3>
                  <p style={{ fontSize: '0.9375rem', color: '#e2ded5', margin: 0, paddingBottom: '12px' }}>A more complete room-cleaning standard.</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dda943' }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2, transform: 'translateY(-36px)' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                {searchBarForm}
              </div>
            </div>
          </section>

          <section style={{ padding: '20px 24px 60px', backgroundColor: '#f6f3ec' }}>
            <div className="app-container-wide">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Included with your stay</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#17271f', marginBottom: '40px' }}>Designed around your comfort</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px 24px', border: '1px solid #eeece5' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#17271f', marginBottom: '12px' }}>Hospital-Grade Cleaning & Air Filtration</h4>
                  <p style={{ color: '#6e7a76', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Enhanced cleaning with dedicated room air filtration.</p>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px 24px', border: '1px solid #eeece5' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#17271f', marginBottom: '12px' }}>Hydrotherapy Spa</h4>
                  <p style={{ color: '#6e7a76', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Complimentary access for Evolve members.</p>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px 24px', border: '1px solid #eeece5' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#17271f', marginBottom: '12px' }}>Fresh Made-to-Order Breakfast</h4>
                  <p style={{ color: '#6e7a76', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Order daily through the app after check-in.</p>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px 24px', border: '1px solid #eeece5' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#17271f', marginBottom: '12px' }}>Real Rewards</h4>
                  <p style={{ color: '#6e7a76', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>Free nights, fine dining or a $70 gift card.</p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: '0 24px 80px', backgroundColor: '#f6f3ec' }}>
             <div className="app-container-wide">
               <div style={{ backgroundColor: '#faf9f5', borderRadius: '24px', padding: '60px 40px', border: '1px solid #eeece5', textAlign: 'center' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>Evolve Experience Rewards</span>
                 <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.25rem', color: '#17271f', marginBottom: '16px', maxWidth: '800px', margin: '0 auto' }}>The First Hotel Rewards System Built Around One Shared Balance</h2>
                 <p style={{ color: '#6e7a76', fontSize: '1.05rem', marginTop: '16px' }}>Earn tangible rewards quickly. No confusing points, just real value for your loyalty.</p>
               </div>
             </div>
          </section>
        </>
      ) : (
        <>
          {/* =========================================================================
              BOOKING BAR (TOP)
             ========================================================================= */}
          <section
            ref={searchSectionRef}
            style={{ padding: '24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e0ddd6' }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {searchBarForm}
            </div>
          </section>

          {/* =========================================================================
              HERO SECTION
             ========================================================================= */}
          <section style={{
        position: 'relative',
        minHeight: '350px',
        padding: '40px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(23, 39, 31, 0.45), rgba(23, 39, 31, 0.68)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>

        {/* Ambient Top Headline */}
        <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '820px' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 800,
            color: '#dda943',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            EVOLVE HOTELS &amp; SUITES — USA
          </span>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: 500,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.35)'
          }}>
            Redefining hospitality across America.
          </h1>
        </div>
      </section>


      {/* =========================================================================
          SECTION 3: OVERVIEW
         ========================================================================= */}
      <section id="difference" style={{ padding: '80px 20px', backgroundColor: '#fcfcfb' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="eyebrow-text">THE EVOLVE DIFFERENCE</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#17271f', marginBottom: '16px' }}>The American standard of true luxury</h2>
            <p style={{ color: '#6e7a76', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>Evolve Hotels & Suites operates premier properties across Arkansas and Texas — delivering a consistently exceptional experience for business and leisure travelers.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              { icon: <Bed size={24}/>, title: 'Fully Renovated Suites', desc: 'Experience our newly redesigned luxury suites featuring premium bedding and modern aesthetics.' },
              { icon: <Coffee size={24}/>, title: 'Made-to-Order Breakfast', desc: 'Order fresh breakfast through our guest app and pick it up hot from The Gourmet Kitchen.' },
              { icon: <Compass size={24}/>, title: 'Fine Dining & Sports Bar', desc: 'Savor elevated culinary creations or catch the game with craft cocktails at our vibrant sports bar.' },
              { icon: <Sparkles size={24}/>, title: 'Outdoor Hydrotherapy Spa', desc: 'Unwind in our exclusive 47-jet, 8-person spa, complimentary for all Evolve Rewards members.' },
              { icon: <Award size={24}/>, title: 'Evolve Experience Rewards', desc: 'Earn tangible rewards quickly. No confusing points, just real value for your loyalty.' },
              { icon: <ShieldCheck size={24}/>, title: 'Cleaner Room Experience', desc: 'Hospital-grade sanitization, air filtration, and complete linen replacement for your peace of mind.' }
            ].map((feature, i) => (
              <div key={i} className="evolve-card evolve-card-interactive" style={{ padding: '32px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f6f3ec', color: '#dda943', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#17271f', marginBottom: '12px' }}>{feature.title}</h3>
                <p style={{ color: '#6e7a76', fontSize: '0.9375rem', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: EVOLVE EXPERIENCE REWARDS
         ========================================================================= */}
      <section id="rewards" style={{ padding: '80px 20px', backgroundColor: '#173f34', color: '#ffffff' }}>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span className="eyebrow-text" style={{ color: '#dda943' }}>EVOLVE REWARDS</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '20px' }}>Real rewards, remarkably fast.</h2>
            <p style={{ color: '#e2ded5', fontSize: '1.1rem', lineHeight: 1.6 }}>Forget complicated points systems. Evolve Rewards tracks your qualifying nights to unlock tangible, high-value experiences.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div style={{ backgroundColor: '#1e4b3e', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', border: '1px solid rgba(221, 169, 67, 0.2)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: '#dda943', marginBottom: '8px' }}>5</div>
              <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a3b1ab', marginBottom: '24px' }}>Qualifying Nights</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Free Fine-Dining Experience</h4>
              <p style={{ fontSize: '0.9375rem', color: '#e2ded5' }}>A complimentary multi-course dinner at The Gourmet Kitchen.</p>
            </div>
            <div style={{ backgroundColor: '#1e4b3e', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', border: '1px solid rgba(221, 169, 67, 0.2)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: '#dda943', marginBottom: '8px' }}>9</div>
              <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a3b1ab', marginBottom: '24px' }}>Qualifying Nights</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Free Reward Night</h4>
              <p style={{ fontSize: '0.9375rem', color: '#e2ded5' }}>Enjoy a complimentary stay in any of our premium suites.</p>
            </div>
            <div style={{ backgroundColor: '#1e4b3e', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', border: '1px solid rgba(221, 169, 67, 0.2)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: '#dda943', marginBottom: '8px' }}>9</div>
              <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a3b1ab', marginBottom: '24px' }}>Qualifying Nights</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>$70 Gift Card</h4>
              <p style={{ fontSize: '0.9375rem', color: '#e2ded5' }}>A versatile digital gift card, redeemable instantly.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={() => openAuthModal('signup')}>Join Evolve Rewards — It's Free</button>
            <div style={{ marginTop: '16px' }}>
              <button className="btn-ghost" onClick={() => openAuthModal('signin')} style={{ color: '#dda943' }}>Member Sign In →</button>
            </div>
          </div>
        </div>
      </section>

        </>
      )}

      {/* =========================================================================
          SECTION 5: ROOMS & SUITES
         ========================================================================= */}
      <section id="rooms" style={{ padding: '80px 20px', backgroundColor: '#ffffff' }}>
        <div className="app-container-wide">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="eyebrow-text">LUXURY ACCOMMODATIONS</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#17271f' }}>Our Signature Suites</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {[
              { name: 'Standard King Suite', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },
              { name: 'Standard Two Queen Suite', image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80' },
              { name: 'Pet-Friendly Suite', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80' },
              { name: 'Accessible King Suite', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80' },
              { name: 'Accessible Two Queen Suite', image: 'https://images.unsplash.com/photo-1584820927498-cafe2c1c6e11?auto=format&fit=crop&w=800&q=80' },
              { name: 'King Jacuzzi Suite', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
            ].map((suite, index) => (
              <div key={index} className="evolve-card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '240px', backgroundColor: '#e8edea' }}>
                  <img src={suite.image} alt={suite.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.35rem', color: '#17271f', marginBottom: '8px' }}>{suite.name}</h3>
                  <p style={{ color: '#6e7a76', fontSize: '0.9375rem', marginBottom: '20px' }}>Experience elevated comfort with memory foam bedding, smart climate control, and our enhanced cleaning protocol.</p>
                  <button className="btn btn-outline btn-full" onClick={() => navigateTo('search')}>View Availability</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <footer id="contact" style={{ backgroundColor: '#17271f', color: '#e2ded5', padding: '60px 20px 40px' }}>
        <div className="app-container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '48px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#dda943', fontWeight: 700, marginBottom: '16px' }}>
                EVOLVE
              </div>
              <p style={{ maxWidth: '300px', lineHeight: 1.6 }}>The one place you go to go places. Experience mindful luxury and impeccable service.</p>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', marginBottom: '16px' }}>Contact Concierge</h4>
              <p style={{ marginBottom: '8px' }}>Email: reservations@evolvehotels.com</p>
              <p style={{ marginBottom: '8px' }}>Phone: 1-800-EVOLVE-0</p>
              <button className="btn btn-primary" style={{ marginTop: '16px', border: 'none', cursor: 'pointer', padding: '12px 24px', borderRadius: '12px' }} onClick={() => navigateTo('support')}>Open Support Center</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '0.875rem', color: '#929b98' }}>
            <p>© 2026 Evolve Hotels &amp; Resorts. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#dda943'} onMouseLeave={(e) => e.currentTarget.style.color = '#929b98'}>Privacy Policy</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#dda943'} onMouseLeave={(e) => e.currentTarget.style.color = '#929b98'}>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
