import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, Sparkles, Award, ShieldCheck, Coffee, 
  Bed, BedDouble, Compass, Check, Search, ChevronDown, ChevronRight,
  UtensilsCrossed, Waves, Gift, Smartphone, Wine, Key, Tv,
  Wind, Clock, Car, Wifi, Phone, Mail, ExternalLink, HelpCircle,
  MessageCircle, X, Shield, ArrowRight, Star, Heart, Calendar
} from 'lucide-react';
import { mockProperties, mockRoomsByProperty } from '../data/mockProperties';
import './landing.css';

interface StorySlide {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
}

const HERO_SLIDES: StorySlide[] = [
  {
    tag: 'Welcome to Evolve Hotels & Suites',
    title: 'More Than a One-Night Stay.',
    subtitle: 'Thoughtfully redesigned suites, chef-prepared breakfast, hydrotherapy spa, and cleaner air in Texarkana, Arkansas.',
    image: '/landing/hero-exterior.jpg'
  },
  {
    tag: 'Hospital-Grade Standards',
    title: 'Cleanliness Beyond Changing Sheets.',
    subtitle: 'Every checkout triggers a complete bedding reset, sanitized mattress protection, and dedicated in-suite air filtration.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=85'
  },
  {
    tag: 'Culinary Distinction',
    title: 'Made-to-Order Breakfast via Guest App.',
    subtitle: 'Order fresh breakfast plates cooked to order with your exact morning pickup time, plus buffet favorites.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1800&q=85'
  },
  {
    tag: 'On-Site Hospitality',
    title: 'The Gourmet Kitchen & Sports Bar.',
    subtitle: 'A full-service culinary experience with elevated craft cocktails and stadium screens without leaving the hotel.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85'
  },
  {
    tag: 'Restorative Wellness',
    title: 'Outdoor 47-Jet Hydrotherapy Spa.',
    subtitle: 'Unwind under the open Arkansas sky in our 47-jet hydrotherapy oasis, complimentary for Rewards members.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1800&q=85'
  },
  {
    tag: 'Evolve Experience Rewards',
    title: 'The First Rewards System on One Shared Balance.',
    subtitle: '5 qualifying nights for fine dining, 9 for a free stay or a $70 gift card. Simple, transparent, and direct.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=85'
  }
];

