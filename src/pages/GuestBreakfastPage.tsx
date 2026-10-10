import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, CheckCircle2, Clock, Utensils, 
  Smartphone, Shield, AlertCircle, ChefHat, 
  Sparkles, Coffee, Bell, Check, Lock, RefreshCw,
  ExternalLink, ChevronRight
} from 'lucide-react';

export interface PlateOrder {
  id: string;
  plateNumber: number;
  eggsCount: number;
  eggsStyle: string;
  toppings: string[];
  meats: string[];
  additionalRequest: string;
}

type OrderFulfillmentStatus = 'draft' | 'review' | 'confirmed' | 'preparing' | 'ready' | 'delivered';

export const GuestBreakfastPage: React.FC = () => {
  const { navigateTo } = useApp();

  // Storage key for guest room 218 order persistence
  const STORAGE_KEY = 'evolve_guest_breakfast_order_218';

  // Guest & Room metadata (matches screenshots)
  const guestInfo = {
    guestName: 'jayeshs',
    phone: '345675576453875',
    roomNumber: 'Room 218',
    suiteLabel: 'Suite 2 · Double Queen Room',
    suiteName: 'Double Queen Room',
    suiteNumber: 'Suite 2',
    stayTitle: 'Current stay · Sample checked-in stay',
    maxPlates: 4,
    date: 'October 11, 2026',
    cutoffText: '4:00 AM Central Time',
    windowText: '3:00 PM–4:00 AM Central Time'
  };

  // State management
  const [activeView, setActiveView] = useState<'sms_preview' | 'order_form' | 'review' | 'tracking' | 'expired'>('sms_preview');
  const [fulfillmentStep, setFulfillmentStep] = useState<'confirmed' | 'preparing' | 'ready' | 'delivered'>('confirmed');
  const [isPhoneView, setIsPhoneView] = useState<boolean>(false);

  // Plate orders state
  const [plates, setPlates] = useState<PlateOrder[]>([
    {
      id: 'plate-1',
      plateNumber: 1,
      eggsCount: 2,
      eggsStyle: 'Scrambled',
      toppings: [],
      meats: [],
      additionalRequest: ''
    }
  ]);

  // Selected pickup time
  const [pickupTime, setPickupTime] = useState<string>('6:30 AM');
  const availableTimes = [
    { time: '6:30 AM', full: false },
    { time: '6:45 AM', full: false },
    { time: '7:00 AM', full: true }, // marked full in screenshot
    { time: '7:15 AM', full: false },
    { time: '7:30 AM', full: false },
    { time: '7:45 AM', full: false }
  ];

  // Options
  const eggStyles = ['Scrambled', 'Over Easy', 'Over Medium', 'Over Hard'];
  const toppingOptions = ['Cheese', 'Onion', 'Bell Pepper', 'Tomato', 'Mushroom', 'Jalapeño'];
  const meatOptions = ['Bacon', 'Sausage', 'Ham', 'Turkey Sausage'];

  // Complimentary Buffet Items (Matches Screenshot 2)
  const buffetItems = [
    { title: 'Belgian waffles', desc: 'Self-serve' },
    { title: 'Fresh hot oatmeal', desc: 'Hot buffet' },
    { title: 'French toast sticks', desc: 'Hot buffet' },
    { title: 'Fresh biscuits & gravy', desc: 'Hot buffet' },
    { title: 'Fresh fruit', desc: 'Organic bananas, pineapple, watermelon, strawberries & blueberries' },
    { title: 'Assorted cereals', desc: 'Honey Nut Cheerios, Cinnamon Toast Crunch & Fruity Pebbles' },
    { title: 'Milk', desc: 'Available with cereal or separately' }
  ];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plates) setPlates(parsed.plates);
        if (parsed.pickupTime) setPickupTime(parsed.pickupTime);
        if (parsed.fulfillmentStep) setFulfillmentStep(parsed.fulfillmentStep);
        if (parsed.activeView && parsed.activeView !== 'sms_preview') {
          setActiveView(parsed.activeView);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save changes
  const saveState = (newView: typeof activeView, newStep: typeof fulfillmentStep) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        plates,
        pickupTime,
        fulfillmentStep: newStep,
        activeView: newView
      }));
    } catch {
      // ignore
    }
  };

  // Plate handlers
  const handleUpdateEggsCount = (plateId: string, count: number) => {
    setPlates(prev => prev.map(p => p.id === plateId ? { ...p, eggsCount: count } : p));
  };

  const handleUpdateEggsStyle = (plateId: string, style: string) => {
    setPlates(prev => prev.map(p => p.id === plateId ? { ...p, eggsStyle: style } : p));
  };

  const handleToggleTopping = (plateId: string, topping: string) => {
    setPlates(prev => prev.map(p => {
      if (p.id !== plateId) return p;
      const exists = p.toppings.includes(topping);
      const newToppings = exists 
        ? p.toppings.filter(t => t !== topping) 
        : [...p.toppings, topping];
      return { ...p, toppings: newToppings };
    }));
  };

  const handleToggleMeat = (plateId: string, meat: string) => {
    setPlates(prev => prev.map(p => {
      if (p.id !== plateId) return p;
      const exists = p.meats.includes(meat);
      if (exists) {
        return { ...p, meats: p.meats.filter(m => m !== meat) };
      }
      if (p.meats.length >= 2) {
        // max 2 meats
        return { ...p, meats: [p.meats[1], meat] };
      }
      return { ...p, meats: [...p.meats, meat] };
    }));
  };

  const handleUpdateNotes = (plateId: string, note: string) => {
    setPlates(prev => prev.map(p => p.id === plateId ? { ...p, additionalRequest: note } : p));
  };

  const handleAddPlate = () => {
    if (plates.length >= guestInfo.maxPlates) return;
    const newPlate: PlateOrder = {
      id: `plate-${Date.now()}`,
      plateNumber: plates.length + 1,
      eggsCount: 2,
      eggsStyle: 'Scrambled',
      toppings: [],
      meats: [],
      additionalRequest: ''
    };
    setPlates(prev => [...prev, newPlate]);
  };

  const handleRemovePlate = (plateId: string) => {
    if (plates.length <= 1) return;
    setPlates(prev => {
      const filtered = prev.filter(p => p.id !== plateId);
      return filtered.map((p, idx) => ({ ...p, plateNumber: idx + 1 }));
    });
  };

  const handleSubmitOrder = () => {
    setFulfillmentStep('confirmed');
    setActiveView('tracking');
    saveState('tracking', 'confirmed');
  };

  const handleSimulateFulfillment = (step: 'confirmed' | 'preparing' | 'ready' | 'delivered') => {
    setFulfillmentStep(step);
    if (step === 'delivered') {
      setActiveView('expired');
      saveState('expired', 'delivered');
    } else {
      setActiveView('tracking');
      saveState('tracking', step);
    }
  };

  const handleResetForTesting = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlates([
      {
        id: 'plate-1',
        plateNumber: 1,
        eggsCount: 2,
        eggsStyle: 'Scrambled',
        toppings: [],
        meats: [],
        additionalRequest: ''
      }
    ]);
    setPickupTime('6:30 AM');
    setFulfillmentStep('confirmed');
    setActiveView('sms_preview');
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', color: '#17271f', paddingBottom: '80px' }}>
      
      {/* 1. TOP SIMULATION & AUDIT BAR */}
      <div style={{
        backgroundColor: '#17271f',
        color: '#e2ded5',
        padding: '10px 16px',
        fontSize: '0.8125rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        borderBottom: '1px solid rgba(221, 169, 67, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: activeView === 'expired' ? '#ef4444' : '#10b981'
          }} />
          <strong style={{ color: '#ffffff' }}>GUEST SECURE LINK (PHONE BROWSER ONLY)</strong>
          <span style={{ color: '#94a3b8' }}>• Room 218 • Assigned to {guestInfo.guestName}</span>
        </div>

        {/* Quick Stepper Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ color: '#dda943', fontWeight: 600, marginRight: '4px' }}>Stage:</span>
          
          <button
            type="button"
            onClick={() => { setActiveView('sms_preview'); saveState('sms_preview', fulfillmentStep); }}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: activeView === 'sms_preview' ? '1px solid #dda943' : '1px solid rgba(255,255,255,0.2)',
              backgroundColor: activeView === 'sms_preview' ? '#dda943' : 'rgba(255,255,255,0.08)',
              color: activeView === 'sms_preview' ? '#17271f' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            1. SMS Preview
          </button>

          <button
            type="button"
            onClick={() => { setActiveView('order_form'); saveState('order_form', fulfillmentStep); }}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: activeView === 'order_form' ? '1px solid #dda943' : '1px solid rgba(255,255,255,0.2)',
              backgroundColor: activeView === 'order_form' ? '#dda943' : 'rgba(255,255,255,0.08)',
              color: activeView === 'order_form' ? '#17271f' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            2. Menu & Plates
          </button>

          <button
            type="button"
            onClick={() => { setActiveView('review'); saveState('review', fulfillmentStep); }}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: activeView === 'review' ? '1px solid #dda943' : '1px solid rgba(255,255,255,0.2)',
              backgroundColor: activeView === 'review' ? '#dda943' : 'rgba(255,255,255,0.08)',
              color: activeView === 'review' ? '#17271f' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            3. Review
          </button>

          <button
            type="button"
            onClick={() => handleSimulateFulfillment('confirmed')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: activeView === 'tracking' && fulfillmentStep === 'confirmed' ? '1px solid #dda943' : '1px solid rgba(255,255,255,0.2)',
              backgroundColor: activeView === 'tracking' && fulfillmentStep === 'confirmed' ? '#dda943' : 'rgba(255,255,255,0.08)',
              color: activeView === 'tracking' && fulfillmentStep === 'confirmed' ? '#17271f' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            4. Confirmed
          </button>

          <button
            type="button"
            onClick={() => handleSimulateFulfillment('preparing')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: activeView === 'tracking' && fulfillmentStep === 'preparing' ? '1px solid #dda943' : '1px solid rgba(255,255,255,0.2)',
              backgroundColor: activeView === 'tracking' && fulfillmentStep === 'preparing' ? '#dda943' : 'rgba(255,255,255,0.08)',
              color: activeView === 'tracking' && fulfillmentStep === 'preparing' ? '#17271f' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            5. Kitchen Preparing
          </button>

          <button
            type="button"
            onClick={() => handleSimulateFulfillment('ready')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: activeView === 'tracking' && fulfillmentStep === 'ready' ? '1px solid #dda943' : '1px solid rgba(255,255,255,0.2)',
              backgroundColor: activeView === 'tracking' && fulfillmentStep === 'ready' ? '#dda943' : 'rgba(255,255,255,0.08)',
              color: activeView === 'tracking' && fulfillmentStep === 'ready' ? '#17271f' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            6. Ready for Pickup
          </button>

          <button
            type="button"
            onClick={() => handleSimulateFulfillment('delivered')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: activeView === 'expired' ? '1px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.4)',
              backgroundColor: activeView === 'expired' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            title="When food is delivered, link automatically expires"
          >
            7. Delivered (Link Expired)
          </button>

          {/* Device Frame Toggle */}
          <button
            type="button"
            onClick={() => setIsPhoneView(!isPhoneView)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #94a3b8',
              backgroundColor: isPhoneView ? '#334155' : 'transparent',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '6px'
            }}
          >
            {isPhoneView ? '🖥️ Desktop Layout' : '📱 Phone Viewport'}
          </button>

          <button
            type="button"
            onClick={handleResetForTesting}
            title="Reset test data"
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTAINER (Supports mobile viewport framing or responsive browser view) */}
      <div style={{
        maxWidth: isPhoneView ? '430px' : '980px',
        margin: '24px auto',
        padding: isPhoneView ? '0' : '0 20px',
        transition: 'all 0.3s ease'
      }}>
        
        {/* If Phone Viewport mode, display simulated iPhone bezel */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: isPhoneView ? '36px' : '20px',
          border: isPhoneView ? '10px solid #1e293b' : '1px solid #e5e3dc',
          boxShadow: isPhoneView ? '0 25px 60px rgba(0, 0, 0, 0.25)' : '0 4px 20px rgba(23, 63, 52, 0.04)',
          overflow: 'hidden',
          minHeight: '80vh'
        }}>
          
          {/* Simulated Mobile Status Notch in Phone Mode */}
          {isPhoneView && (
            <div style={{
              backgroundColor: '#1e293b',
              color: '#94a3b8',
              padding: '6px 20px',
              fontSize: '0.7rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 600
            }}>
              <span>9:41 AM</span>
              <div style={{ width: '80px', height: '14px', backgroundColor: '#0f172a', borderRadius: '10px' }} />
              <span>5G 100%</span>
            </div>
          )}

          {/* Content padding wrapper */}
          <div style={{ padding: isPhoneView ? '20px 18px 40px' : '32px 36px 50px' }}>

            {/* SCREEN 1: GUEST TEXT MESSAGE PREVIEW (Screenshot 1) */}
            {activeView === 'sms_preview' && (
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#997125',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  GUEST TEXT MESSAGE PREVIEW
                </span>

                <h1 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  color: '#17271f',
                  margin: '0 0 10px',
                  fontWeight: 600,
                  lineHeight: 1.15
                }}>
                  Room 218 is assigned.
                </h1>

                <p style={{
                  fontSize: '1.05rem',
                  color: '#55625c',
                  margin: '0 0 28px',
                  lineHeight: 1.5
                }}>
                  The assigned guest receives breakfast access for their own room.
                </p>

                {/* The SMS Card (Exact from Screenshot 1) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e1d8',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(23, 63, 52, 0.06)',
                  maxWidth: '560px',
                  marginBottom: '28px'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #eeece5',
                    marginBottom: '16px',
                    fontWeight: 500
                  }}>
                    Evolve → {guestInfo.guestName} · {guestInfo.phone}
                  </div>

                  {/* SMS Bubble */}
                  <div style={{
                    backgroundColor: '#eef4f0',
                    border: '1px solid #dce8e0',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    fontSize: '1rem',
                    lineHeight: 1.55,
                    color: '#17271f',
                    marginBottom: '20px'
                  }}>
                    Evolve: You can manage breakfast for room 218. Choose your plates and pickup time for the next morning.
                  </div>

                  {/* Open Room 218 breakfast button */}
                  <button
                    type="button"
                    onClick={() => { setActiveView('order_form'); saveState('order_form', fulfillmentStep); }}
                    style={{
                      width: '100%',
                      backgroundColor: '#173f34',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#12332a')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173f34')}
                  >
                    Open room 218 breakfast
                  </button>
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: 1.55,
                  maxWidth: '560px'
                }}>
                  This preview stays in your browser. It does not send a text or give access to rewards, payment details, or other rooms.
                </p>
              </div>
            )}

            {/* SCREEN 2 & 3: SECURE BREAKFAST MENU & PLATE BUILDER (Screenshots 2 & 3) */}
            {activeView === 'order_form' && (
              <div>
                
                {/* Header Sub-bar (Screenshot 2 Top) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #eeece5',
                  marginBottom: '22px'
                }}>
                  <button
                    type="button"
                    onClick={() => navigateTo('in-stay-breakfast')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#173f34',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: 0
                    }}
                  >
                    ← Back to member app
                  </button>

                  <span style={{
                    fontSize: '0.8125rem',
                    color: '#64748b',
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '9999px'
                  }}>
                    Guest preview · Room 218 only
                  </span>
                </div>

                {/* Page Title & Status (Screenshot 2) */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#997125',
                      display: 'block',
                      marginBottom: '6px'
                    }}>
                      SECURE BREAKFAST LINK · ROOM 218
                    </span>
                    <h1 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                      color: '#17271f',
                      margin: '0 0 8px',
                      fontWeight: 600,
                      lineHeight: 1.15
                    }}>
                      Breakfast for Tomorrow Morning
                    </h1>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#64748b',
                      margin: 0,
                      lineHeight: 1.5,
                      maxWidth: '720px'
                    }}>
                      This secure link is only for breakfast for Suite 2. It does not open member bookings, rewards, or account information.
                    </p>
                  </div>

                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.8125rem',
                    fontWeight: 700
                  }}>
                    Ordering open
                  </span>
                </div>

                {/* Daily Breakfast Ordering Alert Box (Screenshot 2 Yellow Card) */}
                <div style={{
                  backgroundColor: '#fdf8ed',
                  border: '1px solid #eddcb5',
                  borderLeft: '4px solid #dda943',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '28px'
                }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#997125',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    DAILY BREAKFAST ORDERING
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: '#17271f', display: 'block', marginBottom: '6px' }}>
                    Ordering opens at 3:00 PM for the next morning
                  </strong>
                  <p style={{ margin: '0 0 6px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                    For stays longer than one night, complete a new breakfast order each day after 3:00 PM Central Time. Orders apply only to the following morning and never repeat automatically.
                  </p>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#17271f' }}>
                    Daily ordering window: {guestInfo.windowText}
                  </span>
                </div>

                {/* Complimentary Buffet Showcase Box (Screenshot 2) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e7e5dc',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '28px',
                  boxShadow: '0 2px 8px rgba(23, 63, 52, 0.02)'
                }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#997125',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    ALSO AVAILABLE TOMORROW MORNING
                  </span>
                  <h3 style={{
                    fontSize: '1.35rem',
                    color: '#17271f',
                    margin: '0 0 6px',
                    fontWeight: 700
                  }}>
                    Explore the complimentary breakfast buffet
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    margin: '0 0 18px'
                  }}>
                    You may also choose from these buffet items. No advance order is required.
                  </p>

                  {/* Buffet Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    {buffetItems.map((item, idx) => (
                      <div key={idx} style={{
                        backgroundColor: '#fafaf8',
                        border: '1px solid #eeece5',
                        borderRadius: '12px',
                        padding: '14px 16px'
                      }}>
                        <strong style={{ fontSize: '0.92rem', color: '#17271f', display: 'block', marginBottom: '2px' }}>
                          {item.title}
                        </strong>
                        <span style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.4, display: 'block' }}>
                          {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Your Assigned Suite Summary Box (Screenshot 2 & 3) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e7e5dc',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '28px',
                  boxShadow: '0 2px 8px rgba(23, 63, 52, 0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#997125'
                    }}>
                      YOUR ASSIGNED SUITE
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#166534',
                      fontWeight: 700,
                      backgroundColor: '#f0fdf4',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      One order per suite for tomorrow morning
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: '0 0 16px', fontWeight: 700 }}>
                    {guestInfo.stayTitle}
                  </h3>

                  {/* Suite 2 Selected Card (Screenshot 2 bottom) */}
                  <div style={{
                    backgroundColor: '#eef4f0',
                    border: '2px solid #173f34',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '14px'
                  }}>
                    <strong style={{ fontSize: '1rem', color: '#17271f', display: 'block', marginBottom: '2px' }}>
                      {guestInfo.suiteLabel}
                    </strong>
                    <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '4px' }}>
                      {guestInfo.roomNumber} · Up to {guestInfo.maxPlates} plates · One per guest
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                      Status: Not submitted
                    </span>
                  </div>

                  {/* Guest and Suite Meta pills */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '10px'
                  }}>
                    <div style={{
                      backgroundColor: '#f8faf9',
                      border: '1px solid #eeece5',
                      borderRadius: '10px',
                      padding: '12px 14px'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Guest</span>
                      <strong style={{ fontSize: '0.95rem', color: '#17271f' }}>{guestInfo.guestName}</strong>
                    </div>

                    <div style={{
                      backgroundColor: '#f8faf9',
                      border: '1px solid #eeece5',
                      borderRadius: '10px',
                      padding: '12px 14px'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Selected suite</span>
                      <strong style={{ fontSize: '0.95rem', color: '#17271f' }}>{guestInfo.suiteName} · {guestInfo.roomNumber}</strong>
                    </div>
                  </div>
                </div>

                {/* MADE TO ORDER SECTION & PICKUP SELECTION (Screenshot 3) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isPhoneView ? '1fr' : '1.45fr 1fr',
                  gap: '24px',
                  alignItems: 'flex-start'
                }}>
                  
                  {/* Left Column: Plates Builder (Screenshot 3 Left) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#997125'
                      }}>
                        MADE TO ORDER FOR TOMORROW
                      </span>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: '#eef4f0',
                        color: '#173f34',
                        padding: '3px 10px',
                        borderRadius: '9999px'
                      }}>
                        {plates.length} of {guestInfo.maxPlates} plates
                      </span>
                    </div>

                    <h2 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.5rem',
                      color: '#17271f',
                      margin: '0 0 6px',
                      fontWeight: 700
                    }}>
                      {guestInfo.suiteLabel}
                    </h2>

                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
                      One plate is allowed per registered guest, up to {guestInfo.maxPlates} for this suite. The room-type maximum is {guestInfo.maxPlates}.
                    </p>

                    {/* Plates List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {plates.map((plate) => (
                        <div key={plate.id} style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2ded5',
                          borderRadius: '16px',
                          padding: '22px',
                          boxShadow: '0 2px 8px rgba(23, 63, 52, 0.03)'
                        }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: '#997125',
                              backgroundColor: '#fbf6ec',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              PLATE {plate.plateNumber}
                            </span>

                            {plates.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePlate(plate.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc2626',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Remove Plate
                              </button>
                            )}
                          </div>

                          {/* 1. Eggs Section */}
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17271f', display: 'block', marginBottom: '8px' }}>
                              Eggs
                            </label>

                            {/* Numbers row (1, 2, 3, 4) */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                              {[1, 2, 3, 4].map(num => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => handleUpdateEggsCount(plate.id, num)}
                                  style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    border: plate.eggsCount === num ? '2px solid #173f34' : '1px solid #d1d5db',
                                    backgroundColor: plate.eggsCount === num ? '#173f34' : '#ffffff',
                                    color: plate.eggsCount === num ? '#ffffff' : '#17271f',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>

                            {/* Egg Style Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {eggStyles.map(style => (
                                <button
                                  key={style}
                                  type="button"
                                  onClick={() => handleUpdateEggsStyle(plate.id, style)}
                                  style={{
                                    padding: '8px 14px',
                                    borderRadius: '9999px',
                                    border: plate.eggsStyle === style ? '1.5px solid #173f34' : '1px solid #d1d5db',
                                    backgroundColor: plate.eggsStyle === style ? '#173f34' : '#ffffff',
                                    color: plate.eggsStyle === style ? '#ffffff' : '#17271f',
                                    fontSize: '0.84rem',
                                    fontWeight: plate.eggsStyle === style ? 700 : 500,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Toppings Section */}
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17271f', display: 'block', marginBottom: '8px' }}>
                              Toppings (optional)
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {toppingOptions.map(top => {
                                const active = plate.toppings.includes(top);
                                return (
                                  <button
                                    key={top}
                                    type="button"
                                    onClick={() => handleToggleTopping(plate.id, top)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '9999px',
                                      border: active ? '1.5px solid #173f34' : '1px solid #d1d5db',
                                      backgroundColor: active ? '#173f34' : '#ffffff',
                                      color: active ? '#ffffff' : '#17271f',
                                      fontSize: '0.84rem',
                                      fontWeight: active ? 700 : 500,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {top}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3. Meats Section (Choose up to 2) */}
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17271f', display: 'block', marginBottom: '8px' }}>
                              Choose up to 2 meats
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {meatOptions.map(meat => {
                                const active = plate.meats.includes(meat);
                                return (
                                  <button
                                    key={meat}
                                    type="button"
                                    onClick={() => handleToggleMeat(plate.id, meat)}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '9999px',
                                      border: active ? '1.5px solid #173f34' : '1px solid #d1d5db',
                                      backgroundColor: active ? '#173f34' : '#ffffff',
                                      color: active ? '#ffffff' : '#17271f',
                                      fontSize: '0.84rem',
                                      fontWeight: active ? 700 : 500,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {meat}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 4. Additional request (optional) */}
                          <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#17271f', display: 'block', marginBottom: '6px' }}>
                              Additional request (optional)
                            </label>
                            <input
                              type="text"
                              value={plate.additionalRequest}
                              onChange={(e) => handleUpdateNotes(plate.id, e.target.value)}
                              placeholder="Request another item or something different..."
                              style={{
                                width: '100%',
                                padding: '12px 14px',
                                borderRadius: '10px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                color: '#17271f',
                                boxSizing: 'border-box',
                                outline: 'none'
                              }}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
                              Requests are subject to availability.
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Add Another Plate Button */}
                    {plates.length < guestInfo.maxPlates && (
                      <button
                        type="button"
                        onClick={handleAddPlate}
                        style={{
                          width: '100%',
                          marginTop: '16px',
                          padding: '14px',
                          borderRadius: '12px',
                          border: '1.5px dashed #173f34',
                          backgroundColor: '#ffffff',
                          color: '#173f34',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        + Add Another Plate (Optional) · {plates.length} of {guestInfo.maxPlates}
                      </button>
                    )}
                  </div>

                  {/* Right Column: Pickup Time & Submit (Screenshot 3 Right) */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2ded5',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 16px rgba(23, 63, 52, 0.04)',
                    position: 'sticky',
                    top: '80px'
                  }}>
                    
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.35rem',
                      color: '#17271f',
                      margin: '0 0 6px',
                      fontWeight: 700
                    }}>
                      Pickup tomorrow morning <span style={{ color: '#dc2626' }}>*</span>
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 16px', lineHeight: 1.45 }}>
                      Select one available time for tomorrow, {guestInfo.date}. Please arrive within 5 minutes.
                    </p>

                    {/* Time slots grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                      {availableTimes.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={item.full}
                          onClick={() => setPickupTime(item.time)}
                          style={{
                            padding: '14px 10px',
                            borderRadius: '12px',
                            border: pickupTime === item.time ? '2px solid #173f34' : '1px solid #d1d5db',
                            backgroundColor: pickupTime === item.time ? '#eef4f0' : (item.full ? '#f1f5f9' : '#ffffff'),
                            color: item.full ? '#94a3b8' : (pickupTime === item.time ? '#173f34' : '#17271f'),
                            fontWeight: pickupTime === item.time ? 700 : 500,
                            fontSize: '0.9rem',
                            cursor: item.full ? 'not-allowed' : 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {item.time} {item.full && <span style={{ fontSize: '0.75rem', display: 'block' }}>· Full</span>}
                        </button>
                      ))}
                    </div>

                    {/* Cutoff warning banner */}
                    <div style={{
                      backgroundColor: '#fdf8ed',
                      border: '1px solid #eddcb5',
                      borderLeft: '4px solid #dda943',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      fontSize: '0.8125rem',
                      lineHeight: 1.45,
                      marginBottom: '20px'
                    }}>
                      <strong style={{ color: '#17271f', display: 'block', marginBottom: '2px' }}>
                        Ordering cutoff: {guestInfo.cutoffText} tomorrow, {guestInfo.date}.
                      </strong>
                      <span style={{ color: '#55625c' }}>
                        You may submit or change the order until the cutoff. After that, the order is read-only.
                      </span>
                    </div>

                    {/* Review My Order Button */}
                    <button
                      type="button"
                      onClick={() => { setActiveView('review'); saveState('review', fulfillmentStep); }}
                      style={{
                        width: '100%',
                        backgroundColor: '#173f34',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#12332a')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173f34')}
                    >
                      Review My Order
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 4: REVIEW ALL BREAKFAST ORDERS (Screenshot 4) */}
            {activeView === 'review' && (
              <div>
                <button
                  type="button"
                  onClick={() => setActiveView('order_form')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#173f34',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0,
                    marginBottom: '14px'
                  }}
                >
                  ← Make Changes
                </button>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#997125',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  TOMORROW MORNING · ALL SUITES
                </span>

                <h1 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  color: '#17271f',
                  margin: '0 0 8px',
                  fontWeight: 600,
                  lineHeight: 1.15
                }}>
                  Review All Breakfast Orders
                </h1>

                <p style={{
                  fontSize: '1rem',
                  color: '#55625c',
                  margin: '0 0 24px',
                  lineHeight: 1.5
                }}>
                  Confirm the plates and pickup time for every suite before submitting.
                </p>

                {/* Suite 2 Summary Card (Screenshot 4) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2ded5',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(23, 63, 52, 0.04)',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#997125',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}>
                      {guestInfo.suiteNumber}
                    </span>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      Not submitted
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.45rem',
                    color: '#17271f',
                    margin: '0 0 16px',
                    fontWeight: 700
                  }}>
                    {guestInfo.suiteName} · {guestInfo.roomNumber}
                  </h2>

                  {/* Plates breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                    {plates.map((plate) => (
                      <div key={plate.id} style={{
                        backgroundColor: '#fafaf8',
                        border: '1px solid #eeece5',
                        borderRadius: '12px',
                        padding: '16px 18px'
                      }}>
                        <strong style={{ fontSize: '1rem', color: '#17271f', display: 'block', marginBottom: '8px' }}>
                          Plate {plate.plateNumber}
                        </strong>
                        <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                          <div><strong>Eggs:</strong> {plate.eggsCount} {plate.eggsStyle.toLowerCase()}</div>
                          <div><strong>Toppings:</strong> {plate.toppings.length > 0 ? plate.toppings.join(', ') : 'None'}</div>
                          <div><strong>Meats:</strong> {plate.meats.length > 0 ? plate.meats.join(', ') : 'None'}</div>
                          <div><strong>Additional request:</strong> {plate.additionalRequest ? plate.additionalRequest : 'None'}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pickup Time box */}
                  <div style={{
                    backgroundColor: '#f8faf9',
                    border: '1px solid #eeece5',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '16px'
                  }}>
                    <strong style={{ fontSize: '0.95rem', color: '#17271f', display: 'block', marginBottom: '4px' }}>
                      Pickup tomorrow morning
                    </strong>
                    <div style={{ fontSize: '0.875rem', color: '#17271f', fontWeight: 700 }}>
                      {pickupTime} · {guestInfo.date}
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                      {plates.length} of {guestInfo.maxPlates} allowed plates · One per guest
                    </span>
                  </div>

                  {/* Edit Suite 2 Button */}
                  <button
                    type="button"
                    onClick={() => setActiveView('order_form')}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#17271f',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Edit {guestInfo.suiteNumber}
                  </button>
                </div>

                {/* Changes available banner */}
                <div style={{
                  backgroundColor: '#fdf8ed',
                  border: '1px solid #eddcb5',
                  borderLeft: '4px solid #dda943',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '0.84rem',
                  color: '#475569',
                  marginBottom: '20px'
                }}>
                  Changes remain available until {guestInfo.cutoffText} tomorrow morning. Each suite keeps its own order and status.
                </div>

                {/* Submit All Breakfast Orders button */}
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  style={{
                    width: '100%',
                    backgroundColor: '#173f34',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '18px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(23, 63, 52, 0.2)'
                  }}
                >
                  Submit All Breakfast Orders
                </button>
              </div>
            )}

            {/* SCREEN 5: ORDER TRACKING & UPDATES (Screenshot 5) */}
            {activeView === 'tracking' && (
              <div>
                
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#997125',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  TOMORROW MORNING · ALL SUITES
                </span>

                <h1 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  color: '#17271f',
                  margin: '0 0 8px',
                  fontWeight: 600,
                  lineHeight: 1.15
                }}>
                  Your Breakfast Orders
                </h1>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#55625c',
                  margin: '0 0 24px',
                  lineHeight: 1.5
                }}>
                  This saved screen keeps every suite, plate, selected item, pickup time, and fulfillment status together. Confirmed orders may be modified until {guestInfo.cutoffText}.
                </p>

                {/* Suite 2 Confirmed Order Card (Screenshot 5) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2ded5',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(23, 63, 52, 0.04)',
                  marginBottom: '20px'
                }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#997125',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}>
                      {guestInfo.suiteNumber}
                    </span>

                    {/* Status Pill */}
                    <span style={{
                      backgroundColor: fulfillmentStep === 'ready' ? '#dbeafe' : '#dcfce7',
                      color: fulfillmentStep === 'ready' ? '#1e40af' : '#166534',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {fulfillmentStep === 'confirmed' && 'Order Confirmed'}
                      {fulfillmentStep === 'preparing' && 'Kitchen Preparing'}
                      {fulfillmentStep === 'ready' && 'Ready for Pickup'}
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.45rem',
                    color: '#17271f',
                    margin: '0 0 16px',
                    fontWeight: 700
                  }}>
                    {guestInfo.suiteName} · {guestInfo.roomNumber}
                  </h2>

                  <strong style={{ fontSize: '0.95rem', color: '#17271f', display: 'block', marginBottom: '10px' }}>
                    Your plate breakdown
                  </strong>

                  {/* Plates breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                    {plates.map((plate) => (
                      <div key={plate.id} style={{
                        backgroundColor: '#fafaf8',
                        border: '1px solid #eeece5',
                        borderRadius: '12px',
                        padding: '16px 18px'
                      }}>
                        <strong style={{ fontSize: '0.95rem', color: '#17271f', display: 'block', marginBottom: '6px' }}>
                          Plate {plate.plateNumber}
                        </strong>
                        <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.6 }}>
                          <div><strong>Eggs:</strong> {plate.eggsCount} {plate.eggsStyle.toLowerCase()}</div>
                          <div><strong>Toppings:</strong> {plate.toppings.length > 0 ? plate.toppings.join(', ') : 'None'}</div>
                          <div><strong>Meats:</strong> {plate.meats.length > 0 ? plate.meats.join(', ') : 'None'}</div>
                          <div><strong>Additional request:</strong> {plate.additionalRequest ? plate.additionalRequest : 'None'}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pickup Info Box */}
                  <div style={{
                    backgroundColor: '#f8faf9',
                    border: '1px solid #eeece5',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '20px'
                  }}>
                    <strong style={{ fontSize: '0.95rem', color: '#17271f', display: 'block', marginBottom: '4px' }}>
                      Pickup tomorrow morning
                    </strong>
                    <div style={{ fontSize: '0.9rem', color: '#17271f', fontWeight: 700 }}>
                      {pickupTime} · {guestInfo.date}
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                      {plates.length} plate{plates.length > 1 ? 's' : ''} · One plate per registered guest
                    </span>
                  </div>

                  {/* 3-STEP REAL-TIME STATUS STEPPER (Screenshot 5) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    
                    {/* Step 1: Confirmed */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: fulfillmentStep === 'confirmed' ? '2px solid #173f34' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#173f34',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        1
                      </div>
                      <strong style={{ fontSize: '0.875rem', color: '#17271f', display: 'block', marginBottom: '2px' }}>
                        Order Confirmed
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Can modify until 4:00 AM CT
                      </span>
                    </div>

                    {/* Step 2: Preparing */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: fulfillmentStep === 'preparing' ? '2px solid #173f34' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: fulfillmentStep === 'preparing' || fulfillmentStep === 'ready' ? '#173f34' : '#e2e8f0',
                        color: fulfillmentStep === 'preparing' || fulfillmentStep === 'ready' ? '#ffffff' : '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        2
                      </div>
                      <strong style={{ fontSize: '0.875rem', color: '#17271f', display: 'block', marginBottom: '2px' }}>
                        Preparing
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {fulfillmentStep === 'preparing' ? 'In kitchen queue' : 'Waiting'}
                      </span>
                    </div>

                    {/* Step 3: Ready for Pickup */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: fulfillmentStep === 'ready' ? '2px solid #173f34' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: fulfillmentStep === 'ready' ? '#16a34a' : '#e2e8f0',
                        color: fulfillmentStep === 'ready' ? '#ffffff' : '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        3
                      </div>
                      <strong style={{ fontSize: '0.875rem', color: '#17271f', display: 'block', marginBottom: '2px' }}>
                        Ready for Pickup
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {fulfillmentStep === 'ready' ? 'At Gourmet Kitchen counter' : 'Waiting'}
                      </span>
                    </div>

                  </div>

                  {/* Status Banner */}
                  <div style={{
                    backgroundColor: '#f8faf9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    marginBottom: '20px'
                  }}>
                    <strong style={{ fontSize: '0.92rem', color: '#17271f', display: 'block', marginBottom: '2px' }}>
                      {fulfillmentStep === 'confirmed' && 'Order Confirmed · Can modify until 4:00 AM CT'}
                      {fulfillmentStep === 'preparing' && 'Kitchen is preparing your order'}
                      {fulfillmentStep === 'ready' && 'Your order is ready at The Gourmet Kitchen!'}
                    </strong>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                      {fulfillmentStep === 'confirmed' && 'This suite order is confirmed and can be changed until 4:00 AM Central Time.'}
                      {fulfillmentStep === 'preparing' && 'Chef team is currently preparing your egg plates and sides fresh for pickup.'}
                      {fulfillmentStep === 'ready' && 'Please proceed to The Gourmet Kitchen counter with your Room 218 key or PIN.'}
                    </p>
                  </div>

                  {/* Modify Suite 2 Order button */}
                  {fulfillmentStep === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => setActiveView('order_form')}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1.5px solid #173f34',
                        backgroundColor: '#ffffff',
                        color: '#173f34',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                      }}
                    >
                      Modify {guestInfo.suiteNumber} Order
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 6: FOOD DELIVERED & LINK EXPIRED (User's specific requirement) */}
            {activeView === 'expired' && (
              <div>
                
                {/* Expired Callout Banner */}
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px'
                  }}>
                    <Lock size={26} />
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#b91c1c',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    SECURE GUEST LINK EXPIRED
                  </span>

                  <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.85rem',
                    color: '#991b1b',
                    margin: '0 0 8px',
                    fontWeight: 700
                  }}>
                    Food Delivered &amp; Fulfilled
                  </h2>

                  <p style={{
                    fontSize: '0.95rem',
                    color: '#7f1d1d',
                    margin: '0 auto',
                    maxWidth: '540px',
                    lineHeight: 1.55
                  }}>
                    Your breakfast order for <strong>{guestInfo.roomNumber} ({guestInfo.suiteName})</strong> was delivered and completed. For guest privacy and room security, this temporary guest link has now expired.
                  </p>
                </div>

                {/* Delivered Fulfillment Summary Card */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2ded5',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(23, 63, 52, 0.04)',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase' }}>
                      FULFILLED ORDER SUMMARY
                    </span>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '9999px'
                    }}>
                      ✓ Delivered
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: '0 0 14px', fontWeight: 700 }}>
                    {guestInfo.suiteLabel}
                  </h3>

                  <div style={{
                    backgroundColor: '#fafaf8',
                    border: '1px solid #eeece5',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                      <strong>Delivered to:</strong> {guestInfo.guestName} ({guestInfo.roomNumber})
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                      <strong>Completed at:</strong> 6:32 AM · {guestInfo.date}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                      <strong>Total plates served:</strong> {plates.length} of {guestInfo.maxPlates}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '0.84rem',
                    color: '#64748b',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: '#1e293b', display: 'block', marginBottom: '2px' }}>
                      Security Notice:
                    </strong>
                    This temporary link was strictly limited to Room 218 breakfast ordering. No member account information, rewards points, payment methods, or other room reservations were shared or accessible.
                  </div>
                </div>

                {/* Need assistance button */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a
                    href="tel:8702168084"
                    style={{
                      flex: 1,
                      backgroundColor: '#173f34',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      display: 'inline-block'
                    }}
                  >
                    Call The Gourmet Kitchen (870-216-8084)
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForTesting}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      color: '#17271f',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reset Demo
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
