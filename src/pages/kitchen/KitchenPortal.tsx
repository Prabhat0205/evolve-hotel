import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { mockBreakfastMenu } from '../../data/mockBreakfast';
import { BreakfastItem } from '../../types';
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
  SlidersHorizontal, Sparkles, Send, Bell
} from 'lucide-react';

export const KitchenPortal: React.FC = () => {
  const { navigateTo, addToast, activeBreakfastOrder } = useApp();

  // -------------------------------------------------------------------------
  // AUTHENTICATION STATE
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
      addToast('success', 'Kitchen Staff Signed In', `Welcome Chef ${matched.name} to Evolve Kitchen Portal.`);
    } else {
      setLoginError('Invalid credentials. Use prabhat.appzoro@gmail.com and password: 123456');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('evolve_kitchen_auth_user');
    addToast('info', 'Logged Out', 'Signed out from Kitchen Staff Portal.');
  };

  // -------------------------------------------------------------------------
  // ORDERS & SYSTEM STATE
  // -------------------------------------------------------------------------
  const [orders, setOrders] = useState<KitchenOrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('evolve_kitchen_orders_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialKitchenOrders;
  });

  // Sync with guest order placed via in-stay breakfast page if exists
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
      localStorage.setItem('evolve_kitchen_orders_v1', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Live Clock
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

  // UI Controls
  const [activeTab, setActiveTab] = useState<KitchenTab>('live_kds');
  const [selectedStation, setSelectedStation] = useState<KitchenStation>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | KitchenOrderStatus>('ALL');
  const [allergiesOnly, setAllergiesOnly] = useState<boolean>(false);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);

  // Selected Order for Full Modal View
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrderRecord | null>(null);

  // 86 / Sold Out Inventory State
  const [inventory86List, setInventory86List] = useState<Record<string, boolean>>({
    'bf-03': false, // Pancakes available
    'bf-06': false, // Green Vitality available
  });

  const toggle86Item = (itemId: string, itemName: string) => {
    setInventory86List((prev) => {
      const updated = !prev[itemId];
      addToast(
        updated ? 'warning' : 'success',
        updated ? `Item 86'd: ${itemName}` : `Item Restocked: ${itemName}`,
        updated ? `${itemName} is now marked SOLD OUT for guests.` : `${itemName} is back on breakfast menu.`
      );
      return { ...prev, [itemId]: updated };
    });
  };

  // -------------------------------------------------------------------------
  // KDS ORDER BUMP / STATUS ACTIONS
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
      addToast('success', 'KDS Ticket Updated', `${targetOrd.orderNumber} (${targetOrd.roomNumber}) marked ${nextStatus || 'progressed'}.`);
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

  // -------------------------------------------------------------------------
  // STATS & FILTERED DATA
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
      avgPrepMinutes: 16,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Tab matching
      if (activeTab === 'delivered_archive' && ord.status !== 'DELIVERED') return false;
      if (activeTab === 'live_kds' && ord.status === 'DELIVERED') return false;

      // Status filter
      if (statusFilter !== 'ALL' && ord.status !== statusFilter) return false;

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
  }, [orders, activeTab, statusFilter, selectedStation, allergiesOnly, searchQuery]);

  // -------------------------------------------------------------------------
  // RENDER: LOGIN SCREEN (IF NOT AUTHENTICATED)
  // -------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="kitchen-login-wrapper">
        <div className="kitchen-login-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
              color: '#ffffff',
              marginBottom: '14px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
            }}>
              <ChefHat size={34} />
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Evolve Luxury Hotels
            </span>
            <h2 style={{ margin: '4px 0 8px 0', fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
              Kitchen Display System (KDS)
            </h2>
            <p style={{ margin: 0, fontSize: '0.90rem', color: '#94a3b8' }}>
              Tablet & Staff Portal for In-Stay Breakfast Order Management
            </p>
          </div>

          {loginError && (
            <div style={{
              backgroundColor: '#450a0a',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '10px 14px',
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
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Kitchen Staff Email
              </label>
              <input
                type="email"
                className="kitchen-login-input"
                placeholder="prabhat.appzoro@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.80rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Passcode / Password
                </label>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Demo: 123456</span>
              </div>
              <input
                type="password"
                className="kitchen-login-input"
                placeholder="••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="kitchen-login-btn">
              Sign In to Kitchen Terminal
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div style={{ marginTop: '22px', borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              One-Tap Quick Role Login
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('prabhat.appzoro@gmail.com');
                  setLoginPassword('123456');
                }}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Chef Prabhat (Lead)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('mateo.kitchen@evolvehotel.com');
                  setLoginPassword('123456');
                }}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Chef Mateo (Hot Line)
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Main Hotel Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER: MAIN KITCHEN DISPLAY SYSTEM (KDS) & TABLET PORTAL
  // -------------------------------------------------------------------------
  return (
    <div className="kitchen-app-root">
      {/* 1. Header Bar */}
      <header className="kitchen-header">
        <div className="kitchen-header-left">
          <div className="kitchen-logo-badge">
            <ChefHat size={22} color="#10b981" />
            <div>
              <h1>Evolve Kitchen</h1>
            </div>
          </div>
          <div style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.80rem', color: '#94a3b8', fontWeight: 600 }}>Station:</span>
            <span className="kitchen-station-pill">{selectedStation}</span>
          </div>
        </div>

        <div className="kitchen-header-right">
          {/* Live Kitchen Clock */}
          <div className="kitchen-clock-display" title="Kitchen Standard Time">
            <Clock size={16} />
            <span>{currentTimeStr || '08:00 AM'}</span>
          </div>

          {/* Sound Alert Toggle */}
          <button
            type="button"
            onClick={() => {
              setAudioAlertEnabled(!audioAlertEnabled);
              addToast('info', audioAlertEnabled ? 'Chime Muted' : 'Chime Active', audioAlertEnabled ? 'Order audio chime muted.' : 'Audio chime enabled for new tickets.');
            }}
            title={audioAlertEnabled ? 'Audio Chime Enabled' : 'Audio Chime Muted'}
            style={{
              background: audioAlertEnabled ? '#1e293b' : '#3f1818',
              border: '1px solid #334155',
              color: audioAlertEnabled ? '#38bdf8' : '#f87171',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            {audioAlertEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span style={{ display: 'none' }}>Chime</span>
          </button>

          {/* User Profile Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1e293b',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.70rem', color: '#10b981', fontWeight: 600 }}>
                {currentUser.roleTitle}
              </div>
            </div>
          </div>

          {/* Exit / Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out Kitchen Terminal"
            style={{
              background: '#241b1b',
              border: '1px solid #4a2828',
              color: '#f87171',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. KPI / Shift Metrics Bar */}
      <div className="kitchen-stats-ribbon">
        <div className="kitchen-stat-card">
          <span className="kitchen-stat-label">Active Orders</span>
          <div className="kitchen-stat-value" style={{ color: '#38bdf8' }}>
            <Utensils size={20} />
            <span>{shiftStats.totalActive}</span>
          </div>
        </div>

        <div className="kitchen-stat-card">
          <span className="kitchen-stat-label">Cooking Now</span>
          <div className="kitchen-stat-value" style={{ color: '#f59e0b' }}>
            <Flame size={20} />
            <span>{shiftStats.cookingNow}</span>
          </div>
        </div>

        <div className="kitchen-stat-card">
          <span className="kitchen-stat-label">Ready For Delivery</span>
          <div className="kitchen-stat-value" style={{ color: '#10b981' }}>
            <CheckCircle2 size={20} />
            <span>{shiftStats.readyForPickup}</span>
          </div>
        </div>

        <div className="kitchen-stat-card">
          <span className="kitchen-stat-label">Queue / Received</span>
          <div className="kitchen-stat-value" style={{ color: '#a78bfa' }}>
            <Clock size={20} />
            <span>{shiftStats.pendingQueue}</span>
          </div>
        </div>

        <div className="kitchen-stat-card">
          <span className="kitchen-stat-label">Delivered Today</span>
          <div className="kitchen-stat-value" style={{ color: '#94a3b8' }}>
            <Check size={20} />
            <span>{shiftStats.deliveredToday}</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs Bar (Touch Optimized for Tablet) */}
      <div className="kitchen-nav-bar">
        <div className="kitchen-tabs-group">
          <button
            type="button"
            className={`kitchen-tab-btn ${activeTab === 'live_kds' ? 'active' : ''}`}
            onClick={() => setActiveTab('live_kds')}
          >
            <Flame size={18} />
            <span>Live KDS Board</span>
            <span className="kitchen-tab-badge">{shiftStats.totalActive}</span>
          </button>

          <button
            type="button"
            className={`kitchen-tab-btn ${activeTab === 'orders_queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders_queue')}
          >
            <Utensils size={18} />
            <span>Orders Queue Table</span>
          </button>

          <button
            type="button"
            className={`kitchen-tab-btn ${activeTab === 'inventory_86' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory_86')}
          >
            <SlidersHorizontal size={18} />
            <span>86 List / Menu Stock</span>
          </button>

          <button
            type="button"
            className={`kitchen-tab-btn ${activeTab === 'delivered_archive' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivered_archive')}
          >
            <CheckCircle size={18} />
            <span>Delivered History ({shiftStats.deliveredToday})</span>
          </button>
        </div>

        {/* Station Selector Buttons */}
        <div className="kitchen-station-filters">
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Station:
          </span>
          {(['ALL', 'HOT_LINE', 'COLD_BAKERY', 'BARISTA'] as KitchenStation[]).map((station) => (
            <button
              key={station}
              type="button"
              className={`kitchen-station-btn ${selectedStation === station ? 'active' : ''}`}
              onClick={() => setSelectedStation(station)}
            >
              {station === 'ALL' ? 'All Stations' : station.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#0e1626',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          minWidth: '240px',
          maxWidth: '380px',
          flex: 1
        }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search room #, guest name, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: '8px',
              background: '#182235',
              border: '1px solid #28374f',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none'
            }}
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
              borderRadius: '6px',
              border: allergiesOnly ? '1.5px solid #ef4444' : '1px solid #334155',
              backgroundColor: allergiesOnly ? '#450a0a' : '#1e293b',
              color: allergiesOnly ? '#fca5a5' : '#cbd5e1',
              fontSize: '0.80rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle size={14} color={allergiesOnly ? '#ef4444' : '#f59e0b'} />
            <span>Allergy Alerts Only</span>
          </button>

          {/* Quick Status Buttons */}
          {(['ALL', 'RECEIVED', 'BEING_PREPARED', 'READY'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: statusFilter === st ? '1px solid #10b981' : '1px solid #334155',
                backgroundColor: statusFilter === st ? '#064e3b' : '#1e293b',
                color: statusFilter === st ? '#34d399' : '#94a3b8',
                fontSize: '0.80rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main Content Area */}
      <main className="kitchen-content-area">
        {/* VIEW 1: LIVE KDS DISPLAY BOARD (TABLET OPTIMIZED GRID) */}
        {activeTab === 'live_kds' && (
          <div>
            {filteredOrders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#131c2d',
                borderRadius: '12px',
                border: '1.5px dashed #28374f'
              }}>
                <ChefHat size={48} color="#64748b" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#ffffff' }}>No Orders in this View</h3>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.90rem' }}>
                  All orders for this station or filter are completed. New guest breakfast orders will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="kitchen-grid-container">
                {filteredOrders.map((order) => {
                  const isCooking = order.status === 'BEING_PREPARED';
                  const isReady = order.status === 'READY';
                  const hasAllergies = order.allergies && order.allergies.length > 0;

                  return (
                    <div
                      key={order.id}
                      className={`kds-card status-${order.status} ${order.isUrgent || hasAllergies ? 'urgent-ticket' : ''}`}
                    >
                      {/* Ticket Header */}
                      <div className="kds-card-header">
                        <div>
                          <div className="kds-room-badge">{order.roomNumber}</div>
                          <div className="kds-ticket-number">{order.orderNumber} • {order.tableOrRoomType || 'Suite'}</div>
                        </div>

                        {/* Prep Timer */}
                        <div className={`kds-timer-pill ${order.elapsedMinutes > 18 ? 'timer-urgent' : order.elapsedMinutes > 12 ? 'timer-warning' : 'timer-normal'}`}>
                          <Clock size={13} />
                          <span>{order.elapsedMinutes}m / {order.targetMinutes}m</span>
                        </div>
                      </div>

                      {/* Ticket Body */}
                      <div className="kds-card-body">
                        {/* Guest & Slot */}
                        <div className="kds-guest-row">
                          <span className="kds-guest-name">
                            {order.guestName}
                            {order.guestTier && (
                              <span style={{ fontSize: '0.70rem', color: '#d97706', marginLeft: '6px', fontWeight: 800 }}>
                                ★ {order.guestTier}
                              </span>
                            )}
                          </span>
                          <span className="kds-delivery-slot">Delivery: {order.deliverySlot}</span>
                        </div>

                        {/* Allergy Warning Banner */}
                        {hasAllergies && (
                          <div className="kds-allergy-alert">
                            <AlertTriangle size={15} />
                            <span>{order.allergies?.join(' • ')}</span>
                          </div>
                        )}

                        {/* Dietary Tags */}
                        {order.dietaryNotes && order.dietaryNotes.length > 0 && (
                          <div className="kds-dietary-tags">
                            {order.dietaryNotes.map((note, idx) => (
                              <span key={idx} className="kds-dietary-badge">
                                {note}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Items Checklist (Click item to mark done on tablet) */}
                        <div className="kds-items-list">
                          {order.items.map((it) => (
                            <div
                              key={it.id}
                              className={`kds-item-row ${it.isPrepared ? 'prepared' : ''}`}
                              onClick={() => toggleItemPrepared(order.id, it.id)}
                              title="Tap item to mark prepared"
                            >
                              <span className="kds-item-qty">{it.quantity}x</span>
                              <div className="kds-item-details">
                                <div className="kds-item-name">{it.item.name}</div>
                                {it.specialInstructions && (
                                  <div className="kds-item-note">Note: {it.specialInstructions}</div>
                                )}
                              </div>
                              {it.isPrepared ? (
                                <Check size={16} color="#10b981" />
                              ) : (
                                <span style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1.5px solid #475569', display: 'inline-block' }} />
                              )}
                            </div>
                          ))}
                        </div>

                        {order.specialInstructions && (
                          <div style={{
                            fontSize: '0.78rem',
                            color: '#94a3b8',
                            fontStyle: 'italic',
                            padding: '6px 8px',
                            background: '#111926',
                            borderRadius: '4px',
                            borderLeft: '3px solid #38bdf8'
                          }}>
                            "{order.specialInstructions}"
                          </div>
                        )}
                      </div>

                      {/* Ticket Footer (Bump Action Buttons) */}
                      <div className="kds-card-footer">
                        {order.status === 'RECEIVED' ? (
                          <button
                            type="button"
                            className="kds-bump-btn start-prep"
                            onClick={() => handleAdvanceOrderStatus(order.id, 'BEING_PREPARED')}
                          >
                            <Flame size={18} />
                            <span>Start Cooking</span>
                          </button>
                        ) : order.status === 'BEING_PREPARED' ? (
                          <button
                            type="button"
                            className="kds-bump-btn mark-ready"
                            onClick={() => handleAdvanceOrderStatus(order.id, 'READY')}
                          >
                            <CheckCircle2 size={18} />
                            <span>Mark Ready</span>
                          </button>
                        ) : order.status === 'READY' ? (
                          <button
                            type="button"
                            className="kds-bump-btn complete"
                            onClick={() => handleAdvanceOrderStatus(order.id, 'DELIVERED')}
                          >
                            <Send size={16} />
                            <span>Complete / Delivered</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="kds-bump-btn complete"
                            disabled
                          >
                            <Check size={16} />
                            <span>Completed</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="kds-details-btn"
                          title="View Full Ticket Details"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Utensils size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ORDERS QUEUE TABLE */}
        {activeTab === 'orders_queue' && (
          <div style={{
            background: '#131c2d',
            borderRadius: '12px',
            border: '1.5px solid #28374f',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#0e1626', borderBottom: '2px solid #28374f', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '14px 18px' }}>Room</th>
                    <th style={{ padding: '14px 18px' }}>Ticket #</th>
                    <th style={{ padding: '14px 18px' }}>Guest Name</th>
                    <th style={{ padding: '14px 18px' }}>Delivery Slot</th>
                    <th style={{ padding: '14px 18px' }}>Items Summary</th>
                    <th style={{ padding: '14px 18px' }}>Allergies / Notes</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord, idx) => (
                    <tr
                      key={ord.id}
                      style={{
                        borderBottom: idx !== filteredOrders.length - 1 ? '1px solid #1e293b' : 'none',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                      }}
                    >
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>
                        {ord.roomNumber}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#38bdf8', fontWeight: 700 }}>
                        {ord.orderNumber}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#f1f5f9', fontWeight: 600 }}>
                        {ord.guestName}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                        <span style={{ background: '#1e293b', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                          {ord.deliverySlot}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                        {ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {ord.allergies && ord.allergies.length > 0 ? (
                          <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                            {ord.allergies.join(', ')}
                          </span>
                        ) : ord.dietaryNotes && ord.dietaryNotes.length > 0 ? (
                          <span style={{ color: '#34d399', fontSize: '0.78rem' }}>
                            {ord.dietaryNotes.join(', ')}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleAdvanceOrderStatus(ord.id, e.target.value as KitchenOrderStatus)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.80rem',
                            fontWeight: 800,
                            border: '1px solid #334155',
                            background: ord.status === 'READY' ? '#064e3b' : ord.status === 'BEING_PREPARED' ? '#78350f' : ord.status === 'DELIVERED' ? '#1e293b' : '#0c4a6e',
                            color: ord.status === 'READY' ? '#34d399' : ord.status === 'BEING_PREPARED' ? '#fbbf24' : ord.status === 'DELIVERED' ? '#94a3b8' : '#38bdf8',
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
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            border: '1px solid #3b4e6d',
                            color: '#ffffff',
                            fontSize: '0.80rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: MENU 86 & STOCK CONTROL */}
        {activeTab === 'inventory_86' && (
          <div style={{
            background: '#131c2d',
            borderRadius: '12px',
            border: '1.5px solid #28374f',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Breakfast Menu Availability (86 Control)
              </h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.90rem' }}>
                Toggle items out of stock in real-time. Sold-out dishes will be disabled immediately in the guest-side in-stay breakfast portal.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {mockBreakfastMenu.map((item) => {
                const is86 = Boolean(inventory86List[item.id]);

                return (
                  <div
                    key={item.id}
                    style={{
                      background: is86 ? '#201616' : '#182235',
                      border: is86 ? '1.5px solid #7f1d1d' : '1.5px solid #2b3952',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                          {item.category.replace('_', ' ')}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: is86 ? '#7f1d1d' : '#064e3b',
                          color: is86 ? '#fca5a5' : '#34d399'
                        }}>
                          {is86 ? '86 / SOLD OUT' : 'AVAILABLE'}
                        </span>
                      </div>
                      <h4 style={{ margin: '6px 0 4px 0', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                        {item.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggle86Item(item.id, item.name)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        border: 'none',
                        background: is86 ? '#10b981' : '#ef4444',
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

        {/* VIEW 4: DELIVERED ARCHIVE */}
        {activeTab === 'delivered_archive' && (
          <div style={{
            background: '#131c2d',
            borderRadius: '12px',
            border: '1.5px solid #28374f',
            padding: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
              Completed & Delivered Breakfast Orders ({orders.filter((o) => o.status === 'DELIVERED').length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.filter((o) => o.status === 'DELIVERED').map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    background: '#182235',
                    border: '1px solid #28374f',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ fontSize: '1.15rem', color: '#ffffff' }}>{ord.roomNumber}</strong>
                      <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700 }}>{ord.orderNumber}</span>
                      <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 800, background: '#064e3b', padding: '2px 8px', borderRadius: '4px' }}>
                        DELIVERED
                      </span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '4px' }}>
                      {ord.guestName} • Delivery Window: {ord.deliverySlot} • Items: {ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdvanceOrderStatus(ord.id, 'BEING_PREPARED')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      color: '#cbd5e1',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Re-open to Kitchen
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------------------------
          MODAL: FULL ORDER TICKET DETAILS & PRINT
      --------------------------------------------------------------------- */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 10, 20, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#141e30',
            borderRadius: '16px',
            border: '2px solid #2d3e5b',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Kitchen Order Ticket (KOT)
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
                  {selectedOrder.roomNumber} • {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Order Details Bar */}
            <div style={{
              background: '#0e1626',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '20px',
              border: '1px solid #1e293b',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>GUEST</span>
                <strong style={{ color: '#ffffff' }}>{selectedOrder.guestName} ({selectedOrder.guestTier || 'Standard'})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>DELIVERY WINDOW</span>
                <strong style={{ color: '#38bdf8' }}>{selectedOrder.deliverySlot}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>TIME ELAPSED</span>
                <strong style={{ color: '#fbbf24' }}>{selectedOrder.elapsedMinutes} mins (Target: {selectedOrder.targetMinutes}m)</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>CURRENT STATUS</span>
                <strong style={{ color: '#10b981' }}>{selectedOrder.status}</strong>
              </div>
            </div>

            {/* Allergies / Special Alerts */}
            {selectedOrder.allergies && selectedOrder.allergies.length > 0 && (
              <div style={{
                background: '#450a0a',
                border: '1.5px solid #ef4444',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}>
                ⚠️ CRITICAL ALLERGIES: {selectedOrder.allergies.join(' • ')}
              </div>
            )}

            {/* Item Breakdown */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                Course & Item Preparation Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((it) => (
                  <div
                    key={it.id}
                    onClick={() => toggleItemPrepared(selectedOrder.id, it.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: it.isPrepared ? '#0b1120' : '#182438',
                      border: '1px solid #28374f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      opacity: it.isPrepared ? 0.6 : 1
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#0284c7', color: '#ffffff', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', fontSize: '0.82rem' }}>
                          {it.quantity}x
                        </span>
                        <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{it.item.name}</strong>
                      </div>
                      {it.specialInstructions && (
                        <div style={{ fontSize: '0.80rem', color: '#fbbf24', marginTop: '4px', marginLeft: '34px' }}>
                          Instruction: {it.specialInstructions}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                        {it.station}
                      </span>
                      {it.isPrepared ? (
                        <CheckCircle2 size={20} color="#10b981" />
                      ) : (
                        <span style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #475569', display: 'inline-block' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid #222f46', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  addToast('info', 'Print KOT', `Order ticket ${selectedOrder.orderNumber} sent to Kitchen POS Printer.`);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: 700,
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
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>

                {selectedOrder.status !== 'READY' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleAdvanceOrderStatus(selectedOrder.id, 'READY');
                      setSelectedOrder(null);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: '#10b981',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Mark Ready for Pickup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenPortal;