export const LandingPage: React.FC = () => {
  const { 
    navigateTo, setSelectedProperty, searchDates, 
    setSearchDates, openAuthModal, currentUser, isMember,
    setSelectedRoom, setSelectedRate, addRoomToOrder
  } = useApp();

  // Selected property (Flagship Texarkana)
  const property = mockProperties[0];
  const texarkanaRooms = mockRoomsByProperty['evolve-texarkana'] || [];

  // Hero Story Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play story slides
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Booking Bar State
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

  // Concierge Quick Question Modal
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);

  const bookingSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDates({
      ...searchDates,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults,
      children: childrenCount,
    });
    setSelectedProperty(property);
    navigateTo('search');
  };

  const handleSelectRoomDirectly = (room: any) => {
    setSelectedProperty(property);
    setSelectedRoom(room);
    if (room.rates && room.rates.length > 0) {
      setSelectedRate(room.rates[0]);
      addRoomToOrder(room, room.rates[0], 1);
    }
    navigateTo('property-detail');
  };

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
    borderRadius: '6px',
    cursor: 'pointer'
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', color: '#17271f' }}>
      
      {/* =========================================================================
          SUB-NAVIGATION BAR (Sticky below header)
         ========================================================================= */}
      <nav className="landing-subnav" aria-label="Main hotel section navigation">
        <div className="landing-subnav-inner">
          <div className="landing-subnav-links">
            <button className="landing-subnav-link" onClick={() => scrollToSection('difference')}>Overview</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('rooms')}>Rooms &amp; Suites</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('amenities')}>Amenities</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('breakfast')}>Breakfast</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('dining')}>Fine Dining</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('wellness')}>Spa</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('rewards')}>Rewards</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('location')}>Location</button>
            <button className="landing-subnav-link" onClick={() => scrollToSection('contact')}>Contact</button>
          </div>
          <button 
            className="landing-subnav-cta" 
            onClick={() => scrollToSection('book')}
          >
            Book now ↗
          </button>
        </div>
      </nav>

      {/* =========================================================================
          HERO STORY SLIDER (#top)
         ========================================================================= */}
      <section 
        id="top" 
        className="landing-hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="landing-hero-slider">
          {HERO_SLIDES.map((slide, idx) => (
            <div 
              key={idx}
              className={`landing-hero-slide ${activeSlide === idx ? 'active' : ''}`}
              style={{ backgroundImage: `url("${slide.image}")` }}
            />
          ))}
        </div>

        <div className="landing-hero-overlay" />

        <div className="landing-hero-content">
          <span className="landing-hero-badge">
            {HERO_SLIDES[activeSlide].tag}
          </span>
          <h1 className="landing-hero-title">
            {HERO_SLIDES[activeSlide].title}
          </h1>
          <p className="landing-hero-subtitle">
            {HERO_SLIDES[activeSlide].subtitle}
          </p>

          <div>
            <button 
              className="landing-hero-learn" 
              onClick={() => scrollToSection('difference')}
            >
              Learn more ↓
            </button>
          </div>

          {/* Slider Dots */}
          <div className="landing-hero-controls" aria-label="Homepage stories">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                className={`landing-hero-dot ${activeSlide === idx ? 'active' : ''}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Show slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOOKING BAR (#book)
         ========================================================================= */}
      <div id="book" ref={bookingSectionRef} className="landing-booking-container">
        <div className="landing-booking-card">
          <form className="landing-booking-form" onSubmit={handleSearchSubmit}>
            
            {/* Check-in */}
            <div className="landing-booking-field">
              <label className="landing-booking-label">Check in</label>
              <input
                type="date"
                required
                className="landing-booking-input"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>

            {/* Check-out */}
            <div className="landing-booking-field">
              <label className="landing-booking-label">Check out</label>
              <input
                type="date"
                required
                min={checkInDate}
                className="landing-booking-input"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>

            {/* Guests */}
            <div className="landing-booking-field">
              <label className="landing-booking-label">Guests</label>
              <button 
                type="button" 
                onClick={() => { setGuestsDropdownOpen(!guestsDropdownOpen); setSuitesDropdownOpen(false); }}
                style={{ 
                  background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                  fontSize: '0.9375rem', fontWeight: 700, color: '#17271f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'
                }}
              >
                <span>{adults + childrenCount} guest{adults + childrenCount > 1 ? 's' : ''}</span>
                <ChevronDown size={14} color="#7b8882" />
              </button>

              {guestsDropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setGuestsDropdownOpen(false)} />
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '14px', boxShadow: '0 12px 36px rgba(0,0,0,0.18)', zIndex: 100, border: '1px solid #e0ddd6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17271f' }}>Adults</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} style={counterBtnStyle}>-</button>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, width: '16px', textAlign: 'center' }}>{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)} style={counterBtnStyle}>+</button>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #eee', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17271f' }}>Children</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} style={counterBtnStyle}>-</button>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, width: '16px', textAlign: 'center' }}>{childrenCount}</span>
                        <button type="button" onClick={() => setChildrenCount(childrenCount + 1)} style={counterBtnStyle}>+</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Suites */}
            <div className="landing-booking-field">
              <label className="landing-booking-label">Suites</label>
              <button 
                type="button" 
                onClick={() => { setSuitesDropdownOpen(!suitesDropdownOpen); setGuestsDropdownOpen(false); }}
                style={{ 
                  background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                  fontSize: '0.9375rem', fontWeight: 700, color: '#17271f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'
                }}
              >
                <span>{roomsCount} suite{roomsCount > 1 ? 's' : ''}</span>
                <ChevronDown size={14} color="#7b8882" />
              </button>

              {suitesDropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setSuitesDropdownOpen(false)} />
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '260px', backgroundColor: '#fff', padding: '20px', borderRadius: '14px', boxShadow: '0 12px 36px rgba(0,0,0,0.18)', zIndex: 100, border: '1px solid #e0ddd6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17271f' }}>Suites</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button type="button" onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))} style={counterBtnStyle}>-</button>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, width: '16px', textAlign: 'center' }}>{roomsCount}</span>
                        <button type="button" onClick={() => setRoomsCount(Math.min(10, roomsCount + 1))} style={counterBtnStyle}>+</button>
                      </div>
                    </div>
                    <div 
                      onClick={() => navigateTo('corporate-booking')}
                      style={{ fontSize: '0.85rem', color: '#173f34', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Need more than 9 rooms? Group Rates ↗
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Rate Type */}
            <div className="landing-booking-field">
              <label className="landing-booking-label">Rate type</label>
              <select
                className="landing-booking-select"
                value={rateType}
                onChange={(e) => setRateType(e.target.value)}
              >
                <option value="Best Available Rate">Best Available Rate</option>
                <option value="Evolve Member Rate">Evolve Member Rate</option>
                <option value="AAA">AAA Rate</option>
                <option value="AARP">AARP Senior Rate</option>
                <option value="Government / Military">Government / Military</option>
                <option value="Corporate Code">Corporate Code</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <button type="submit" id="search-suites-btn" className="landing-booking-btn">
              Search suites <span>↗</span>
            </button>
          </form>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: OVERVIEW (#difference)
         ========================================================================= */}
      <section id="difference" className="landing-section">
        <div className="landing-section-shell">
          <span className="landing-tag">Overview</span>
          <h2 className="landing-heading">More Than a One-Night Stay</h2>
          <p className="landing-subheading">
            At <strong style={{ color: '#173f34' }}>Evolve Hotel &amp; Suites — Fine Dining &amp; Spa</strong>, you receive more than a comfortable room. Enjoy fully renovated rooms, fresh made-to-order breakfast, fine dining, hydrotherapy, cleaner air, and enhanced hospital-grade cleaning—and join one of the most unique and flexible hotel rewards programs. It all comes together in one thoughtfully connected Texarkana experience.
          </p>

          <div className="landing-exp-grid" aria-label="Explore the Evolve experience">
            {/* 1. Fully Renovated Suites */}
            <div className="landing-exp-card" onClick={() => scrollToSection('rooms')}>
              <div className="landing-exp-icon">
                <BedDouble size={26} />
              </div>
              <h3>Fully Renovated Suites</h3>
              <p>Thoughtfully redesigned suites with separate living space, cleaner air, and elevated comfort.</p>
              <span className="landing-exp-link">Explore suites ↓</span>
            </div>

            {/* 2. Made-to-Order Breakfast */}
            <div className="landing-exp-card" onClick={() => scrollToSection('breakfast')}>
              <div className="landing-exp-icon">
                <Smartphone size={26} />
              </div>
              <h3>Made-to-Order Breakfast</h3>
              <p>Order fresh breakfast and choose a pickup time through the Evolve Guest App.</p>
              <span className="landing-exp-link">Discover breakfast ↓</span>
            </div>

            {/* 3. Fine Dining & Sports Bar */}
            <div className="landing-exp-card" onClick={() => scrollToSection('dining')}>
              <div className="landing-exp-icon">
                <UtensilsCrossed size={26} />
              </div>
              <h3>Fine Dining &amp; Sports Bar</h3>
              <p>Enjoy a complete dining experience without leaving the hotel.</p>
              <span className="landing-exp-link">Explore dining ↓</span>
            </div>

            {/* 4. Outdoor Hydrotherapy Spa */}
            <div className="landing-exp-card" onClick={() => scrollToSection('wellness')}>
              <div className="landing-exp-icon">
                <Waves size={26} />
              </div>
              <h3>Outdoor Hydrotherapy Spa</h3>
              <p>Relax and recharge in our outdoor 47-jet hydrotherapy experience.</p>
              <span className="landing-exp-link">Explore the spa ↓</span>
            </div>

            {/* 5. Evolve Experience Rewards */}
            <div className="landing-exp-card" onClick={() => scrollToSection('rewards')}>
              <div className="landing-exp-icon">
                <Gift size={26} />
              </div>
              <h3>Evolve Experience Rewards</h3>
              <p>Choose a free night, fine-dining experience, or $70 gift card from one shared balance.</p>
              <span className="landing-exp-link">Explore Rewards →</span>
            </div>

            {/* 6. Cleaner Room Experience */}
            <div className="landing-exp-card" onClick={() => scrollToSection('cleaner-room')}>
              <div className="landing-exp-icon">
                <Sparkles size={26} />
              </div>
              <h3>Cleaner Room Experience</h3>
              <p>Dedicated air filtration in every suite, supported by enhanced hospital-grade cleaning.</p>
              <span className="landing-exp-link">View amenities ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EVOLVE EXPERIENCE REWARDS (#rewards)
         ========================================================================= */}
      <section id="rewards" className="landing-section landing-rewards-section">
        <div className="landing-section-shell">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 40px' }}>
            <div className="landing-rewards-distinction">
              <Sparkles size={16} /> One of the Most Unique and Flexible Hotel Rewards Experiences
            </div>
            <span className="landing-tag light">Evolve Experience Rewards</span>
            <h2 className="landing-heading light">
              The First Hotel Rewards System Built Around One Shared Balance
            </h2>
            <p className="landing-subheading light" style={{ margin: '0 auto' }}>
              Earn automatically when you book directly through the Evolve website or Guest App. Redeem your shared qualifying-night balance for a free night, a complete fine-dining experience, or a $70 gift card—without points or complicated calculations.
            </p>
          </div>

          {/* 3 Redemption Choice Cards */}
          <div className="landing-rewards-grid" aria-label="Evolve Rewards redemption choices">
            <div className="landing-reward-choice-card">
              <span className="landing-reward-badge">Culinary Delight</span>
              <div className="landing-reward-nights">5</div>
              <div className="landing-reward-nights-label">Qualifying Nights</div>
              <h3>1 Free Fine-Dining Experience</h3>
              <p>Redeem five qualifying nights for a complete eligible dining experience at The Gourmet Kitchen.</p>
            </div>

            <div className="landing-reward-choice-card" style={{ borderColor: '#dda943', transform: 'scale(1.02)' }}>
              <span className="landing-reward-badge" style={{ background: '#dda943', color: '#17271f' }}>Most Popular</span>
              <div className="landing-reward-nights">9</div>
              <div className="landing-reward-nights-label">Qualifying Nights</div>
              <h3>1 Free Room Night</h3>
              <p>Redeem nine qualifying nights toward an eligible room night in any renovated signature suite.</p>
            </div>

            <div className="landing-reward-choice-card">
              <span className="landing-reward-badge">Instant Value</span>
              <div className="landing-reward-nights">9</div>
              <div className="landing-reward-nights-label">Qualifying Nights</div>
              <h3>1 $70 Gift Card</h3>
              <p>Choose a versatile $70 digital gift card directly from the same shared qualifying-night balance.</p>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="landing-rewards-pillars">
            <div className="landing-rewards-pillar">
              <strong>Earn Automatically</strong>
              <p>Every qualifying direct-booked night is automatically added to your shared balance.</p>
            </div>
            <div className="landing-rewards-pillar">
              <strong>Redeem Your Way</strong>
              <p>Choose the reward that matters most when your qualifying balance reaches target.</p>
            </div>
            <div className="landing-rewards-pillar">
              <strong>Track Your Progress</strong>
              <p>Follow your active balance, available perks, and redemption history seamlessly in the app.</p>
            </div>
          </div>

          {/* Additional Member Benefits */}
          <div style={{ marginTop: '48px' }}>
            <span className="landing-tag light">Additional Member Benefits</span>
            <div className="landing-benefits-grid">
              <div className="landing-benefit-card">
                <div className="landing-benefit-icon">
                  <Wine size={22} />
                </div>
                <h3>Complimentary Welcome Beverage</h3>
                <p>Choose one alcoholic or non-alcoholic beverage upon check-in. Valid ID and legal drinking age required for alcoholic selections.</p>
              </div>

              <div className="landing-benefit-card">
                <div className="landing-benefit-icon">
                  <Waves size={22} />
                </div>
                <h3>Complimentary Hydrotherapy Access</h3>
                <p>Rewards members receive outdoor 47-jet hydrotherapy spa access at no additional charge throughout their stay.</p>
                <a href="#wellness" className="landing-benefit-link">Learn More ↓</a>
              </div>

              <div className="landing-benefit-card">
                <div className="landing-benefit-icon">
                  <Key size={22} />
                </div>
                <h3>Electronic PIN Check-In</h3>
                <p>Eligible members receive a secure suite-access PIN and proceed directly to their room with no front-desk stop required.</p>
              </div>

              <div className="landing-benefit-card">
                <div className="landing-benefit-icon">
                  <Smartphone size={22} />
                </div>
                <h3>Included Made-to-Order Breakfast</h3>
                <p>Choose freshly made options and a scheduled pickup time exclusively through the Evolve Guest App.</p>
                <a href="#breakfast" className="landing-benefit-link">Learn More ↓</a>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="landing-rewards-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => openAuthModal('signup')}
            >
              Join Evolve Rewards — It’s Free
            </button>
            <button 
              className="btn btn-primary"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              onClick={() => openAuthModal('signin')}
            >
              Member Sign In →
            </button>
            <button 
              className="btn-ghost"
              style={{ color: '#dda943' }}
              onClick={() => navigateTo('membership')}
            >
              View Full Rewards Details →
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ROOMS & SUITES (#rooms)
         ========================================================================= */}
      <section id="rooms" className="landing-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="landing-section-shell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span className="landing-tag">Rooms &amp; Suites</span>
              <h2 className="landing-heading">More space to settle in.</h2>
              <p className="landing-subheading" style={{ marginBottom: 0 }}>
                Every Evolve accommodation is a fully renovated suite with a separate living area. Choose from standard, pet-friendly, accessible, and Jacuzzi layouts.
              </p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => scrollToSection('book')}
            >
              Check suite availability ↗
            </button>
          </div>

          {/* Suites Grid */}
          <div className="landing-suites-grid" aria-label="Evolve suite inventory">
            {texarkanaRooms.map((room) => {
              const startingRate = room.rates?.[0]?.nightlyPrice || 149;
              return (
                <div key={room.id} className="landing-suite-card">
                  <div className="landing-suite-photo">
                    <img src={room.images?.[0] || property.heroImage} alt={room.name} />
                    <span className="landing-suite-tag">{room.category || 'Renovated Suite'}</span>
                  </div>
                  <div className="landing-suite-body">
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.8125rem', color: '#6e7a75', marginBottom: '16px' }}>
                      <span>• {room.maxGuests} Guests</span>
                      <span>• {room.bedConfig}</span>
                      <span>• {Math.round(room.sizeSqm * 10.764)} sq ft</span>
                    </div>
                    <div className="landing-suite-footer">
                      <div className="landing-suite-price">
                        ${startingRate} <small>/ night</small>
                      </div>
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                        onClick={() => handleSelectRoomDirectly(room)}
                      >
                        View availability →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Included in Every Suite: 12-Item Showcase */}
          <div className="landing-inclusions-box">
            <span className="landing-tag">Included in Every Suite</span>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#17271f', margin: '6px 0 16px' }}>
              Thoughtful details, already included.
            </h3>
            <p style={{ color: '#6e7a75', fontSize: '0.95rem', margin: 0, maxWidth: '680px' }}>
              From hospital-grade sanitation to Keurig coffee machines, every suite is outfitted with premium amenities to ensure your ultimate relaxation.
            </p>

            <div className="landing-inclusions-grid">
              <div className="landing-inclusion-item">
                <Tv size={20} className="landing-inclusion-icon" />
                <span>65-inch flat-screen TV</span>
              </div>
              <div className="landing-inclusion-item">
                <Wind size={20} className="landing-inclusion-icon" />
                <span>New AC with wall thermostat</span>
              </div>
              <div className="landing-inclusion-item">
                <ShieldCheck size={20} className="landing-inclusion-icon" />
                <span>Dedicated air filtration</span>
              </div>
              <div className="landing-inclusion-item">
                <Sparkles size={20} className="landing-inclusion-icon" />
                <span>Enhanced hospital-grade cleaning</span>
              </div>
              <div className="landing-inclusion-item">
                <Coffee size={20} className="landing-inclusion-icon" />
                <span>Keurig with glass cups</span>
              </div>
              <div className="landing-inclusion-item">
                <UtensilsCrossed size={20} className="landing-inclusion-icon" />
                <span>Microwave</span>
              </div>
              <div className="landing-inclusion-item">
                <Wine size={20} className="landing-inclusion-icon" />
                <span>Full-size two-door refrigerator</span>
              </div>
              <div className="landing-inclusion-item">
                <Check size={20} className="landing-inclusion-icon" />
                <span>Iron and ironing board</span>
              </div>
              <div className="landing-inclusion-item">
                <Sparkles size={20} className="landing-inclusion-icon" />
                <span>Hair dryer</span>
              </div>
              <div className="landing-inclusion-item">
                <Sparkles size={20} className="landing-inclusion-icon" />
                <span>Natural bath-product dispensers</span>
              </div>
              <div className="landing-inclusion-item">
                <Smartphone size={20} className="landing-inclusion-icon" />
                <span>Bluetooth LED mirror with speakers</span>
              </div>
              <div className="landing-inclusion-item">
                <BedDouble size={20} className="landing-inclusion-icon" />
                <span>Separate living area and full shower</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THOUGHTFUL AMENITIES (#amenities)
         ========================================================================= */}
      <section id="amenities" className="landing-section">
        <div className="landing-section-shell">
          <span className="landing-tag">Thoughtful Amenities</span>
          <h2 className="landing-heading">More included in your Evolve experience.</h2>
          <p className="landing-subheading">
            Practical essentials, distinctive hotel experiences, and member benefits come together to make every stay easier and more enjoyable.
          </p>

          <div className="landing-amenities-grid">
            <div className="landing-amenity-card">
              <div className="landing-amenity-icon"><Wifi size={24} /></div>
              <h3>Complimentary Wi-Fi</h3>
              <p>Stay connected throughout your suite, public lounge, and dining pavilion with ultra-fast speeds.</p>
            </div>

            <div className="landing-amenity-card">
              <div className="landing-amenity-icon"><Car size={24} /></div>
              <h3>Complimentary Parking</h3>
              <p>Convenient, brightly lit on-site parking is fully included with your stay.</p>
            </div>

            <div className="landing-amenity-card" onClick={() => scrollToSection('breakfast')} style={{ cursor: 'pointer' }}>
              <div className="landing-amenity-icon"><Coffee size={24} /></div>
              <h3>Fresh Made-to-Order Breakfast</h3>
              <p>Choose freshly made breakfast options and a convenient pickup time through the Evolve Guest App, with buffet favorites also available.</p>
              <span className="landing-amenity-link">Learn more ↓</span>
            </div>

            <div className="landing-amenity-card" onClick={() => scrollToSection('dining')} style={{ cursor: 'pointer' }}>
              <div className="landing-amenity-icon"><UtensilsCrossed size={24} /></div>
              <h3>Fine Dining &amp; Sports Bar</h3>
              <p>Enjoy The Gourmet Kitchen with Sports Bar without ever leaving the hotel property.</p>
              <span className="landing-amenity-link">Explore dining ↓</span>
            </div>

            <div className="landing-amenity-card" onClick={() => scrollToSection('wellness')} style={{ cursor: 'pointer' }}>
              <div className="landing-amenity-icon"><Waves size={24} /></div>
              <h3>Outdoor Hydrotherapy Spa</h3>
              <p>Complimentary for Evolve Rewards members; available to non-members for $10 per stay.</p>
              <span className="landing-amenity-link">Explore the spa ↓</span>
            </div>

            <div className="landing-amenity-card" onClick={() => scrollToSection('rewards')} style={{ cursor: 'pointer' }}>
              <div className="landing-amenity-icon"><Key size={24} /></div>
              <h3>Member PIN Check-In</h3>
              <p>Eligible Rewards members receive a secure suite PIN with no front-desk stop required.</p>
              <span className="landing-amenity-link">Explore member benefits →</span>
            </div>

            <div className="landing-amenity-card" onClick={() => scrollToSection('rewards')} style={{ cursor: 'pointer' }}>
              <div className="landing-amenity-icon"><Wine size={24} /></div>
              <h3>Welcome Beverage</h3>
              <p>Rewards members can choose a complimentary alcoholic or non-alcoholic beverage at check-in.</p>
              <span className="landing-amenity-link">Explore member benefits →</span>
            </div>

            <div className="landing-amenity-card" onClick={() => scrollToSection('rooms')} style={{ cursor: 'pointer' }}>
              <div className="landing-amenity-icon"><BedDouble size={24} /></div>
              <h3>Pet-Friendly Suites</h3>
              <p>Designated King and Two Queen Suites prepared thoughtfully with a plush pet bed.</p>
              <span className="landing-amenity-link">Explore suites ↑</span>
            </div>

            <div className="landing-amenity-card">
              <div className="landing-amenity-icon"><Clock size={24} /></div>
              <h3>24-Hour Front Desk</h3>
              <p>Hotel assistance and security remain available around the clock whenever you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: ENHANCED HOSPITAL-GRADE CLEANING (#cleaner-room)
         ========================================================================= */}
      <section id="cleaner-room" className="landing-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="landing-section-shell">
          <div className="landing-split">
            <div className="landing-split-visual">
              <img 
                src="/landing/cleaner-room.jpg" 
                alt="A bright Evolve suite bed prepared with crisp clean bedding, freshly laundered blanket, and layered pillows"
              />
            </div>
            <div>
              <span className="landing-tag">Enhanced Hospital-Grade Cleaning</span>
              <h2 className="landing-heading">Cleanliness that goes beyond changing the sheets.</h2>
              <p className="landing-subheading">
                At Evolve, every checkout triggers a complete bedding reset. All guest-use bedding is replaced with freshly laundered bedding, including blankets. The mattress cover is sanitized before clean sheets are installed, and every protected pillow receives two fresh pillowcases for an additional layer of protection.
              </p>

              <div className="landing-cleaning-points">
                <div className="landing-cleaning-point">
                  <BedDouble size={20} color="#173f34" />
                  <h3>Every Blanket Washed</h3>
                  <p>Blankets are removed and laundered after every single guest checkout.</p>
                </div>
                <div className="landing-cleaning-point">
                  <Sparkles size={20} color="#173f34" />
                  <h3>Mattress Cover Sanitized</h3>
                  <p>The mattress cover is sanitized before freshly laundered sheets are installed.</p>
                </div>
                <div className="landing-cleaning-point">
                  <ShieldCheck size={20} color="#173f34" />
                  <h3>Double-Cased Pillows</h3>
                  <p>Every pillow has a protective cover plus two clean pillowcases for added hygiene.</p>
                </div>
                <div className="landing-cleaning-point">
                  <Wind size={20} color="#173f34" />
                  <h3>Cleaner Air in Every Suite</h3>
                  <p>Dedicated in-suite air filtration supports a cleaner, healthier room environment.</p>
                </div>
              </div>

              <div className="landing-disinfection-box">
                <Shield size={24} color="#173f34" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Complete Suite Disinfection After Checkout</strong>
                  <p>High-touch surfaces, door handles and knobs, seating, and floors are thoroughly cleaned and disinfected before the next guest arrives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FRESH MADE-TO-ORDER BREAKFAST (#breakfast)
         ========================================================================= */}
      <section id="breakfast" className="landing-section">
        <div className="landing-section-shell">
          <div className="landing-split reverse">
            <div>
              <span className="landing-tag">Fresh Made-to-Order Breakfast</span>
              <h2 className="landing-heading">Made fresh for you—ordered only through the app.</h2>
              <p className="landing-subheading">
                Choose freshly made breakfast options and a convenient pickup time exclusively through the Evolve Guest App. Your selection is prepared around the time you choose.
              </p>

              <div className="landing-steps-row">
                <div className="landing-step-card">
                  <div className="landing-step-num">1</div>
                  <strong>Choose your breakfast</strong>
                  <p>Select from chef-crafted hot omelets, waffles, and classics inside the app.</p>
                </div>
                <div className="landing-step-card">
                  <div className="landing-step-num">2</div>
                  <strong>Select a pickup time</strong>
                  <p>Choose the convenient available time slot that fits your morning schedule.</p>
                </div>
                <div className="landing-step-card">
                  <div className="landing-step-num">3</div>
                  <strong>Pick up fresh order</strong>
                  <p>Follow live status and collect your breakfast hot from The Gourmet Kitchen.</p>
                </div>
              </div>

              <div style={{ background: '#f5f7f5', border: '1px solid #e2ded5', borderRadius: '14px', padding: '16px 20px', margin: '20px 0' }}>
                <p style={{ margin: '0 0 6px', fontSize: '0.875rem', color: '#17271f' }}>
                  <strong>Buffet favorites are also available:</strong> The buffet remains a separate option for guests who prefer grab-and-go convenience.
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6e7a75' }}>
                  <strong>Ordering for another registered guest?</strong> Eligible guests can receive their own mobile breakfast-ordering access.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigateTo('in-stay-breakfast')}
                >
                  Order Through Guest App ↗
                </button>
                <button 
                  className="btn btn-outline"
                  disabled
                  style={{ opacity: 0.65, cursor: 'not-allowed' }}
                >
                  Download App — Coming Soon
                </button>
              </div>
            </div>

            <div className="landing-split-visual">
              <img 
                src="/landing/breakfast-app.jpg" 
                alt="Fresh breakfast with omelet, avocado, sausage, and coffee prepared in The Gourmet Kitchen"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: THE GOURMET KITCHEN WITH SPORTS BAR (#dining)
         ========================================================================= */}
      <section id="dining" className="landing-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="landing-section-shell">
          <div className="landing-split">
            <div className="landing-split-visual">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" 
                alt="The Gourmet Kitchen with fine dining dishes and sports bar atmosphere"
              />
            </div>

            <div>
              <span className="landing-tag">The Gourmet Kitchen with Sports Bar</span>
              <h2 className="landing-heading">Fine dining without leaving the hotel.</h2>
              <p className="landing-subheading">
                Enjoy thoughtfully prepared food, full-service hospitality, and the energy of a sports bar—all conveniently located inside Evolve Hotel &amp; Suites.
              </p>

              <div className="landing-dining-highlights">
                <div className="landing-dining-highlight">
                  <UtensilsCrossed size={22} color="#173f34" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>A complete dining experience</strong>
                    <p>Settle in for an elevated dinner or artisan sharing plate without needing to travel into the city.</p>
                  </div>
                </div>

                <div className="landing-dining-highlight">
                  <Tv size={22} color="#173f34" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Refined atmosphere, sports-bar energy</strong>
                    <p>Enjoy comfortable dining alongside the games and major sporting events you want to watch on high-definition screens.</p>
                  </div>
                </div>

                <div className="landing-dining-highlight">
                  <Gift size={22} color="#dda943" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Earn Rewards with Every Qualifying Stay</strong>
                    <div className="landing-dining-equation">
                      5 Qualifying Nights = 1 Free Fine-Dining Experience
                    </div>
                    <p>Once five qualifying direct-booked nights are completed, your complete dinner dining reward becomes available to redeem.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button 
                  className="btn btn-secondary"
                  disabled
                  style={{ opacity: 0.85, cursor: 'default' }}
                >
                  View Live Square Menu — Coming Soon
                </button>
                <p style={{ fontSize: '0.8125rem', color: '#7a8781', marginTop: '8px' }}>
                  Menu, pricing, availability, and dining hours will be synced automatically once the Square connection goes live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: OUTDOOR HYDROTHERAPY SPA (#wellness)
         ========================================================================= */}
      <section id="wellness" className="landing-section">
        <div className="landing-section-shell">
          <div className="landing-split reverse">
            <div>
              <span className="landing-tag">Outdoor Hydrotherapy Spa</span>
              <h2 className="landing-heading">A better way to relax at Evolve.</h2>
              <p className="landing-subheading">
                Step away from the day and recharge in Evolve’s outdoor 47-jet hydrotherapy spa, designed to add a restorative experience to your stay.
              </p>

              <div className="landing-spa-specs">
                <div className="landing-spa-spec">
                  <Waves size={24} color="#173f34" />
                  <div>
                    <strong>47-jet outdoor hydrotherapy</strong>
                    <p>Relax and unwind with deep ergonomic seating and soothing temperature control.</p>
                  </div>
                </div>

                <div className="landing-spa-spec">
                  <Gift size={24} color="#dda943" />
                  <div>
                    <strong>Complimentary for Rewards members</strong>
                    <p>Hydrotherapy spa access is included as an exclusive Evolve Rewards member privilege.</p>
                  </div>
                </div>

                <div className="landing-spa-spec">
                  <Smartphone size={24} color="#173f34" />
                  <div>
                    <strong>$10 per stay for non-members</strong>
                    <p>Non-members can easily add spa access during direct booking or through the Guest App.</p>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8faf8', border: '1px solid #e2ded5', borderRadius: '12px', padding: '16px 20px', margin: '20px 0' }}>
                <strong style={{ fontSize: '0.875rem', color: '#173f34' }}>Access Information:</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6e7a75' }}>
                  Towels and entry instructions are provided by the hotel. Operating hours, age guidelines, and safety policies are posted in the spa pavilion.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigateTo('membership')}
                >
                  Explore Member Benefits →
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => scrollToSection('book')}
                >
                  Add &amp; Book Your Stay ↑
                </button>
              </div>
            </div>

            <div className="landing-split-visual">
              <img 
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80" 
                alt="Evolve outdoor hydrotherapy spa illuminated warmly at twilight"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: OUR TEXARKANA LOCATION (#location)
         ========================================================================= */}
      <section id="location" className="landing-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="landing-section-shell">
          <span className="landing-tag">Our Texarkana Location</span>
          <h2 className="landing-heading">Easy to find. Close to what matters.</h2>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#173f34', fontWeight: 600, fontSize: '1rem', marginBottom: '24px' }}>
            <MapPin size={20} color="#dda943" />
            5420 Crossroad Parkway, Texarkana, Arkansas 71854
          </p>

          <div className="landing-location-layout">
            {/* Embedded Google Maps */}
            <div className="landing-map-frame">
              <iframe
                title="Map showing Evolve Hotel & Suites in Texarkana"
                src="https://www.google.com/maps?q=5420+Crossroad+Parkway+Texarkana+Arkansas+71854&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Nearby Points of Interest */}
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#17271f', marginBottom: '16px', fontWeight: 700 }}>Nearby Landmarks</h3>
              <div className="landing-nearby-list">
                <div className="landing-nearby-item">
                  <Compass size={22} color="#173f34" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Arkansas Convention Center</strong>
                    <span>Conveniently located in the immediate Crossroads Parkway area, ideal for events and conferences.</span>
                  </div>
                </div>

                <div className="landing-nearby-item">
                  <ShieldCheck size={22} color="#173f34" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>CHRISTUS St. Michael Health System</strong>
                    <span>A quick 5-minute drive across Texarkana for medical, specialist, and hospital visits.</span>
                  </div>
                </div>

                <div className="landing-nearby-item">
                  <MapPin size={22} color="#173f34" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Texarkana Regional Airport (TXK)</strong>
                    <span>Seamless access via I-49 and connecting arterials with on-site car rental services.</span>
                  </div>
                </div>

                <div className="landing-nearby-item">
                  <Coffee size={22} color="#173f34" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Spring Lake Park &amp; Downtown Texarkana</strong>
                    <span>Minutes from regional recreation, historical twin-city post office, fine dining, and cultural arts.</span>
                  </div>
                </div>

                <a 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '8px' }}
                  href="https://maps.google.com/?q=5420+Crossroad+Parkway+Texarkana+Arkansas+71854" 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: CONTACT EVOLVE (#contact)
         ========================================================================= */}
      <section id="contact" className="landing-section">
        <div className="landing-section-shell">
          <div className="landing-contact-card">
            <div>
              <span className="landing-tag light">Contact Evolve</span>
              <h2 className="landing-heading light">Questions before your stay?</h2>
              <p className="landing-subheading light" style={{ marginBottom: '28px' }}>
                We’re here to help with reservations, group stays, dining inquiries, and the complete Evolve experience.
              </p>
              <button 
                className="btn btn-secondary"
                onClick={() => navigateTo('corporate-booking')}
              >
                Inquire About Group Rates ↗
              </button>
            </div>

            <div className="landing-contact-actions">
              <a className="landing-contact-btn" href="mailto:hello@stayatevolve.com">
                <Mail size={24} color="#dda943" />
                <div>
                  <small>Email Concierge</small>
                  <span>hello@stayatevolve.com</span>
                </div>
              </a>

              <a className="landing-contact-btn" href="tel:+18702168084">
                <Phone size={24} color="#dda943" />
                <div>
                  <small>Call Front Desk</small>
                  <span>870-216-8084</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLOATING QUICK QUESTION CONCIERGE WIDGET
         ========================================================================= */}
      <aside className="landing-question-widget" aria-label="Ask Evolve a question">
        <button 
          className="landing-question-launcher"
          type="button"
          onClick={() => setConciergeModalOpen(true)}
        >
          <MessageCircle size={18} color="#dda943" />
          <span>Questions? Get an Immediate Response</span>
        </button>
      </aside>

      {/* Quick Concierge FAQ Modal */}
      {conciergeModalOpen && (
        <div className="landing-concierge-modal" onClick={() => setConciergeModalOpen(false)}>
          <div className="landing-concierge-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#dda943" />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', margin: 0, color: '#17271f' }}>
                  Evolve Concierge Express
                </h3>
              </div>
              <button 
                onClick={() => setConciergeModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6e7a75' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#6e7a75', fontSize: '0.9375rem', marginBottom: '20px' }}>
              Quick answers to frequently asked questions about Evolve Hotels &amp; Suites in Texarkana:
            </p>

            <div style={{ display: 'grid', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: '#f7f8f6', padding: '14px', borderRadius: '12px' }}>
                <strong style={{ fontSize: '0.9375rem', color: '#173f34', display: 'block', marginBottom: '4px' }}>
                  What are Check-in and Checkout times?
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#556660' }}>
                  Check-in starts at 3:00 PM. Checkout is at 11:00 AM. Members with electronic PIN check-in can bypass the desk.
                </p>
              </div>

              <div style={{ background: '#f7f8f6', padding: '14px', borderRadius: '12px' }}>
                <strong style={{ fontSize: '0.9375rem', color: '#173f34', display: 'block', marginBottom: '4px' }}>
                  How does Made-to-Order Breakfast work?
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#556660' }}>
                  Simply open the Evolve Guest App on your phone, choose your desired hot dishes and pickup window (6:30 AM – 9:30 AM).
                </p>
              </div>

              <div style={{ background: '#f7f8f6', padding: '14px', borderRadius: '12px' }}>
                <strong style={{ fontSize: '0.9375rem', color: '#173f34', display: 'block', marginBottom: '4px' }}>
                  Are pets allowed?
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#556660' }}>
                  Yes! We offer dedicated Pet-Friendly King and Two Queen Suites prepared with pet beds for $25/night.
                </p>
              </div>

              <div style={{ background: '#f7f8f6', padding: '14px', borderRadius: '12px' }}>
                <strong style={{ fontSize: '0.9375rem', color: '#173f34', display: 'block', marginBottom: '4px' }}>
                  Who gets Hydrotherapy Spa access?
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#556660' }}>
                  Spa access is complimentary for all Evolve Rewards members. Non-members can purchase access for $10 per stay.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href="tel:+18702168084" 
                className="btn btn-primary" 
                style={{ flex: 1, textDecoration: 'none' }}
              >
                Call Concierge (870-216-8084)
              </a>
              <button 
                className="btn btn-outline" 
                onClick={() => { setConciergeModalOpen(false); navigateTo('support'); }}
              >
                Help Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SITE FOOTER
         ========================================================================= */}
      <footer style={{ backgroundColor: '#17271f', color: '#e2ded5', padding: '60px 24px 40px' }}>
        <div className="landing-section-shell">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '40px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', color: '#dda943', fontWeight: 700, marginBottom: '12px' }}>
                EVOLVE HOTELS &amp; SUITES
              </div>
              <p style={{ maxWidth: '360px', color: '#b5c0bc', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Fine Dining &amp; Spa · 5420 Crossroad Parkway, Texarkana, AR 71854. Elevating comfort, dining, and loyalty rewards across America.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Quick Navigation</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#b5c0bc' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => scrollToSection('difference')}>Overview</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => scrollToSection('rooms')}>Suites &amp; Amenities</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => scrollToSection('breakfast')}>Breakfast Ordering</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => scrollToSection('dining')}>The Gourmet Kitchen</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => scrollToSection('wellness')}>Hydrotherapy Spa</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => scrollToSection('rewards')}>Evolve Rewards</span>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Direct Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#b5c0bc' }}>
                  <a href="tel:+18702168084" style={{ color: 'inherit', textDecoration: 'none' }}>870-216-8084</a>
                  <a href="mailto:hello@stayatevolve.com" style={{ color: 'inherit', textDecoration: 'none' }}>hello@stayatevolve.com</a>
                  <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('corporate-booking')}>Group Rates &amp; Corporate</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Guest Support Center</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.8125rem', color: '#889690' }}>
            <p style={{ margin: 0 }}>© 2026 Evolve Hotels &amp; Suites. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Terms of Use</span>
              <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
