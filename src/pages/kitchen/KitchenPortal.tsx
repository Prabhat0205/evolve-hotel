import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KitchenOrderRecord,
  KitchenOrderStatus,
  KitchenTab,
  BuffetMenuItem,
  KitchenStaffUser,
  PlateDetail,
} from './kitchenTypes';
import {
  kitchenDefaultStaff,
  kitchenStaffTeam,
  initialKitchenOrders,
  initialBuffetMenu,
} from './kitchenData';
import './kitchen.css';
import {
  ChefHat, Clock, AlertTriangle, CheckCircle, CheckCircle2,
  Flame, Coffee, Utensils, Search, Volume2, VolumeX,
  Printer, ArrowLeft, LogOut, Check, X, ShieldAlert,
  SlidersHorizontal, Sparkles, Send, Eye, ShieldCheck,
  Menu, LayoutGrid, Columns, Table as TableIcon, Mail, Lock,
  KeyRound, HelpCircle, ArrowRight, ChevronDown, Plus, Edit2, Trash2
} from 'lucide-react';

export const KitchenPortal: React.FC = () => {
  const { navigateTo, addToast, activeBreakfastOrder } = useApp();

  // -------------------------------------------------------------------------
  // 1. AUTHENTICATION & MULTI-STEP 2FA STATE
  // -------------------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<KitchenStaffUser | null>(() => {
    try {
      const saved = localStorage.getItem('evolve_kitchen_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authStage, setAuthStage] = useState<'landing' | 'credentials' | '2fa'>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('prabhat.appzoro@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('123456');
  const [authError, setAuthError] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // -------------------------------------------------------------------------
  // 2. KITCHEN ORDERS & BUFFET MENU STATE
  // -------------------------------------------------------------------------
  const [orders, setOrders] = useState<KitchenOrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('evolve_kitchen_orders_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialKitchenOrders;
  });

  const [buffetMenu, setBuffetMenu] = useState<BuffetMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('evolve_buffet_menu_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialBuffetMenu;
  });

  useEffect(() => {
    try {
      localStorage.setItem('evolve_kitchen_orders_v3', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('evolve_buffet_menu_v1', JSON.stringify(buffetMenu));
    } catch {}
  }, [buffetMenu]);

  // Selected Order for the Right Details Panel (Defaults to Room 108)
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    return orders[0]?.id || 'kord-108';
  });

  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || orders[0] || null;
  }, [orders, selectedOrderId]);

  // UI Navigation & Filters
  const [activeTab, setActiveTab] = useState<KitchenTab>('upcoming');
  const [activePillFilter, setActivePillFilter] = useState<'upcoming' | 'preparing' | 'ready' | 'picked_up' | 'all_orders' | 'order_history'>('upcoming');
  const [searchRoomQuery, setSearchRoomQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('Today');

  // Modal States
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [showAddBuffetModal, setShowAddBuffetModal] = useState<boolean>(false);

  // New Buffet Item Form
  const [newBuffetCategory, setNewBuffetCategory] = useState<BuffetMenuItem['category']>('Eggs & Omelettes');
  const [newBuffetName, setNewBuffetName] = useState<string>('');
  const [newBuffetDesc, setNewBuffetDesc] = useState<string>('');
  const [newBuffetOptions, setNewBuffetOptions] = useState<string>('');

  // Edit Order Form State
  const [editSpecialReq, setEditSpecialReq] = useState<string>('');
  const [editPlateItems, setEditPlateItems] = useState<string[]>([]);

  useEffect(() => {
    if (selectedOrder) {
      setEditSpecialReq(selectedOrder.plates[0]?.specialRequest || '');
      setEditPlateItems(selectedOrder.plates[0]?.items || []);
    }
  }, [selectedOrder]);

  // -------------------------------------------------------------------------
  // 3. STATS COMPUTATION (MATCHING SCREENSHOT NUMBERS EXACTLY)
  // -------------------------------------------------------------------------
  const stats = useMemo(() => {
    const upcomingList = orders.filter((o) => o.status === 'NOT_STARTED');
    const preparingList = orders.filter((o) => o.status === 'PREPARING');
    const readyList = orders.filter((o) => o.status === 'READY');
    const pickedUpList = orders.filter((o) => o.status === 'PICKED_UP');

    const upcomingPlates = upcomingList.reduce((acc, o) => acc + o.platesCount, 0);
    const preparingPlates = preparingList.reduce((acc, o) => acc + o.platesCount, 0);
    const readyPlates = readyList.reduce((acc, o) => acc + o.platesCount, 0);
    const pickedUpPlates = pickedUpList.reduce((acc, o) => acc + o.platesCount, 0);
    const allPlates = orders.reduce((acc, o) => acc + o.platesCount, 0);

    return {
      upcomingCount: upcomingList.length,
      upcomingPlates,
      preparingCount: preparingList.length,
      preparingPlates,
      readyCount: readyList.length,
      readyPlates,
      pickedUpCount: pickedUpList.length,
      pickedUpPlates,
      allCount: orders.length,
      allPlates,
    };
  }, [orders]);

  // Filtered orders list based on pill filter and search
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Pill filter
      if (activePillFilter === 'upcoming' && ord.status !== 'NOT_STARTED') return false;
      if (activePillFilter === 'preparing' && ord.status !== 'PREPARING') return false;
      if (activePillFilter === 'ready' && ord.status !== 'READY') return false;
      if (activePillFilter === 'picked_up' && ord.status !== 'PICKED_UP') return false;
      if (activePillFilter === 'order_history' && ord.status !== 'PICKED_UP') return false;

      // Room Search query
      if (searchRoomQuery.trim()) {
        const q = searchRoomQuery.toLowerCase();
        const matchesRoom = ord.roomNumber.toLowerCase().includes(q);
        const matchesGuest = ord.guestName.toLowerCase().includes(q);
        if (!matchesRoom && !matchesGuest) return false;
      }

      return true;
    });
  }, [orders, activePillFilter, searchRoomQuery]);

  // -------------------------------------------------------------------------
  // 4. ACTION HANDLERS
  // -------------------------------------------------------------------------
  const handleUpdateOrderStatus = (orderId: string, newStatus: KitchenOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      addToast(
        'success',
        'Status Updated',
        `${target.roomNumber} (${target.ticketId}) marked ${newStatus.replace('_', ' ')}.`
      );
    }
  };

  const handleSaveOrderEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== selectedOrder.id) return o;
        const updatedPlates: PlateDetail[] = o.plates.map((p, idx) => {
          if (idx === 0) {
            return {
              ...p,
              items: editPlateItems,
              specialRequest: editSpecialReq,
            };
          }
          return p;
        });
        return {
          ...o,
          plates: updatedPlates,
        };
      })
    );

    setShowEditOrderModal(false);
    addToast('success', 'Breakfast Order Updated', `Changes saved for ${selectedOrder.roomNumber}.`);
  };

  const handleAddBuffetMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuffetName.trim()) {
      addToast('warning', 'Missing Name', 'Please provide a dish name.');
      return;
    }

    const newItem: BuffetMenuItem = {
      id: `bf-m-${Date.now()}`,
      category: newBuffetCategory,
      name: newBuffetName.trim(),
      description: newBuffetDesc.trim() || 'Prepared fresh daily for guest breakfast buffet.',
      options: newBuffetOptions
        ? newBuffetOptions.split(',').map((s) => s.trim())
        : undefined,
      isAvailable: true,
    };

    setBuffetMenu((prev) => [newItem, ...prev]);
    setNewBuffetName('');
    setNewBuffetDesc('');
    setNewBuffetOptions('');
    setShowAddBuffetModal(false);
    addToast('success', 'Buffet Dish Added', `${newItem.name} added to the fixed breakfast buffet.`);
  };

  const toggleBuffetItemAvailability = (id: string, name: string) => {
    setBuffetMenu((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    const item = buffetMenu.find((i) => i.id === id);
    const nextState = !item?.isAvailable;
    addToast(
      nextState ? 'success' : 'warning',
      nextState ? `${name} Restocked` : `${name} Marked 86'd`,
      nextState ? `${name} is now available on buffet.` : `${name} marked sold out.`
    );
  };

  const deleteBuffetMenuItem = (id: string, name: string) => {
    setBuffetMenu((prev) => prev.filter((i) => i.id !== id));
    addToast('info', 'Dish Removed', `${name} removed from buffet menu.`);
  };

  // Auth Submit Handlers
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (
      (loginEmail.trim().toLowerCase() === 'prabhat.appzoro@gmail.com' && loginPassword === '123456') ||
      loginPassword === '123456'
    ) {
      setAuthStage('2fa');
      addToast('info', '2FA Passcode Dispatched', `A 6-digit code (123456) was dispatched to ${loginEmail}.`);
    } else {
      setAuthError('Invalid credentials. Use prabhat.appzoro@gmail.com and password: 123456');
    }
  };

  const handleVerify2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const fullCode = otpDigits.join('');
    if (fullCode === '123456' || fullCode.length === 6) {
      const matched = kitchenStaffTeam.find(
        (s) => s.email.toLowerCase() === loginEmail.trim().toLowerCase()
      ) || {
        ...kitchenDefaultStaff,
        email: loginEmail.trim(),
      };
      setCurrentUser(matched);
      localStorage.setItem('evolve_kitchen_auth_user', JSON.stringify(matched));
      setAuthStage('landing');
      addToast('success', 'Staff Signed In', `Welcome Chef ${matched.name} to Evolve Kitchen.`);
    } else {
      setAuthError('Invalid 2FA code. Please use demo code: 123456');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('evolve_kitchen_auth_user');
    setAuthStage('landing');
    setIsMobileMenuOpen(false);
    setIsMobileDetailsOpen(false);
    addToast('info', 'Signed Out', 'Signed out from Kitchen Staff Terminal.');
  };

  // -------------------------------------------------------------------------
  // 5. RENDER: LANDING / AUTHENTICATION PAGE
  // -------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="kitchen-landing-screen">
        <header className="kitchen-landing-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.02em', color: '#17271f' }}>
              EVOLVE
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#fdf6e9', color: '#997125', padding: '3px 8px', borderRadius: '4px', border: '1px solid #fae2b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              KITCHEN PARTNER
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('landing')}
            style={{ background: 'none', border: 'none', color: '#55665e', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={15} />
            <span>Customer Site</span>
          </button>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
          {/* Luxury Evolve Culinary Partner Seal */}
          <div className="kitchen-landing-seal-wrapper">
            <div className="kitchen-landing-seal">
              <ChefHat size={38} color="#dda943" strokeWidth={1.8} />
              <div className="kitchen-seal-stars">★★★★★</div>
            </div>
          </div>

          <h2 className="kitchen-landing-title">
            Evolve Restaurant Partner
          </h2>
          <p className="kitchen-landing-sub">
            Breakfast order dispatch and real-time kitchen display system for suites & guest rooms.
          </p>

          <button
            type="button"
            className="kitchen-landing-login-btn"
            onClick={() => {
              setAuthError('');
              setAuthStage('credentials');
            }}
          >
            <Lock size={16} color="#dda943" />
            <span>Staff Login to Kitchen KDS</span>
          </button>

          <div className="kitchen-landing-notice">
            Authorized Culinary Staff Only • Secure 2FA Access
          </div>
        </main>

        {/* Credentials & 2FA Modal */}
        {authStage === 'credentials' && (
          <div className="kitchen-modal-backdrop">
            <div className="kitchen-modal-box" style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#17271f' }}>
                  Kitchen Staff Sign In
                </h3>
                <button type="button" onClick={() => setAuthStage('landing')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              {authError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px' }}>
                  {authError}
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>Staff Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#17271f' }}>Password</label>
                    <span style={{ fontSize: '0.75rem', color: '#b3832c', fontWeight: 700 }}>Pass: 123456</span>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#17271f', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Continue to 2FA Code ➔
                </button>
              </form>
            </div>
          </div>
        )}

        {authStage === '2fa' && (
          <div className="kitchen-modal-backdrop">
            <div className="kitchen-modal-box" style={{ maxWidth: '420px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.80rem', color: '#997125', fontWeight: 800, textTransform: 'uppercase' }}>Two-Factor Security</span>
                <button type="button" onClick={() => setAuthStage('landing')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 800, color: '#17271f' }}>
                Enter 6-Digit Email Code
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748b' }}>
                Passcode dispatched to <strong>{loginEmail}</strong>
              </p>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '16px' }}>
                <strong>Demo Passcode: 123456</strong>
              </div>

              <form onSubmit={handleVerify2FASubmit}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '18px' }}>
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputRefs.current[i] = el; }}
                      type="text"
                      maxLength={1}
                      value={d}
                      onChange={(e) => {
                        const newD = [...otpDigits];
                        newD[i] = e.target.value.slice(-1);
                        setOtpDigits(newD);
                        if (e.target.value && i < 5) otpInputRefs.current[i + 1]?.focus();
                      }}
                      style={{ width: '42px', height: '48px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, borderRadius: '6px', border: '1.5px solid #cbd5e1' }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#17271f', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Verify & Enter Kitchen KDS
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 6. RENDER: MAIN APP — EXACT REPLICA OF THE SCREENSHOT
  // -------------------------------------------------------------------------
  return (
    <div className="kitchen-screen-wrapper">
      {/* ===================================================================
          MOBILE & TABLET TOPBAR (Visible only below 1024px)
      =================================================================== */}
      <header className="kitchen-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="kitchen-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open kitchen navigation"
          >
            <Menu size={22} />
          </button>
          <div className="kitchen-mobile-brand">
            <span className="kitchen-mobile-brand-name">EVOLVE</span>
            <span className="kitchen-mobile-brand-dot">·</span>
            <span className="kitchen-mobile-brand-sub">KITCHEN</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="kitchen-mobile-active-badge">
            {stats.upcomingCount + stats.preparingCount} Active
          </span>
        </div>
      </header>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="kitchen-sidebar-backdrop"
          style={{ display: 'block' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ===================================================================
          PANEL 1: LEFT DEEP FOREST SIDEBAR (EXACTLY LIKE SCREENSHOT)
      =================================================================== */}
      <aside className={`kitchen-sidebar-panel ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* Mobile Close Button (Visible below 1024px) */}
          <div className="kitchen-sidebar-mobile-close">
            <button
              type="button"
              className="kitchen-sidebar-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="kitchen-sidebar-brand">
            <span className="kitchen-sidebar-brand-name">EVOLVE ·</span>
            <span className="kitchen-sidebar-brand-sub">KITCHEN</span>
          </div>

          {/* Navigation Items */}
          <nav className="kitchen-sidebar-nav">
            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('upcoming');
                setActivePillFilter('upcoming');
                setIsMobileMenuOpen(false);
              }}
            >
              <span>Upcoming</span>
              <span className="kitchen-sidebar-item-badge">{stats.upcomingCount}</span>
            </button>

            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'preparing' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('preparing');
                setActivePillFilter('preparing');
                setIsMobileMenuOpen(false);
              }}
            >
              <span>Preparing</span>
              <span className="kitchen-sidebar-item-badge">{stats.preparingCount}</span>
            </button>

            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'ready' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('ready');
                setActivePillFilter('ready');
                setIsMobileMenuOpen(false);
              }}
            >
              <span>Ready</span>
              <span className="kitchen-sidebar-item-badge">{stats.readyCount}</span>
            </button>

            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'picked_up' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('picked_up');
                setActivePillFilter('picked_up');
                setIsMobileMenuOpen(false);
              }}
            >
              <span>Picked Up</span>
              <span className="kitchen-sidebar-item-badge">{stats.pickedUpCount}</span>
            </button>

            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'all_orders' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('all_orders');
                setActivePillFilter('all_orders');
                setIsMobileMenuOpen(false);
              }}
            >
              <span>All Orders</span>
              <span className="kitchen-sidebar-item-badge">{stats.allCount}</span>
            </button>

            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'order_history' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('order_history');
                setActivePillFilter('order_history');
                setIsMobileMenuOpen(false);
              }}
            >
              <span>Order History</span>
            </button>

            {/* Dedicated Buffet Menu Management Tab (Requested by User!) */}
            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'buffet_menu' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('buffet_menu');
                setIsMobileMenuOpen(false);
              }}
              style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={15} color="#dda943" />
                <span style={{ color: '#dda943' }}>Buffet Menu</span>
              </div>
            </button>

            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('reports');
                setIsMobileMenuOpen(false);
                addToast('info', 'Kitchen Reports', 'Shift report: 15 breakfast plates served today.');
              }}
            >
              <span>Reports</span>
            </button>

            <button
              type="button"
              className={`kitchen-sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('settings');
                setIsMobileMenuOpen(false);
                addToast('info', 'Settings', 'Kitchen station configuration active.');
              }}
            >
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Staff Name & Sign Out */}
        <div className="kitchen-sidebar-bottom">
          <div className="kitchen-sidebar-user">
            {currentUser.name} • {currentUser.roleTitle}
          </div>
          <button
            type="button"
            className="kitchen-sidebar-item"
            onClick={handleLogout}
            style={{ color: '#f87171' }}
          >
            <span>Sign Out</span>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* ===================================================================
          PANEL 2: CENTER BREAKFAST QUEUE STREAM OR BUFFET MENU
      =================================================================== */}
      {activeTab === 'buffet_menu' ? (
        /* BUFFET MENU MANAGEMENT VIEW */
        <div className="kitchen-buffet-panel">
          <div className="kitchen-buffet-header">
            <div>
              <h2 className="kitchen-buffet-title">Breakfast Buffet Menu</h2>
              <p style={{ margin: '4px 0 0 0', color: '#55665e', fontSize: '0.90rem' }}>
                Fixed buffet items available for room & suite guest orders. Kitchen staff can add or toggle dishes here.
              </p>
            </div>
            <button
              type="button"
              className="kitchen-btn-add-buffet"
              onClick={() => setShowAddBuffetModal(true)}
            >
              <Plus size={16} />
              <span>+ Add Buffet Item</span>
            </button>
          </div>

          <div className="kitchen-buffet-grid">
            {buffetMenu.map((item) => (
              <div key={item.id} className="kitchen-buffet-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: item.isAvailable ? '#dcfce7' : '#fee2e2',
                      color: item.isAvailable ? '#15803d' : '#991b1b',
                    }}>
                      {item.isAvailable ? 'AVAILABLE' : '86 / SOLD OUT'}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: '#17271f' }}>
                    {item.name}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#55665e', lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                  {item.options && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      <strong>Options: </strong>{item.options.join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #edf2f7', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => toggleBuffetItemAvailability(item.id, item.name)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: item.isAvailable ? '#17271f' : '#16a34a',
                      color: '#ffffff',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {item.isAvailable ? "Mark 86'd (Sold Out)" : 'Mark Available'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBuffetMenuItem(item.id, item.name)}
                    title="Remove item"
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STANDARD BREAKFAST QUEUE STREAM (MATCHING SCREENSHOT) */
        <main className="kitchen-center-panel">
          {/* Header Row */}
          <div className="kitchen-queue-header">
            <div>
              <h1 className="kitchen-queue-title">Breakfast Kitchen</h1>
              <p className="kitchen-queue-subtitle">Today · Live kitchen queue</p>
            </div>

            <div className="kitchen-queue-actions">
              <button type="button" className="kitchen-dropdown-btn">
                <span>{dateFilter}</span>
                <ChevronDown size={14} />
              </button>

              <input
                type="text"
                placeholder="Search room"
                className="kitchen-search-room-input"
                value={searchRoomQuery}
                onChange={(e) => setSearchRoomQuery(e.target.value)}
              />

              <button
                type="button"
                className="kitchen-action-outline-btn"
                onClick={() => addToast('info', 'Print Tickets', 'Printing all active kitchen order tickets.')}
              >
                <span>Print Order Tickets</span>
              </button>

              <button
                type="button"
                className="kitchen-action-outline-btn"
                onClick={() => addToast('info', 'Prep Summary', 'Morning breakfast prep summary dispatched to printer.')}
              >
                <span>Print Prep Summary</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards (Row of 5 Cards Matching Screenshot) */}
          <div className="kitchen-summary-cards-row">
            <div
              className={`kitchen-summary-card ${activePillFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActivePillFilter('upcoming')}
            >
              <span className="kitchen-summary-label">Upcoming</span>
              <span className="kitchen-summary-number">{stats.upcomingCount}</span>
              <span className="kitchen-summary-plates">orders · {stats.upcomingPlates} plates</span>
            </div>

            <div
              className={`kitchen-summary-card ${activePillFilter === 'preparing' ? 'active' : ''}`}
              onClick={() => setActivePillFilter('preparing')}
            >
              <span className="kitchen-summary-label">Preparing</span>
              <span className="kitchen-summary-number">{stats.preparingCount}</span>
              <span className="kitchen-summary-plates">orders · {stats.preparingPlates} plates</span>
            </div>

            <div
              className={`kitchen-summary-card ${activePillFilter === 'ready' ? 'active' : ''}`}
              onClick={() => setActivePillFilter('ready')}
            >
              <span className="kitchen-summary-label">Ready</span>
              <span className="kitchen-summary-number">{stats.readyCount}</span>
              <span className="kitchen-summary-plates">orders · {stats.readyPlates} plates</span>
            </div>

            <div
              className={`kitchen-summary-card ${activePillFilter === 'picked_up' ? 'active' : ''}`}
              onClick={() => setActivePillFilter('picked_up')}
            >
              <span className="kitchen-summary-label">Picked Up</span>
              <span className="kitchen-summary-number">{stats.pickedUpCount}</span>
              <span className="kitchen-summary-plates">order · {stats.pickedUpPlates} plates</span>
            </div>

            <div
              className={`kitchen-summary-card ${activePillFilter === 'all_orders' ? 'active' : ''}`}
              onClick={() => setActivePillFilter('all_orders')}
            >
              <span className="kitchen-summary-label">All Orders</span>
              <span className="kitchen-summary-number">{stats.allCount}</span>
              <span className="kitchen-summary-plates">orders · {stats.allPlates} plates</span>
            </div>
          </div>

          {/* Filter Pills Row */}
          <div className="kitchen-filter-pills-row">
            {(
              [
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'preparing', label: 'Preparing' },
                { id: 'ready', label: 'Ready' },
                { id: 'picked_up', label: 'Picked Up' },
                { id: 'all_orders', label: 'All Orders' },
                { id: 'order_history', label: 'Order History' },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`kitchen-filter-pill ${activePillFilter === pill.id ? 'active' : ''}`}
                onClick={() => setActivePillFilter(pill.id)}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Section Heading */}
          <div className="kitchen-section-heading">
            {activePillFilter === 'upcoming'
              ? 'Upcoming — by pickup time'
              : activePillFilter === 'preparing'
              ? 'Preparing — by pickup time'
              : activePillFilter === 'ready'
              ? 'Ready for pickup'
              : activePillFilter === 'picked_up'
              ? 'Picked up orders'
              : 'All breakfast orders'}
          </div>

          {/* Orders Stream List */}
          <div className="kitchen-orders-list">
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '10px', color: '#64748b' }}>
                No breakfast orders found for this filter.
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isSelected = selectedOrderId === ord.id;
                const isNotStarted = ord.status === 'NOT_STARTED';

                return (
                  <div
                    key={ord.id}
                    className={`kitchen-order-row-card ${isNotStarted ? 'has-stripe' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedOrderId(ord.id);
                      setIsMobileDetailsOpen(true);
                    }}
                  >
                    <div className="kitchen-order-row-left">
                      <div className="kitchen-order-time">{ord.pickupTime}</div>
                      <div className="kitchen-order-room-info">
                        <h4 className="kitchen-order-room-title">{ord.roomNumber}</h4>
                        <span className="kitchen-order-guest-plates">
                          {ord.guestName} · {ord.platesCount} {ord.platesCount === 1 ? 'plate' : 'plates'}
                        </span>
                      </div>
                    </div>

                    <div>
                      {ord.status === 'NOT_STARTED' && (
                        <div className="kitchen-status-pill-notstarted">
                          <div>Not</div>
                          <div>Started</div>
                        </div>
                      )}
                      {ord.status === 'PREPARING' && (
                        <div className="kitchen-status-pill-preparing">Preparing</div>
                      )}
                      {ord.status === 'READY' && (
                        <div className="kitchen-status-pill-ready">Ready</div>
                      )}
                      {ord.status === 'PICKED_UP' && (
                        <div className="kitchen-status-pill-pickedup">Picked Up</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      )}

      {/* Mobile Details Drawer Backdrop */}
      {isMobileDetailsOpen && (
        <div
          className="kitchen-details-backdrop"
          style={{ display: 'block' }}
          onClick={() => setIsMobileDetailsOpen(false)}
        />
      )}

      {/* ===================================================================
          PANEL 3: RIGHT ORDER DETAILS & ACTION PANEL (EXACTLY LIKE SCREENSHOT)
      =================================================================== */}
      {selectedOrder && activeTab !== 'buffet_menu' && (
        <aside className={`kitchen-details-panel ${isMobileDetailsOpen ? 'mobile-open' : ''}`}>
          <div>
            {/* Mobile Drawer Header with Back to Queue & Close */}
            <div className="kitchen-details-mobile-header">
              <button
                type="button"
                className="kitchen-btn-back-queue"
                onClick={() => setIsMobileDetailsOpen(false)}
              >
                <ArrowLeft size={14} />
                <span>Back to Queue</span>
              </button>
              <button
                type="button"
                className="kitchen-details-close-btn"
                onClick={() => setIsMobileDetailsOpen(false)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Header info */}
            <span className="kitchen-details-ticket-id">{selectedOrder.ticketId}</span>
            <h2 className="kitchen-details-room-heading">{selectedOrder.roomNumber}</h2>
            <p className="kitchen-details-guest-meta">
              {selectedOrder.guestName} · Pickup {selectedOrder.pickupTime} · {selectedOrder.platesCount} {selectedOrder.platesCount === 1 ? 'plate' : 'plates'}
            </p>

            {/* Plates breakdown */}
            {selectedOrder.plates.map((plate) => (
              <div key={plate.id} className="kitchen-plate-block">
                <h3 className="kitchen-plate-title">Plate {plate.plateNumber}</h3>
                <ul className="kitchen-plate-items-list">
                  {plate.items.map((item, idx) => (
                    <li key={idx} className="kitchen-plate-item-bullet">
                      <span>{item}</span>
                    </li>
                  ))}
                  {plate.specialRequest && (
                    <li className="kitchen-plate-special-req">
                      <span><strong>Special request:</strong> {plate.specialRequest}</span>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div>
            {/* 2x2 Segmented Status Buttons Grid (Matching Screenshot) */}
            <div className="kitchen-status-btn-grid">
              <button
                type="button"
                className={`kitchen-status-btn ${selectedOrder.status === 'NOT_STARTED' ? 'active' : ''}`}
                onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'NOT_STARTED')}
              >
                Not Started
              </button>

              <button
                type="button"
                className={`kitchen-status-btn ${selectedOrder.status === 'PREPARING' ? 'active' : ''}`}
                onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'PREPARING')}
              >
                Preparing
              </button>

              <button
                type="button"
                className={`kitchen-status-btn ${selectedOrder.status === 'READY' ? 'active' : ''}`}
                onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'READY')}
              >
                Ready
              </button>

              <button
                type="button"
                className={`kitchen-status-btn ${selectedOrder.status === 'PICKED_UP' ? 'active' : ''}`}
                onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'PICKED_UP')}
              >
                Picked Up
              </button>
            </div>

            {/* Edit Breakfast Order Button */}
            <button
              type="button"
              className="kitchen-edit-order-btn"
              onClick={() => setShowEditOrderModal(true)}
            >
              Edit Breakfast Order
            </button>

            {/* Print Order Ticket Button */}
            <button
              type="button"
              className="kitchen-print-ticket-btn"
              onClick={() => addToast('info', 'Print Ticket', `Printing KOT ticket ${selectedOrder.ticketId} for ${selectedOrder.roomNumber}.`)}
            >
              Print this order ticket
            </button>
          </div>
        </aside>
      )}

      {/* ===================================================================
          MODAL: EDIT BREAKFAST ORDER
      =================================================================== */}
      {showEditOrderModal && selectedOrder && (
        <div className="kitchen-modal-backdrop">
          <div className="kitchen-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125' }}>{selectedOrder.ticketId}</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#17271f' }}>
                  Edit Order for {selectedOrder.roomNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditOrderModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdits}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>
                  Plate 1 Buffet Dishes (Select or edit items)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {editPlateItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...editPlateItems];
                          updated[idx] = e.target.value;
                          setEditPlateItems(updated);
                        }}
                        style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditPlateItems(editPlateItems.filter((_, i) => i !== idx))}
                        style={{ padding: '0 10px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditPlateItems([...editPlateItems, 'New buffet dish'])}
                    style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px dashed #94a3b8', color: '#17271f', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Dish to Plate 1
                  </button>
                </div>
              </div>

              {/* Quick insert from buffet menu */}
              <div style={{ marginBottom: '18px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  Quick add from Fixed Buffet Menu:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {buffetMenu.slice(0, 6).map((dish) => (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => setEditPlateItems([...editPlateItems, dish.name])}
                      style={{ padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid #cbd5e1', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      + {dish.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                  Special Request Note
                </label>
                <input
                  type="text"
                  value={editSpecialReq}
                  onChange={(e) => setEditSpecialReq(e.target.value)}
                  placeholder="e.g. Gluten-free toast, well done bacon"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditOrderModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 18px', borderRadius: '6px', background: '#17271f', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Breakfast Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD NEW BUFFET MENU DISH
      =================================================================== */}
      {showAddBuffetModal && (
        <div className="kitchen-modal-backdrop">
          <div className="kitchen-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125' }}>FIXED BUFFET MENU</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#17271f' }}>
                  Add Breakfast Buffet Dish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBuffetModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBuffetMenuItem}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                  Dish Category
                </label>
                <select
                  value={newBuffetCategory}
                  onChange={(e) => setNewBuffetCategory(e.target.value as BuffetMenuItem['category'])}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                >
                  <option value="Eggs & Omelettes">Eggs & Omelettes</option>
                  <option value="Meats & Proteins">Meats & Proteins</option>
                  <option value="Breads & Toast">Breads & Toast</option>
                  <option value="Sides & Toppings">Sides & Toppings</option>
                  <option value="Beverages & Juices">Beverages & Juices</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                  Dish Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Truffled Farm Eggs Florentine"
                  value={newBuffetName}
                  onChange={(e) => setNewBuffetName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Poached eggs with fresh baby spinach on sourdough toast"
                  value={newBuffetDesc}
                  onChange={(e) => setNewBuffetDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                  Preparation Options (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Over Easy, Sunny Side Up, Scrambled, Poached"
                  value={newBuffetOptions}
                  onChange={(e) => setNewBuffetOptions(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddBuffetModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 18px', borderRadius: '6px', background: '#17271f', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Add Dish to Buffet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenPortal;
