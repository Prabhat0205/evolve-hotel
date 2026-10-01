import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { mockBreakfastMenu } from '../../data/mockBreakfast';
import {
  KitchenOrderRecord,
  KitchenOrderStatus,
  KitchenStation,
  KitchenStaffUser,
  KitchenTab,
  KitchenShiftStats,
} from './kitchenTypes';
import {
  kitchenDefaultStaff,
  kitchenStaffTeam,
  initialKitchenOrders,
} from './kitchenData';
import './kitchen.css';
import {
  ChefHat, Clock, AlertTriangle, CheckCircle, CheckCircle2,
  Flame, Coffee, Utensils, Search, Filter, Volume2, VolumeX,
  Printer, ArrowLeft, LogOut, Check, RefreshCw, X, ShieldAlert,
  SlidersHorizontal, Sparkles, Send, Eye, ShieldCheck, CheckSquare,
  Square, Menu, LayoutGrid, Columns, Table as TableIcon, Mail, Lock
} from 'lucide-react';

export const KitchenPortal: React.FC = () => {
  const { navigateTo, addToast, activeBreakfastOrder } = useApp();

  // -------------------------------------------------------------------------
  // 1. AUTHENTICATION STATE
  // -------------------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<KitchenStaffUser | null>(() => {
    try {
      const saved = localStorage.getItem('evolve_kitchen_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginEmail, setLoginEmail] = useState<string>('prabhat.appzoro@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('123456');
  const [loginError, setLoginError] = useState<string>('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (
      (loginEmail.trim().toLowerCase() === 'prabhat.appzoro@gmail.com' && loginPassword === '123456') ||
      loginPassword === '123456'
    ) {
      const matched = kitchenStaffTeam.find(
        (s) => s.email.toLowerCase() === loginEmail.trim().toLowerCase()
      ) || {
        ...kitchenDefaultStaff,
        email: loginEmail.trim(),
      };

      setCurrentUser(matched);
      localStorage.setItem('evolve_kitchen_auth_user', JSON.stringify(matched));
      addToast('success', 'Staff Signed In', `Welcome Chef ${matched.name} to Evolve Kitchen.`);
    } else {
      setLoginError('Invalid credentials. Use prabhat.appzoro@gmail.com and password: 123456');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('evolve_kitchen_auth_user');
    addToast('info', 'Logged Out', 'Signed out from Kitchen Staff Terminal.');
  };

  // -------------------------------------------------------------------------
  // 2. ORDERS & SYSTEM DATA
  // -------------------------------------------------------------------------
  const [orders, setOrders] = useState<KitchenOrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('evolve_kitchen_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialKitchenOrders;
  });

  // Sync active guest order if placed in guest portal
  useEffect(() => {
    if (activeBreakfastOrder) {
      setOrders((prev) => {
        const exists = prev.some((o) => o.orderNumber === activeBreakfastOrder.orderNumber);
        if (exists) return prev;

        const newGuestOrder: KitchenOrderRecord = {
          id: `kord-live-${activeBreakfastOrder.id}`,
          orderNumber: activeBreakfastOrder.orderNumber,
          roomNumber: activeBreakfastOrder.roomNumber,
          guestName: activeBreakfastOrder.guestName,
          guestTier: 'Prestige',
          deliverySlot: activeBreakfastOrder.deliverySlot,
          orderPlacedAt: activeBreakfastOrder.orderTime,
          estimatedDeliveryTime: activeBreakfastOrder.estimatedDeliveryTime,
          status: (activeBreakfastOrder.status as KitchenOrderStatus) || 'RECEIVED',
          items: activeBreakfastOrder.items.map((i, idx) => ({
            id: `kitem-live-${idx}`,
            item: i.item,
            quantity: i.quantity,
            specialInstructions: i.specialInstructions,
            station: i.item.category === 'BEVERAGES' ? 'BARISTA' : i.item.category === 'HOT_SPECIALS' ? 'HOT_LINE' : 'COLD_BAKERY',
            isPrepared: false,
          })),
          dietaryNotes: activeBreakfastOrder.dietaryNote ? [activeBreakfastOrder.dietaryNote] : [],
          allergies: [],
          specialInstructions: 'Live order placed by guest from suite app.',
          elapsedMinutes: 4,
          targetMinutes: 20,
          isUrgent: false,
        };

        return [newGuestOrder, ...prev];
      });
    }
  }, [activeBreakfastOrder]);

  useEffect(() => {
    try {
      localStorage.setItem('evolve_kitchen_orders_v2', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Live Digital Clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Audio Chime Synthesizer for Kitchen Notifications
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);
  const playKitchenChime = (type: 'ready' | 'alert') => {
    if (!audioAlertEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'ready') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(740, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {}
  };

  // UI Navigation, Views & Filtering
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<KitchenTab>('live_kds');
  const [viewMode, setViewMode] = useState<'kanban' | 'grid' | 'table'>('kanban');
  const [selectedStation, setSelectedStation] = useState<KitchenStation>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allergiesOnly, setAllergiesOnly] = useState<boolean>(false);

  // Selected Order for KOT Modal
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrderRecord | null>(null);

  // 86 / Sold Out Inventory State
  const [inventory86List, setInventory86List] = useState<Record<string, boolean>>({
    'bf-03': false,
    'bf-06': false,
  });

  const toggle86Item = (itemId: string, itemName: string) => {
    setInventory86List((prev) => {
      const updated = !prev[itemId];
      addToast(
        updated ? 'warning' : 'success',
        updated ? `Item 86'd: ${itemName}` : `Item Restocked: ${itemName}`,
        updated ? `${itemName} marked SOLD OUT for guests.` : `${itemName} is available again.`
      );
      return { ...prev, [itemId]: updated };
    });
  };

  // -------------------------------------------------------------------------
  // 3. ORDER ACTIONS (ONE-TAP PROGRESSION)
  // -------------------------------------------------------------------------
  const handleAdvanceOrderStatus = (orderId: string, nextStatus?: KitchenOrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        let target: KitchenOrderStatus = 'BEING_PREPARED';
        if (nextStatus) {
          target = nextStatus;
        } else if (ord.status === 'RECEIVED') {
          target = 'BEING_PREPARED';
        } else if (ord.status === 'BEING_PREPARED') {
          target = 'READY';
        } else if (ord.status === 'READY') {
          target = 'DELIVERED';
        }

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedOrd: KitchenOrderRecord = {
          ...ord,
          status: target,
          prepStartedAt: target === 'BEING_PREPARED' ? (ord.prepStartedAt || now) : ord.prepStartedAt,
          readyAt: target === 'READY' ? now : ord.readyAt,
        };

        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrd);
        }

        return updatedOrd;
      })
    );

    const targetOrd = orders.find((o) => o.id === orderId);
    if (targetOrd) {
      if (nextStatus === 'READY' || (!nextStatus && targetOrd.status === 'BEING_PREPARED')) {
        playKitchenChime('ready');
      }
      addToast(
        'success',
        'Order Status Advanced',
        `${targetOrd.roomNumber} (${targetOrd.orderNumber}) is now ${nextStatus || 'progressed'}.`
      );
    }
  };

  const toggleItemPrepared = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedItems = ord.items.map((it) =>
          it.id === itemId ? { ...it, isPrepared: !it.isPrepared } : it
        );
        const updatedOrd = { ...ord, items: updatedItems };
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrd);
        }
        return updatedOrd;
      })
    );
  };

  // Add a quick simulation ticket
  const handleAddSampleOrder = () => {
    const randomRoom = `Suite ${Math.floor(100 + Math.random() * 800)}`;
    const randomTicket = `BF-${Math.floor(7800 + Math.random() * 200)}`;
    const newOrder: KitchenOrderRecord = {
      id: `kord-sim-${Date.now()}`,
      orderNumber: randomTicket,
      roomNumber: randomRoom,
      guestName: 'Lady Catherine Windsor',
      guestTier: 'Prestige',
      tableOrRoomType: 'Heritage Balcony Suite',
      deliverySlot: '08:45 AM - 09:15 AM',
      orderPlacedAt: '08:20 AM',
      estimatedDeliveryTime: '08:55 AM',
      status: 'RECEIVED',
      items: [
        {
          id: `ki-sim-1-${Date.now()}`,
          item: mockBreakfastMenu[0],
          quantity: 2,
          specialInstructions: 'Poached medium-firm, caviar on side.',
          station: 'HOT_LINE',
          isPrepared: false,
        },
        {
          id: `ki-sim-2-${Date.now()}`,
          item: mockBreakfastMenu[5],
          quantity: 1,
          specialInstructions: 'Extra cold pressed ginger shot.',
          station: 'BARISTA',
          isPrepared: false,
        },
      ],
      dietaryNotes: ['Lactose-free'],
      allergies: ['Shellfish / Crustaceans'],
      specialInstructions: 'Guest requests white linen presentation tray.',
      elapsedMinutes: 2,
      targetMinutes: 20,
      isUrgent: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    playKitchenChime('alert');
    addToast('info', 'New Guest Ticket', `${randomRoom} placed breakfast order ${randomTicket}.`);
  };

  // -------------------------------------------------------------------------
  // 4. STATS & FILTERED DATA
  // -------------------------------------------------------------------------
  const shiftStats: KitchenShiftStats = useMemo(() => {
    const totalActive = orders.filter((o) => o.status !== 'DELIVERED').length;
    const pendingQueue = orders.filter((o) => o.status === 'RECEIVED').length;
    const cookingNow = orders.filter((o) => o.status === 'BEING_PREPARED').length;
    const readyForPickup = orders.filter((o) => o.status === 'READY').length;
    const deliveredToday = orders.filter((o) => o.status === 'DELIVERED').length;
    return {
      totalActive,
      pendingQueue,
      cookingNow,
      readyForPickup,
      deliveredToday,
      avgPrepMinutes: 15,
    };
  }, [orders]);

  const allergyAlertCount = useMemo(() => {
    return orders.filter(
      (o) => o.status !== 'DELIVERED' && o.allergies && o.allergies.length > 0
    ).length;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Tab matching
      if (activeTab === 'delivered_archive' && ord.status !== 'DELIVERED') return false;
      if (activeTab === 'live_kds' && ord.status === 'DELIVERED') return false;

      // Station filter
      if (selectedStation !== 'ALL') {
        const hasStationItem = ord.items.some((it) => it.station === selectedStation);
        if (!hasStationItem) return false;
      }

      // Allergies only
      if (allergiesOnly && (!ord.allergies || ord.allergies.length === 0)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRoom = ord.roomNumber.toLowerCase().includes(q);
        const matchesGuest = ord.guestName.toLowerCase().includes(q);
        const matchesTicket = ord.orderNumber.toLowerCase().includes(q);
        const matchesItem = ord.items.some((i) => i.item.name.toLowerCase().includes(q));
        if (!matchesRoom && !matchesGuest && !matchesTicket && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, activeTab, selectedStation, allergiesOnly, searchQuery]);

  // Kanban Columns Data
  const receivedOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'RECEIVED'),
    [filteredOrders]
  );
  const cookingOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'BEING_PREPARED'),
    [filteredOrders]
  );
  const readyOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'READY'),
    [filteredOrders]
  );

  // -------------------------------------------------------------------------
  // 5. RENDER: LOGIN SCREEN (SPLIT-SCREEN ADMIN LUXURY THEME)
  // -------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="kitchen-login-split-wrapper">
        {/* Left Side: Luxury Culinary Brand Banner */}
        <div
          className="kitchen-hero-side"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=85')`,
          }}
        >
          <div className="kitchen-hero-overlay" />

          <div className="kitchen-hero-content">
            {/* Header Brand Badge */}
            <div className="kitchen-brand-header">
              <div className="kitchen-brand-icon">
                <ChefHat size={26} color="#17271f" />
              </div>
              <div className="kitchen-brand-titles">
                <span className="kitchen-brand-name">EVOLVE</span>
                <span className="kitchen-brand-badge">Hotels & Resorts • Kitchen & Breakfast Suite</span>
              </div>
            </div>

            {/* Central Hero Headline */}
            <div className="kitchen-hero-body">
              <div className="kitchen-eyebrow-pill">
                <Sparkles size={14} color="#dda943" />
                <span>Next-Gen Kitchen Display & Expediting</span>
              </div>

              <h1 className="kitchen-hero-heading">
                Culinary Precision & Room Service Flow
              </h1>

              <p className="kitchen-hero-text">
                Manage morning breakfast prep rails, monitor dietary allergen alerts, route tickets to specific stations, and coordinate runner deliveries with zero confusion.
              </p>

              {/* Feature Pills */}
              <div className="kitchen-feature-grid">
                <div className="kitchen-feature-pill">
                  <div className="kitchen-feature-icon">
                    <Columns size={18} />
                  </div>
                  <span className="kitchen-feature-label">Live KDS Rail</span>
                </div>
                <div className="kitchen-feature-pill">
                  <div className="kitchen-feature-icon">
                    <AlertTriangle size={18} />
                  </div>
                  <span className="kitchen-feature-label">Allergy Sentinel</span>
                </div>
                <div className="kitchen-feature-pill">
                  <div className="kitchen-feature-icon">
                    <SlidersHorizontal size={18} />
                  </div>
                  <span className="kitchen-feature-label">86 Item Control</span>
                </div>
                <div className="kitchen-feature-pill">
                  <div className="kitchen-feature-icon">
                    <Coffee size={18} />
                  </div>
                  <span className="kitchen-feature-label">Station Routing</span>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div style={{ fontSize: '0.78rem', color: '#9bb1a8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#dda943" />
              <span>Dedicated Kitchen Terminal • Tablet & Touch-First Operations</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean White Login Card */}
        <div className="kitchen-login-side">
          <div className="kitchen-login-container">
            <div className="kitchen-form-header">
              <span className="kitchen-form-eyebrow">STAFF ACCESS</span>
              <h2 className="kitchen-form-title">Kitchen Terminal Sign In</h2>
              <p className="kitchen-form-desc">
                Sign in with your kitchen staff credentials to access live breakfast tickets and station controls.
              </p>
            </div>

            {loginError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="kitchen-form-group">
                <label className="kitchen-form-label">Staff Email Address</label>
                <div className="kitchen-input-wrapper">
                  <Mail size={18} className="kitchen-input-icon" />
                  <input
                    type="email"
                    className="kitchen-input"
                    placeholder="prabhat.appzoro@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="kitchen-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="kitchen-form-label" style={{ margin: 0 }}>Passcode / Password</label>
                  <span style={{ fontSize: '0.75rem', color: '#b3832c', fontWeight: 800 }}>Default: 123456</span>
                </div>
                <div className="kitchen-input-wrapper">
                  <Lock size={18} className="kitchen-input-icon" />
                  <input
                    type="password"
                    className="kitchen-input"
                    placeholder="••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="kitchen-submit-btn">
                <span>Sign In to Kitchen Terminal</span>
              </button>
            </form>

            {/* Quick One-Tap Staff Selector */}
            <div className="kitchen-demo-box">
              <div className="kitchen-demo-header">
                <span className="kitchen-demo-title">
                  <ChefHat size={14} color="#dda943" />
                  Quick One-Tap Shift Log In
                </span>
                <span className="kitchen-demo-badge">DEMO ACCESS</span>
              </div>
              <div className="kitchen-demo-grid">
                <button
                  type="button"
                  className="kitchen-demo-card"
                  onClick={() => {
                    setLoginEmail('prabhat.appzoro@gmail.com');
                    setLoginPassword('123456');
                  }}
                >
                  <div>
                    <span className="kitchen-demo-role-name">Chef Prabhat</span>
                    <span className="kitchen-demo-desc">Executive Kitchen Lead • All Stations</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#173f34' }}>Tap to Fill →</span>
                </button>
                <button
                  type="button"
                  className="kitchen-demo-card"
                  onClick={() => {
                    setLoginEmail('mateo.kitchen@evolvehotel.com');
                    setLoginPassword('123456');
                  }}
                >
                  <div>
                    <span className="kitchen-demo-role-name">Chef Mateo Vance</span>
                    <span className="kitchen-demo-desc">Hot Line Lead • Eggs & Griddles</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#173f34' }}>Tap to Fill →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 6. RENDER: MAIN KITCHEN APP (MATCHING ADMIN OPS SIDEBAR & WORKSPACE)
  // -------------------------------------------------------------------------
  return (
    <div className="kitchen-ops-layout">
      {/* ===================================================================
          LEFT DARK EMERALD SIDEBAR (IDENTICAL TO ADMIN SIDEBAR)
      =================================================================== */}
      <aside className={`kitchen-ops-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          {/* Operations Brand Title with Gold Eyebrow and Hamburger Menu Button */}
          {!isSidebarCollapsed ? (
            <div className="kitchen-ops-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="kitchen-ops-brand-eyebrow">EVOLVE HOTEL OPERATIONS</span>
                <h2 className="kitchen-ops-title">Kitchen KDS</h2>
              </div>
              <button
                type="button"
                className="kitchen-ops-toggle-btn"
                onClick={() => setIsSidebarCollapsed(true)}
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <Menu size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <button
                type="button"
                className="kitchen-ops-toggle-btn"
                onClick={() => setIsSidebarCollapsed(false)}
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <Menu size={18} />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="kitchen-ops-nav">
            <button
              type="button"
              className={`kitchen-ops-nav-item ${activeTab === 'live_kds' ? 'active' : ''}`}
              onClick={() => setActiveTab('live_kds')}
              title="Live KDS Board"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame size={18} />
                {!isSidebarCollapsed && <span>Live KDS Board</span>}
              </div>
              {!isSidebarCollapsed && <span className="kitchen-nav-badge">{shiftStats.totalActive}</span>}
            </button>

            <button
              type="button"
              className={`kitchen-ops-nav-item ${activeTab === 'orders_queue' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders_queue')}
              title="Orders Table View"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TableIcon size={18} />
                {!isSidebarCollapsed && <span>Orders Table</span>}
              </div>
            </button>

            <button
              type="button"
              className={`kitchen-ops-nav-item ${activeTab === 'inventory_86' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory_86')}
              title="86 Menu Stock Control"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SlidersHorizontal size={18} />
                {!isSidebarCollapsed && <span>86 Menu Stock</span>}
              </div>
            </button>

            <button
              type="button"
              className={`kitchen-ops-nav-item ${activeTab === 'delivered_archive' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivered_archive')}
              title="Delivered Orders Log"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} />
                {!isSidebarCollapsed && <span>Delivered Log</span>}
              </div>
              {!isSidebarCollapsed && <span style={{ fontSize: '0.72rem', color: '#9bb1a8' }}>{shiftStats.deliveredToday}</span>}
            </button>
          </nav>

          {/* Sidebar Station Filter Section */}
          {!isSidebarCollapsed && (
            <div className="kitchen-station-sidebar-box">
              <span className="kitchen-station-sidebar-title">Prep Station Filter</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(['ALL', 'HOT_LINE', 'COLD_BAKERY', 'BARISTA'] as KitchenStation[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`kitchen-station-item ${selectedStation === st ? 'active' : ''}`}
                    onClick={() => setSelectedStation(st)}
                  >
                    {st === 'ALL' ? (
                      <Utensils size={14} />
                    ) : st === 'HOT_LINE' ? (
                      <Flame size={14} />
                    ) : st === 'COLD_BAKERY' ? (
                      <ChefHat size={14} />
                    ) : (
                      <Coffee size={14} />
                    )}
                    <span>
                      {st === 'ALL'
                        ? 'All Stations'
                        : st === 'HOT_LINE'
                        ? 'Hot Kitchen Line'
                        : st === 'COLD_BAKERY'
                        ? 'Bakery & Pastry'
                        : 'Barista & Beverages'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Profile Card in Sidebar */}
        <div className="kitchen-ops-profile-card">
          <div className="kitchen-ops-profile-info">
            <div className="kitchen-ops-avatar" title={currentUser.name}>
              {currentUser.name.charAt(0)}
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div className="kitchen-ops-name">{currentUser.name}</div>
                <div className="kitchen-ops-role-badge">
                  {currentUser.roleTitle.toUpperCase()}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="kitchen-ops-logout-btn"
            onClick={handleLogout}
            title="Sign Out Kitchen Terminal"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ===================================================================
          MAIN WORKSPACE (MATCHING ADMIN OPS MAIN WORKSPACE)
      =================================================================== */}
      <main className="kitchen-ops-main">
        {/* Workspace Top Header */}
        <div className="kitchen-ops-header-row">
          <div>
            <span className="kitchen-ops-eyebrow">
              KITCHEN DISPLAY SYSTEM • MORNING SERVICE (06:30 - 11:30)
            </span>
            <h1 className="kitchen-ops-heading">
              Breakfast Orders & Kitchen Expediting
            </h1>
            <p className="kitchen-ops-subheading">
              Tap any ticket to start cooking, mark ready for delivery, or check critical dietary allergen flags.
            </p>
          </div>

          <div className="kitchen-header-actions">
            {/* Live Clock Box */}
            <div className="kitchen-clock-box" title="Kitchen Time">
              <Clock size={16} color="#dda943" />
              <span>{currentTimeStr || '08:00 AM'}</span>
            </div>

            {/* Audio Alert Chime Toggle */}
            <button
              type="button"
              className={`kitchen-icon-btn ${audioAlertEnabled ? 'active' : ''}`}
              onClick={() => {
                setAudioAlertEnabled(!audioAlertEnabled);
                if (!audioAlertEnabled) playKitchenChime('ready');
                addToast(
                  'info',
                  audioAlertEnabled ? 'Chime Muted' : 'Chime Active',
                  audioAlertEnabled ? 'Order sound muted.' : 'Order sound chime active.'
                );
              }}
              title={audioAlertEnabled ? 'Audio Alert Chime Active' : 'Audio Alert Chime Muted'}
            >
              {audioAlertEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{audioAlertEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>

            {/* View Mode Toggle (Only when in live_kds tab) */}
            {activeTab === 'live_kds' && (
              <div className="kitchen-view-mode-group">
                <button
                  type="button"
                  className={`kitchen-view-mode-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                  title="3-Column Kanban Board (New -> Cooking -> Ready)"
                >
                  <Columns size={15} />
                  <span>Kanban Rails</span>
                </button>
                <button
                  type="button"
                  className={`kitchen-view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid Ticket Cards"
                >
                  <LayoutGrid size={15} />
                  <span>Grid Cards</span>
                </button>
              </div>
            )}

            {/* Add Test Ticket Button (Great for testing live flow!) */}
            <button
              type="button"
              className="kitchen-icon-btn"
              onClick={handleAddSampleOrder}
              title="Simulate Guest Order"
            >
              <Sparkles size={15} color="#b3832c" />
              <span>+ New Ticket</span>
            </button>
          </div>
        </div>

        {/* Shift KPI Metrics Ribbon (Admin Metric Card Style) */}
        <div className="kitchen-metrics-grid">
          <div className="kitchen-metric-card">
            <div className="kitchen-metric-content">
              <span className="kitchen-metric-label">Active Orders</span>
              <span className="kitchen-metric-num">{shiftStats.totalActive}</span>
            </div>
            <div className="kitchen-metric-icon-box" style={{ background: '#edf5f1', color: '#173f34' }}>
              <Utensils size={22} />
            </div>
          </div>

          <div className="kitchen-metric-card">
            <div className="kitchen-metric-content">
              <span className="kitchen-metric-label">Cooking Now</span>
              <span className="kitchen-metric-num" style={{ color: '#d97706' }}>
                {shiftStats.cookingNow}
              </span>
            </div>
            <div className="kitchen-metric-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Flame size={22} />
            </div>
          </div>

          <div className="kitchen-metric-card">
            <div className="kitchen-metric-content">
              <span className="kitchen-metric-label">Ready for Runner</span>
              <span className="kitchen-metric-num" style={{ color: '#16a34a' }}>
                {shiftStats.readyForPickup}
              </span>
            </div>
            <div className="kitchen-metric-icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="kitchen-metric-card">
            <div className="kitchen-metric-content">
              <span className="kitchen-metric-label">Queue / Received</span>
              <span className="kitchen-metric-num" style={{ color: '#0284c7' }}>
                {shiftStats.pendingQueue}
              </span>
            </div>
            <div className="kitchen-metric-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Clock size={22} />
            </div>
          </div>

          <div className="kitchen-metric-card">
            <div className="kitchen-metric-content">
              <span className="kitchen-metric-label">Allergy Flags</span>
              <span className="kitchen-metric-num" style={{ color: allergyAlertCount > 0 ? '#dc2626' : '#64748b' }}>
                {allergyAlertCount}
              </span>
            </div>
            <div className="kitchen-metric-icon-box" style={{ background: allergyAlertCount > 0 ? '#fee2e2' : '#f1f5f9', color: allergyAlertCount > 0 ? '#dc2626' : '#64748b' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="kitchen-controls-bar">
          <div className="kitchen-search-box">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="kitchen-search-input"
              placeholder="Search room #, guest name, ticket #, or dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setAllergiesOnly(!allergiesOnly)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: allergiesOnly ? '1.5px solid #ef4444' : '1px solid #d4ded9',
                backgroundColor: allergiesOnly ? '#fee2e2' : '#ffffff',
                color: allergiesOnly ? '#991b1b' : '#374151',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <AlertTriangle size={15} color={allergiesOnly ? '#ef4444' : '#d97706'} />
              <span>Allergy Alerts Only ({allergyAlertCount})</span>
            </button>

            {/* Station Pills (On tablet or when sidebar is collapsed) */}
            {(['ALL', 'HOT_LINE', 'COLD_BAKERY', 'BARISTA'] as KitchenStation[]).map((station) => (
              <button
                key={station}
                type="button"
                onClick={() => setSelectedStation(station)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: selectedStation === station ? '1.5px solid #17271f' : '1px solid #d4ded9',
                  backgroundColor: selectedStation === station ? '#17271f' : '#ffffff',
                  color: selectedStation === station ? '#ffffff' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {station === 'ALL'
                  ? 'All Stations'
                  : station === 'HOT_LINE'
                  ? 'Hot Line'
                  : station === 'COLD_BAKERY'
                  ? 'Bakery'
                  : 'Barista'}
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================================
            VIEW 1: LIVE KDS BOARD (KANBAN 3-COLUMN OR GRID)
        =================================================================== */}
        {activeTab === 'live_kds' && (
          <div>
            {viewMode === 'kanban' ? (
              /* KANBAN 3-COLUMN VIEW (SUPER SIMPLE FOR KITCHEN UNDERSTANDING) */
              <div className="kitchen-kanban-board">
                {/* COLUMN 1: NEW / QUEUE */}
                <div className="kitchen-kanban-col">
                  <div className="kitchen-kanban-header">
                    <div>
                      <div className="kitchen-col-title-group">
                        <span className="kitchen-col-dot" style={{ backgroundColor: '#0284c7' }} />
                        <h3 className="kitchen-col-title">1. New Orders</h3>
                        <span className="kitchen-col-count-badge" style={{ backgroundColor: '#0284c7' }}>
                          {receivedOrders.length}
                        </span>
                      </div>
                      <div className="kitchen-col-sub">Waiting to start cooking</div>
                    </div>
                  </div>

                  <div className="kitchen-col-cards-list">
                    {receivedOrders.length === 0 ? (
                      <div className="kitchen-col-empty-card">
                        ✓ No pending tickets in queue
                      </div>
                    ) : (
                      receivedOrders.map((ord) => renderOrderCard(ord))
                    )}
                  </div>
                </div>

                {/* COLUMN 2: COOKING NOW */}
                <div className="kitchen-kanban-col">
                  <div className="kitchen-kanban-header">
                    <div>
                      <div className="kitchen-col-title-group">
                        <span className="kitchen-col-dot" style={{ backgroundColor: '#d97706' }} />
                        <h3 className="kitchen-col-title">2. In The Pan / Cooking</h3>
                        <span className="kitchen-col-count-badge" style={{ backgroundColor: '#d97706' }}>
                          {cookingOrders.length}
                        </span>
                      </div>
                      <div className="kitchen-col-sub">Active preparation on station</div>
                    </div>
                  </div>

                  <div className="kitchen-col-cards-list">
                    {cookingOrders.length === 0 ? (
                      <div className="kitchen-col-empty-card">
                        ✓ No tickets currently cooking
                      </div>
                    ) : (
                      cookingOrders.map((ord) => renderOrderCard(ord))
                    )}
                  </div>
                </div>

                {/* COLUMN 3: READY TO SERVE */}
                <div className="kitchen-kanban-col">
                  <div className="kitchen-kanban-header">
                    <div>
                      <div className="kitchen-col-title-group">
                        <span className="kitchen-col-dot" style={{ backgroundColor: '#16a34a' }} />
                        <h3 className="kitchen-col-title">3. Plated & Ready</h3>
                        <span className="kitchen-col-count-badge" style={{ backgroundColor: '#16a34a' }}>
                          {readyOrders.length}
                        </span>
                      </div>
                      <div className="kitchen-col-sub">Waiting for runner / butler</div>
                    </div>
                  </div>

                  <div className="kitchen-col-cards-list">
                    {readyOrders.length === 0 ? (
                      <div className="kitchen-col-empty-card">
                        ✓ No tickets waiting for pickup
                      </div>
                    ) : (
                      readyOrders.map((ord) => renderOrderCard(ord))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* GRID CARDS VIEW */
              <div className="kitchen-grid-view">
                {filteredOrders.length === 0 ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1.5px dashed #cbd5e1'
                  }}>
                    <ChefHat size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                    <h3 style={{ margin: '0 0 6px 0', fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: '#17271f' }}>
                      No Active Tickets Found
                    </h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.90rem' }}>
                      There are no active orders matching your current station or search filters.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((ord) => renderOrderCard(ord))
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            VIEW 2: ORDERS QUEUE TABLE (MATCHING ADMIN DASHBOARD LISTINGS)
        =================================================================== */}
        {activeTab === 'orders_queue' && (
          <div className="kitchen-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="kitchen-table">
                <thead>
                  <tr>
                    <th>Room / Suite</th>
                    <th>Ticket #</th>
                    <th>Guest Name</th>
                    <th>Delivery Slot</th>
                    <th>Items Summary</th>
                    <th>Allergies / Flags</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        No orders matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td style={{ fontWeight: 800, fontSize: '1rem', color: '#17271f' }}>
                          {ord.roomNumber}
                        </td>
                        <td style={{ fontWeight: 700, color: '#17271f' }}>
                          {ord.orderNumber}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {ord.guestName}
                        </td>
                        <td>
                          <span style={{ background: '#edf4f0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700, color: '#17271f', border: '1px solid #c2e0d1' }}>
                            {ord.deliverySlot}
                          </span>
                        </td>
                        <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                          {ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                        </td>
                        <td>
                          {ord.allergies && ord.allergies.length > 0 ? (
                            <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                              {ord.allergies.join(', ')}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.80rem' }}>None</span>
                          )}
                        </td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => handleAdvanceOrderStatus(ord.id, e.target.value as KitchenOrderStatus)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.80rem',
                              fontWeight: 700,
                              border: '1px solid #cbd5e1',
                              background: ord.status === 'READY' ? '#dcfce7' : ord.status === 'BEING_PREPARED' ? '#fef3c7' : ord.status === 'DELIVERED' ? '#f1f5f9' : '#e0f2fe',
                              color: ord.status === 'READY' ? '#15803d' : ord.status === 'BEING_PREPARED' ? '#92400e' : ord.status === 'DELIVERED' ? '#475569' : '#0369a1',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="RECEIVED">RECEIVED (Queue)</option>
                            <option value="BEING_PREPARED">BEING PREPARED (Cooking)</option>
                            <option value="READY">READY FOR PICKUP</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              background: '#ffffff',
                              border: '1.5px solid #17271f',
                              color: '#17271f',
                              fontSize: '0.80rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Eye size={13} />
                            <span>View Ticket</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 3: 86 STOCK & MENU CONTROL
        =================================================================== */}
        {activeTab === 'inventory_86' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e1e7e4',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ marginBottom: '22px' }}>
              <span className="kitchen-ops-eyebrow">STOCK & AVAILABILITY</span>
              <h3 style={{ margin: '4px 0 6px 0', fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 700, color: '#17271f' }}>
                Breakfast Item Availability (86 Control)
              </h3>
              <p style={{ margin: 0, color: '#55665e', fontSize: '0.92rem' }}>
                Toggle items out of stock in real-time. Sold-out dishes will immediately show as unavailable in the guest suite in-stay breakfast portal.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {mockBreakfastMenu.map((item) => {
                const is86 = Boolean(inventory86List[item.id]);

                return (
                  <div
                    key={item.id}
                    style={{
                      background: is86 ? '#fff5f5' : '#f8fafc',
                      border: is86 ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b3832c', textTransform: 'uppercase' }}>
                          {item.category.replace('_', ' ')}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: is86 ? '#fee2e2' : '#dcfce7',
                          color: is86 ? '#991b1b' : '#15803d',
                          border: is86 ? '1px solid #fca5a5' : '1px solid #bbf7d0'
                        }}>
                          {is86 ? '86 / SOLD OUT' : 'AVAILABLE'}
                        </span>
                      </div>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.1rem', fontWeight: 700, color: '#17271f' }}>
                        {item.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#55665e', lineHeight: 1.45 }}>
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggle86Item(item.id, item.name)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        border: 'none',
                        background: is86 ? '#17271f' : '#dc2626',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {is86 ? (
                        <>
                          <Check size={16} />
                          <span>Restock & Mark Available</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} />
                          <span>86 This Item (Mark Sold Out)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 4: DELIVERED ARCHIVE
        =================================================================== */}
        {activeTab === 'delivered_archive' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e1e7e4',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <span className="kitchen-ops-eyebrow">HISTORICAL DISPATCH LOG</span>
              <h3 style={{ margin: '4px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 700, color: '#17271f' }}>
                Completed Breakfast Orders Today ({orders.filter((o) => o.status === 'DELIVERED').length})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.filter((o) => o.status === 'DELIVERED').map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #edf2f7',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ fontSize: '1.15rem', color: '#17271f' }}>{ord.roomNumber}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>{ord.orderNumber}</span>
                      <span style={{ color: '#15803d', fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                        DELIVERED
                      </span>
                    </div>
                    <div style={{ color: '#55665e', fontSize: '0.85rem', marginTop: '4px' }}>
                      {ord.guestName} • Delivery Window: {ord.deliverySlot} • Items: {ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdvanceOrderStatus(ord.id, 'BEING_PREPARED')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#17271f',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Re-open Ticket
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================
          MODAL: FULL KITCHEN ORDER TICKET (KOT)
      =================================================================== */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e1e7e4',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#b3832c', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  KITCHEN ORDER TICKET (KOT)
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, color: '#17271f' }}>
                  {selectedOrder.roomNumber} • {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Order Details Bar */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #e1e7e4',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>GUEST</span>
                <strong style={{ color: '#17271f' }}>{selectedOrder.guestName} ({selectedOrder.guestTier || 'Standard VIP'})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>DELIVERY WINDOW</span>
                <strong style={{ color: '#17271f' }}>{selectedOrder.deliverySlot}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>TIME ELAPSED</span>
                <strong style={{ color: '#92400e' }}>{selectedOrder.elapsedMinutes} mins (Target: {selectedOrder.targetMinutes}m)</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>CURRENT STAGE</span>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: selectedOrder.status === 'READY' ? '#dcfce7' : selectedOrder.status === 'BEING_PREPARED' ? '#fef9c3' : '#e0f2fe',
                  color: selectedOrder.status === 'READY' ? '#15803d' : selectedOrder.status === 'BEING_PREPARED' ? '#854d0e' : '#0369a1'
                }}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Allergies / Special Alerts */}
            {selectedOrder.allergies && selectedOrder.allergies.length > 0 && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} />
                <span>CRITICAL ALLERGIES: {selectedOrder.allergies.join(' • ')}</span>
              </div>
            )}

            {/* Item Breakdown */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#17271f', textTransform: 'uppercase', margin: '0 0 10px 0', letterSpacing: '0.04em' }}>
                Course & Item Preparation Checklist (Tap to Strike)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((it) => (
                  <div
                    key={it.id}
                    onClick={() => toggleItemPrepared(selectedOrder.id, it.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: it.isPrepared ? '#f8fafc' : '#ffffff',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#17271f', color: '#ffffff', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', fontSize: '0.82rem' }}>
                          {it.quantity}x
                        </span>
                        <strong style={{ color: it.isPrepared ? '#64748b' : '#17271f', fontSize: '0.95rem', textDecoration: it.isPrepared ? 'line-through' : 'none' }}>
                          {it.item.name}
                        </strong>
                      </div>
                      {it.specialInstructions && (
                        <div style={{ fontSize: '0.80rem', color: '#b45309', marginTop: '4px', marginLeft: '34px', fontWeight: 600 }}>
                          Note: {it.specialInstructions}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        {it.station}
                      </span>
                      {it.isPrepared ? (
                        <CheckCircle2 size={20} color="#16a34a" />
                      ) : (
                        <span style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #cbd5e1', display: 'inline-block' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid #e5e7eb', paddingTop: '18px' }}>
              <button
                type="button"
                onClick={() => {
                  addToast('info', 'Print KOT', `Order ticket ${selectedOrder.orderNumber} sent to Kitchen POS Printer.`);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#17271f',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={16} />
                <span>Print Kitchen Slip</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>

                {selectedOrder.status === 'RECEIVED' ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleAdvanceOrderStatus(selectedOrder.id, 'BEING_PREPARED');
                      setSelectedOrder(null);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '6px',
                      background: '#17271f',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Start Cooking 🔥
                  </button>
                ) : selectedOrder.status === 'BEING_PREPARED' ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleAdvanceOrderStatus(selectedOrder.id, 'READY');
                      setSelectedOrder(null);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '6px',
                      background: '#16a34a',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Mark Ready for Pickup 🔔
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleAdvanceOrderStatus(selectedOrder.id, 'DELIVERED');
                      setSelectedOrder(null);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '6px',
                      background: '#17271f',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Dispatch / Delivered ✅
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // 7. HELPER: RENDER INDIVIDUAL TICKET CARD
  // -------------------------------------------------------------------------
  function renderOrderCard(order: KitchenOrderRecord) {
    const hasAllergies = order.allergies && order.allergies.length > 0;
    const isReady = order.status === 'READY';
    const isCooking = order.status === 'BEING_PREPARED';
    const isNew = order.status === 'RECEIVED';

    return (
      <div
        key={order.id}
        className={`kds-card ${order.isUrgent || hasAllergies ? 'urgent' : ''}`}
      >
        {/* Ticket Header */}
        <div className="kds-card-header">
          <div>
            <div className="kds-room-badge">
              <span>{order.roomNumber}</span>
            </div>
            <div className="kds-ticket-id">
              {order.orderNumber} • {order.tableOrRoomType || 'Suite'}
            </div>
          </div>

          {/* Timer Pill */}
          <div
            className={`kds-timer-pill ${
              order.elapsedMinutes > 18
                ? 'timer-red'
                : isReady
                ? 'timer-green'
                : isCooking
                ? 'timer-amber'
                : 'timer-blue'
            }`}
          >
            <Clock size={12} />
            <span>
              {isReady
                ? 'Ready'
                : `${order.elapsedMinutes}m / ${order.targetMinutes}m`}
            </span>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="kds-card-body">
          {/* Guest Line */}
          <div className="kds-guest-line">
            <span className="kds-guest-name">{order.guestName}</span>
            <span className="kds-slot-badge">{order.deliverySlot}</span>
          </div>

          {/* Allergy Callout Banner */}
          {hasAllergies && (
            <div className="kds-allergy-banner">
              <AlertTriangle size={15} />
              <span>ALLERGY: {order.allergies?.join(' • ')}</span>
            </div>
          )}

          {/* Items Checklist (Tap to Strike) */}
          <div className="kds-items-list">
            {order.items.map((it) => (
              <div
                key={it.id}
                className={`kds-item-row ${it.isPrepared ? 'done' : ''}`}
                onClick={() => toggleItemPrepared(order.id, it.id)}
                title="Tap item to mark prepared"
              >
                <span className="kds-item-qty">{it.quantity}x</span>
                <div className="kds-item-info">
                  <div className="kds-item-name">{it.item.name}</div>
                  {it.specialInstructions && (
                    <div className="kds-item-instruction">
                      Note: {it.specialInstructions}
                    </div>
                  )}
                </div>
                {it.isPrepared ? (
                  <Check size={16} color="#16a34a" />
                ) : (
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: '1.5px solid #cbd5e1',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Guest Note */}
          {order.specialInstructions && (
            <div className="kds-special-note">"{order.specialInstructions}"</div>
          )}
        </div>

        {/* Ticket Footer / Action Buttons */}
        <div className="kds-card-footer">
          {isNew ? (
            <button
              type="button"
              className="kds-action-btn btn-cook"
              onClick={() => handleAdvanceOrderStatus(order.id, 'BEING_PREPARED')}
            >
              <Flame size={16} />
              <span>Start Cooking</span>
            </button>
          ) : isCooking ? (
            <button
              type="button"
              className="kds-action-btn btn-ready"
              onClick={() => handleAdvanceOrderStatus(order.id, 'READY')}
            >
              <CheckCircle2 size={16} />
              <span>Mark Ready</span>
            </button>
          ) : isReady ? (
            <button
              type="button"
              className="kds-action-btn btn-dispatch"
              onClick={() => handleAdvanceOrderStatus(order.id, 'DELIVERED')}
            >
              <Send size={15} />
              <span>Hand Off to Runner</span>
            </button>
          ) : (
            <button
              type="button"
              className="kds-action-btn btn-dispatch"
              disabled
            >
              <Check size={15} />
              <span>Completed</span>
            </button>
          )}

          <button
            type="button"
            className="kds-inspect-btn"
            title="Inspect Full Ticket"
            onClick={() => setSelectedOrder(order)}
          >
            <Eye size={17} />
          </button>
        </div>
      </div>
    );
  }
};

export default KitchenPortal;
