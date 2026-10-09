import React, { useState, useEffect } from 'react';
import '../../styles/admin.css';
import { authService } from '../../services';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { AdminUser } from '../../types/admin';
import { mockAdminUsers } from '../../data/mockAdminUsers';
import { mockAdminProperties } from '../../data/mockAdminProperties';
import {
  mockDashboardMetrics,
  mockDashboardGuests,
  mockQuickAccessTiles,
  mockAuditActivity,
  mockActiveBookings,
  mockBookingHistory,
  mockGiftCardRequests,
  mockGuestCases,
  mockAutomatedRuleDecisions,
  mockRewardsReportEntries,
  mockPropertyUsers,
  mockPhoneGuestUsers,
} from '../../data/mockDashboardData';
import {
  AdminPropertyItem,
  DashboardGuestItem,
  AuditActivityItem,
  QuickAccessTile,
  AdminActiveBooking,
  PhoneGuestUserBooking,
  GiftCardRequestItem,
  GuestCaseItem,
  AutomatedRuleDecisionItem,
  RewardsReportEntry,
  PropertyUserItem,
  MemberRewardTransaction,
} from '../../types/admin';
import {
  Building2, Calendar, Users, Wrench, TrendingUp,
  Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft,
  KeyRound, Sparkles, LogOut, AlertCircle,
  LayoutDashboard, CalendarDays, Award, Gift, BarChart3,
  ChevronDown, ChevronUp, Filter, Plus, Check, Clock, Search, Download, ExternalLink,
  FileText, Printer, UserPlus, ShieldAlert, Key, History, Menu, SlidersHorizontal,
  CheckCircle2, MessageSquare, Edit3, Phone, Mail, UtensilsCrossed, Coffee,
  Activity, X
} from 'lucide-react';

/* =========================================================================
   LOGIN COMPONENT MATCHING SCREENSHOT EXACTLY (2 USERS ONLY)
========================================================================= */
const AdminLoginFlow: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const { navigateTo, addToast } = useApp();

  // Authentication Flow Step: 'credentials' | 'two_factor'
  const [authStep, setAuthStep] = useState<'credentials' | 'two_factor'>('credentials');

  // Selected User: Default to Property Manager
  const [selectedUser, setSelectedUser] = useState<AdminUser>(mockAdminUsers[0]);
  const [email, setEmail] = useState<string>(mockAdminUsers[0].email);
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // 2FA state
  const [twoFactorCode, setTwoFactorCode] = useState<string>('123456');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [codeResent, setCodeResent] = useState<boolean>(false);

  // Masked email for 2FA screen
  const getMaskedEmail = (userEmail: string) => {
    const parts = userEmail.split('@');
    if (parts.length < 2) return userEmail;
    const name = parts[0];
    const visible = name.slice(0, 2);
    return `${visible}••••@${parts[1]}`;
  };

  // Quick-select demo accounts (Property Manager & Front Desk only)
  const handleQuickDemoSelect = (user: AdminUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword('password123');
    setErrorMessage('');
  };

  // Step 1: Submit Credentials -> Go to 2FA
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const matched = mockAdminUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    ) || selectedUser;

    setSelectedUser(matched);
    setErrorMessage('');
    setAuthStep('two_factor');
    addToast(
      'info',
      'Security Verification',
      `A 6-digit verification code has been dispatched to ${getMaskedEmail(matched.email)}.`
    );
  };

  // Step 2: Verify 2FA Code -> Open Administration
  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.trim().length !== 6) {
      setErrorMessage('The verification code you entered is invalid. Please enter a 6-digit code.');
      return;
    }

    loginAdmin(selectedUser);
    addToast(
      'success',
      'Authentication Complete',
      `Welcome to Evolve Administration, ${selectedUser.name} (${selectedUser.roleTitle}).`
    );
  };

  // Resend OTP code
  const handleResendCode = () => {
    setCodeResent(true);
    setTwoFactorCode('123456');
    setErrorMessage('');
    addToast('info', 'Code Resent', `A new verification code has been sent to ${getMaskedEmail(email)}.`);
    setTimeout(() => setCodeResent(false), 5000);
  };

  return (
    <div className="admin-portal-wrapper">
      {/* LEFT SIDE: Premium Hospitality Brand & Value Showcase */}
      <div
        className="admin-hero-side"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=85')`,
        }}
      >
        <div className="admin-hero-overlay" />

        <div className="admin-hero-content">
          {/* Header Brand Badge */}
          <div className="admin-brand-header">
            <div className="admin-brand-icon">
              E
            </div>
            <div className="admin-brand-titles">
              <span className="admin-brand-name">EVOLVE</span>
              <span className="admin-brand-badge">Hotels & Resorts • Admin Operations</span>
            </div>
          </div>

          {/* Central Hero Headline & Supporting Statement */}
          <div className="admin-hero-body">
            <div className="admin-eyebrow-pill">
              <Sparkles size={14} color="#dda943" />
              <span>Next-Generation PMS & Operations</span>
            </div>

            <h1 className="admin-hero-heading">
              One Platform for Smarter Hotel Operations
            </h1>

            <p className="admin-hero-text">
              Manage properties, reservations, guests, staff, and daily operations from one secure platform. Built for exceptional guest experiences and streamlined management.
            </p>

            {/* Feature Pills */}
            <div className="admin-feature-grid">
              <div className="admin-feature-pill">
                <div className="admin-feature-icon">
                  <Calendar size={18} />
                </div>
                <span className="admin-feature-label">Reservations</span>
              </div>

              <div className="admin-feature-pill">
                <div className="admin-feature-icon">
                  <Users size={18} />
                </div>
                <span className="admin-feature-label">Guests</span>
              </div>

              <div className="admin-feature-pill">
                <div className="admin-feature-icon">
                  <Wrench size={18} />
                </div>
                <span className="admin-feature-label">Operations</span>
              </div>

              <div className="admin-feature-pill">
                <div className="admin-feature-icon">
                  <Building2 size={18} />
                </div>
                <span className="admin-feature-label">Properties</span>
              </div>

              <div className="admin-feature-pill">
                <div className="admin-feature-icon">
                  <TrendingUp size={18} />
                </div>
                <span className="admin-feature-label">Growth / Reports</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust & Status */}
          <div className="admin-hero-footer">
            <div className="admin-status-indicator">
              <span className="admin-status-dot" />
              <span>Multi-Property Grid: <strong>4 Active Properties</strong></span>
            </div>
            <div>
              <span>Enterprise RBAC v2.4 • Mandatory 2FA</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Admin Authentication Panel */}
      <div className="admin-login-side">
        {/* Top Control Bar */}
        <div className="admin-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="admin-system-tag" style={{ color: '#17271f', backgroundColor: '#edf4f0', border: '1px solid #c2e0d1' }}>
            <ShieldCheck size={14} color="#17271f" />
            <span style={{ fontWeight: 600 }}>Secure Admin Portal</span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('landing')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#f6f3ec',
              border: '1px solid #e2ded5',
              borderRadius: '9999px',
              color: '#173f34',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ede9df')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f6f3ec')}
          >
            ← Return to Hotel Website
          </button>
        </div>

        {/* Central Form Centering Wrapper */}
        <div className="admin-login-body">
          <div className="admin-form-container">

          {/* ===================================================================
              STEP 1: CREDENTIALS (EXACTLY MATCHING SCREENSHOT)
          =================================================================== */}
          {authStep === 'credentials' && (
            <div>
              <div className="admin-login-header">
                <span className="admin-welcome-eyebrow" style={{ color: '#997125', fontWeight: 800, letterSpacing: '0.09em' }}>
                  WELCOME BACK
                </span>
                <h2 className="admin-login-title" style={{ color: '#17271f', fontFamily: 'Playfair Display, serif', fontSize: '2.3rem', fontWeight: 700, margin: '6px 0 8px 0' }}>
                  Login to Admin Portal
                </h2>
                <p className="admin-login-subtitle" style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Access your assigned properties, manage operations, and deliver better guest experiences.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="admin-alert-banner admin-alert-error" style={{ marginBottom: '16px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#991b1b' }}>Authentication Notice: </strong>
                    <span style={{ color: '#b91c1c' }}>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} noValidate style={{ marginTop: '20px' }}>
                {/* Email / Username Field */}
                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="admin-email" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.875rem' }}>
                    Email / Username
                  </label>
                  <div className="admin-input-wrap">
                    <div className="admin-input-icon" style={{ color: '#4b5563' }}>
                      <Users size={18} />
                    </div>
                    <input
                      id="admin-email"
                      type="email"
                      className="admin-input"
                      placeholder="alexandra.vance@evolvehotels.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ color: '#111827', fontWeight: 600, border: '1.5px solid #d1d5db', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="admin-password" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.875rem' }}>
                    Password
                  </label>
                  <div className="admin-input-wrap">
                    <div className="admin-input-icon" style={{ color: '#4b5563' }}>
                      <Lock size={18} />
                    </div>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      className="admin-input admin-input-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ color: '#111827', fontWeight: 600, border: '1.5px solid #d1d5db', backgroundColor: '#ffffff' }}
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{ color: '#4b5563' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="admin-options-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 20px 0' }}>
                  <label className="admin-checkbox-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#17271f', fontWeight: 600, fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#17271f', cursor: 'pointer' }}
                    />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="button"
                    className="admin-link-btn"
                    onClick={() => addToast('info', 'Password Assistance', 'Please contact your General Manager or system administrator for password resets.')}
                    style={{ background: 'none', border: 'none', color: '#17271f', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="admin-submit-btn"
                  style={{
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(23, 39, 31, 0.2)'
                  }}
                >
                  <span>Login</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Security Note Box */}
              <div
                className="admin-security-note"
                style={{
                  backgroundColor: '#fbf7ee',
                  borderLeft: '4px solid #dda943',
                  borderTop: '1px solid #ede4d1',
                  borderRight: '1px solid #ede4d1',
                  borderBottom: '1px solid #ede4d1',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  margin: '20px 0 22px 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                  lineHeight: 1.45
                }}
              >
                <Lock size={16} color="#dda943" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#17271f' }}>Authorized access only. </strong>
                  All activities may be monitored and secured according to hospitality enterprise compliance policies.
                </div>
              </div>

              {/* DEMO RBAC TEST ACCOUNTS (ONLY 2 USERS: PROPERTY MANAGER & FRONT DESK) */}
              <div
                className="admin-demo-box"
                style={{
                  backgroundColor: '#faf8f5',
                  border: '1px dashed #d6cebf',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}
              >
                <div className="admin-demo-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div className="admin-demo-title" style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#17271f', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={14} color="#b88628" />
                    <span>DEMO RBAC TEST ACCOUNTS</span>
                  </div>
                  <span className="admin-demo-badge" style={{ fontSize: '0.7rem', padding: '2px 8px', backgroundColor: 'rgba(221, 169, 67, 0.15)', color: '#8c6317', borderRadius: '4px', fontWeight: 700 }}>
                    Click to Quick-Fill
                  </span>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '0 0 10px 0' }}>
                  Select an account to test mandatory 2FA and dynamic role-based redirection:
                </p>

                {/* 2 User Accounts Grid */}
                <div className="admin-demo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {mockAdminUsers.map((user) => {
                    const isSelected = selectedUser.id === user.id;
                    const isPM = user.role === 'property_manager';
                    return (
                      <button
                        key={user.id}
                        type="button"
                        className="admin-demo-card"
                        onClick={() => handleQuickDemoSelect(user)}
                        style={{
                          textAlign: 'left',
                          backgroundColor: isSelected ? '#fef9ee' : '#ffffff',
                          border: isSelected ? '1.5px solid #b88628' : '1px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(184, 134, 40, 0.12)' : 'none'
                        }}
                      >
                        <span className="admin-demo-role-name" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#17271f', display: 'block', marginBottom: '2px' }}>
                          {isPM ? '🏨 Property Manager' : '🛎️ Front Desk (View-Only)'}
                        </span>
                        <span className="admin-demo-desc" style={{ fontSize: '0.725rem', color: '#4b5563', display: 'block' }}>
                          {user.name} ({isPM ? 'General Property Manager • Full Access' : 'Front Desk Officer • View Only'})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              STEP 2: MANDATORY 2FA VERIFICATION (CHECK YOUR WORK EMAIL)
          =================================================================== */}
          {authStep === 'two_factor' && (
            <div>
              {/* Back Button */}
              <button
                type="button"
                className="admin-back-action"
                onClick={() => {
                  setAuthStep('credentials');
                  setErrorMessage('');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#17271f',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: '16px',
                  padding: 0
                }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <div className="admin-login-header">
                <span className="admin-welcome-eyebrow" style={{ color: '#997125', fontWeight: 800, letterSpacing: '0.09em' }}>
                  MANDATORY STAFF VERIFICATION
                </span>
                <h2 className="admin-login-title" style={{ color: '#17271f', fontFamily: 'Playfair Display, serif', fontSize: '2.3rem', fontWeight: 700, margin: '6px 0 8px 0' }}>
                  Check your work email
                </h2>
                <div className="admin-login-subtitle" style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  <div>Enter the six-digit code sent to</div>
                  <strong style={{ color: '#17271f', fontSize: '1rem' }}>{getMaskedEmail(email)}.</strong>
                </div>
              </div>

              {/* Error Banner if any */}
              {errorMessage && (
                <div className="admin-alert-banner admin-alert-error" style={{ marginBottom: '16px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#991b1b' }}>Verification Notice: </strong>
                    <span style={{ color: '#b91c1c' }}>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handle2FASubmit} noValidate style={{ marginTop: '20px' }}>
                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="admin-2fa-code" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.875rem' }}>
                    Two-factor code
                  </label>
                  <div className="admin-input-wrap">
                    <div className="admin-input-icon" style={{ color: '#4b5563' }}>
                      <KeyRound size={18} />
                    </div>
                    <input
                      id="admin-2fa-code"
                      type="text"
                      className="admin-input"
                      placeholder="Enter 123456 for this review"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      maxLength={6}
                      autoFocus
                      required
                      style={{
                        letterSpacing: '0.15em',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#111827',
                        border: '1.5px solid #d1d5db',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  className="admin-submit-btn"
                  style={{
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    marginTop: '20px',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Verify & Open Administration</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Resend Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={handleResendCode}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#17271f',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Resend code
                </button>
                {codeResent && (
                  <span style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>
                    ✓ Code sent
                  </span>
                )}
              </div>
            </div>
          )}

          </div>
        </div>

        {/* Consistent Version Footer */}
        <div className="admin-login-footer">
          <span>Evolve Hospitality Operating System • Version 4.8.2 Enterprise</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   AUTHENTICATED WORKSPACE SHELL (READY FOR INNER PAGES ONE BY ONE)
========================================================================= */
/* =========================================================================
   OPERATIONS DASHBOARD (PROPERTY MANAGER WORKSPACE)
   MATCHING THE REFERENCE SCREENSHOT
========================================================================= */
const PropertyManagerDashboard: React.FC = () => {
  const { currentAdmin, logoutAdmin } = useAdmin();
  const { addToast, navigateTo } = useApp();

  const isFrontDesk = currentAdmin?.role === 'front_desk';

  // Navigation tab state with direct URL synchronization (e.g. /admin/cases, /admin/bookings)
  const getInitialAdminTab = (): string => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts[0] === 'admin' && parts[1]) {
        return parts[1].toLowerCase();
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam.toLowerCase();
    }
    return isFrontDesk ? 'bookings' : 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialAdminTab);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const targetUrl = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
    }
  };

  useEffect(() => {
    const handleAdminRoute = () => {
      if (typeof window !== 'undefined') {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts[0] === 'admin') {
          const tab = parts[1] || (isFrontDesk ? 'bookings' : 'dashboard');
          setActiveTabState(tab);
        }
      }
    };
    window.addEventListener('popstate', handleAdminRoute);
    return () => window.removeEventListener('popstate', handleAdminRoute);
  }, [isFrontDesk]);

  // Properties list state
  const [propertiesList, setPropertiesList] = useState<AdminPropertyItem[]>(mockAdminProperties);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'pre_launch'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Guest Management state
  const [guestSearchQuery, setGuestSearchQuery] = useState<string>('');
  // Helper to load guests including any registered accounts from sign-up
  const getInitialGuestsList = (): DashboardGuestItem[] => {
    try {
      const registered = authService.getRegisteredAccounts();
      if (!registered || registered.length === 0) return mockDashboardGuests;
      const registeredGuests: DashboardGuestItem[] = registered.map((reg, i) => {
        const u = reg.user;
        const custId = u.customerId || (u.memberProfile?.memberId ? u.memberProfile.memberId.replace('EV-', 'CUST-') : `CUST-${2001 + i}`);
        const sqId = (u as any).squareId || `sq_cust_${2001 + i}`;
        return {
          id: u.id || `reg-guest-${i}`,
          customerId: custId,
          squareId: sqId,
          squareSyncStatus: 'Linked',
          squareLastSynced: 'Synced via POS webhook',
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Registered Guest',
          phone: u.phone || '(555) 000-0000',
          email: u.email,
          tier: (u.memberProfile?.tier === 'PRESTIGE' ? 'Prestige' : u.memberProfile?.tier === 'LEGACY' ? 'Elite' : 'Origins') as 'Prestige' | 'Origins' | 'Elite',
          joinedDate: 'Sep 2026',
          pointsBalance: 500,
          activeStays: 0,
          rewardNights: u.memberProfile?.unusedRewardNights ?? 1,
          qualifiedNights: u.memberProfile?.qualifyingNightsThisYear ?? 1,
          cloudbedsReference: `CB-${11200 + i}`,
          latestStayText: 'Registered via online signup',
          stayHistoryText: 'Account registered via online sign up',
          redemptionHistoryText: '0 Free Nights',
          casesText: 'No open requests',
          accountStatus: 'Active',
        };
      });
      const registeredEmails = new Set(registeredGuests.map(g => g.email.toLowerCase()));
      const remainingMock = mockDashboardGuests.filter(g => !registeredEmails.has(g.email.toLowerCase()));
      return [...remainingMock, ...registeredGuests];
    } catch {
      return mockDashboardGuests;
    }
  };

  const [guestsList, setGuestsList] = useState<DashboardGuestItem[]>(getInitialGuestsList);
  const [selectedGuest, setSelectedGuest] = useState<DashboardGuestItem | null>(null);
  const [editTier, setEditTier] = useState<'Prestige' | 'Origins' | 'Elite'>('Prestige');
  const [pointAdjustment, setPointAdjustment] = useState<string>('');
  const [nightsAdjustment, setNightsAdjustment] = useState<string>('');
  const [guestAuditReason, setGuestAuditReason] = useState<string>('');
  const [guestQuickAction, setGuestQuickAction] = useState<string | null>(null);
  const [guestModalView, setGuestModalView] = useState<'profile' | 'editProfile' | 'changePhone' | 'rewardAdjustment' | 'latestStay' | 'redemptions' | 'cases'>('profile');
  const [showGuestAdjustmentPanel, setShowGuestAdjustmentPanel] = useState<boolean>(false);
  const [selectedCreditedStayModal, setSelectedCreditedStayModal] = useState<boolean>(false);
  const [showRewardDetailsModal, setShowRewardDetailsModal] = useState<boolean>(false);
  const [editGuestName, setEditGuestName] = useState<string>('');
  const [editGuestEmail, setEditGuestEmail] = useState<string>('');
  const [editGuestPhone, setEditGuestPhone] = useState<string>('');
  const [editCloudbedsRef, setEditCloudbedsRef] = useState<string>('CB-10482');
  const [editAccountStatus, setEditAccountStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editAccountStatusReason, setEditAccountStatusReason] = useState<string>('');

  // Phone editing & 2FA sequence state
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [newMobileNumber, setNewMobileNumber] = useState<string>('');
  const [phoneVerifyMethod, setPhoneVerifyMethod] = useState<string>('Code to current phone');
  const [phoneAuditNote, setPhoneAuditNote] = useState<string>('');

  // Communication preferences state
  const [commPrefStayMessages, setCommPrefStayMessages] = useState<boolean>(true);
  const [commPrefRewardConfirmations, setCommPrefRewardConfirmations] = useState<boolean>(true);
  const [commPrefSmsMarketing, setCommPrefSmsMarketing] = useState<boolean>(true);
  const [commPrefEmailMarketing, setCommPrefEmailMarketing] = useState<boolean>(true);

  // Reward Adjustment state
  const [rewardAdjType, setRewardAdjType] = useState<string>('Add Reward Points');
  const [rewardAdjUnit, setRewardAdjUnit] = useState<'nights' | 'points'>('points');
  const [rewardAdjNights, setRewardAdjNights] = useState<string>('10');
  const [rewardAdjReason, setRewardAdjReason] = useState<string>('');
  const [rewardAdjRef, setRewardAdjRef] = useState<string>('');

  // Dedicated Rewards Profile Management State
  const [selectedRewardsMember, setSelectedRewardsMember] = useState<DashboardGuestItem | null>(null);
  const [rewardsHistoryFilter, setRewardsHistoryFilter] = useState<'all' | 'credited' | 'redeemed'>('all');
  const [rewardsSearchQuery, setRewardsSearchQuery] = useState<string>('');
  const [rewardsTierFilter, setRewardsTierFilter] = useState<string>('all');
  const [showRewardAdjModal, setShowRewardAdjModal] = useState<boolean>(false);
  const [rewardAdjAction, setRewardAdjAction] = useState<string>('Add Reward Points');
  const [rewardAdjModalUnit, setRewardAdjModalUnit] = useState<'nights' | 'points'>('points');
  const [rewardAdjNightsInput, setRewardAdjNightsInput] = useState<string>('10');
  const [rewardAdjReasonInput, setRewardAdjReasonInput] = useState<string>('');
  const [rewardAdjRefInput, setRewardAdjRefInput] = useState<string>('CB-10482');

  // Helper functions for calculated rewards
  const getGuestEarnedPoints = (g: DashboardGuestItem): number => {
    if (g.totalPointsEarned !== undefined) return g.totalPointsEarned;
    if (g.rewardTransactions && g.rewardTransactions.length > 0) {
      return g.rewardTransactions.filter(t => t.activity === 'Points Credited').reduce((sum, t) => sum + (t.points > 0 ? t.points : 0), 0);
    }
    return 125;
  };

  const getGuestRedeemedPoints = (g: DashboardGuestItem): number => {
    if (g.pointsRedeemed !== undefined) return g.pointsRedeemed;
    if (g.rewardTransactions && g.rewardTransactions.length > 0) {
      return g.rewardTransactions.filter(t => t.activity === 'Points Redeemed').reduce((sum, t) => sum + Math.abs(t.points), 0);
    }
    return 40;
  };

  const getGuestAvailablePoints = (g: DashboardGuestItem): number => {
    return getGuestEarnedPoints(g) - getGuestRedeemedPoints(g);
  };

  const getGuestTransactions = (g: DashboardGuestItem): MemberRewardTransaction[] => {
    if (g.rewardTransactions && g.rewardTransactions.length > 0) {
      return g.rewardTransactions;
    }
    return [
      { id: `${g.id}-tx-1`, date: 'Sep 28, 2026', activity: 'Points Credited', stayOrBooking: g.cloudbedsReference || 'CB-10245', nights: 3, points: 3, status: 'Credited', notes: '3-night completed Cloudbeds stay' },
      { id: `${g.id}-tx-2`, date: 'Sep 15, 2026', activity: 'Points Credited', stayOrBooking: 'CB-10122', nights: 2, points: 2, status: 'Credited', notes: '2-night completed Cloudbeds stay' },
      { id: `${g.id}-tx-2b`, date: 'Sep 04, 2026', activity: 'Points Redeemed', stayOrBooking: 'EV-DINE-5521', squareRefId: 'sq_pos_dine_5521', points: -15, status: 'Redeemed', notes: 'Redeem fine dine through Square POS (Ref: SQ-FD-5521)' },
      { id: `${g.id}-tx-3`, date: 'Aug 29, 2026', activity: 'Points Redeemed', stayOrBooking: 'EV-BK-4019', squareRefId: `sq_red_${g.customerId?.toLowerCase() || '4019'}`, points: -40, status: 'Redeemed', notes: 'Suite booking reward redemption (Square POS)' },
      { id: `${g.id}-tx-3b`, date: 'Aug 20, 2026', activity: 'Points Redeemed', stayOrBooking: 'EV-GFT-9042', giftogramRefId: 'GFT-9042-X', points: -20, status: 'Redeemed', notes: 'Redeem through Giftogram $50 digital gift card (Ref: GFT-9042-X)' },
      { id: `${g.id}-tx-4`, date: 'Aug 14, 2026', activity: 'Points Credited', stayOrBooking: 'CB-10088', nights: 4, points: 4, status: 'Credited', notes: '4-night completed direct stay' },
      { id: `${g.id}-tx-5`, date: 'Jul 20, 2026', activity: 'Points Credited', stayOrBooking: 'CB-09941', nights: 5, points: 5, status: 'Credited', notes: '5-night completed direct stay' },
      { id: `${g.id}-tx-6`, date: 'Jun 11, 2026', activity: 'Points Credited', stayOrBooking: 'CB-09812', nights: 3, points: 3, status: 'Credited', notes: '3-night completed direct stay' },
    ];
  };

  const getTransactionCategory = (tx: MemberRewardTransaction): string => {
    if (tx.activity === 'Points Credited') {
      return 'Stay Credit';
    }
    const n = (tx.notes || '').toLowerCase();
    if (n.includes('dine') || n.includes('dining')) return 'Fine Dining';
    if (n.includes('gift') || n.includes('giftogram')) return 'Giftogram';
    if (n.includes('night') || n.includes('room') || n.includes('stay')) return 'Room Nights';
    return 'Reward Redemption';
  };

  const handleRewardPointsAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRewardsMember) return;
    const amt = Math.max(1, parseInt(rewardAdjNightsInput) || 1);
    const isAdd = rewardAdjAction.startsWith('Add');
    const absAmt = Math.abs(amt);

    const currentEarned = getGuestEarnedPoints(selectedRewardsMember);
    const currentRedeemed = getGuestRedeemedPoints(selectedRewardsMember);
    const currentAvailable = getGuestAvailablePoints(selectedRewardsMember);

    if (!isAdd && absAmt > currentAvailable) {
      addToast('error', 'Insufficient Available Balance', `Member only has ${currentAvailable} points available. Cannot deduct ${absAmt} points.`);
      return;
    }

    const ref = rewardAdjRefInput.trim() || `CB-ADJ-${Math.floor(10000 + Math.random() * 9000)}`;
    const reason = rewardAdjReasonInput.trim() || (isAdd ? 'Points credit adjustment' : 'Folio points deduction');

    const newTx: MemberRewardTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      activity: isAdd ? 'Points Credited' : 'Points Redeemed',
      stayOrBooking: ref,
      points: isAdd ? absAmt : -absAmt,
      status: isAdd ? 'Credited' : 'Redeemed',
      notes: `Adjustment: ${reason}`
    };

    const newTotalEarned = isAdd ? currentEarned + absAmt : currentEarned;
    const newTotalRedeemed = isAdd ? currentRedeemed : currentRedeemed + absAmt;
    const newAvailable = newTotalEarned - newTotalRedeemed;

    const updatedMember: DashboardGuestItem = {
      ...selectedRewardsMember,
      totalPointsEarned: newTotalEarned,
      pointsRedeemed: newTotalRedeemed,
      rewardNights: newAvailable,
      pointsBalance: newAvailable,
      rewardTransactions: [newTx, ...getGuestTransactions(selectedRewardsMember)]
    };

    setGuestsList(prev => prev.map(g => g.id === updatedMember.id ? updatedMember : g));
    setSelectedRewardsMember(updatedMember);
    setShowRewardAdjModal(false);
    setRewardAdjReasonInput('');
    setRewardAdjNightsInput('10');

    addToast(
      'success',
      'Reward Adjustment Logged',
      `${isAdd ? '+' : '-'}${absAmt} points recorded for ${selectedRewardsMember.name}. New available balance: ${newAvailable} points.`
    );
  };

  // Sidebar toggle state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Guest Management Filters state
  const [isGuestFiltersOpen, setIsGuestFiltersOpen] = useState<boolean>(true);
  const [guestFilterName, setGuestFilterName] = useState<string>('');
  const [guestFilterPhone, setGuestFilterPhone] = useState<string>('');
  const [guestFilterEmail, setGuestFilterEmail] = useState<string>('');
  const [guestFilterTier, setGuestFilterTier] = useState<string>('all');
  const [guestFilterStatus, setGuestFilterStatus] = useState<string>('all');
  const [guestFilterRewards, setGuestFilterRewards] = useState<string>('all');
  const [guestFilterJoinedYear, setGuestFilterJoinedYear] = useState<string>('all');
  const [guestQuickTierFilter, setGuestQuickTierFilter] = useState<'all' | 'Origins' | 'Prestige' | 'Elite' | 'Active'>('all');

  // Guest Management Sub-tab ('members' vs 'guest_users')
  const [guestManagementSubTab, setGuestManagementSubTab] = useState<'members' | 'guest_users'>('members');
  const [phoneGuestUsersList, setPhoneGuestUsersList] = useState<PhoneGuestUserBooking[]>(mockPhoneGuestUsers);
  const [guestUserSearch, setGuestUserSearch] = useState<string>('');
  const [guestUserRestaurantFilter, setGuestUserRestaurantFilter] = useState<'all' | 'Not Checked In' | 'Checked In' | 'Details Captured'>('all');
  const [guestUserStatusFilter, setGuestUserStatusFilter] = useState<'all' | 'Arriving' | 'In House' | 'Completed'>('all');

  // Modal for Restaurant Check-in & Guest User Details
  const [selectedGuestUserForModal, setSelectedGuestUserForModal] = useState<PhoneGuestUserBooking | null>(null);
  const [modalGuestName, setModalGuestName] = useState<string>('');
  const [modalGuestEmail, setModalGuestEmail] = useState<string>('');
  const [modalRestaurantCheckedIn, setModalRestaurantCheckedIn] = useState<boolean>(false);
  const [modalTableNumber, setModalTableNumber] = useState<string>('');
  const [modalGuestNotes, setModalGuestNotes] = useState<string>('');

  // Active Bookings Filter by Guest Type
  const [filterGuestType, setFilterGuestType] = useState<'all' | 'members' | 'guest_users'>('all');

  // Quick Access & Modals state
  const [activeQuickAccess, setActiveQuickAccess] = useState<QuickAccessTile | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPropName, setNewPropName] = useState<string>('');
  const [newPropManager, setNewPropManager] = useState<string>('');
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [managingProperty, setManagingProperty] = useState<AdminPropertyItem | null>(null);

  // Active Bookings state
  const [activeBookingsList, setActiveBookingsList] = useState<AdminActiveBooking[]>(mockActiveBookings);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);
  const [filterGuestName, setFilterGuestName] = useState<string>('');
  const [filterResNumber, setFilterResNumber] = useState<string>('');
  const [filterPhone, setFilterPhone] = useState<string>('');
  const [filterRoomType, setFilterRoomType] = useState<string>('all');
  const [filterCheckInDate, setFilterCheckInDate] = useState<string>('');
  const [filterCheckOutDate, setFilterCheckOutDate] = useState<string>('');
  const [filterBookingSource, setFilterBookingSource] = useState<string>('all');
  const [filterSuitesCount, setFilterSuitesCount] = useState<string>('all');
  const [filterBookingStatus, setFilterBookingStatus] = useState<string>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | 'today' | 'tomorrow' | '7days' | '30days'>('all');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<AdminActiveBooking | null>(null);
  const [showBookingHistoryModal, setShowBookingHistoryModal] = useState<boolean>(false);

  // Gift Requests state
  const [giftRequestsList, setGiftRequestsList] = useState<GiftCardRequestItem[]>(mockGiftCardRequests);
  const [giftFilterStatus, setGiftFilterStatus] = useState<'all' | 'pending' | 'fulfilled'>('all');
  const [giftSearchQuery, setGiftSearchQuery] = useState<string>('');
  const [editingNoteReq, setEditingNoteReq] = useState<GiftCardRequestItem | null>(null);
  const [quickNoteText, setQuickNoteText] = useState<string>('');

  // Guest Cases state
  const [guestCasesList, setGuestCasesList] = useState<GuestCaseItem[]>(mockGuestCases);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<GuestCaseItem | null>(null);
  const [editCaseStatus, setEditCaseStatus] = useState<'Open' | 'In Progress' | 'Resolved' | 'Closed'>('Open');
  const [editCasePriority, setEditCasePriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [editCaseAssignedRole, setEditCaseAssignedRole] = useState<string>('Front Desk');
  const [showCreateCaseModal, setShowCreateCaseModal] = useState<boolean>(false);
  const [newCaseMember, setNewCaseMember] = useState<string>('Emily Anderson');
  const [newCaseType, setNewCaseType] = useState<string>('Missing Stay');
  const [newCaseDesc, setNewCaseDesc] = useState<string>('');
  const [newCasePriority, setNewCasePriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [newCaseAssignedRole, setNewCaseAssignedRole] = useState<'Property Manager' | 'Front Desk'>('Property Manager');
  const [caseReplyNote, setCaseReplyNote] = useState<string>('');

  const openCaseModal = (item: GuestCaseItem) => {
    setSelectedCaseForModal(item);
    setEditCaseStatus(item.status);
    setEditCasePriority(item.priority);
    setEditCaseAssignedRole(item.assignedRole);
    setCaseReplyNote('');
  };

  // Guest Cases Filters state
  const [caseFilterSearch, setCaseFilterSearch] = useState<string>('');
  const [caseFilterRole, setCaseFilterRole] = useState<string>('all');
  const [caseFilterPriority, setCaseFilterPriority] = useState<string>('all');
  const [caseFilterStatus, setCaseFilterStatus] = useState<string>('all');
  const [isCaseFiltersOpen, setIsCaseFiltersOpen] = useState<boolean>(true);

  // Reporting state
  const [showMembershipReportModal, setShowMembershipReportModal] = useState<boolean>(false);
  const [showRewardsReportModal, setShowRewardsReportModal] = useState<boolean>(false);
  const [showRuleDecisionsModal, setShowRuleDecisionsModal] = useState<boolean>(false);
  const [membershipReportSearch, setMembershipReportSearch] = useState<string>('');
  const [rewardsReportFilter, setRewardsReportFilter] = useState<'all' | 'credits' | 'redemptions'>('all');

  // Users & Security state
  const [propertyUsersList, setPropertyUsersList] = useState<PropertyUserItem[]>(mockPropertyUsers);
  const [selectedSecurityProperty, setSelectedSecurityProperty] = useState<string | null>('Evolve Texarkana');
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserPhone, setNewUserPhone] = useState<string>('');
  const [newUserEmployeeId, setNewUserEmployeeId] = useState<string>('');
  const [newUserDesignation, setNewUserDesignation] = useState<string>('');
  const [newUserNotes, setNewUserNotes] = useState<string>('');
  const [selectedUserForModal, setSelectedUserForModal] = useState<PropertyUserItem | null>(null);
  const [showPropertySecurityLogModal, setShowPropertySecurityLogModal] = useState<boolean>(false);

  // Staff User Security & Manage Access View state
  const [selectedStaffUser, setSelectedStaffUser] = useState<PropertyUserItem | null>(null);
  const [editEmpId, setEditEmpId] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editDesignation, setEditDesignation] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [actionReason, setActionReason] = useState<string>('');
  const [selectedBreakfastOrder, setSelectedBreakfastOrder] = useState<{
    orderNumber: string;
    suiteNumber: string;
    guestName: string;
    pickupTime: string;
    platesCount: number;
    status: string;
    confirmationCode: string;
  } | null>(null);

  if (!currentAdmin) return null;

  // Filtered active bookings with Advanced Filters (matching attached view)
  const filteredBookings = activeBookingsList.filter(booking => {
    // 1. Guest Name
    if (filterGuestName.trim()) {
      const q = filterGuestName.toLowerCase().trim();
      if (!booking.guestName.toLowerCase().includes(q)) return false;
    }

    // 2. Reservation Number or Cloudbed ID
    if (filterResNumber.trim()) {
      const q = filterResNumber.toLowerCase().trim();
      const matchesConf = booking.confirmationCode.toLowerCase().includes(q);
      const matchesCb = booking.cloudbedsId ? booking.cloudbedsId.toLowerCase().includes(q) : false;
      if (!matchesConf && !matchesCb) return false;
    }

    // 3. Phone Number
    if (filterPhone.trim()) {
      const q = filterPhone.toLowerCase().trim();
      if (!booking.phone.toLowerCase().includes(q)) return false;
    }

    // 4. Room Type
    if (filterRoomType !== 'all') {
      if (!booking.roomType.toLowerCase().includes(filterRoomType.toLowerCase())) return false;
    }

    // 5. Check-in Date
    if (filterCheckInDate) {
      if (booking.startDate < filterCheckInDate) return false;
    }

    // 6. Check-out Date
    if (filterCheckOutDate) {
      if (booking.endDate > filterCheckOutDate) return false;
    }

    // 7. Booking Source
    if (filterBookingSource !== 'all') {
      if ((booking.bookingSource || 'Cloudbeds').toLowerCase() !== filterBookingSource.toLowerCase()) return false;
    }

    // 8. Number of Suites
    if (filterSuitesCount !== 'all') {
      if (filterSuitesCount === '3+') {
        if (booking.suitesCount < 3) return false;
      } else if (booking.suitesCount !== Number(filterSuitesCount)) {
        return false;
      }
    }

    // 9. Booking Status
    if (filterBookingStatus !== 'all') {
      if (booking.status.toLowerCase() !== filterBookingStatus.toLowerCase()) return false;
    }

    // 10. Guest / Account Type Filter
    if (filterGuestType !== 'all') {
      if (filterGuestType === 'guest_users' && !booking.isGuestUser) return false;
      if (filterGuestType === 'members' && booking.isGuestUser) return false;
    }

    // 11. Quick Timeline Filter
    if (selectedTimeFilter === 'today') {
      if (booking.startDate !== '2026-09-17' && booking.status !== 'Arriving') return false;
    } else if (selectedTimeFilter === 'tomorrow') {
      if (booking.startDate !== '2026-09-18') return false;
    } else if (selectedTimeFilter === '7days') {
      if (booking.startDate < '2026-09-17' || booking.startDate > '2026-09-24') return false;
    } else if (selectedTimeFilter === '30days') {
      if (booking.startDate < '2026-09-17' || booking.startDate > '2026-10-17') return false;
    }

    return true;
  });

  const activeFiltersCount = (
    (filterGuestName.trim() ? 1 : 0) +
    (filterResNumber.trim() ? 1 : 0) +
    (filterPhone.trim() ? 1 : 0) +
    (filterRoomType !== 'all' ? 1 : 0) +
    (filterCheckInDate ? 1 : 0) +
    (filterCheckOutDate ? 1 : 0) +
    (filterBookingSource !== 'all' ? 1 : 0) +
    (filterSuitesCount !== 'all' ? 1 : 0) +
    (filterBookingStatus !== 'all' ? 1 : 0) +
    (filterGuestType !== 'all' ? 1 : 0) +
    (selectedTimeFilter !== 'all' ? 1 : 0)
  );

  const handleResetFilters = () => {
    setFilterGuestName('');
    setFilterResNumber('');
    setFilterPhone('');
    setFilterRoomType('all');
    setFilterCheckInDate('');
    setFilterCheckOutDate('');
    setFilterBookingSource('all');
    setFilterSuitesCount('all');
    setFilterBookingStatus('all');
    setFilterGuestType('all');
    setSelectedTimeFilter('all');
    addToast('info', 'Filters Reset', 'All filter fields have been cleared.');
  };

  const handleApplyFilters = () => {
    addToast('success', 'Filters Applied', `Showing ${filteredBookings.length} matching reservations.`);
  };

  // Filtered Phone Guest Users (Guest Management nested tab)
  const filteredPhoneGuests = phoneGuestUsersList.filter(guest => {
    if (guestUserSearch.trim()) {
      const q = guestUserSearch.toLowerCase().trim();
      const matchPhone = guest.phone.toLowerCase().includes(q);
      const matchRef = guest.bookingRef.toLowerCase().includes(q);
      const matchName = guest.name ? guest.name.toLowerCase().includes(q) : false;
      const matchEmail = guest.email ? guest.email.toLowerCase().includes(q) : false;
      const matchRoom = guest.roomType.toLowerCase().includes(q) || guest.suiteNumber.toLowerCase().includes(q);
      if (!matchPhone && !matchRef && !matchName && !matchEmail && !matchRoom) return false;
    }

    if (guestUserStatusFilter !== 'all') {
      if (guest.status !== guestUserStatusFilter) return false;
    }
    return true;
  });

  // Modal Handlers for Guest User Details & Restaurant Check-In
  const openGuestUserDetailModal = (guest: PhoneGuestUserBooking) => {
    setSelectedGuestUserForModal(guest);
    setModalGuestName(guest.name || '');
    setModalGuestEmail(guest.email || '');
    setModalRestaurantCheckedIn(guest.restaurantStatus === 'Checked In' || guest.restaurantStatus === 'Details Captured');
    setModalTableNumber(guest.tableNumber || '');
    setModalGuestNotes(guest.notes || '');
  };

  const handleSaveGuestUserDetails = () => {
    if (!selectedGuestUserForModal) return;
    const updatedNotes = modalGuestNotes.trim();

    // 1. Update phoneGuestUsersList
    setPhoneGuestUsersList(prev => prev.map(item => {
      if (item.id === selectedGuestUserForModal.id || item.bookingRef === selectedGuestUserForModal.bookingRef) {
        return {
          ...item,
          notes: updatedNotes,
        };
      }
      return item;
    }));

    // 2. Update corresponding entry in activeBookingsList
    setActiveBookingsList(prev => prev.map(b => {
      if (b.confirmationCode === selectedGuestUserForModal.bookingRef || b.phone === selectedGuestUserForModal.phone) {
        return {
          ...b,
          notes: updatedNotes,
        };
      }
      return b;
    }));

    // 3. Update selectedBookingDetails if open
    if (selectedBookingDetails && (selectedBookingDetails.confirmationCode === selectedGuestUserForModal.bookingRef || selectedBookingDetails.phone === selectedGuestUserForModal.phone)) {
      setSelectedBookingDetails(prev => prev ? {
        ...prev,
        notes: updatedNotes,
      } : null);
    }

    addToast('success', 'Notes Saved', `Updated notes for ${selectedGuestUserForModal.name || selectedGuestUserForModal.phone}.`);
    setSelectedGuestUserForModal(null);
  };

  const openGuestUserModalFromBooking = (booking: AdminActiveBooking) => {
    const existingGuest = phoneGuestUsersList.find(g => g.bookingRef === booking.confirmationCode || g.phone === booking.phone);
    if (existingGuest) {
      openGuestUserDetailModal(existingGuest);
    } else {
      const synth: PhoneGuestUserBooking = {
        id: `phone-guest-${Date.now()}`,
        phone: booking.phone,
        name: booking.guestName || 'Guest User',
        email: booking.email,
        bookingRef: booking.confirmationCode,
        bookingDate: booking.bookingDate || 'Oct 04, 2026',
        checkInDate: booking.startDate,
        checkOutDate: booking.endDate,
        dateRange: booking.dateRange,
        roomType: booking.roomType,
        suiteNumber: booking.suiteNumber || '104',
        adultsCount: booking.adultsCount || 1,
        totalAmount: booking.totalAmount || '$350.00',
        status: (booking.status === 'Cancelled' ? 'Cancelled' : booking.status === 'Completed' ? 'Completed' : booking.status === 'In House' ? 'In House' : 'Arriving'),
        hasBreakfastAccess: false,
        restaurantStatus: booking.restaurantStatus || 'Not Checked In',
        tableNumber: booking.tableNumber,
        notes: booking.notes
      };
      openGuestUserDetailModal(synth);
    }
  };

  // Filtered properties
  const filteredProperties = propertiesList.filter(prop => {
    if (selectedFilter === 'active') return prop.status === 'Active';
    if (selectedFilter === 'pre_launch') return prop.status === 'Pre-Launch';
    return true;
  });

  // Filtered guests based on search input (Dashboard) and Advanced Filters (Guest Management)
  const filteredGuests = guestsList.filter(g => {
    if (activeTab === 'dashboard') {
      if (!guestSearchQuery.trim()) return true;
      const q = guestSearchQuery.toLowerCase().trim();
      return (
        g.name.toLowerCase().includes(q) ||
        (g.customerId && g.customerId.toLowerCase().includes(q)) ||
        (g.squareId && g.squareId.toLowerCase().includes(q)) ||
        g.phone.includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.tier.toLowerCase().includes(q) ||
        (g.accountStatus && g.accountStatus.toLowerCase().includes(q))
      );
    }

    // 1. Name, Customer ID, or Square ID
    if (guestFilterName.trim()) {
      const q = guestFilterName.toLowerCase().trim();
      const matchName = g.name.toLowerCase().includes(q);
      const matchCustId = (g.customerId || '').toLowerCase().includes(q);
      const matchSquareId = (g.squareId || '').toLowerCase().includes(q);
      if (!matchName && !matchCustId && !matchSquareId) return false;
    }

    // 2. Phone No
    if (guestFilterPhone.trim()) {
      if (!g.phone.toLowerCase().includes(guestFilterPhone.toLowerCase().trim())) return false;
    }

    // 3. Email
    if (guestFilterEmail.trim()) {
      if (!g.email.toLowerCase().includes(guestFilterEmail.toLowerCase().trim())) return false;
    }

    // 4. Tier
    if (guestFilterTier !== 'all') {
      if (g.tier.toLowerCase() !== guestFilterTier.toLowerCase()) return false;
    }

    // 5. Status
    if (guestFilterStatus !== 'all') {
      if ((g.accountStatus || 'Active').toLowerCase() !== guestFilterStatus.toLowerCase()) return false;
    }

    // 6. Rewards
    if (guestFilterRewards !== 'all') {
      const nights = g.rewardNights ?? 0;
      if (guestFilterRewards === '1+' && nights < 1) return false;
      if (guestFilterRewards === '5+' && nights < 5) return false;
      if (guestFilterRewards === '10+' && nights < 10) return false;
      if (guestFilterRewards === '20+' && nights < 20) return false;
    }

    // 7. Member Since
    if (guestFilterJoinedYear !== 'all') {
      if (!g.joinedDate || !g.joinedDate.includes(guestFilterJoinedYear)) return false;
    }

    // 8. Quick Shortcut
    if (guestQuickTierFilter === 'Active') {
      if ((g.accountStatus || 'Active') !== 'Active') return false;
    } else if (guestQuickTierFilter !== 'all') {
      if (g.tier !== guestQuickTierFilter) return false;
    }

    return true;
  });

  const activeGuestFiltersCount = (
    (guestFilterName.trim() ? 1 : 0) +
    (guestFilterPhone.trim() ? 1 : 0) +
    (guestFilterEmail.trim() ? 1 : 0) +
    (guestFilterTier !== 'all' ? 1 : 0) +
    (guestFilterStatus !== 'all' ? 1 : 0) +
    (guestFilterRewards !== 'all' ? 1 : 0) +
    (guestFilterJoinedYear !== 'all' ? 1 : 0) +
    (guestQuickTierFilter !== 'all' ? 1 : 0)
  );

  const handleResetGuestFilters = () => {
    setGuestFilterName('');
    setGuestFilterPhone('');
    setGuestFilterEmail('');
    setGuestFilterTier('all');
    setGuestFilterStatus('all');
    setGuestFilterRewards('all');
    setGuestFilterJoinedYear('all');
    setGuestQuickTierFilter('all');
    addToast('info', 'Filters Reset', 'All guest filters have been cleared.');
  };

  const handleApplyGuestFilters = () => {
    addToast('success', 'Filters Applied', `Showing ${filteredGuests.length} matching members.`);
  };

  // Filtered Guest Cases for Evolve Texarkana
  const filteredGuestCases = guestCasesList.filter(c => {
    if (c.property !== 'Evolve Texarkana' && c.property !== 'All') return false;

    // 1. Search filter (Case No, Guest Name, Title)
    if (caseFilterSearch.trim()) {
      const q = caseFilterSearch.toLowerCase().trim();
      const matchNo = (c.caseNumber || '').toLowerCase().includes(q);
      const matchName = (c.guestName || '').toLowerCase().includes(q);
      const matchTitle = (c.title || '').toLowerCase().includes(q);
      if (!matchNo && !matchName && !matchTitle) return false;
    }

    // 2. Assigned To filter
    if (caseFilterRole !== 'all') {
      if ((c.assignedRole || '').toLowerCase() !== caseFilterRole.toLowerCase()) return false;
    }

    // 3. Priority filter
    if (caseFilterPriority !== 'all') {
      if ((c.priority || '').toLowerCase() !== caseFilterPriority.toLowerCase()) return false;
    }

    // 4. Status filter
    if (caseFilterStatus !== 'all') {
      if ((c.status || '').toLowerCase() !== caseFilterStatus.toLowerCase()) return false;
    }

    return true;
  });

  const activeCaseFiltersCount = (
    (caseFilterSearch.trim() ? 1 : 0) +
    (caseFilterRole !== 'all' ? 1 : 0) +
    (caseFilterPriority !== 'all' ? 1 : 0) +
    (caseFilterStatus !== 'all' ? 1 : 0)
  );

  const handleResetCaseFilters = () => {
    setCaseFilterSearch('');
    setCaseFilterRole('all');
    setCaseFilterPriority('all');
    setCaseFilterStatus('all');
    addToast('info', 'Filters Reset', 'All guest case filters have been cleared.');
  };

  // Handle Add Property
  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim()) {
      addToast('error', 'Required Field', 'Please enter a property name.');
      return;
    }

    const newProperty: AdminPropertyItem = {
      id: `prop-${Date.now()}`,
      name: newPropName.trim(),
      membersCount: 0,
      openCasesCount: 0,
      managerName: newPropManager.trim() || 'Unassigned',
      status: 'Pre-Launch',
      integrationReadiness: 'Credentials required',
    };

    setPropertiesList([newProperty, ...propertiesList]);
    setNewPropName('');
    setNewPropManager('');
    setShowAddModal(false);
    addToast('success', 'Property Added', `${newProperty.name} has been created in Pre-Launch status.`);
  };

  // Handle Guest Update
  const handleSaveGuestUpdate = () => {
    if (!selectedGuest) return;
    const pts = parseInt(pointAdjustment) || 0;
    const nights = parseInt(nightsAdjustment) || 0;
    const updatedPoints = Math.max(0, (selectedGuest.pointsBalance || 0) + pts);
    const updatedNights = Math.max(0, (selectedGuest.rewardNights || 0) + nights);

    const updated = guestsList.map(g =>
      g.id === selectedGuest.id ? {
        ...g,
        tier: editTier,
        pointsBalance: updatedPoints,
        rewardNights: updatedNights,
      } : g
    );

    setGuestsList(updated);
    const reasonMsg = guestAuditReason.trim() ? `Audit reason logged: "${guestAuditReason.trim()}".` : 'Routine manager review.';
    addToast('success', 'Member Record Updated', `${selectedGuest.name}'s account has been adjusted. ${reasonMsg}`);
    setSelectedGuest(null);
    setPointAdjustment('');
    setNightsAdjustment('');
    setGuestAuditReason('');
  };

  // Open Guest Profile with Sub-view routing
  const openGuestProfile = (guest: DashboardGuestItem, initialView: 'profile' | 'editProfile' | 'changePhone' | 'rewardAdjustment' | 'latestStay' | 'redemptions' | 'cases' = 'profile') => {
    setSelectedGuest(guest);
    const resolvedView = (isFrontDesk && ['editProfile', 'changePhone', 'rewardAdjustment'].includes(initialView)) ? 'profile' : initialView;
    setGuestModalView(resolvedView);
    setEditGuestName(guest.name);
    setEditGuestEmail(guest.email);
    setEditGuestPhone(guest.phone);
    setEditCloudbedsRef(guest.cloudbedsReference || 'CB-10482');
    setEditAccountStatus(guest.accountStatus || 'Active');
    setEditAccountStatusReason('');
    setIsEditingPhone(false);
    setNewMobileNumber('');
    setPhoneVerifyMethod('Code to current phone');
    setPhoneAuditNote('');
    setRewardAdjType('Add Reward Points');
    setRewardAdjNights('10');
    setRewardAdjReason('');
    setRewardAdjRef('');
    if (guest.commPreferences) {
      setCommPrefStayMessages(guest.commPreferences.stayMessages);
      setCommPrefRewardConfirmations(guest.commPreferences.rewardConfirmations);
      setCommPrefSmsMarketing(guest.commPreferences.smsMarketing);
      setCommPrefEmailMarketing(guest.commPreferences.emailMarketing);
    } else {
      setCommPrefStayMessages(true);
      setCommPrefRewardConfirmations(true);
      setCommPrefSmsMarketing(true);
      setCommPrefEmailMarketing(true);
    }
  };

  // Save Account Info & Communication Preferences
  const handleSaveAccountInfo = () => {
    if (!selectedGuest) return;
    const finalPhone = isEditingPhone && newMobileNumber.trim() ? newMobileNumber.trim() : editGuestPhone;
    const isStatusChanged = editAccountStatus !== (selectedGuest.accountStatus || 'Active');
    const updatedGuest: DashboardGuestItem = {
      ...selectedGuest,
      name: editGuestName,
      email: editGuestEmail,
      phone: finalPhone,
      cloudbedsReference: editCloudbedsRef,
      accountStatus: editAccountStatus,
      commPreferences: {
        stayMessages: commPrefStayMessages,
        rewardConfirmations: commPrefRewardConfirmations,
        smsMarketing: commPrefSmsMarketing,
        emailMarketing: commPrefEmailMarketing,
      },
    };
    const updated = guestsList.map(g => g.id === selectedGuest.id ? updatedGuest : g);
    setGuestsList(updated);
    setSelectedGuest(updatedGuest);
    if (isStatusChanged) {
      addToast(
        editAccountStatus === 'Active' ? 'success' : 'info',
        'Account Status Updated',
        `${editGuestName}'s status set to ${editAccountStatus}${editAccountStatusReason.trim() ? ` — Reason: ${editAccountStatusReason.trim()}` : ''}.`
      );
    } else {
      addToast('success', 'Profile Updated', `Account details & communication preferences saved for ${editGuestName}.`);
    }
    setGuestModalView('profile');
  };

  // Verify and Replace Phone
  const handleVerifyAndReplacePhone = () => {
    if (!selectedGuest) return;
    if (!newMobileNumber.trim()) {
      addToast('error', 'Phone Required', 'Please enter a valid new mobile number.');
      return;
    }
    const updatedGuest: DashboardGuestItem = {
      ...selectedGuest,
      phone: newMobileNumber.trim(),
    };
    const updated = guestsList.map(g => g.id === selectedGuest.id ? updatedGuest : g);
    setGuestsList(updated);
    setSelectedGuest(updatedGuest);
    setEditGuestPhone(newMobileNumber.trim());
    setIsEditingPhone(false);
    addToast('success', 'Phone Verified & Replaced', `Primary identifier updated to ${newMobileNumber.trim()} for ${selectedGuest.name}.`);
    setGuestModalView('profile');
  };

  // Save Communication Preferences
  const handleSaveCommPreferences = () => {
    if (!selectedGuest) return;
    const updatedGuest: DashboardGuestItem = {
      ...selectedGuest,
      commPreferences: {
        stayMessages: commPrefStayMessages,
        rewardConfirmations: commPrefRewardConfirmations,
        smsMarketing: commPrefSmsMarketing,
        emailMarketing: commPrefEmailMarketing,
      },
    };
    const updated = guestsList.map(g => g.id === selectedGuest.id ? updatedGuest : g);
    setGuestsList(updated);
    setSelectedGuest(updatedGuest);
    addToast('success', 'Preferences Saved', `Communication preferences updated for ${selectedGuest.name}.`);
    setGuestModalView('profile');
  };

  // Confirm and Add Reward Adjustment to Audit Log
  const handleConfirmRewardAdjustment = () => {
    if (!selectedGuest) return;
    const amt = Math.max(1, parseInt(rewardAdjNights, 10) || 1);
    const isAdd = rewardAdjType.startsWith('Add');
    const absAmt = Math.abs(amt);

    const currentEarned = getGuestEarnedPoints(selectedGuest);
    const currentRedeemed = getGuestRedeemedPoints(selectedGuest);
    const currentAvailable = getGuestAvailablePoints(selectedGuest);

    if (!isAdd && absAmt > currentAvailable) {
      addToast('error', 'Insufficient Available Balance', `Member only has ${currentAvailable} points available. Cannot deduct ${absAmt} points.`);
      return;
    }

    const ref = rewardAdjRef.trim() || `CB-ADJ-${Math.floor(10000 + Math.random() * 9000)}`;
    const reason = rewardAdjReason.trim() || (isAdd ? 'Points credit adjustment' : 'Folio points deduction');

    const newTx: MemberRewardTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      activity: isAdd ? 'Points Credited' : 'Points Redeemed',
      stayOrBooking: ref,
      points: isAdd ? absAmt : -absAmt,
      status: isAdd ? 'Credited' : 'Redeemed',
      notes: `Adjustment: ${reason}`
    };

    const newTotalEarned = isAdd ? currentEarned + absAmt : currentEarned;
    const newTotalRedeemed = isAdd ? currentRedeemed : currentRedeemed + absAmt;
    const newAvailable = newTotalEarned - newTotalRedeemed;

    const updatedGuest: DashboardGuestItem = {
      ...selectedGuest,
      rewardNights: newAvailable,
      pointsBalance: newAvailable,
      totalPointsEarned: newTotalEarned,
      pointsRedeemed: newTotalRedeemed,
      rewardTransactions: [newTx, ...getGuestTransactions(selectedGuest)]
    };

    const updated = guestsList.map(g => g.id === selectedGuest.id ? updatedGuest : g);
    setGuestsList(updated);
    setSelectedGuest(updatedGuest);

    addToast('success', 'Reward Adjustment Logged', `${isAdd ? '+' : '-'}${absAmt} points recorded for ${selectedGuest.name}. New available balance: ${newAvailable} points.`);
    setGuestModalView('profile');
  };



  // Manual Status Dropdown Update (Pending or Done) for Gift Requests
  const handleToggleGiftStatus = (reqId: string, newStatus: 'pending' | 'fulfilled') => {
    const target = giftRequestsList.find(r => r.id === reqId);
    if (!target) return;
    const isDone = newStatus === 'fulfilled';
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const processedDate = isDone ? (target.dateProcessed || todayStr) : undefined;

    setGiftRequestsList(prev => prev.map(req =>
      req.id === reqId ? {
        ...req,
        status: newStatus,
        statusText: isDone ? 'Delivered via Giftogram' : 'Awaiting Giftogram fulfillment',
        dateProcessed: processedDate,
        deliveredDate: isDone ? (req.deliveredDate || todayStr) : undefined,
      } : req
    ));
    addToast(
      'success',
      isDone ? 'Status Updated: Done' : 'Status Updated: Pending',
      `${target.requestCode} (${target.guestName}) status set to ${isDone ? `Done (Date Processed: ${processedDate})` : 'Pending'}.`
    );
  };

  // Open Giftogram in new tab for direct fulfillment
  const handleOpenGiftogramFulfill = () => {
    window.open('https://www.giftogram.com', '_blank', 'noopener,noreferrer');
  };

  // Quick Save Note for a Gift Request
  const handleSaveGiftNote = () => {
    if (!editingNoteReq) return;
    const trimmed = quickNoteText.trim();
    setGiftRequestsList(prev => prev.map(req =>
      req.id === editingNoteReq.id ? { ...req, notes: trimmed } : req
    ));
    addToast('success', 'Note Saved', `Notes updated for ${editingNoteReq.requestCode} (${editingNoteReq.guestName}).`);
    setEditingNoteReq(null);
  };

  // Quick Inline Status Update from Cases Table (allows Front Desk and Property Manager to instantly resolve or progress cases)
  const handleInlineCaseStatusChange = (caseId: string, newStatus: 'Open' | 'In Progress' | 'Resolved' | 'Closed') => {
    const targetCase = guestCasesList.find(c => c.id === caseId);
    if (!targetCase) return;
    const authorRole = currentAdmin.role === 'front_desk' ? 'Front Desk' : 'Property Manager';
    const newNote = {
      author: currentAdmin.name,
      role: authorRole,
      time: 'Just now',
      message: `Status updated from ${targetCase.status} to ${newStatus}.`
    };
    const updatedList = guestCasesList.map(c =>
      c.id === caseId ? {
        ...c,
        status: newStatus,
        updatedBy: currentAdmin.name,
        timelineUpdates: [...(c.timelineUpdates || []), newNote]
      } : c
    );
    setGuestCasesList(updatedList);
    addToast('success', 'Case Status Updated', `${targetCase.caseNumber} marked as ${newStatus}. All roles updated.`);
  };

  // Handle Update / Resolve Shared Case from Modal (supports status, priority, role edits, and review notes)
  const handleAddCaseNote = (statusOverride?: 'Open' | 'In Progress' | 'Resolved' | 'Closed') => {
    if (!selectedCaseForModal) return;
    const finalStatus = statusOverride || editCaseStatus || selectedCaseForModal.status;
    const finalPriority = editCasePriority || selectedCaseForModal.priority;
    const finalAssignedRole = editCaseAssignedRole || selectedCaseForModal.assignedRole;

    const authorRole = currentAdmin.role === 'front_desk' ? 'Front Desk' : 'Property Manager';
    const noteText = caseReplyNote.trim();

    const hasStatusChange = finalStatus !== selectedCaseForModal.status;
    const hasPriorityChange = finalPriority !== selectedCaseForModal.priority;
    const hasRoleChange = finalAssignedRole !== selectedCaseForModal.assignedRole;

    if (!noteText && !hasStatusChange && !hasPriorityChange && !hasRoleChange && !statusOverride) {
      setSelectedCaseForModal(null);
      return;
    }

    let noteMessage = noteText;
    if (!noteMessage) {
      const details: string[] = [];
      if (hasStatusChange) details.push(`Status updated to ${finalStatus}`);
      if (hasRoleChange) details.push(`Reassigned to ${finalAssignedRole}`);
      if (hasPriorityChange) details.push(`Priority changed to ${finalPriority}`);
      noteMessage = details.join(' • ');
    }

    const newNote = noteMessage ? {
      author: currentAdmin.name,
      role: authorRole,
      time: 'Just now',
      message: noteMessage
    } : null;

    const updatedTimeline = newNote
      ? [...(selectedCaseForModal.timelineUpdates || []), newNote]
      : selectedCaseForModal.timelineUpdates;

    const updatedList = guestCasesList.map(c =>
      c.id === selectedCaseForModal.id ? {
        ...c,
        status: finalStatus,
        priority: finalPriority,
        assignedRole: finalAssignedRole,
        updatedBy: currentAdmin.name,
        timelineUpdates: updatedTimeline
      } : c
    );

    setGuestCasesList(updatedList);
    const msg = finalStatus === 'Resolved' 
      ? `${selectedCaseForModal.caseNumber} marked as Resolved.` 
      : `${selectedCaseForModal.caseNumber} updated to ${finalStatus}.`;
    addToast('success', 'Shared Case Updated', msg);
    setSelectedCaseForModal(null);
    setCaseReplyNote('');
  };

  // Handle Create Case
  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const creatorRole = currentAdmin.role === 'front_desk' ? 'Front Desk' : 'Property Manager';
    const newCase: GuestCaseItem = {
      id: `case-${Date.now()}`,
      caseNumber: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newCaseType,
      property: 'Evolve Texarkana',
      guestName: newCaseMember,
      description: newCaseDesc.trim() || 'Guest inquiry logged for review',
      priority: newCasePriority,
      assignedRole: newCaseAssignedRole,
      updatedBy: currentAdmin.name,
      status: 'Open',
      createdDate: 'Today',
      timelineUpdates: [
        {
          author: currentAdmin.name,
          role: creatorRole,
          time: 'Just now',
          message: `Case opened by ${currentAdmin.name} (${creatorRole}) and assigned to ${newCaseAssignedRole}: ${newCaseDesc.trim() || 'New guest operations inquiry.'}`
        }
      ]
    };

    setGuestCasesList([newCase, ...guestCasesList]);
    addToast('success', 'Guest Case Created', `${newCase.caseNumber} assigned to ${newCaseAssignedRole} and logged in shared ledger.`);
    setShowCreateCaseModal(false);
    setNewCaseDesc('');
    setNewCaseAssignedRole('Property Manager');
  };

  // Handle Add Front Desk User
  const handleAddFrontDeskUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      addToast('error', 'Missing Information', 'Please provide a full name and business email.');
      return;
    }

    const nextIdNum = 100 + propertyUsersList.length + 1;
    const empId = newUserEmployeeId.trim() || `EMP-${nextIdNum}`;
    const newUser: PropertyUserItem = {
      id: `FD-${nextIdNum}`,
      employeeId: empId,
      name: newUserName.trim(),
      role: 'Front Desk',
      designation: newUserDesignation.trim() || 'Front Desk Associate',
      property: 'Evolve Texarkana',
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+1 (903) 555-0199',
      notes: newUserNotes.trim(),
      status: 'Active',
      twoFactorRequirement: 'Mandatory',
      recoveryIssuesCount: 0,
      lastActive: 'Provisioned just now',
    };

    setPropertyUsersList([...propertyUsersList, newUser]);
    addToast('success', 'Front Desk Officer Added', `${newUser.name} (${newUser.employeeId || newUser.id}) provisioned for Evolve Texarkana. 2FA enrollment email dispatched.`);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserEmployeeId('');
    setNewUserDesignation('');
    setNewUserNotes('');
  };

  // Handle Toggle User Access
  const handleToggleUserAccess = (userId: string) => {
    setPropertyUsersList(propertyUsersList.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        addToast(nextStatus === 'Active' ? 'success' : 'info', 'Security Status Updated', `${u.name} is now ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    if (selectedUserForModal && selectedUserForModal.id === userId) {
      setSelectedUserForModal({
        ...selectedUserForModal,
        status: selectedUserForModal.status === 'Active' ? 'Inactive' : 'Active'
      });
    }
  };

  // Open Manage Access / Staff Security view
  const handleOpenManageAccess = (user: PropertyUserItem) => {
    setSelectedStaffUser(user);
    setEditEmpId(user.employeeId || user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditDesignation(user.designation || user.role);
    setEditNotes(user.notes || '');
    setActionReason('');
  };

  // Save editable Front Desk staff details
  const handleSaveStaffDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffUser) return;
    if (!editName.trim() || !editEmail.trim()) {
      addToast('error', 'Missing Information', 'Officer full name and business email are required.');
      return;
    }

    const updatedUser: PropertyUserItem = {
      ...selectedStaffUser,
      employeeId: editEmpId.trim() || selectedStaffUser.employeeId,
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      designation: editDesignation.trim(),
      notes: editNotes.trim(),
    };

    setPropertyUsersList(propertyUsersList.map(u => u.id === selectedStaffUser.id ? updatedUser : u));
    setSelectedStaffUser(updatedUser);
    addToast('success', 'Staff Details Saved', `${updatedUser.name} (${updatedUser.employeeId || updatedUser.id}) details updated successfully.`);
  };

  // Toggle staff account access (Disable / Enable)
  const handleToggleStaffAccess = () => {
    if (!selectedStaffUser) return;
    const nextStatus = selectedStaffUser.status === 'Active' ? 'Inactive' : 'Active';
    const updatedUser: PropertyUserItem = {
      ...selectedStaffUser,
      status: nextStatus,
    };

    setPropertyUsersList(propertyUsersList.map(u => u.id === selectedStaffUser.id ? updatedUser : u));
    setSelectedStaffUser(updatedUser);

    if (nextStatus === 'Inactive') {
      addToast('info', 'Access Disabled', `${selectedStaffUser.name}'s account access has been disabled${actionReason ? `: "${actionReason}"` : '.'}`);
    } else {
      addToast('success', 'Access Enabled', `${selectedStaffUser.name}'s account access has been re-enabled.`);
    }
    setActionReason('');
  };

  // Delete staff account
  const handleDeleteStaffAccount = () => {
    if (!selectedStaffUser) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete the account for ${selectedStaffUser.name}? This action cannot be undone.`);
    if (!confirmDelete) return;

    setPropertyUsersList(propertyUsersList.filter(u => u.id !== selectedStaffUser.id));
    addToast('info', 'Staff Account Deleted', `${selectedStaffUser.name} (${selectedStaffUser.employeeId || selectedStaffUser.id}) account has been deleted.`);
    setSelectedStaffUser(null);
  };

  // All 8 menu items matching screenshot 1
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['property_manager'] },
    { id: 'bookings', label: 'Active Bookings', icon: CalendarDays, roles: ['property_manager', 'front_desk'] },
    { id: 'guests', label: 'Guest Management', icon: Users, roles: ['property_manager', 'front_desk'] },
    { id: 'rewards', label: 'Rewards', icon: Award, roles: ['property_manager'] },
    { id: 'gifts', label: 'Gift Requests', icon: Gift, roles: ['property_manager'] },
    { id: 'cases', label: 'Cases', icon: AlertCircle, roles: ['property_manager', 'front_desk'] },
    { id: 'reporting', label: 'Reporting', icon: BarChart3, roles: ['property_manager'] },
    { id: 'security', label: 'Users & Security', icon: ShieldCheck, roles: ['property_manager'] },
  ];

  // Role-filtered sidebar menu items: Property Manager has full access, Front Desk has limited operational access
  const menuItems = allMenuItems.filter(item => item.roles.includes(currentAdmin.role));

  // Automatically enforce tab clearance: fallback unauthorized tabs to allowed initial tab
  useEffect(() => {
    const allowed = allMenuItems.filter(item => item.roles.includes(currentAdmin.role)).map(i => i.id);
    if (!allowed.includes(activeTab)) {
      setActiveTab(isFrontDesk ? 'bookings' : 'dashboard');
    }
  }, [currentAdmin.role, activeTab, isFrontDesk]);

  return (
    <div className="admin-ops-layout">
      {/* ===================================================================
          LEFT SIDEBAR: OPERATIONS (MATCHING SCREENSHOT 1)
      =================================================================== */}
      <aside className={`admin-ops-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          {/* Operations Brand Title with Gold Eyebrow and Hamburger Menu Button */}
          {!isSidebarCollapsed ? (
            <div className="admin-ops-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="admin-ops-brand-eyebrow">EVOLVE ADMINISTRATION</span>
                <h2 className="admin-ops-title">Operations</h2>
              </div>
              <button
                type="button"
                className="admin-ops-toggle-btn"
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
                className="admin-ops-toggle-btn"
                onClick={() => setIsSidebarCollapsed(false)}
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <Menu size={18} />
              </button>
            </div>
          )}

          {/* Navigation Links (8 Items) */}
          <nav className="admin-ops-nav">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.label}
                  className={`admin-ops-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Card */}
        <div className="admin-ops-profile-card">
          <div className="admin-ops-profile-info">
            <div className="admin-ops-avatar" title={`${currentAdmin.name} (${currentAdmin.role === 'property_manager' ? 'Property Manager' : 'Front Desk'})`}>
              {currentAdmin.name.charAt(0)}
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div className="admin-ops-name">{currentAdmin.name}</div>
                <div className="admin-ops-role-badge">
                  {currentAdmin.role === 'property_manager' ? 'PROPERTY MANAGER • FULL ACCESS' : 'FRONT DESK • VIEW ONLY ACCESS'}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="admin-ops-logout-btn"
            onClick={() => navigateTo('landing')}
            title="Return to Public Hotel Website"
            style={{ marginRight: '6px' }}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="admin-ops-logout-btn"
            onClick={logoutAdmin}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ===================================================================
          MAIN CONTENT AREA
      =================================================================== */}
      <main className="admin-ops-main">
        {activeTab === 'dashboard' ? (
          /* ===============================================================
             MAIN DASHBOARD VIEW (MODERN LUXURY EXECUTIVE OVERVIEW)
          =============================================================== */
          <div>
            {/* Executive Header Banner */}
            <div className="admin-dash-header-banner">
              <div>
                <div className="admin-dash-telemetry-badge">
                  <span className="admin-pulse-indicator" />
                  <span className="admin-telemetry-text">Hospitality Operations Live</span>
                  <span className="admin-telemetry-sep">•</span>
                  <span className="admin-telemetry-prop">Evolve Estate & Suites</span>
                </div>
                <h1 className="admin-dash-title">Executive Management Overview</h1>
                <p className="admin-dash-subtitle">
                  Real-time telemetry across guest loyalty tiers, active reservations, and automated ledger activity.
                </p>
              </div>
            </div>

            {/* 1. TOP 4 KPI METRIC CARDS */}
            <div className="admin-kpi-grid">
              {mockDashboardMetrics.map(metric => {
                let IconComp = Users;
                let iconBg = '#f0fdf4';
                let iconColor = '#166534';

                if (metric.id === 'bookings') {
                  IconComp = Building2;
                  iconBg = '#eff6ff';
                  iconColor = '#2563eb';
                } else if (metric.id === 'rewards') {
                  IconComp = Award;
                  iconBg = '#fefce8';
                  iconColor = '#ca8a04';
                } else if (metric.id === 'alerts') {
                  IconComp = AlertCircle;
                  iconBg = '#fff1f2';
                  iconColor = '#e11d48';
                }

                return (
                  <div key={metric.id} className="admin-kpi-card">
                    <div>
                      <div className="admin-kpi-top">
                        <span className="admin-kpi-label">{metric.label}</span>
                        <div className="admin-kpi-icon-wrap" style={{ backgroundColor: iconBg, color: iconColor }}>
                          <IconComp size={18} />
                        </div>
                      </div>
                      <div className="admin-kpi-value">{metric.value}</div>
                      <div className="admin-kpi-subtext">{metric.subtext}</div>
                    </div>
                    <div className="admin-kpi-footer">
                      <button
                        type="button"
                        className="admin-kpi-action"
                        onClick={() => {
                          if (metric.actionTab) setActiveTab(metric.actionTab);
                        }}
                      >
                        <span>{metric.actionText.replace(' →', '')}</span>
                        <ArrowRight size={14} className="admin-kpi-arrow" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. MIDDLE TWO-COLUMN SECTION */}
            <div className="admin-dash-two-col">
              {/* LEFT COLUMN: GUEST MANAGEMENT CARD */}
              <div className="admin-dash-card">
                <div className="admin-dash-card-header">
                  <h2 className="admin-dash-card-title">Guest Management</h2>
                  <button
                    type="button"
                    className="admin-link-action"
                    onClick={() => setActiveTab('guests')}
                    title="Open full members directory with Square POS status"
                  >
                    <span>View Members Table</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Search Input with Search Icon and Clear button */}
                <div className="admin-dash-search-wrap">
                  <Search size={15} className="admin-dash-search-icon" />
                  <input
                    type="text"
                    className="admin-guest-search-input"
                    placeholder="Search guest name, phone, email, Evolve ID, or Square ID..."
                    value={guestSearchQuery}
                    onChange={(e) => setGuestSearchQuery(e.target.value)}
                  />
                  {guestSearchQuery && (
                    <button
                      type="button"
                      className="admin-search-clear-btn"
                      onClick={() => setGuestSearchQuery('')}
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Guest List */}
                <div className="admin-guest-list">
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map(guest => {
                      const initials = guest.name
                        .split(' ')
                        .filter(Boolean)
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase() || 'GU';

                      const tierLower = (guest.tier || '').toLowerCase();
                      const tierBadgeStyle =
                        tierLower === 'prestige'
                          ? { bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
                          : tierLower === 'elite'
                          ? { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }
                          : { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' };

                      return (
                        <div key={guest.id} className="admin-guest-item">
                          <div className="admin-guest-left">
                            <div className="admin-guest-avatar">
                              {initials}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span className="admin-guest-name">{guest.name}</span>
                                <span className="admin-guest-id-chip">
                                  {guest.customerId || 'CUST-1001'}
                                </span>
                                <span
                                  className="admin-square-id-chip"
                                  title={`Linked Square POS Customer ID: ${guest.squareId || 'sq_cust_1001'}. Real-time synchronization active.`}
                                >
                                  <span
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      backgroundColor: guest.squareSyncStatus === 'Pending Sync' ? '#f59e0b' : '#22c55e',
                                      display: 'inline-block'
                                    }}
                                  />
                                  Square: {guest.squareId || `sq_cust_${guest.customerId?.replace('CUST-', '') || '1001'}`}
                                </span>
                              </div>
                              <div className="admin-guest-meta-row">
                                <span>{guest.phone}</span>
                                <span>•</span>
                                <span>{guest.email}</span>
                                <span>•</span>
                                <span
                                  className="admin-guest-tier-badge"
                                  style={{
                                    backgroundColor: tierBadgeStyle.bg,
                                    color: tierBadgeStyle.color,
                                    border: `1px solid ${tierBadgeStyle.border}`
                                  }}
                                >
                                  {guest.tier}
                                </span>
                                <span>•</span>
                                <span style={{ fontWeight: 600, color: '#17271f' }}>
                                  {guest.rewardNights ?? 0} Nights
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="admin-btn-adjust"
                            onClick={() => {
                              openGuestProfile(guest, 'profile');
                              setEditTier(guest.tier);
                              setPointAdjustment('');
                            }}
                          >
                            <SlidersHorizontal size={13} />
                            <span>View / Adjust</span>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '36px 0', color: '#6b7280', fontSize: '0.85rem' }}>
                      No members match the current filter or search criteria.
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: QUICK ACCESS CARD */}
              <div className="admin-dash-card">
                <div className="admin-dash-card-header" style={{ marginBottom: '8px' }}>
                  <div>
                    <h2 className="admin-dash-card-title">
                      <Sparkles size={17} color="#dda943" />
                      Quick Access
                    </h2>
                    <p className="admin-dash-card-subtitle" style={{ margin: '3px 0 0 0' }}>
                      Direct shortcuts to property workflows and queues.
                    </p>
                  </div>
                </div>
                <div className="admin-quick-access-grid">
                  {mockQuickAccessTiles.map(tile => {
                    let TileIcon = ArrowRight;
                    let iconBg = '#f4f6f5';
                    let iconColor = '#17271f';
                    let isLiveApi = false;

                    if (tile.id === 'missing-stay') {
                      TileIcon = Clock;
                      iconBg = '#fffbeb';
                      iconColor = '#d97706';
                    } else if (tile.id === 'gift-card') {
                      TileIcon = Gift;
                      iconBg = '#fefce8';
                      iconColor = '#ca8a04';
                    } else if (tile.id === 'phone-recovery') {
                      TileIcon = Phone;
                      iconBg = '#f0fdf4';
                      iconColor = '#16a34a';
                    } else if (tile.id === 'api-status') {
                      TileIcon = Activity;
                      iconBg = '#ecfeff';
                      iconColor = '#0891b2';
                      isLiveApi = true;
                    } else if (tile.id === 'create-case') {
                      TileIcon = UserPlus;
                      iconBg = '#f5f3ff';
                      iconColor = '#7c3aed';
                    } else if (tile.id === 'account-status') {
                      TileIcon = ShieldCheck;
                      iconBg = '#eff6ff';
                      iconColor = '#2563eb';
                    } else if (tile.id === 'property-settings') {
                      TileIcon = SlidersHorizontal;
                      iconBg = '#f8fafc';
                      iconColor = '#475569';
                    }

                    return (
                      <button
                        key={tile.id}
                        type="button"
                        className="admin-quick-access-tile"
                        onClick={() => {
                          if (tile.id === 'property-settings') {
                            setActiveTab('properties');
                          } else {
                            setActiveQuickAccess(tile);
                          }
                        }}
                      >
                        <div className="admin-tile-header">
                          <div className="admin-tile-icon-wrap" style={{ backgroundColor: iconBg, color: iconColor }}>
                            <TileIcon size={17} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {isLiveApi && (
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: '#10b981',
                                  display: 'inline-block'
                                }}
                                title="Live Webhook Link"
                              />
                            )}
                            <ArrowRight size={13} className="admin-tile-chevron" />
                          </div>
                        </div>
                        <div>
                          <div className="admin-quick-access-title">{tile.title}</div>
                          <div className="admin-quick-access-desc">{tile.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. BOTTOM SECTION: RECENT AUDIT ACTIVITY CARD (INTEGRATED EXECUTIVE CARD) */}
            <div className="admin-audit-card">
              <div className="admin-audit-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={18} color="#17271f" />
                  <h2 className="admin-dash-card-title" style={{ margin: 0 }}>
                    Recent Audit Activity
                  </h2>
                  <span className="admin-chip-counter">
                    {mockAuditActivity.length} Events Logged
                  </span>
                </div>
                <button
                  type="button"
                  className="admin-btn-export-report"
                  onClick={() => {
                    addToast('success', 'Report Exported', 'Audit summary export CSV dispatched to manager work email.');
                  }}
                >
                  <Download size={14} />
                  <span>Export Report</span>
                </button>
              </div>
              <div className="admin-audit-list">
                {mockAuditActivity.map(item => {
                  let AuditIcon = History;
                  let iconBg = '#f4f6f5';
                  let iconColor = '#55665e';

                  if (item.type === 'stay') {
                    AuditIcon = CheckCircle2;
                    iconBg = '#ecfdf5';
                    iconColor = '#059669';
                  } else if (item.type === 'gift') {
                    AuditIcon = Gift;
                    iconBg = '#fefce8';
                    iconColor = '#ca8a04';
                  } else if (item.type === 'account') {
                    AuditIcon = ShieldCheck;
                    iconBg = '#eff6ff';
                    iconColor = '#2563eb';
                  }

                  const isPositive = item.tag.includes('+');
                  const isCurrency = item.tag.includes('$');
                  const tagStyle = isPositive
                    ? { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' }
                    : isCurrency
                    ? { bg: '#fefce8', color: '#854d0e', border: '#fde047' }
                    : { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' };

                  return (
                    <div key={item.id} className="admin-audit-row">
                      <div className="admin-audit-time-pill">
                        <Clock size={12} />
                        <span>{item.timestamp}</span>
                      </div>
                      <div className="admin-audit-content">
                        <div className="admin-audit-icon-wrap" style={{ backgroundColor: iconBg, color: iconColor }}>
                          <AuditIcon size={16} />
                        </div>
                        <div>
                          <div className="admin-audit-title">{item.title}</div>
                          <div className="admin-audit-sub">{item.subtitle}</div>
                        </div>
                      </div>
                      <div
                        className="admin-audit-tag"
                        style={{
                          backgroundColor: tagStyle.bg,
                          color: tagStyle.color,
                          border: `1px solid ${tagStyle.border}`
                        }}
                      >
                        {item.tag}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="admin-audit-footer">
                <div className="admin-audit-footer-text">
                  Immutable ledger synced with Cloudbeds PMS webhooks and Square POS night audits.
                </div>
                <button
                  type="button"
                  className="admin-btn-audit-docked"
                  onClick={() => setShowAuditModal(true)}
                >
                  <span>View Full Searchable Audit Log</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'bookings' ? (
          /* ===============================================================
             ACTIVE BOOKINGS VIEW (MATCHING THE SCREENSHOT EXACTLY)
          =============================================================== */
          <div>
            <div className="admin-card-workspace">
              {/* Header with Title, Inline Count Badge, and Back Button */}
              <div className="admin-card-header" style={{ marginBottom: '22px', alignItems: 'center' }}>
                <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, flexWrap: 'wrap' }}>
                  <span>Evolve Texarkana • Active Bookings</span>
                  <span
                    title={`${filteredBookings.length} Active Reservations`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#edf4f0',
                      color: '#17271f',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: '20px',
                      border: '1px solid #c2e0d1'
                    }}
                  >
                    {filteredBookings.length}
                  </span>
                </h2>
                {!isFrontDesk && (
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <ArrowLeft size={15} />
                    <span>Dashboard</span>
                  </button>
                )}
              </div>

              {/* Collapsible Advanced Filters Section (Matching Attached View) */}
              <div className="admin-filters-card">
                {/* Header Bar with Open / Collapse Toggle */}
                <div
                  className="admin-filters-header"
                  onClick={() => setIsFiltersOpen(prev => !prev)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={15} style={{ color: '#17271f' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#17271f', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Advanced Filters
                    </span>
                    {activeFiltersCount > 0 && (
                      <span style={{
                        backgroundColor: '#ea580c',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {activeFiltersCount} Active
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>{isFiltersOpen ? 'Collapse' : 'Expand'}</span>
                    {isFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Collapsible Body with 2-Line Grid */}
                {isFiltersOpen && (
                  <div className="admin-filters-body">
                    {/* Line 1 (5 Filters) */}
                    <div className="admin-filters-grid-line-1">
                      {/* 1. Guest Name */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Guest Name</label>
                        <input
                          type="text"
                          className="admin-filter-input"
                          placeholder="e.g. John Parker"
                          value={filterGuestName}
                          onChange={(e) => setFilterGuestName(e.target.value)}
                        />
                      </div>

                      {/* 2. Reservation Number / Cloudbed ID */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Reservation / Cloudbed ID</label>
                        <input
                          type="text"
                          className="admin-filter-input"
                          placeholder="e.g. EV-4291 or CB-10482"
                          value={filterResNumber}
                          onChange={(e) => setFilterResNumber(e.target.value)}
                        />
                      </div>

                      {/* 3. Phone Number */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Phone Number</label>
                        <input
                          type="text"
                          className="admin-filter-input"
                          placeholder="Enter Phone Number"
                          value={filterPhone}
                          onChange={(e) => setFilterPhone(e.target.value)}
                        />
                      </div>

                      {/* 4. Room Type */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Room Type</label>
                        <select
                          className="admin-filter-select"
                          value={filterRoomType}
                          onChange={(e) => setFilterRoomType(e.target.value)}
                        >
                          <option value="all">All Room Types</option>
                          <option value="King Room">King Room</option>
                          <option value="Double Queen">Double Queen</option>
                          <option value="Executive Suite">Executive Suite</option>
                          <option value="Studio Suite">Studio Suite</option>
                        </select>
                      </div>

                      {/* 5. Number of Suites */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Number of Suites</label>
                        <select
                          className="admin-filter-select"
                          value={filterSuitesCount}
                          onChange={(e) => setFilterSuitesCount(e.target.value)}
                        >
                          <option value="all">All Suites</option>
                          <option value="1">1 Suite</option>
                          <option value="2">2 Suites</option>
                          <option value="3+">3+ Suites</option>
                        </select>
                      </div>
                    </div>

                    {/* Line 2 (4 Filters) */}
                    <div className="admin-filters-grid-line-2">
                      {/* 6. Check-in Date */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Check-in Date</label>
                        <input
                          type="date"
                          className="admin-filter-input"
                          value={filterCheckInDate}
                          onChange={(e) => setFilterCheckInDate(e.target.value)}
                        />
                      </div>

                      {/* 7. Check-out Date */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Check-out Date</label>
                        <input
                          type="date"
                          className="admin-filter-input"
                          value={filterCheckOutDate}
                          onChange={(e) => setFilterCheckOutDate(e.target.value)}
                        />
                      </div>

                      {/* 8. Booking Source */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Booking Source</label>
                        <select
                          className="admin-filter-select"
                          value={filterBookingSource}
                          onChange={(e) => setFilterBookingSource(e.target.value)}
                        >
                          <option value="all">All Sources</option>
                          <option value="Direct Website">Direct Website</option>
                          <option value="Cloudbeds">Cloudbeds</option>
                          <option value="Third Party">Third Party</option>
                        </select>
                      </div>

                      {/* 9. Booking Status */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Booking Status</label>
                        <select
                          className="admin-filter-select"
                          value={filterBookingStatus}
                          onChange={(e) => setFilterBookingStatus(e.target.value)}
                        >
                          <option value="all">All Statuses (Active & Completed)</option>
                          <option value="Arriving">Arriving</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="In House">In House</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* 10. Guest / Reservation Type */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Guest Type</label>
                        <select
                          className="admin-filter-select"
                          value={filterGuestType}
                          onChange={(e) => setFilterGuestType(e.target.value as any)}
                        >
                          <option value="all">All Guests (Members & Phone)</option>
                          <option value="members">Registered Members</option>
                          <option value="guest_users">Phone Guest Users (No Breakfast)</option>
                        </select>
                      </div>
                    </div>

                    {/* Bottom Action Bar: Quick Timeline on Left, Reset / Apply Buttons on Right */}
                    <div className="admin-filters-bottom-bar">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          Quick Timeline:
                        </span>
                        {[
                          { id: 'all', label: 'All Active' },
                          { id: 'today', label: 'Arriving Today' },
                          { id: 'tomorrow', label: 'Tomorrow' },
                          { id: '7days', label: 'Next 7 Days' },
                          { id: '30days', label: 'Next 30 Days' },
                        ].map(pill => (
                          <button
                            key={pill.id}
                            type="button"
                            onClick={() => setSelectedTimeFilter(pill.id as any)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '16px',
                              border: selectedTimeFilter === pill.id ? '1.5px solid #17271f' : '1px solid #cbd5e1',
                              backgroundColor: selectedTimeFilter === pill.id ? '#17271f' : '#ffffff',
                              color: selectedTimeFilter === pill.id ? '#ffffff' : '#334155',
                              fontSize: '0.78rem',
                              fontWeight: selectedTimeFilter === pill.id ? 700 : 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          className="admin-filter-reset-btn"
                          onClick={handleResetFilters}
                        >
                          Reset Filters
                        </button>
                        <button
                          type="button"
                          className="admin-filter-apply-btn"
                          onClick={handleApplyFilters}
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Bookings Table Listing View - Stretched Full Width */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '24px', width: '100%' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '12px 18px', width: '10%' }}>Reservation ID</th>
                        <th style={{ padding: '12px 16px', width: '10%' }}>Cloudbed ID</th>
                        <th style={{ padding: '12px 16px', width: '13%' }}>Guest Name</th>
                        <th style={{ padding: '12px 16px', width: '12%' }}>Phone No</th>
                        <th style={{ padding: '12px 14px', width: '12%' }}>Room Type</th>
                        <th style={{ padding: '12px 12px', width: '7%' }}>Suites</th>
                        <th style={{ padding: '12px 14px', width: '12%' }}>Room No</th>
                        <th style={{ padding: '12px 14px', width: '13%' }}>Booking Dates</th>
                        <th style={{ padding: '12px 14px', width: '10%' }}>Booking Source</th>
                        <th style={{ padding: '12px 14px', width: '5%' }}>Status</th>
                        <th style={{ padding: '12px 18px', width: '5%', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking, idx) => {
                          const statusColor =
                            booking.status === 'Confirmed' ? '#15803d' :
                            booking.status === 'Arriving' ? '#b45309' :
                            booking.status === 'In House' ? '#1d4ed8' :
                            booking.status === 'Completed' ? '#4b5563' : '#b91c1c';

                          return (
                            <tr
                              key={booking.id}
                              style={{
                                borderBottom: idx !== filteredBookings.length - 1 ? '1px solid #edf2f7' : 'none',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbfcfb')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                            >
                              {/* 1. Reservation ID */}
                              <td style={{ padding: '14px 18px', color: '#17271f', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {booking.confirmationCode}
                              </td>

                              {/* 2. Cloudbed ID */}
                              <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {booking.cloudbedsId || booking.pmsId || '—'}
                              </td>

                              {/* 3. Guest Name */}
                              <td style={{ padding: '14px 16px', color: '#17271f', fontWeight: 700, fontSize: '0.92rem', whiteSpace: 'nowrap' }}>
                                {booking.guestName?.replace(/\s*\(\+.*?\)/g, '') || 'Guest User'}
                              </td>

                              {/* 4. Phone No (Separate Column) */}
                              <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {booking.phone}
                              </td>

                              {/* 5. Room Type */}
                              <td style={{ padding: '14px 14px', color: '#334155', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {booking.roomType}
                              </td>

                              {/* 6. Suites */}
                              <td style={{ padding: '14px 12px', color: '#17271f', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {booking.suitesCount || 1}
                              </td>

                              {/* 7. Room No */}
                              <td style={{ padding: '14px 14px', color: '#17271f', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {booking.suiteNumber
                                  ? booking.suiteNumber.replace(/^Suite\s*/i, '')
                                  : '104'}
                              </td>

                              {/* 8. Booking Dates */}
                              <td style={{ padding: '14px 14px', color: '#55665e', fontSize: '0.86rem', whiteSpace: 'nowrap' }}>
                                {booking.dateRange}
                              </td>

                              {/* 9. Booking Source */}
                              <td style={{ padding: '14px 14px', color: '#334155', fontWeight: 500, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {booking.isGuestUser ? (
                                  <span style={{ color: '#c2410c', fontWeight: 700 }}>Direct Website</span>
                                ) : (
                                  booking.bookingSource || 'Cloudbeds'
                                )}
                              </td>

                              {/* 10. Status */}
                              <td style={{ padding: '14px 14px', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600, color: statusColor }}>
                                {booking.status}
                              </td>

                              {/* 11. Action (Small Eye Icon) */}
                              <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <button
                                  type="button"
                                  title="View Details"
                                  aria-label="View Details"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    border: '1.5px solid #17271f',
                                    backgroundColor: '#ffffff',
                                    color: '#17271f',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#17271f';
                                    e.currentTarget.style.color = '#ffffff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.color = '#17271f';
                                  }}
                                  onClick={() => setSelectedBookingDetails(booking)}
                                >
                                  <Eye size={15} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={11} style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b', fontSize: '0.9rem' }}>
                            No active bookings found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Button: View Full Searchable Audit Log */}
            <button
              type="button"
              className="admin-btn-audit-log"
              onClick={() => setShowAuditModal(true)}
            >
              <span>View Full Searchable Audit Log</span>
            </button>
          </div>
        ) : activeTab === 'guests' ? (
          /* ===============================================================
             GUEST MANAGEMENT VIEW (MATCHING THE SCREENSHOT EXACTLY)
          =============================================================== */
          <div>
            <div className="admin-card-workspace">
              {/* Header with Title, Inline Count Badge, and Back Button */}
              <div className="admin-card-header" style={{ marginBottom: '22px', alignItems: 'center' }}>
                <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, flexWrap: 'wrap' }}>
                  <span>Evolve Texarkana • Guest Management</span>
                  <span
                    title={`${filteredGuests.length} Members`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#edf4f0',
                      color: '#17271f',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: '20px',
                      border: '1px solid #c2e0d1'
                    }}
                  >
                    {filteredGuests.length}
                  </span>
                </h2>
                {!isFrontDesk && (
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <ArrowLeft size={15} />
                    <span>Dashboard</span>
                  </button>
                )}
              </div>

              {/* Nested Sub-Tabs: Registered Members vs Guest Users (Phone Bookings) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '2px solid #e2e8f0',
                marginBottom: '20px',
                paddingBottom: '2px'
              }}>
                <button
                  type="button"
                  onClick={() => setGuestManagementSubTab('members')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    border: 'none',
                    borderBottom: guestManagementSubTab === 'members' ? '3px solid #17271f' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: guestManagementSubTab === 'members' ? '#17271f' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '-2px'
                  }}
                >
                  <Users size={16} />
                  <span>Registered Members</span>
                  <span style={{
                    backgroundColor: guestManagementSubTab === 'members' ? '#17271f' : '#e2e8f0',
                    color: guestManagementSubTab === 'members' ? '#ffffff' : '#475569',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {guestsList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuestManagementSubTab('guest_users')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    border: 'none',
                    borderBottom: guestManagementSubTab === 'guest_users' ? '3px solid #ea580c' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: guestManagementSubTab === 'guest_users' ? '#ea580c' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '-2px'
                  }}
                >
                  <Phone size={16} />
                  <span>Guest Users</span>
                  <span style={{
                    backgroundColor: guestManagementSubTab === 'guest_users' ? '#ea580c' : '#fee2e2',
                    color: guestManagementSubTab === 'guest_users' ? '#ffffff' : '#b91c1c',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {phoneGuestUsersList.length}
                  </span>
                </button>
              </div>

              {guestManagementSubTab === 'members' ? (
                <>
                  {/* Collapsible Advanced Filters Section (Guest Management) */}
              <div className="admin-filters-card">
                {/* Header Bar with Open / Collapse Toggle */}
                <div
                  className="admin-filters-header"
                  onClick={() => setIsGuestFiltersOpen(prev => !prev)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={15} style={{ color: '#17271f' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#17271f', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Advanced Filters
                    </span>
                    {activeGuestFiltersCount > 0 && (
                      <span style={{
                        backgroundColor: '#ea580c',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {activeGuestFiltersCount} Active
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>{isGuestFiltersOpen ? 'Collapse' : 'Expand'}</span>
                    {isGuestFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Collapsible Body with 2-Line Grid */}
                {isGuestFiltersOpen && (
                  <div className="admin-filters-body">
                    {/* Line 1 (3 Filters: Name, Phone, Email) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 14px', marginBottom: '12px' }}>
                      {/* 1. Name or Evolve ID or Square ID */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Guest Name / Evolve ID / Square ID</label>
                        <input
                          type="text"
                          className="admin-filter-input"
                          placeholder="e.g. Emily, CUST-1001, or sq_cust_1001"
                          value={guestFilterName}
                          onChange={(e) => setGuestFilterName(e.target.value)}
                        />
                      </div>

                      {/* 2. Phone No */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Phone Number</label>
                        <input
                          type="text"
                          className="admin-filter-input"
                          placeholder="Enter Phone Number"
                          value={guestFilterPhone}
                          onChange={(e) => setGuestFilterPhone(e.target.value)}
                        />
                      </div>

                      {/* 3. Email Address */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Email Address</label>
                        <input
                          type="text"
                          className="admin-filter-input"
                          placeholder="e.g. emily@example.com"
                          value={guestFilterEmail}
                          onChange={(e) => setGuestFilterEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Line 2 (4 Filters: Tier, Status, Rewards, Member Since) */}
                    <div className="admin-filters-grid-line-2">
                      {/* 5. Tier */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Member Tier</label>
                        <select
                          className="admin-filter-select"
                          value={guestFilterTier}
                          onChange={(e) => setGuestFilterTier(e.target.value)}
                        >
                          <option value="all">All Tiers</option>
                          <option value="Origins">Origins</option>
                          <option value="Prestige">Prestige</option>
                          <option value="Elite">Elite</option>
                        </select>
                      </div>

                      {/* 6. Status */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Account Status</label>
                        <select
                          className="admin-filter-select"
                          value={guestFilterStatus}
                          onChange={(e) => setGuestFilterStatus(e.target.value)}
                        >
                          <option value="all">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      {/* 7. Rewards Nights */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Reward Nights</label>
                        <select
                          className="admin-filter-select"
                          value={guestFilterRewards}
                          onChange={(e) => setGuestFilterRewards(e.target.value)}
                        >
                          <option value="all">All Reward Nights</option>
                          <option value="1+">1+ Nights</option>
                          <option value="5+">5+ Nights</option>
                          <option value="10+">10+ Nights</option>
                          <option value="20+">20+ Nights</option>
                        </select>
                      </div>

                      {/* 8. Member Since */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Member Since</label>
                        <select
                          className="admin-filter-select"
                          value={guestFilterJoinedYear}
                          onChange={(e) => setGuestFilterJoinedYear(e.target.value)}
                        >
                          <option value="all">All Years</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>
                      </div>
                    </div>

                    {/* Bottom Action Bar: Quick Tier on Left, Reset / Apply Buttons on Right */}
                    <div className="admin-filters-bottom-bar">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          Quick Filters:
                        </span>
                        {[
                          { id: 'all', label: 'All Members' },
                          { id: 'Active', label: 'Active Only' },
                          { id: 'Origins', label: 'Origins' },
                          { id: 'Prestige', label: 'Prestige' },
                          { id: 'Elite', label: 'Elite' },
                        ].map(pill => (
                          <button
                            key={pill.id}
                            type="button"
                            onClick={() => setGuestQuickTierFilter(pill.id as any)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '16px',
                              border: guestQuickTierFilter === pill.id ? '1.5px solid #17271f' : '1px solid #cbd5e1',
                              backgroundColor: guestQuickTierFilter === pill.id ? '#17271f' : '#ffffff',
                              color: guestQuickTierFilter === pill.id ? '#ffffff' : '#334155',
                              fontSize: '0.78rem',
                              fontWeight: guestQuickTierFilter === pill.id ? 700 : 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          className="admin-filter-reset-btn"
                          onClick={handleResetGuestFilters}
                        >
                          Reset Filters
                        </button>
                        <button
                          type="button"
                          className="admin-filter-apply-btn"
                          onClick={handleApplyGuestFilters}
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Management Table Listing View */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '12px 16px' }}>Evolve ID</th>
                        <th style={{ padding: '12px 16px' }}>Square ID (POS)</th>
                        <th style={{ padding: '12px 16px' }}>Name</th>
                        <th style={{ padding: '12px 16px' }}>Phone No</th>
                        <th style={{ padding: '12px 16px' }}>Rewards</th>
                        <th style={{ padding: '12px 16px' }}>Tier</th>
                        <th style={{ padding: '12px 16px' }}>Member Since</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuests.length > 0 ? (
                        filteredGuests.map((guest, idx) => (
                          <tr
                            key={guest.id}
                            style={{
                              borderBottom: idx !== filteredGuests.length - 1 ? '1px solid #edf2f7' : 'none',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbfcfb')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                          >
                            {/* 1. Customer ID */}
                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#17271f', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                              {guest.customerId || `CUST-${1001 + idx}`}
                            </td>

                            {/* 1b. Square ID (POS) */}
                            <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                              <span
                                title={`Square POS ID: ${guest.squareId || `sq_cust_${guest.customerId?.replace('CUST-', '') || 1001 + idx}`}`}
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  color: '#166534',
                                  backgroundColor: '#f0fdf4',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #bbf7d0',
                                  display: 'inline-block'
                                }}
                              >
                                {guest.squareId || `sq_cust_${guest.customerId?.replace('CUST-', '') || 1001 + idx}`}
                              </span>
                            </td>

                            {/* 2. Name */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.92rem' }}>
                                {guest.name}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                {guest.email}
                              </div>
                            </td>

                            {/* 3. Phone No */}
                            <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                              {guest.phone}
                            </td>

                            {/* 4. Rewards */}
                            <td style={{ padding: '14px 16px', color: '#17271f', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                              {guest.rewardNights ?? 0} Nights
                            </td>

                            {/* 5. Tier */}
                            <td style={{ padding: '14px 16px', color: '#17271f', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                              {guest.tier}
                            </td>

                            {/* 6. Member Since */}
                            <td style={{ padding: '14px 16px', color: '#55665e', fontSize: '0.86rem', whiteSpace: 'nowrap' }}>
                              {guest.joinedDate || 'Jan 2024'}
                            </td>

                            {/* 7. Status */}
                            <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600, color: (guest.accountStatus || 'Active') === 'Active' ? '#15803d' : '#b91c1c' }}>
                              {guest.accountStatus || 'Active'}
                            </td>

                            {/* 8. Action */}
                            <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                className="admin-btn-security-action"
                                style={{
                                  padding: '7px 14px',
                                  borderRadius: '6px',
                                  border: '1.5px solid #17271f',
                                  backgroundColor: '#ffffff',
                                  color: '#17271f',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                onClick={() => {
                                  openGuestProfile(guest, 'profile');
                                  setEditTier(guest.tier);
                                  setPointAdjustment('');
                                  setNightsAdjustment('');
                                  setGuestAuditReason('');
                                }}
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b', fontSize: '0.9rem' }}>
                            No members found matching the specified filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* ===============================================================
               GUEST USERS (PHONE BOOKINGS) NESTED TAB VIEW
            =============================================================== */
            <div>
              {/* Filter & Search Bar */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={guestUserSearch}
                      onChange={(e) => setGuestUserSearch(e.target.value)}
                      placeholder="Search phone (+1 555...), ref, name..."
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#475569' }}>Stay Status:</label>
                    <select
                      value={guestUserStatusFilter}
                      onChange={(e) => setGuestUserStatusFilter(e.target.value as any)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        color: '#1e293b',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="all">All Stays</option>
                      <option value="In House">In House</option>
                      <option value="Arriving">Arriving</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guest Users Table Listing View */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '12px 16px' }}>Reservation ID</th>
                        <th style={{ padding: '12px 16px' }}>Phone Number</th>
                        <th style={{ padding: '12px 16px' }}>Guest Name</th>
                        <th style={{ padding: '12px 16px' }}>Email ID</th>
                        <th style={{ padding: '12px 16px' }}>Booking Date</th>
                        <th style={{ padding: '12px 16px' }}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPhoneGuests.length > 0 ? (
                        filteredPhoneGuests.map((guest, idx) => (
                          <tr
                            key={guest.id}
                            style={{
                              borderBottom: idx !== filteredPhoneGuests.length - 1 ? '1px solid #edf2f7' : 'none',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbfcfb')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                          >
                            {/* 1. Reservation ID */}
                            <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                backgroundColor: '#f1f5f9',
                                color: '#334155',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1'
                              }}>
                                {guest.bookingRef}
                              </span>
                            </td>

                            {/* 2. Phone Number */}
                            <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#17271f' }}>
                                <span style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  backgroundColor: '#e0f2fe',
                                  color: '#0284c7',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <Phone size={13} />
                                </span>
                                <span>{guest.phone}</span>
                              </div>
                            </td>

                            {/* 3. Guest Name */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.90rem' }}>
                                {(guest.name || 'Guest User').replace(/\s*\(\+.*?\)/g, '')}
                              </div>
                            </td>

                            {/* 4. Email ID */}
                            <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                              {guest.email ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#17271f', fontSize: '0.85rem' }}>
                                  <span style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f0fdf4',
                                    color: '#16a34a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <Mail size={12} />
                                  </span>
                                  <span style={{ fontWeight: 500 }}>{guest.email}</span>
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.80rem', fontStyle: 'italic' }}>—</span>
                              )}
                            </td>

                            {/* 5. Booking Date */}
                            <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', color: '#475569', fontSize: '0.85rem' }}>
                              {guest.bookingDate}
                            </td>

                            {/* 6. Notes & Edit (Common Section) */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {guest.notes ? (
                                  <div
                                    onClick={() => openGuestUserDetailModal(guest)}
                                    title={`${guest.notes} (Click to edit notes)`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      cursor: 'pointer',
                                      backgroundColor: '#f8fafc',
                                      border: '1px solid #e2e8f0',
                                      padding: '4px 10px',
                                      borderRadius: '6px',
                                      maxWidth: '260px',
                                      flex: 1
                                    }}
                                  >
                                    <FileText size={13} style={{ color: '#059669', flexShrink: 0 }} />
                                    <span style={{
                                      fontSize: '0.80rem',
                                      color: '#334155',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {guest.notes}
                                    </span>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', flex: 1 }}>
                                    No notes
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openGuestUserDetailModal(guest)}
                                  title={guest.notes ? "Edit notes" : "Add notes"}
                                  aria-label={guest.notes ? "Edit notes" : "Add notes"}
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: '#17271f',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    transition: 'background-color 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d4739')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#17271f')}
                                >
                                  <Edit3 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                            No guest user phone bookings found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        ) : activeTab === 'rewards' ? (
          /* ===============================================================
             REWARDS MANAGEMENT VIEW — LISTING VIEW (PAGE 1) & INNER PAGE (PAGE 2)
          =============================================================== */
          <div>
            {!selectedRewardsMember ? (
              /* ===========================================================
                 PAGE 1: REWARDS MEMBERS LISTING VIEW
              =========================================================== */
              <div className="admin-card-workspace">
                {/* Header */}
                <div className="admin-card-header" style={{ marginBottom: '18px', alignItems: 'center' }}>
                  <div>
                    <span className="admin-ops-eyebrow">PROFILE-LEVEL REWARDS MANAGEMENT</span>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>Evolve Texarkana • Member Rewards</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#edf4f0',
                          color: '#17271f',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          padding: '2px 10px',
                          borderRadius: '20px',
                          border: '1px solid #c2e0d1'
                        }}
                      >
                        {guestsList.length} Members
                      </span>
                    </h2>
                    <p className="admin-card-desc">
                      Manage member rewards balances, points earned from completed stays, and complete transaction ledgers.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <ArrowLeft size={15} />
                    <span>Dashboard</span>
                  </button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '0 0 20px 0' }} />

                {/* Filter and Search Bar */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="admin-bookings-search-input"
                      style={{ paddingLeft: '40px', margin: 0, width: '100%' }}
                      placeholder="Search members by name, phone, email, Evolve ID, or Square ID..."
                      value={rewardsSearchQuery}
                      onChange={(e) => setRewardsSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Tier Filter Buttons */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['all', 'Prestige', 'Origins', 'Elite'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setRewardsTierFilter(t)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          border: rewardsTierFilter === t ? '1.5px solid #17271f' : '1px solid #e2e8f0',
                          backgroundColor: rewardsTierFilter === t ? '#17271f' : '#ffffff',
                          color: rewardsTierFilter === t ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {t === 'all' ? 'All Tiers' : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rewards Program Summary Cards Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  marginBottom: '22px'
                }}>
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ENROLLED MEMBERS</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17271f', margin: '4px 0 2px 0' }}>{guestsList.length}</div>
                    <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>Active rewards accounts</span>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>TOTAL POINTS EARNED</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#173f34', margin: '4px 0 2px 0' }}>
                      {guestsList.reduce((acc, g) => acc + getGuestEarnedPoints(g), 0).toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>From qualified completed stays</span>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>POINTS REDEEMED</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', margin: '4px 0 2px 0' }}>
                      {guestsList.reduce((acc, g) => acc + getGuestRedeemedPoints(g), 0).toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Used for bookings & rewards</span>
                  </div>

                  <div style={{ backgroundColor: '#fcfaf6', borderRadius: '12px', padding: '16px 20px', border: '1.5px solid #dda943', boxShadow: '0 2px 8px rgba(221, 169, 67, 0.1)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#997125', letterSpacing: '0.08em', textTransform: 'uppercase' }}>NET AVAILABLE POINTS</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17271f', margin: '4px 0 2px 0' }}>
                      {guestsList.reduce((acc, g) => acc + getGuestAvailablePoints(g), 0).toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#997125', fontWeight: 600 }}>Earned − Redeemed</span>
                  </div>
                </div>

                {/* Clean Members Listing Table */}
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        <th style={{ padding: '14px 18px' }}>Evolve ID</th>
                        <th style={{ padding: '14px 18px' }}>Square ID (POS)</th>
                        <th style={{ padding: '14px 18px' }}>Member Profile</th>
                        <th style={{ padding: '14px 18px' }}>Verified Contact</th>
                        <th style={{ padding: '14px 18px' }}>Loyalty Tier</th>
                        <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Earned</th>
                        <th style={{ padding: '14px 18px', textAlign: 'right' }}>Redeemed</th>
                        <th style={{ padding: '14px 18px', textAlign: 'right' }}>Available Balance</th>
                        <th style={{ padding: '14px 18px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guestsList
                        .filter(g => {
                          const query = rewardsSearchQuery.toLowerCase();
                          const matchesQuery = !query ||
                            g.name.toLowerCase().includes(query) ||
                            g.email.toLowerCase().includes(query) ||
                            g.phone.includes(query) ||
                            (g.customerId && g.customerId.toLowerCase().includes(query)) ||
                            (g.squareId && g.squareId.toLowerCase().includes(query));
                          const matchesTier = rewardsTierFilter === 'all' || g.tier === rewardsTierFilter;
                          return matchesQuery && matchesTier;
                        })
                        .map((guest, idx) => {
                          const earned = getGuestEarnedPoints(guest);
                          const redeemed = getGuestRedeemedPoints(guest);
                          const available = getGuestAvailablePoints(guest);

                          return (
                            <tr
                              key={guest.id}
                              style={{
                                borderBottom: '1px solid #f1f5f3',
                                backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafcfb',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f7f4')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafcfb')}
                            >
                              {/* 1. Customer ID */}
                              <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, backgroundColor: '#edf4f0', color: '#17271f', padding: '3px 8px', borderRadius: '4px', border: '1px solid #c2e0d1' }}>
                                  {guest.customerId || `CUST-${1000 + idx}`}
                                </span>
                              </td>

                              {/* 2. Square ID (POS) */}
                              <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                <span
                                  title={`Square POS ID: ${guest.squareId || `sq_cust_${guest.customerId?.replace('CUST-', '') || 1000 + idx}`}`}
                                  style={{
                                    display: 'inline-block',
                                    fontSize: '0.82rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    backgroundColor: '#f0fdf4',
                                    color: '#166534',
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                    border: '1px solid #bbf7d0'
                                  }}
                                >
                                  {guest.squareId || `sq_cust_${guest.customerId?.replace('CUST-', '') || 1000 + idx}`}
                                </span>
                              </td>

                              {/* 3. Member Profile */}
                              <td style={{ padding: '14px 18px' }}>
                                <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.92rem' }}>
                                  {guest.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                  {guest.email}
                                </div>
                              </td>

                              <td style={{ padding: '14px 18px', color: '#475569', fontSize: '0.85rem' }}>
                                {guest.phone}
                              </td>

                              <td style={{ padding: '14px 18px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '3px 10px',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    backgroundColor: guest.tier === 'Prestige' ? '#fcf6eb' : guest.tier === 'Elite' ? '#17271f' : '#e8edea',
                                    color: guest.tier === 'Prestige' ? '#997125' : guest.tier === 'Elite' ? '#ffffff' : '#173f34',
                                    border: guest.tier === 'Prestige' ? '1px solid #dda943' : 'none'
                                  }}
                                >
                                  {guest.tier}
                                </span>
                              </td>

                              <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: '#15803d' }}>
                                {earned} pts
                              </td>

                              <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: '#b45309' }}>
                                {redeemed} pts
                              </td>

                              <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    backgroundColor: '#eaf5ee',
                                    color: '#173f34',
                                    border: '1px solid #b7dfc8'
                                  }}
                                  title={`${earned} Earned − ${redeemed} Redeemed = ${available} Available`}
                                >
                                  {available} pts
                                </span>
                              </td>

                              <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedRewardsMember(guest)}
                                  style={{
                                    padding: '7px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#ffffff',
                                    color: '#17271f',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#17271f';
                                    e.currentTarget.style.color = '#ffffff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.color = '#17271f';
                                  }}
                                >
                                  <span>View Rewards</span>
                                  <span>→</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Rewards directory footer tip */}
                <div style={{ marginTop: '24px', fontSize: '0.84rem', color: '#64748b' }}>
                  💡 <em>Click "View Rewards" on any member to view rewards summary, credit missing stays, or adjust points.</em>
                </div>
              </div>
            ) : (
              /* ===========================================================
                 PAGE 2: DEDICATED REWARDS SECTION — INNER PAGE FOR MEMBER
              =========================================================== */
              <div className="admin-card-workspace">
                {/* Top Nav Bar: Back to Members List */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setSelectedRewardsMember(null)}
                    style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Members List</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setRewardAdjRefInput(selectedRewardsMember.cloudbedsReference || 'CB-10482');
                        setRewardAdjNightsInput('10');
                        setRewardAdjReasonInput('');
                        setRewardAdjAction('Add Reward Points');
                        setShowRewardAdjModal(true);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #c2e0d1',
                        backgroundColor: '#edf4f0',
                        color: '#173f34',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d8ebd0')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#edf4f0')}
                    >
                      <SlidersHorizontal size={15} />
                      <span>Adjust Points</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        openGuestProfile(selectedRewardsMember, 'profile');
                        setSelectedRewardsMember(null);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        color: '#17271f',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Full Profile
                    </button>
                  </div>
                </div>

                {/* Member Header Information Card */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#173f34',
                      color: '#dda943',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 800
                    }}>
                      {selectedRewardsMember.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#17271f', fontWeight: 800 }}>
                          {selectedRewardsMember.name}
                        </h2>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#edf4f0', color: '#17271f', padding: '2px 8px', borderRadius: '4px', border: '1px solid #c2e0d1' }}>
                          Evolve ID: {selectedRewardsMember.customerId || 'CUST-1001'}
                        </span>
                        <span
                          title="Linked Square POS ID: Uniquely associates all points & rewards redemptions"
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #bbf7d0',
                            fontFamily: 'monospace',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: selectedRewardsMember.squareSyncStatus === 'Pending Sync' ? '#f59e0b' : '#22c55e' }}></span>
                          Square POS: {selectedRewardsMember.squareId || `sq_cust_${selectedRewardsMember.customerId?.replace('CUST-', '') || '1001'}`}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: selectedRewardsMember.tier === 'Prestige' ? '#fcf6eb' : selectedRewardsMember.tier === 'Elite' ? '#17271f' : '#e8edea',
                          color: selectedRewardsMember.tier === 'Prestige' ? '#997125' : selectedRewardsMember.tier === 'Elite' ? '#ffffff' : '#173f34',
                          padding: '2px 10px',
                          borderRadius: '9999px',
                          border: selectedRewardsMember.tier === 'Prestige' ? '1px solid #dda943' : 'none'
                        }}>
                          {selectedRewardsMember.tier} Tier
                        </span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                        {selectedRewardsMember.phone} • {selectedRewardsMember.email} • PMS Ref: <strong>{selectedRewardsMember.cloudbedsReference || 'CB-10482'}</strong> • Linked Square ID: <strong style={{ fontFamily: 'monospace', color: '#166534' }}>{selectedRewardsMember.squareId || `sq_cust_${selectedRewardsMember.customerId?.replace('CUST-', '') || '1001'}`}</strong> ({selectedRewardsMember.squareSyncStatus || 'Linked'})
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>ACCOUNT STATUS</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                      <strong style={{ color: '#17271f', fontSize: '0.9rem' }}>{selectedRewardsMember.accountStatus || 'Active'}</strong>
                    </div>
                  </div>
                </div>

                {/* ===========================================================
                    1. REWARDS SUMMARY (TOP 3 SUMMARY CARDS)
                =========================================================== */}
                <div style={{ marginBottom: '10px' }}>
                  <span className="admin-ops-eyebrow" style={{ color: '#997125', fontWeight: 800 }}>MEMBER REWARDS SNAPSHOT</span>
                  <h3 style={{ margin: '2px 0 16px 0', fontSize: '1.25rem', color: '#17271f', fontWeight: 800, fontFamily: 'Playfair Display, serif' }}>
                    Rewards Summary
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '18px',
                  marginBottom: '32px'
                }}>
                  {/* Card 1: Total Points Earned */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '22px 24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          TOTAL POINTS EARNED
                        </span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eaf5ee', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#15803d', lineHeight: 1.1, margin: '8px 0' }}>
                        {getGuestEarnedPoints(selectedRewardsMember)}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f3', paddingTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                      Earned through qualified completed stays
                    </div>
                  </div>

                  {/* Card 2: Points Redeemed */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '22px 24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          POINTS REDEEMED
                        </span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Gift size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#b45309', lineHeight: 1.1, margin: '8px 0' }}>
                        {getGuestRedeemedPoints(selectedRewardsMember)}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f3', paddingTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                      Points used across room bookings & rewards
                    </div>
                  </div>

                  {/* Card 3: Points Available / Remaining */}
                  <div style={{
                    backgroundColor: '#fcfaf6',
                    borderRadius: '14px',
                    padding: '22px 24px',
                    border: '2px solid #dda943',
                    boxShadow: '0 4px 14px rgba(221, 169, 67, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#997125', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          POINTS AVAILABLE / REMAINING
                        </span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fcf6eb', color: '#dda943', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sparkles size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#17271f', lineHeight: 1.1, margin: '8px 0' }}>
                        {getGuestAvailablePoints(selectedRewardsMember)}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #ede4d1', paddingTop: '10px', fontSize: '0.8rem', color: '#17271f' }}>
                      <strong>Formula:</strong> {getGuestEarnedPoints(selectedRewardsMember)} Earned − {getGuestRedeemedPoints(selectedRewardsMember)} Redeemed = <strong>{getGuestAvailablePoints(selectedRewardsMember)} Available</strong>
                    </div>
                  </div>
                </div>

                {/* ===========================================================
                    2. REWARDS POINTS HISTORY
                =========================================================== */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                  {/* Header & Filter Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#17271f', fontWeight: 800, fontFamily: 'Playfair Display, serif' }}>
                        Rewards Points History
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                        Chronological record of points earned from completed stays and points redeemed.
                      </p>
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f3', padding: '4px', borderRadius: '8px' }}>
                      {[
                        { key: 'all', label: `All Activity (${getGuestTransactions(selectedRewardsMember).length})` },
                        { key: 'credited', label: `Points Credited (${getGuestTransactions(selectedRewardsMember).filter(t => t.activity === 'Points Credited').length})` },
                        { key: 'redeemed', label: `Points Redeemed (${getGuestTransactions(selectedRewardsMember).filter(t => t.activity === 'Points Redeemed').length})` },
                      ].map(tab => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setRewardsHistoryFilter(tab.key as any)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            backgroundColor: rewardsHistoryFilter === tab.key ? '#ffffff' : 'transparent',
                            color: rewardsHistoryFilter === tab.key ? '#17271f' : '#64748b',
                            boxShadow: rewardsHistoryFilter === tab.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Points History Table */}
                  <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <th style={{ padding: '12px 16px' }}>Date</th>
                          <th style={{ padding: '12px 16px' }}>Activity</th>
                          <th style={{ padding: '12px 16px' }}>Reference / Folio</th>
                          <th style={{ padding: '12px 16px' }}>Redemption / Category</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Points</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                          <th style={{ padding: '12px 16px' }}>Details / Perk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getGuestTransactions(selectedRewardsMember)
                          .filter(t => {
                            if (rewardsHistoryFilter === 'credited') return t.activity === 'Points Credited';
                            if (rewardsHistoryFilter === 'redeemed') return t.activity === 'Points Redeemed';
                            return true;
                          })
                          .map((tx, idx) => {
                            const isCredited = tx.activity === 'Points Credited';
                            const category = getTransactionCategory(tx);

                            return (
                              <tr
                                key={tx.id || idx}
                                style={{
                                  borderBottom: '1px solid #f1f5f3',
                                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafcfb'
                                }}
                              >
                                <td style={{ padding: '14px 16px', color: '#17271f', fontWeight: 600 }}>
                                  {tx.date}
                                </td>

                                <td style={{ padding: '14px 16px' }}>
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      backgroundColor: isCredited ? '#eaf5ee' : '#fff7ed',
                                      color: isCredited ? '#15803d' : '#c2410c'
                                    }}
                                  >
                                    {isCredited ? '+ Points Credited' : '− Points Redeemed'}
                                  </span>
                                </td>

                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#17271f' }}>
                                    {tx.stayOrBooking}
                                  </div>
                                  {!isCredited && (
                                    <div style={{ marginTop: '3px' }}>
                                      {tx.giftogramRefId ? (
                                        <span
                                          title={`Giftogram e-gift card reference: ${tx.giftogramRefId}`}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.72rem',
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            backgroundColor: '#ecfeff',
                                            color: '#0e7490',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            border: '1px solid #a5f3fc'
                                          }}
                                        >
                                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#06b6d4' }}></span>
                                          <span>Giftogram: {tx.giftogramRefId}</span>
                                        </span>
                                      ) : (
                                        <span
                                          title={`Redemption locked to Square POS ID: ${selectedRewardsMember.squareId || 'sq_cust_1001'}`}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.72rem',
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            backgroundColor: '#f0fdf4',
                                            color: '#166534',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            border: '1px solid #bbf7d0'
                                          }}
                                        >
                                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                                          <span>Square: {tx.squareRefId || `sq_red_${tx.id || 'pos'}`}</span>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>

                                <td style={{ padding: '14px 16px' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    backgroundColor: category === 'Fine Dining' ? '#fef3c7' : category === 'Giftogram' ? '#ecfeff' : category === 'Room Nights' ? '#ede9fe' : '#eaf5ee',
                                    color: category === 'Fine Dining' ? '#92400e' : category === 'Giftogram' ? '#0e7490' : category === 'Room Nights' ? '#5b21b6' : '#15803d'
                                  }}>
                                    {category}
                                  </span>
                                </td>

                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                  <span
                                    style={{
                                      fontWeight: 800,
                                      fontSize: '0.9rem',
                                      color: isCredited ? '#15803d' : '#b45309'
                                    }}
                                  >
                                    {isCredited ? `+${tx.points} pts` : `${tx.points} pts`}
                                  </span>
                                </td>

                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      backgroundColor: tx.status === 'Credited' ? '#dcfce7' : tx.status === 'Redeemed' ? '#fef3c7' : '#f1f5f9',
                                      color: tx.status === 'Credited' ? '#15803d' : tx.status === 'Redeemed' ? '#92400e' : '#475569'
                                    }}
                                  >
                                    {tx.status}
                                  </span>
                                </td>

                                <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem' }}>
                                  {tx.notes || (isCredited ? 'Completed Cloudbeds stay' : 'Points redemption')}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Cloudbeds Stay Calculation Policy Callout */}
                  <div style={{
                    marginTop: '20px',
                    padding: '14px 18px',
                    backgroundColor: '#fbfaf6',
                    borderRadius: '8px',
                    borderLeft: '4px solid #dda943',
                    fontSize: '0.825rem',
                    color: '#475569',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: '#17271f' }}>Rewards Points & POS Policy: </strong>
                    Points are credited to members for qualifying completed stays and bound to their unique <strong>Evolve ID</strong> and 3rd-party <strong>Square POS ID</strong> ({selectedRewardsMember.squareId || 'sq_cust_1001'}). When members redeem points (e.g., 5 nights to fine dining experiences), redemptions are locked to their Square ID. Even if guest contact details change, this permanent POS linkage prevents duplicate points claims across different accounts.
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'gifts' ? (
          /* ===============================================================
             GIFT REQUESTS LISTING VIEW — WITH REQUEST DATES, POINTS, STATUS & GIFTOGRAM REDIRECT
          =============================================================== */
          <div>
            <div className="admin-card-workspace">
              {/* Header with Eyebrow, Title, Subtitle and Actions */}
              <div className="admin-card-header" style={{ marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="admin-ops-eyebrow">PROPERTY MANAGER WORKSPACE</span>
                  <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Evolve Texarkana • Giftogram Gift Card Requests</span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: '#edf4f0',
                        color: '#17271f',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        padding: '2px 10px',
                        borderRadius: '20px',
                        border: '1px solid #c2e0d1'
                      }}
                    >
                      {giftRequestsList.length} Requests
                    </span>
                  </h2>
                  <p className="admin-card-desc">
                    Customer redemption requests for Giftogram digital gift cards. Review requested points, fulfill on Giftogram, and update delivery status.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <ArrowLeft size={15} />
                    <span>Dashboard</span>
                  </button>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '0 0 20px 0' }} />

              {/* Summary Metrics Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
                marginBottom: '22px'
              }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>TOTAL REQUESTS</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17271f', margin: '4px 0 2px 0' }}>{giftRequestsList.length}</div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Member redemptions</span>
                </div>

                <div style={{ backgroundColor: '#fffbeb', borderRadius: '12px', padding: '16px 20px', border: '1.5px solid #fde68a', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PENDING FULFILLMENT</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', margin: '4px 0 2px 0' }}>
                    {giftRequestsList.filter(r => r.status === 'pending').length}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600 }}>Awaiting Giftogram processing</span>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '16px 20px', border: '1.5px solid #bbf7d0', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', letterSpacing: '0.08em', textTransform: 'uppercase' }}>DONE / DELIVERED</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', margin: '4px 0 2px 0' }}>
                    {giftRequestsList.filter(r => r.status === 'fulfilled').length}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>Dispatched to customer</span>
                </div>

                <div style={{ backgroundColor: '#fcfaf6', borderRadius: '12px', padding: '16px 20px', border: '1.5px solid #dda943', boxShadow: '0 2px 8px rgba(221, 169, 67, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#997125', letterSpacing: '0.08em', textTransform: 'uppercase' }}>TOTAL POINTS REDEEMED</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17271f', margin: '4px 0 2px 0' }}>
                    {giftRequestsList.reduce((acc, r) => acc + (r.pointsRequested || r.nightsDeducted || 9), 0)} pts
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#997125', fontWeight: 600 }}>Via Giftogram cards</span>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="admin-bookings-search-input"
                    style={{ paddingLeft: '40px', margin: 0, width: '100%' }}
                    placeholder="Search by customer name, email, request code, or reference..."
                    value={giftSearchQuery}
                    onChange={(e) => setGiftSearchQuery(e.target.value)}
                  />
                </div>

                {/* Status Filter Buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { key: 'all', label: `All (${giftRequestsList.length})` },
                    { key: 'pending', label: `Pending (${giftRequestsList.filter(r => r.status === 'pending').length})` },
                    { key: 'fulfilled', label: `Done / Delivered (${giftRequestsList.filter(r => r.status === 'fulfilled').length})` },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setGiftFilterStatus(tab.key as any)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: giftFilterStatus === tab.key ? '1.5px solid #17271f' : '1px solid #e2e8f0',
                        backgroundColor: giftFilterStatus === tab.key ? '#17271f' : '#ffffff',
                        color: giftFilterStatus === tab.key ? '#ffffff' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Gift Requests Listing Table */}
              <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8faf9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '14px 18px' }}>Request ID</th>
                      <th style={{ padding: '14px 18px' }}>Date of Request</th>
                      <th style={{ padding: '14px 18px' }}>Customer / Member</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Points Requested</th>
                      <th style={{ padding: '14px 18px' }}>Voucher Amount</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>Date Processed</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center', width: '130px' }}>Notes</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {giftRequestsList
                      .filter(req => {
                        const query = giftSearchQuery.toLowerCase();
                        const matchesSearch = !query ||
                          req.requestCode.toLowerCase().includes(query) ||
                          req.guestName.toLowerCase().includes(query) ||
                          req.guestEmail.toLowerCase().includes(query) ||
                          (req.phone && req.phone.includes(query)) ||
                          (req.notes && req.notes.toLowerCase().includes(query)) ||
                          (req.dateProcessed && req.dateProcessed.toLowerCase().includes(query));
                        const matchesStatus = giftFilterStatus === 'all' || req.status === giftFilterStatus;
                        return matchesSearch && matchesStatus;
                      })
                      .map((req, idx) => {
                        const isDone = req.status === 'fulfilled';
                        const pointsVal = req.pointsRequested || req.nightsDeducted || 9;

                        return (
                          <tr
                            key={req.id}
                            style={{
                              borderBottom: '1px solid #f1f5f3',
                              backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafcfb',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f7f4')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafcfb')}
                          >
                            {/* Request Code */}
                            <td style={{ padding: '14px 18px' }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#17271f', fontSize: '0.92rem' }}>
                                {req.requestCode}
                              </span>
                            </td>

                            {/* Date of Request */}
                            <td style={{ padding: '14px 18px', color: '#475569', fontSize: '0.86rem', whiteSpace: 'nowrap' }}>
                              {req.requestDate || 'Sep 28, 2026'}
                            </td>

                            {/* Customer / Member - Name and Phone No Below */}
                            <td style={{ padding: '14px 18px' }}>
                              <strong style={{ color: '#17271f', fontSize: '0.92rem', display: 'block' }}>
                                {req.guestName}
                              </strong>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                                {req.phone || '(555) 234-5678'}
                              </span>
                            </td>

                            {/* Points Requested */}
                            <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, color: '#17271f' }}>
                              {pointsVal} Points
                            </td>

                            {/* Voucher Amount */}
                            <td style={{ padding: '14px 18px' }}>
                              <strong style={{ color: '#15803d', fontSize: '0.92rem' }}>
                                {req.amount.replace(/Digital Gift Card/i, '').trim()}
                              </strong>
                            </td>

                            {/* Status Section - Simple Clean Dropdown (No icons, no bulky box) */}
                            <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                              <select
                                value={req.status}
                                onChange={(e) => handleToggleGiftStatus(req.id, e.target.value as 'pending' | 'fulfilled')}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  backgroundColor: '#ffffff',
                                  color: isDone ? '#15803d' : '#b45309',
                                  border: '1px solid #d1d5db',
                                  outline: 'none'
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="fulfilled">Done</option>
                              </select>
                            </td>

                            {/* Date Processed - Marked when admin marks Done */}
                            <td style={{ padding: '14px 18px', fontSize: '0.86rem', whiteSpace: 'nowrap' }}>
                              {isDone && (req.dateProcessed || req.deliveredDate) ? (
                                <span style={{ color: '#15803d', fontWeight: 600 }}>{req.dateProcessed || req.deliveredDate}</span>
                              ) : (
                                <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.82rem' }}>
                                  Pending completion
                                </span>
                              )}
                            </td>

                            {/* Notes - Small compact section opening popup */}
                            <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                              {req.notes ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteReq(req);
                                    setQuickNoteText(req.notes || '');
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#ffffff',
                                    color: '#17271f',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease'
                                  }}
                                  title="View and edit note in popup"
                                >
                                  <FileText size={13} style={{ color: '#173f34' }} />
                                  <span>View Note</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteReq(req);
                                    setQuickNoteText('');
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    border: '1px dashed #cbd5e1',
                                    backgroundColor: '#f8fafc',
                                    color: '#64748b',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease'
                                  }}
                                  title="Add note in popup"
                                >
                                  <Plus size={12} />
                                  <span>Add Note</span>
                                </button>
                              )}
                            </td>



                            {/* Actions: Fulfill in Giftogram */}
                            <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={handleOpenGiftogramFulfill}
                                style={{
                                  padding: '7px 14px',
                                  borderRadius: '6px',
                                  border: '1px solid #17271f',
                                  backgroundColor: '#17271f',
                                  color: '#ffffff',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Opens Giftogram.com directly in a new tab"
                              >
                                <span>Fulfill in Giftogram</span>
                                <ExternalLink size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Helpful integration note */}
              <div style={{
                marginTop: '20px',
                padding: '14px 18px',
                backgroundColor: '#fbfaf6',
                borderRadius: '8px',
                borderLeft: '4px solid #dda943',
                fontSize: '0.825rem',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <strong style={{ color: '#17271f' }}>Giftogram Fulfillment Process: </strong>
                  When a customer requests a gift card redemption, click <strong>"Fulfill in Giftogram"</strong> to open Giftogram.com in a new tab. Once purchased and dispatched, record the provider reference code and update the status to <strong>Done</strong>. Admin can also manually toggle status between Pending and Done anytime.
                </div>
                <button
                  type="button"
                  onClick={() => window.open('https://www.giftogram.com', '_blank', 'noopener,noreferrer')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#173f34',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Visit Giftogram.com</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>

            {/* Bottom Button: View Full Searchable Audit Log */}
            <button
              type="button"
              className="admin-btn-audit-log"
              onClick={() => setShowAuditModal(true)}
            >
              <span>View Full Searchable Audit Log</span>
            </button>
          </div>
        ) : activeTab === 'cases' ? (
          /* ===============================================================
             GUEST CASES TABLE VIEW (COLUMNS: CASE NO, NAME, ASSIGNED TO, STATUS, ACTION WITH VIEW ICON)
          =============================================================== */
          <div>
            <div className="admin-card-workspace">
              {/* Header with Title, Count Badge, Create Case and Back Button */}
              <div className="admin-card-header" style={{ marginBottom: '20px', alignItems: 'center' }}>
                <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, flexWrap: 'wrap' }}>
                  <span>Evolve Texarkana • Guest Cases</span>
                  <span
                    title={`${filteredGuestCases.length} Guest Cases`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#edf4f0',
                      color: '#17271f',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: '20px',
                      border: '1px solid #c2e0d1'
                    }}
                  >
                    {filteredGuestCases.length}
                  </span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="admin-btn-create-case"
                    style={{ marginTop: 0, padding: '9px 18px', fontSize: '0.88rem', fontWeight: 600 }}
                    onClick={() => setShowCreateCaseModal(true)}
                  >
                    + Create Guest Case
                  </button>
                  {!isFrontDesk && (
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Advanced Filters Section */}
              <div className="admin-filters-card" style={{ marginBottom: '20px' }}>
                <div
                  className="admin-filters-header"
                  onClick={() => setIsCaseFiltersOpen(prev => !prev)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={15} style={{ color: '#17271f' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#17271f', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Advanced Filters
                    </span>
                    {activeCaseFiltersCount > 0 && (
                      <span style={{
                        backgroundColor: '#ea580c',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {activeCaseFiltersCount} Active
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>{isCaseFiltersOpen ? 'Collapse' : 'Expand'}</span>
                    {isCaseFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Collapsible Body with Filters */}
                {isCaseFiltersOpen && (
                  <div className="admin-filters-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
                      {/* 1. Case No / Search */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Search Case / Name</label>
                        <input
                          type="text"
                          className="admin-filter-input"
                          placeholder="e.g. CASE-1042 or Emily"
                          value={caseFilterSearch}
                          onChange={(e) => setCaseFilterSearch(e.target.value)}
                        />
                      </div>

                      {/* 2. Assigned To */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Assigned To</label>
                        <select
                          className="admin-filter-select"
                          value={caseFilterRole}
                          onChange={(e) => setCaseFilterRole(e.target.value)}
                        >
                          <option value="all">All Roles</option>
                          <option value="Property Manager">Property Manager</option>
                          <option value="Front Desk">Front Desk</option>
                        </select>
                      </div>

                      {/* 3. Priority */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Priority</label>
                        <select
                          className="admin-filter-select"
                          value={caseFilterPriority}
                          onChange={(e) => setCaseFilterPriority(e.target.value)}
                        >
                          <option value="all">All Priorities</option>
                          <option value="Urgent">Urgent</option>
                          <option value="High">High</option>
                          <option value="Normal">Normal</option>
                        </select>
                      </div>

                      {/* 4. Status */}
                      <div className="admin-filter-group">
                        <label className="admin-filter-label">Status</label>
                        <select
                          className="admin-filter-select"
                          value={caseFilterStatus}
                          onChange={(e) => setCaseFilterStatus(e.target.value)}
                        >
                          <option value="all">All Statuses</option>
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      {/* 5. Reset Action */}
                      {activeCaseFiltersCount > 0 && (
                        <div className="admin-filter-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={handleResetCaseFilters}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              height: '38px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            Reset Filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Cases Table View */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '14px 18px', width: '18%' }}>Case No</th>
                        <th style={{ padding: '14px 18px', width: '28%' }}>Name</th>
                        <th style={{ padding: '14px 18px', width: '18%' }}>Assigned To</th>
                        <th style={{ padding: '14px 18px', width: '14%' }}>Priority</th>
                        <th style={{ padding: '14px 18px', width: '14%' }}>Status</th>
                        <th style={{ padding: '14px 18px', width: '8%', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuestCases.length > 0 ? (
                        filteredGuestCases.map((item, idx) => {
                          let statusColor = '#475569';
                          const s = (item.status || '').toLowerCase();
                          if (s === 'resolved' || s === 'closed') statusColor = '#15803d';
                          else if (s === 'open' || s === 'new') statusColor = '#0284c7';
                          else if (s === 'in progress' || s === 'under review') statusColor = '#d97706';

                          return (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: idx !== filteredGuestCases.length - 1 ? '1px solid #edf2f7' : 'none',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbfcfb')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                            >
                              {/* 1. Case No */}
                              <td style={{ padding: '14px 18px', fontWeight: 700, color: '#17271f', fontSize: '0.90rem', whiteSpace: 'nowrap' }}>
                                {item.caseNumber}
                              </td>

                              {/* 2. Name */}
                              <td style={{ padding: '14px 18px' }}>
                                <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.92rem' }}>
                                  {item.guestName}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                  {item.title}
                                </div>
                              </td>

                              {/* 3. Assigned To */}
                              <td style={{ padding: '14px 18px', color: '#334155', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>{item.assignedRole}</span>
                                  {isFrontDesk && item.assignedRole?.toLowerCase().includes('front desk') && (
                                    <span style={{
                                      fontSize: '0.72rem',
                                      backgroundColor: '#e0f2fe',
                                      color: '#0369a1',
                                      padding: '2px 7px',
                                      borderRadius: '4px',
                                      fontWeight: 700,
                                      border: '1px solid #bae6fd'
                                    }}>
                                      Review
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 4. Priority */}
                              <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  backgroundColor: item.priority === 'Urgent' ? '#fee2e2' : item.priority === 'High' ? '#fef3c7' : '#f1f5f9',
                                  color: item.priority === 'Urgent' ? '#991b1b' : item.priority === 'High' ? '#92400e' : '#334155',
                                  border: item.priority === 'Urgent' ? '1px solid #fca5a5' : item.priority === 'High' ? '1px solid #fcd34d' : '1px solid #e2e8f0',
                                  letterSpacing: '0.02em'
                                }}>
                                  {item.priority}
                                </span>
                              </td>

                              {/* 5. Status (Interactive Selector to easily resolve / progress cases) */}
                              <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                <select
                                  value={item.status}
                                  onChange={(e) => handleInlineCaseStatusChange(item.id, e.target.value as any)}
                                  title="Change case status directly"
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    border: '1.5px solid #cbd5e1',
                                    backgroundColor: item.status === 'Resolved' || item.status === 'Closed' ? '#f0fdf4' : item.status === 'In Progress' ? '#fffbeb' : '#f0f9ff',
                                    color: statusColor,
                                    cursor: 'pointer',
                                    outline: 'none'
                                  }}
                                >
                                  <option value="Open">Open</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Resolved">✓ Resolved</option>
                                  <option value="Closed">Closed</option>
                                </select>
                              </td>

                              {/* 6. Action with Review & Edit Button */}
                              <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <button
                                  type="button"
                                  title="Review & Edit Case"
                                  aria-label="Review & Edit Case"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1.5px solid #17271f',
                                    backgroundColor: '#ffffff',
                                    color: '#17271f',
                                    cursor: 'pointer',
                                    fontSize: '0.80rem',
                                    fontWeight: 600,
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#17271f';
                                    e.currentTarget.style.color = '#ffffff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.color = '#17271f';
                                  }}
                                  onClick={() => openCaseModal(item)}
                                >
                                  <Edit3 size={13} />
                                  <span>Edit</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ padding: '36px 18px', textAlign: 'center', color: '#64748b' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px', color: '#17271f' }}>
                              No guest cases found
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
                              Try clearing filters or create a new guest case for this property.
                            </div>
                            <button
                              type="button"
                              className="admin-btn-create-case"
                              style={{ marginTop: 0 }}
                              onClick={() => setShowCreateCaseModal(true)}
                            >
                              + Create Guest Case
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Button: View Full Searchable Audit Log */}
            <button
              type="button"
              className="admin-btn-audit-log"
              onClick={() => setShowAuditModal(true)}
            >
              <span>View Full Searchable Audit Log</span>
            </button>
          </div>
        ) : activeTab === 'reporting' ? (
          /* ===============================================================
             REPORTING VIEW (MATCHING REFERENCE SCREENSHOT)
          =============================================================== */
          <div>
            <div className="admin-card-workspace">
              {/* Header with Title and Dashboard Back Button */}
              <div className="admin-card-header" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="admin-ops-eyebrow">PROPERTY MANAGER WORKSPACE</span>
                  <h2 className="admin-card-title">Evolve Texarkana • Reporting</h2>
                  <p className="admin-card-desc">
                    View, search, and print property-scoped operational records for reconciliation, management review, and the permanent audit trail.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn-dashboard-back"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <ArrowLeft size={15} />
                  <span>Dashboard</span>
                </button>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '0 0 20px 0' }} />

              {/* Reporting Options Box (Matching Screenshot) */}
              <div className="admin-reporting-card">
                {/* Row 1: Filtered Audit Log */}
                <div className="admin-reporting-row">
                  <div className="admin-reporting-info">
                    <h4 className="admin-reporting-title">Filtered Audit Log</h4>
                    <p className="admin-reporting-desc">Visible staff, reward, account, security and integration activity</p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-reporting-primary"
                    onClick={() => setShowAuditModal(true)}
                  >
                    View / Search
                  </button>
                </div>

                {/* Row 2: Membership Report */}
                <div className="admin-reporting-row">
                  <div className="admin-reporting-info">
                    <h4 className="admin-reporting-title">Membership Report</h4>
                    <p className="admin-reporting-desc">Member count, tier, status, qualified nights and available balance</p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-reporting-secondary"
                    onClick={() => setShowMembershipReportModal(true)}
                  >
                    Open Report
                  </button>
                </div>

                {/* Row 3: Rewards & Redemptions Report */}
                <div className="admin-reporting-row">
                  <div className="admin-reporting-info">
                    <h4 className="admin-reporting-title">Rewards & Redemptions Report</h4>
                    <p className="admin-reporting-desc">Qualified-night credits and free-night, dining and gift-card deductions</p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-reporting-secondary"
                    onClick={() => setShowRewardsReportModal(true)}
                  >
                    Open Report
                  </button>
                </div>

                {/* Row 4: Automated Rule Decisions */}
                <div className="admin-reporting-row">
                  <div className="admin-reporting-info">
                    <h4 className="admin-reporting-title">Automated Rule Decisions</h4>
                    <p className="admin-reporting-desc">Clear eligibility failures rejected by the system without creating an Admin review item</p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-reporting-secondary"
                    onClick={() => setShowRuleDecisionsModal(true)}
                  >
                    View Decisions
                  </button>
                </div>

                {/* Callout Notice Card */}
                <div className="admin-reporting-callout">
                  <h5 className="admin-reporting-callout-title">View, search, and print access</h5>
                  <p className="admin-reporting-callout-desc">
                    For data protection, CSV downloads are restricted to Super Admin. Your role can still open, search, and print permitted reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Button: View Full Searchable Audit Log */}
            <button
              type="button"
              className="admin-btn-audit-log"
              onClick={() => setShowAuditModal(true)}
            >
              <span>View Full Searchable Audit Log</span>
            </button>
          </div>
        ) : activeTab === 'security' ? (
          /* ===============================================================
             USERS & SECURITY VIEW (MATCHING BOTH REFERENCE SCREENSHOTS)
          =============================================================== */
          <div>
            <div className="admin-card-workspace">
              {selectedStaffUser ? (
                /* -------------------------------------------------------------
                   STAFF USER SECURITY & MANAGE ACCESS VIEW (MATCHING SCREENSHOT)
                ------------------------------------------------------------- */
                <div>
                  {/* Top Navigation Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h2 className="admin-card-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.65rem' }}>
                        {selectedStaffUser.name} • Staff Security
                      </h2>
                      <p className="admin-card-desc" style={{ color: '#64748b', marginTop: '4px' }}>
                        Review and manage this staff user&apos;s access. Property: {selectedStaffUser.property}.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '0 0 20px 0' }} />

                  {/* Back to Property Security Button */}
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedStaffUser(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>{selectedStaffUser.property} Security</span>
                    </button>
                  </div>

                  {/* 3 Metric Cards Grid matching Screenshot */}
                  <div className="admin-security-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
                    <div className="admin-security-metric-tile">
                      <span className="admin-security-metric-eyebrow">PROPERTY</span>
                      <h3 className="admin-security-metric-val">{selectedStaffUser.property}</h3>
                    </div>

                    <div className="admin-security-metric-tile">
                      <span className="admin-security-metric-eyebrow">ROLE</span>
                      <h3 className="admin-security-metric-val">{selectedStaffUser.role}</h3>
                    </div>

                    <div className="admin-security-metric-tile">
                      <span className="admin-security-metric-eyebrow">ACCOUNT</span>
                      <h3 className="admin-security-metric-val" style={{ color: selectedStaffUser.status === 'Active' ? '#15803d' : '#b91c1c' }}>
                        {selectedStaffUser.status}
                      </h3>
                    </div>
                  </div>

                  {/* Editable Front Desk User Details Form */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #dbe2df',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '22px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span className="admin-ops-eyebrow">FRONT DESK EDITABLE PROFILE</span>
                        <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#17271f' }}>
                          Staff Identity &amp; Contact Details
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                          Edit employee ID, name, business email, contact number, designation, and operational notes.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSaveStaffDetails}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                            Employee ID
                          </label>
                          <input
                            type="text"
                            value={editEmpId}
                            onChange={(e) => setEditEmpId(e.target.value)}
                            placeholder="e.g. EMP-102"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #d1d5db',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g. Mike Johnson"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #d1d5db',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                            Business Email
                          </label>
                          <input
                            type="email"
                            required
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="e.g. mike.j@evolve.com"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #d1d5db',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                            Contact No
                          </label>
                          <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="e.g. +1 (903) 555-0188"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #d1d5db',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                            Designation
                          </label>
                          <select
                            value={editDesignation === 'Property Manager' ? 'Property Manager' : 'Front Desk'}
                            onChange={(e) => setEditDesignation(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #d1d5db',
                              fontSize: '0.88rem',
                              backgroundColor: '#ffffff'
                            }}
                          >
                            <option value="Front Desk">Front Desk</option>
                            <option value="Property Manager">Property Manager</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                            Assigned Role &amp; Property
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`${selectedStaffUser.role} • ${selectedStaffUser.property}`}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #e5e7eb',
                              backgroundColor: '#f3f4f6',
                              color: '#4b5563',
                              fontSize: '0.88rem',
                              fontWeight: 600
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                          Notes
                        </label>
                        <textarea
                          rows={2}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="e.g. Shift assignments, onboarding notes, system credentials..."
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1.5px solid #d1d5db',
                            fontSize: '0.88rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          type="submit"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 22px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#17271f',
                            color: '#ffffff',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Verification Cards Container matching Screenshot */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #dbe2df',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '22px'
                  }}>
                    {/* Row 1: Staff identity */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '18px 24px',
                      borderBottom: '1px solid #edf1ef'
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 3px 0', fontSize: '0.98rem', fontWeight: 700, color: '#17271f' }}>
                          Staff identity
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#55665e', margin: '0 0 2px 0' }}>
                          {selectedStaffUser.email}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#6a7c73' }}>
                          Last successful sign-in: {selectedStaffUser.lastActive || 'Aug 23, 2026 • 9:14 AM'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17271f' }}>
                        Verified
                      </span>
                    </div>


                    {/* Row 3: Authentication */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '18px 24px'
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 3px 0', fontSize: '0.98rem', fontWeight: 700, color: '#17271f' }}>
                          Authentication
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#55665e' }}>
                          Password plus email 2FA • Recovery changes are permanently audited
                        </div>
                      </div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17271f' }}>
                        Secure
                      </span>
                    </div>
                  </div>

                  {/* Required reason & Action Buttons matching Screenshot */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Required reason
                    </label>
                    <textarea
                      rows={3}
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Reason for disabling, enabling, or deleting this staff account"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #d1d5db',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        marginBottom: '16px'
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleToggleStaffAccess}
                        style={{
                          padding: '11px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: selectedStaffUser.status === 'Active' ? '#17271f' : '#15803d',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {selectedStaffUser.status === 'Active' ? 'Disable Access' : 'Enable Access'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPropertySecurityLogModal(true)}
                        style={{
                          padding: '11px 24px',
                          borderRadius: '8px',
                          border: '1.5px solid #d1d5db',
                          backgroundColor: '#ffffff',
                          color: '#17271f',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        View Staff Audit
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteStaffAccount}
                        style={{
                          padding: '11px 24px',
                          borderRadius: '8px',
                          border: '1.5px solid #fca5a5',
                          backgroundColor: '#ffffff',
                          color: '#dc2626',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedSecurityProperty ? (
                /* -------------------------------------------------------------
                   SCREENSHOT 2: PROPERTY SECURITY & USERS DETAIL VIEW
                ------------------------------------------------------------- */
                <div>
                  {/* Top Navigation Row matching Screenshot 2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedSecurityProperty(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>All Security</span>
                    </button>

                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                  </div>

                  {/* 3 Metric Cards Grid */}
                  <div className="admin-security-metrics-grid">
                    {/* Card 1: Property */}
                    <div className="admin-security-metric-tile">
                      <span className="admin-security-metric-eyebrow">PROPERTY</span>
                      <h3 className="admin-security-metric-val">Evolve Texarkana</h3>
                    </div>

                    {/* Card 2: Property Status */}
                    <div className="admin-security-metric-tile">
                      <span className="admin-security-metric-eyebrow">PROPERTY STATUS</span>
                      <h3 className="admin-security-metric-val">Active</h3>
                    </div>

                    {/* Card 3: Administration Access */}
                    <div className="admin-security-metric-tile">
                      <span className="admin-security-metric-eyebrow">ADMINISTRATION ACCESS</span>
                      <h3 className="admin-security-metric-val">
                        {propertyUsersList.filter(u => u.status === 'Active').length} active • All access verified
                      </h3>
                      <p className="admin-security-metric-subtext">
                        Property Manager and Front Desk accounts • Super Admin excluded
                      </p>
                    </div>
                  </div>

                  {/* Front Desk Section Title & Action Buttons Above Table */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{
                        margin: 0,
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.45rem',
                        color: '#17271f',
                        fontWeight: 700
                      }}>
                        Front Desk
                      </h3>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        {propertyUsersList.length}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        className="admin-btn-add-front-desk"
                        onClick={() => setShowAddUserModal(true)}
                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      >
                        <Plus size={15} />
                        <span>Add Front Desk User</span>
                      </button>

                      <button
                        type="button"
                        className="admin-btn-security-log"
                        onClick={() => setShowPropertySecurityLogModal(true)}
                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      >
                        <span>View Property Security Log</span>
                      </button>
                    </div>
                  </div>

                  {/* Front Desk Table View */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '14px 18px', width: '12%' }}>ID</th>
                            <th style={{ padding: '14px 18px', width: '26%' }}>Name</th>
                            <th style={{ padding: '14px 18px', width: '28%' }}>Email</th>
                            <th style={{ padding: '14px 18px', width: '20%' }}>Phone No</th>
                            <th style={{ padding: '14px 18px', width: '14%', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {propertyUsersList.length > 0 ? (
                            propertyUsersList.map((user, idx) => (
                              <tr
                                key={user.id}
                                style={{
                                  borderBottom: idx !== propertyUsersList.length - 1 ? '1px solid #edf2f7' : 'none',
                                  transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbfcfb')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                              >
                                {/* 1. ID */}
                                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#17271f', fontSize: '0.90rem', whiteSpace: 'nowrap' }}>
                                  {user.employeeId || user.id}
                                </td>

                                {/* 2. Name */}
                                <td style={{ padding: '14px 18px' }}>
                                  <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.92rem' }}>
                                    {user.name}
                                  </div>
                                  <div style={{ fontSize: '0.80rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                                    {user.designation === 'Property Manager' || user.role === 'Property Manager' ? 'Property Manager' : 'Front Desk'}
                                  </div>
                                </td>

                                {/* 3. Email */}
                                <td style={{ padding: '14px 18px', color: '#475569', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                  {user.email}
                                </td>

                                {/* 4. Phone No */}
                                <td style={{ padding: '14px 18px', color: '#334155', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                  {user.phone || '+1 (903) 555-0142'}
                                </td>

                                {/* 5. Actions */}
                                <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                  <button
                                    type="button"
                                    className="admin-btn-security-action"
                                    style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                                    onClick={() => handleOpenManageAccess(user)}
                                  >
                                    {user.role === 'Property Manager' ? 'View Security' : 'Manage Access'}
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                No front desk users found. Click &quot;Add Front Desk User&quot; above to provision access.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* -------------------------------------------------------------
                   SCREENSHOT 1: ALL SECURITY PROPERTIES OVERVIEW
                ------------------------------------------------------------- */
                <div>
                  <div className="admin-card-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="admin-ops-eyebrow">PROPERTY MANAGER WORKSPACE</span>
                      <h2 className="admin-card-title">Users & Security</h2>
                      <p className="admin-card-desc">
                        Manage property administrative officers, two-factor compliance, and operational credential status.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '0 0 20px 0' }} />

                  {/* Property Overview Card matching Screenshot 1 */}
                  <div className="admin-security-overview-card">
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: '#17271f' }}>
                        Evolve Texarkana
                      </h3>
                      <div style={{ color: '#15803d', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>
                        Active
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.86rem' }}>
                        Administration access: {propertyUsersList.length} active • All access verified • 0 security alerts
                      </div>
                    </div>

                    <button
                      type="button"
                      className="admin-btn-security-action"
                      onClick={() => setSelectedSecurityProperty('Evolve Texarkana')}
                    >
                      View Property Security
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Button: View Full Searchable Audit Log */}
            <button
              type="button"
              className="admin-btn-audit-log"
              onClick={() => setShowAuditModal(true)}
            >
              <span>View Full Searchable Audit Log</span>
            </button>
          </div>
        ) : activeTab === 'properties' ? (
          /* ===============================================================
             PROPERTIES & ACCESS VIEW
          =============================================================== */
          <div>
            <div className="admin-card-workspace">
              <div className="admin-card-header">
                <div>
                  <span className="admin-ops-eyebrow">PROPERTY MANAGER WORKSPACE</span>
                  <h2 className="admin-card-title">Properties & Access</h2>
                  <p className="admin-card-desc">
                    Organization-wide property configuration, manager assignment, activation status and integration readiness.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn-dashboard-back"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <ArrowLeft size={15} />
                  <span>Dashboard</span>
                </button>
              </div>

              {/* Filter Dropdown Bar */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="admin-properties-dropdown"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <span>
                    {selectedFilter === 'all' && 'All Properties'}
                    {selectedFilter === 'active' && 'Active Properties Only'}
                    {selectedFilter === 'pre_launch' && 'Pre-Launch Properties Only'}
                  </span>
                  <ChevronDown size={18} color="#4b5563" />
                </button>

                {isFilterOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d4ded9',
                    borderRadius: '8px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    zIndex: 20,
                    marginTop: '4px',
                    overflow: 'hidden'
                  }}>
                    <button
                      type="button"
                      onClick={() => { setSelectedFilter('all'); setIsFilterOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: selectedFilter === 'all' ? '#f4f7f5' : '#ffffff',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: selectedFilter === 'all' ? 700 : 500,
                        color: '#17271f',
                        cursor: 'pointer'
                      }}
                    >
                      All Properties ({propertiesList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedFilter('active'); setIsFilterOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: selectedFilter === 'active' ? '#f4f7f5' : '#ffffff',
                        border: 'none',
                        borderTop: '1px solid #edf1ef',
                        fontSize: '0.875rem',
                        fontWeight: selectedFilter === 'active' ? 700 : 500,
                        color: '#17271f',
                        cursor: 'pointer'
                      }}
                    >
                      Active Properties Only ({propertiesList.filter(p => p.status === 'Active').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedFilter('pre_launch'); setIsFilterOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background: selectedFilter === 'pre_launch' ? '#f4f7f5' : '#ffffff',
                        border: 'none',
                        borderTop: '1px solid #edf1ef',
                        fontSize: '0.875rem',
                        fontWeight: selectedFilter === 'pre_launch' ? 700 : 500,
                        color: '#17271f',
                        cursor: 'pointer'
                      }}
                    >
                      Pre-Launch Properties Only ({propertiesList.filter(p => p.status === 'Pre-Launch').length})
                    </button>
                  </div>
                )}
              </div>

              {/* + Add Property CTA */}
              <button
                type="button"
                className="admin-btn-add-property"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                <span>Add Property</span>
              </button>

              {/* Stacked Properties List */}
              <div className="admin-property-list">
                {filteredProperties.map(prop => (
                  <div key={prop.id} className="admin-property-row">
                    <div>
                      <div className="admin-property-name">{prop.name}</div>
                      <div className="admin-property-meta">
                        {prop.membersCount} members • {prop.openCasesCount} open cases • Manager: {prop.managerName}
                      </div>
                      <div className="admin-property-integration">
                        Integration readiness:{' '}
                        <strong style={{
                          color: prop.integrationReadiness === 'Healthy' ? '#15803d' : '#b45309',
                          fontWeight: 700
                        }}>
                          {prop.integrationReadiness}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-property-actions">
                      <span className="admin-property-status-text">
                        {prop.status}
                      </span>
                      <button
                        type="button"
                        className="admin-btn-manage-prop"
                        onClick={() => setManagingProperty(prop)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="admin-btn-audit-log"
              onClick={() => setShowAuditModal(true)}
            >
              <span>View Full Searchable Audit Log</span>
            </button>
          </div>
        ) : !allMenuItems.find(m => m.id === activeTab)?.roles.includes(currentAdmin.role) ? (
          /* Role Access Restricted Guard */
          <div className="admin-card-workspace" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Lock size={28} />
            </div>
            <h2 className="admin-card-title" style={{ marginBottom: '8px' }}>
              Access Restricted
            </h2>
            <p className="admin-card-desc" style={{ margin: '0 auto 24px auto', maxWidth: '480px' }}>
              Your account <strong>{currentAdmin.name}</strong> ({currentAdmin.roleTitle || 'Front Desk Officer'}) has operational clearance and does not have permissions to access this management module. Contact your General Property Manager for elevated privileges.
            </p>
            <button
              type="button"
              className="admin-btn-add-property"
              onClick={() => setActiveTab(isFrontDesk ? 'bookings' : 'dashboard')}
            >
              <ArrowLeft size={16} />
              <span>{isFrontDesk ? 'Return to Active Bookings' : 'Return to Dashboard'}</span>
            </button>
          </div>
        ) : (
          /* Placeholder for upcoming modules as user builds them one-by-one */
          <div className="admin-card-workspace" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(221, 169, 67, 0.12)',
              color: '#b88628',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Sparkles size={28} />
            </div>
            <h2 className="admin-card-title" style={{ marginBottom: '8px' }}>
              {allMenuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="admin-card-desc" style={{ margin: '0 auto 24px auto' }}>
              This page will be configured in the next step. You can proceed step-by-step to create the interface for this section.
            </p>
            <button
              type="button"
              className="admin-btn-add-property"
              onClick={() => setActiveTab('dashboard')}
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>
        )}
      </main>

      {/* ===================================================================
          MODAL: ADD PROPERTY
      =================================================================== */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#17271f' }}>
                Add New Property
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPropertySubmit}>
              <div className="admin-field-group" style={{ marginBottom: '16px' }}>
                <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                  Property Name
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Evolve Aspen Lodge"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  required
                  style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}
                />
              </div>

              <div className="admin-field-group" style={{ marginBottom: '24px' }}>
                <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                  General Manager (Optional)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Marcus Sterling"
                  value={newPropManager}
                  onChange={(e) => setNewPropManager(e.target.value)}
                  style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    background: '#ffffff',
                    color: '#374151',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-add-property"
                  style={{ margin: 0 }}
                >
                  Create Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: MANAGE PROPERTY
      =================================================================== */}
      {managingProperty && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="admin-ops-eyebrow">PROPERTY CONFIGURATION</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  {managingProperty.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setManagingProperty(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px', margin: '16px 0', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#6b7280', display: 'block' }}>Current Status:</span>
                  <strong style={{ color: '#17271f' }}>{managingProperty.status}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block' }}>Assigned Manager:</span>
                  <strong style={{ color: '#17271f' }}>{managingProperty.managerName}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block' }}>Active Members:</span>
                  <strong style={{ color: '#17271f' }}>{managingProperty.membersCount}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block' }}>Open Cases:</span>
                  <strong style={{ color: '#17271f' }}>{managingProperty.openCasesCount}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  const updatedStatus = managingProperty.status === 'Active' ? 'Pre-Launch' : 'Active';
                  setPropertiesList(propertiesList.map(p => p.id === managingProperty.id ? { ...p, status: updatedStatus } : p));
                  setManagingProperty({ ...managingProperty, status: updatedStatus });
                  addToast('info', 'Status Updated', `${managingProperty.name} status changed to ${updatedStatus}.`);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#f3f4f6',
                  color: '#1f2937',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Toggle Status ({managingProperty.status === 'Active' ? 'Set Pre-Launch' : 'Set Active'})
              </button>

              <button
                type="button"
                onClick={() => setManagingProperty(null)}
                className="admin-btn-add-property"
                style={{ margin: 0 }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: FULL SEARCHABLE AUDIT LOG
      =================================================================== */}
      {showAuditModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '650px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">ORGANIZATION AUDIT TRAIL</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Searchable System Audit Log
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              {[
                { time: 'Today 07:46 AM', user: currentAdmin.name, action: '2FA authentication verified via work email.', status: 'Success' },
                { time: 'Today 06:15 AM', user: 'System Worker', action: 'Automated PMS integration sync: Evolve Texarkana healthy.', status: 'Healthy' },
                { time: 'Yesterday 11:20 PM', user: 'Alex Rivera', action: 'Updated booking policies for Evolve Brooklyn.', status: 'Saved' },
                { time: 'Yesterday 04:45 PM', user: 'Jane Smith', action: 'Resolved case #EV-9021 (Suite 402 AC inspection).', status: 'Closed' },
                { time: 'Sep 14 02:10 PM', user: currentAdmin.name, action: 'Initialized pre-launch credentials for Evolve Prospect Park.', status: 'Pending' },
              ].map((log, idx) => (
                <div key={idx} style={{ padding: '12px 16px', borderBottom: idx < 4 ? '1px solid #f3f4f6' : 'none', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <strong style={{ color: '#17271f' }}>{log.user}</strong>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{log.time}</span>
                  </div>
                  <div style={{ color: '#4b5563' }}>{log.action}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="admin-btn-add-property"
                style={{ margin: 0 }}
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: MEMBER PROFILE & OPERATIONAL HISTORY (MATCHING SCREENSHOT)
      =================================================================== */}
      {selectedGuest && (
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
            borderRadius: '16px',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '28px 32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            {/* ===================================================================
                VIEW 1: MAIN MEMBER PROFILE & OPERATIONAL HISTORY
            =================================================================== */}
            {guestModalView === 'profile' && (
              <div>
                {/* Modal Header matching Screenshot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 800, color: '#17271f', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span>{selectedGuest.name}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#edf4f0', color: '#17271f', padding: '3px 10px', borderRadius: '6px', border: '1px solid #c2e0d1', fontFamily: 'sans-serif' }}>
                        {selectedGuest.customerId || 'CUST-1001'}
                      </span>
                      {isFrontDesk && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', border: '1px solid #cbd5e1', letterSpacing: '0.03em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                          View Only Mode
                        </span>
                      )}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                      Complete member profile and connected operational history.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!isFrontDesk && (
                      <button
                        type="button"
                        className="admin-btn-dashboard-back"
                        onClick={() => setSelectedGuest(null)}
                      >
                        <ArrowLeft size={15} />
                        <span>Dashboard</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '14px 0 18px 0' }} />

                {/* 4 Metric Tiles matching Screenshot */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  {/* Tile 1: AVAILABLE REWARD NIGHTS */}
                  <div className="admin-security-metric-tile" style={{ padding: '14px 18px' }}>
                    <span className="admin-security-metric-eyebrow">AVAILABLE REWARD NIGHTS</span>
                    <h3 className="admin-security-metric-val">{selectedGuest.rewardNights ?? 12}</h3>
                  </div>

                  {/* Tile 2: QUALIFIED NIGHTS */}
                  <div className="admin-security-metric-tile" style={{ padding: '14px 18px' }}>
                    <span className="admin-security-metric-eyebrow">QUALIFIED NIGHTS</span>
                    <h3 className="admin-security-metric-val">{selectedGuest.qualifiedNights ?? 34}</h3>
                  </div>

                  {/* Tile 3: TIER */}
                  <div className="admin-security-metric-tile" style={{ padding: '14px 18px' }}>
                    <span className="admin-security-metric-eyebrow">TIER</span>
                    <h3 className="admin-security-metric-val">{selectedGuest.tier}</h3>
                  </div>

                  {/* Tile 4: ACCOUNT */}
                  <div className="admin-security-metric-tile" style={{ padding: '14px 18px' }}>
                    <span className="admin-security-metric-eyebrow">ACCOUNT</span>
                    <h3 className="admin-security-metric-val">{selectedGuest.accountStatus || 'Active'}</h3>
                  </div>
                </div>

                {/* Action Buttons Row */}
                {!isFrontDesk ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '18px' }}>
                    <button
                      type="button"
                      className="admin-btn-security-action"
                      onClick={() => {
                        setEditGuestName(selectedGuest.name);
                        setEditGuestEmail(selectedGuest.email);
                        setEditGuestPhone(selectedGuest.phone);
                        setEditCloudbedsRef(selectedGuest.cloudbedsReference || 'CB-10482');
                        setEditAccountStatus(selectedGuest.accountStatus || 'Active');
                        setIsEditingPhone(false);
                        setNewMobileNumber('');
                        setGuestModalView('editProfile');
                      }}
                    >
                      Edit Profile
                    </button>

                    <button
                      type="button"
                      className="admin-btn-security-action"
                      onClick={() => {
                        setNewMobileNumber('');
                        setPhoneVerifyMethod('Code to current phone');
                        setPhoneAuditNote('');
                        setGuestModalView('changePhone');
                      }}
                    >
                      Change Verified Phone
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRewardsMember(selectedGuest);
                        setActiveTab('rewards');
                        setSelectedGuest(null);
                      }}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '8px',
                        border: '1.5px solid #dda943',
                        backgroundColor: '#fcf6eb',
                        color: '#997125',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Award size={15} />
                      <span>Rewards Section & Points History →</span>
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '18px',
                    color: '#64748b',
                    fontSize: '0.83rem'
                  }}>
                    <ShieldCheck size={16} color="#475569" />
                    <span>Front Desk Officer Clearance: <strong>View-only profile</strong>. Member details, phone verification, and rewards are managed with Property Manager privileges.</span>
                  </div>
                )}

                {/* Member Details Record Box matching Screenshot rows */}
                <div className="admin-security-users-card" style={{ marginBottom: '20px' }}>
                  {/* Row 1: Verified identity & Evolve ID */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Verified identity</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Evolve ID: <strong style={{ color: '#17271f' }}>{selectedGuest.customerId || 'CUST-1001'}</strong> • {selectedGuest.phone} • {selectedGuest.email}
                      </div>
                      <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                        Assigned Evolve ID • Primary identifier: verified phone number
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                      Verified ✓
                    </div>
                  </div>

                  {/* Row 1b: Square POS Integration & Anti-Duplicate Redemption Lock */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Square POS ID (Points & Rewards Lock)</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#166534', padding: '1px 6px', borderRadius: '4px', border: '1px solid #bbf7d0', fontFamily: 'monospace' }}>
                          {selectedGuest.squareId || `sq_cust_${selectedGuest.customerId?.replace('CUST-', '') || '1001'}`}
                        </span>
                      </h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Linked with Customer ID: <strong style={{ color: '#17271f' }}>{selectedGuest.customerId || 'CUST-1001'}</strong> • Status: <strong style={{ color: selectedGuest.squareSyncStatus === 'Pending Sync' ? '#d97706' : '#15803d' }}>{selectedGuest.squareSyncStatus || 'Linked'}</strong> • Last Sync: {selectedGuest.squareLastSynced || 'Synced via POS webhook'}
                      </div>
                      <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                        Default 3rd-party POS identifier. All points redemptions (e.g. 5 nights to fine dining dinner) are permanently associated with this Square ID so that updated member details cannot claim duplicate rewards across accounts.
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: 700,
                        color: selectedGuest.squareSyncStatus === 'Pending Sync' ? '#b45309' : '#15803d',
                        fontSize: '0.86rem',
                        backgroundColor: selectedGuest.squareSyncStatus === 'Pending Sync' ? '#fef3c7' : '#eaf5ee',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: selectedGuest.squareSyncStatus === 'Pending Sync' ? '#d97706' : '#16a34a' }}></span>
                        {selectedGuest.squareSyncStatus || 'Linked ✓'}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Cloudbeds connection */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Cloudbeds connection</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        {selectedGuest.cloudbedsReference || 'CB-10482'} • Background PMS reference
                      </div>
                      <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                        Phone identifies the member; reservation ID identifies the credited stay.
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                      Connected
                    </div>
                  </div>

                  {/* Row 3: Latest Qualified Stay */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Latest Qualified Stay</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        {selectedGuest.latestStayText || '+2 nights • Completed direct stay • Cloudbeds EV-4218 • Aug 14, 2026'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-btn-security-action"
                      onClick={() => setGuestModalView('latestStay')}
                    >
                      View credited stay
                    </button>
                  </div>

                  {/* Row 4: Redemption history */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Redemption history</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        {selectedGuest.redemptionHistoryText || '1 Free Night • 2 Fine Dining Experiences • 0 Gift Cards'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-btn-security-action"
                      onClick={() => setGuestModalView('redemptions')}
                    >
                      View history
                    </button>
                  </div>

                  {/* Row 5: Cases and missing stays */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Cases and missing stays</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        {selectedGuest.casesText || '1 completed case • No open requests'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-btn-security-action"
                      onClick={() => setGuestModalView('cases')}
                    >
                      View cases
                    </button>
                  </div>
                </div>

                {/* Bottom Action Buttons matching Screenshot */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowRewardDetailsModal(true)}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#17271f',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    View Reward Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAuditModal(true)}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: '1px solid #d4ded9',
                      backgroundColor: '#ffffff',
                      color: '#17271f',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    View/Search Audit Log
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================================
                VIEW 2: EDIT PROFILE / ACCOUNT INFORMATION (MATCHING SCREENSHOT 1)
            =================================================================== */}
            {guestModalView === 'editProfile' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: '#b3832c', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      PROPERTY MANAGER WORKSPACE
                    </div>
                    <h2 style={{ margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 800, color: '#17271f' }}>
                      {selectedGuest.name} • Account Information
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#55665e' }}>
                      Authorized profile information and integration identifiers.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedGuest(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '14px 0 18px 0' }} />

                {/* Navigation: Back to Guest Profile */}
                <div style={{ marginBottom: '22px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setGuestModalView('profile')}
                  >
                    <ArrowLeft size={15} />
                    <span>Guest Profile</span>
                  </button>
                </div>

                {/* Form matching Screenshot 1 */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveAccountInfo();
                }}>
                  {/* Full name */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      value={editGuestName}
                      onChange={(e) => setEditGuestName(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={editGuestEmail}
                      onChange={(e) => setEditGuestEmail(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Verified phone number */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#17271f' }}>
                        Verified phone number
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !isEditingPhone;
                          setIsEditingPhone(nextState);
                          if (nextState) setNewMobileNumber(editGuestPhone);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1a56db',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {isEditingPhone ? 'Cancel phone change' : 'Edit / Change Verified Phone'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editGuestPhone}
                      onChange={(e) => {
                        setEditGuestPhone(e.target.value);
                        if (!isEditingPhone && e.target.value !== selectedGuest.phone) {
                          setIsEditingPhone(true);
                          setNewMobileNumber(e.target.value);
                        }
                      }}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Conditional Phone 2FA & Audit fields matching Screenshot 2 */}
                  {isEditingPhone && (
                    <div style={{
                      backgroundColor: '#f6f9f7',
                      border: '1.5px solid #cce0d5',
                      borderRadius: '10px',
                      padding: '18px 20px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        backgroundColor: '#ebf4ee',
                        borderLeft: '4px solid #17271f',
                        borderRadius: '6px',
                        padding: '14px 16px',
                        marginBottom: '16px'
                      }}>
                        <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.92rem', marginBottom: '4px' }}>
                          Security sequence
                        </div>
                        <div style={{ color: '#2d4338', fontSize: '0.85rem', lineHeight: 1.45 }}>
                          Verify with 2FA, confirm the new number is not already used, replace the identifier across Evolve, and retain the old number only in the security audit.
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                          Current verified number
                        </label>
                        <input
                          type="text"
                          disabled
                          value={selectedGuest.phone}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '0.9rem', color: '#4b5563', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                          New mobile number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter new number"
                          value={newMobileNumber}
                          onChange={(e) => {
                            setNewMobileNumber(e.target.value);
                            setEditGuestPhone(e.target.value);
                          }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #d1d5db', fontSize: '0.9rem', color: '#17271f', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                          Verification method
                        </label>
                        <select
                          value={phoneVerifyMethod}
                          onChange={(e) => setPhoneVerifyMethod(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #d1d5db', fontSize: '0.9rem', color: '#17271f', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                        >
                          <option value="Code to current phone">Code to current phone</option>
                          <option value="Code to email on file">Code to email on file</option>
                          <option value="Supervisor manual override">Supervisor manual override</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                          Required audit note
                        </label>
                        <textarea
                          placeholder="Reason and verification completed"
                          value={phoneAuditNote}
                          onChange={(e) => setPhoneAuditNote(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #d1d5db', fontSize: '0.9rem', color: '#17271f', minHeight: '75px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Cloudbeds guest reference */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Cloudbeds guest reference
                    </label>
                    <input
                      type="text"
                      value={editCloudbedsRef}
                      onChange={(e) => setEditCloudbedsRef(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Account status */}
                  <div style={{ marginBottom: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#17271f' }}>
                        Account status
                      </label>
                      <span style={{ fontSize: '0.78rem', color: '#55665e' }}>
                        Controls whether this member can sign in and redeem rewards
                      </span>
                    </div>
                    <select
                      value={editAccountStatus}
                      onChange={(e) => setEditAccountStatus(e.target.value as 'Active' | 'Inactive')}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    {editAccountStatus !== (selectedGuest.accountStatus || 'Active') && (
                      <div style={{ marginTop: '12px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                          Required reason
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Explain why access is changing"
                          value={editAccountStatusReason}
                          onChange={(e) => setEditAccountStatusReason(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.88rem', color: '#17271f', boxSizing: 'border-box', resize: 'vertical' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Communication Preferences under profile edit fields on same page (matching Screenshot 3) */}
                  <div style={{
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '20px',
                    marginTop: '16px',
                    marginBottom: '26px'
                  }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#17271f' }}>
                      Communication Preferences
                    </h4>
                    <p style={{ margin: '0 0 16px 0', color: '#55665e', fontSize: '0.88rem' }}>
                      Transactional notices remain available; marketing messages can be unsubscribed.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #f1f5f3' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17271f' }}>Reservation and stay messages</span>
                        <input
                          type="checkbox"
                          checked={commPrefStayMessages}
                          onChange={(e) => setCommPrefStayMessages(e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1a56db' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #f1f5f3' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17271f' }}>Reward confirmations</span>
                        <input
                          type="checkbox"
                          checked={commPrefRewardConfirmations}
                          onChange={(e) => setCommPrefRewardConfirmations(e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1a56db' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #f1f5f3' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17271f' }}>SMS marketing</span>
                        <input
                          type="checkbox"
                          checked={commPrefSmsMarketing}
                          onChange={(e) => setCommPrefSmsMarketing(e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1a56db' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #f1f5f3' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17271f' }}>Email marketing</span>
                        <input
                          type="checkbox"
                          checked={commPrefEmailMarketing}
                          onChange={(e) => setCommPrefEmailMarketing(e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1a56db' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#17271f',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===================================================================
                VIEW 3: CHANGE VERIFIED PHONE (MATCHING SCREENSHOT 2)
            =================================================================== */}
            {guestModalView === 'changePhone' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: '#b3832c', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      PROPERTY MANAGER WORKSPACE
                    </div>
                    <h2 style={{ margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 800, color: '#17271f' }}>
                      {selectedGuest.name} • Change Verified Phone
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#55665e' }}>
                      The phone number remains the member's primary Evolve identifier.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedGuest(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '14px 0 18px 0' }} />

                {/* Navigation: Back to Guest Profile */}
                <div style={{ marginBottom: '22px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setGuestModalView('profile')}
                  >
                    <ArrowLeft size={15} />
                    <span>Guest Profile</span>
                  </button>
                </div>

                {/* Security sequence Banner */}
                <div style={{
                  backgroundColor: '#ebf4ee',
                  borderLeft: '4px solid #17271f',
                  borderRadius: '6px',
                  padding: '16px 20px',
                  marginBottom: '22px'
                }}>
                  <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.95rem', marginBottom: '4px' }}>
                    Security sequence
                  </div>
                  <div style={{ color: '#2d4338', fontSize: '0.88rem', lineHeight: 1.45 }}>
                    Verify with 2FA, confirm the new number is not already used, replace the identifier across Evolve, and retain the old number only in the security audit.
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyAndReplacePhone();
                }}>
                  {/* Current verified number */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Current verified number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedGuest.phone}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '0.92rem', color: '#4b5563', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* New mobile number */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      New mobile number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter new number"
                      value={newMobileNumber}
                      onChange={(e) => setNewMobileNumber(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Verification method */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Verification method
                    </label>
                    <select
                      value={phoneVerifyMethod}
                      onChange={(e) => setPhoneVerifyMethod(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                    >
                      <option value="Code to current phone">Code to current phone</option>
                      <option value="Code to email on file">Code to email on file</option>
                      <option value="Supervisor manual override">Supervisor manual override</option>
                    </select>
                  </div>

                  {/* Required audit note */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Required audit note
                    </label>
                    <textarea
                      required
                      placeholder="Reason and verification completed"
                      value={phoneAuditNote}
                      onChange={(e) => setPhoneAuditNote(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', minHeight: '85px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#17271f',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Verify and Replace Number
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===================================================================
                VIEW 4: REWARD LEDGER & REDEMPTIONS (MATCHING SCREENSHOT)
            =================================================================== */}
            {guestModalView === 'redemptions' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: '#b3832c', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      PROPERTY MANAGER WORKSPACE
                    </div>
                    <h2 style={{ margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 800, color: '#17271f' }}>
                      {selectedGuest.name} • Reward Ledger & Redemptions
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#55665e' }}>
                      Every addition and deduction remains a permanent transaction.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedGuest(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '14px 0 18px 0' }} />

                {/* Navigation: Back to Guest Profile */}
                <div style={{ marginBottom: '22px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setGuestModalView('profile')}
                  >
                    <ArrowLeft size={15} />
                    <span>Guest Profile</span>
                  </button>
                </div>

                {/* Transactions Card matching Screenshot */}
                <div className="admin-security-users-card" style={{ marginBottom: '22px' }}>
                  {/* Row 1: +25 Reward Points */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.05rem', fontWeight: 700, color: '#17271f' }}>
                        +25 Reward Points
                      </h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Cloudbeds EV-4218 • Completed direct stay • Aug 14
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#15803d', fontSize: '0.95rem' }}>
                      +25 pts
                    </div>
                  </div>

                  {/* Row 2: -15 Reward Points */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.05rem', fontWeight: 700, color: '#17271f' }}>
                        -15 Reward Points (Fine Dining)
                      </h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Fine Dining Experience • Square SQ-77104 • Aug 13
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#b45309', fontSize: '0.95rem' }}>
                      -15 pts
                    </div>
                  </div>

                  {/* Row 3: -25 Reward Points */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.05rem', fontWeight: 700, color: '#17271f' }}>
                        -25 Reward Points (Room Night)
                      </h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        1 Complimentary Room Night Redemption • EV-BK-4019 • Jun 11
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#b45309', fontSize: '0.95rem' }}>
                      -25 pts
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons matching Screenshot */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowAuditModal(true)}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: '1px solid #d4ded9',
                      backgroundColor: '#ffffff',
                      color: '#17271f',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    View/Search Guest Audit
                  </button>

                  <button
                    type="button"
                    onClick={() => setGuestModalView('rewardAdjustment')}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#17271f',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Adjust Reward Points
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================================
                VIEW 5: REWARD ADJUSTMENT
            =================================================================== */}
            {guestModalView === 'rewardAdjustment' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: '#b3832c', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      PROPERTY MANAGER WORKSPACE
                    </div>
                    <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 800, color: '#17271f' }}>
                      {selectedGuest.name} • Reward Points Adjustment
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedGuest(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '14px 0 18px 0' }} />

                {/* Navigation: Back to Guest Profile */}
                <div style={{ marginBottom: '18px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setGuestModalView('profile')}
                  >
                    <ArrowLeft size={15} />
                    <span>Guest Profile</span>
                  </button>
                </div>

                {/* Metric Card: CURRENT AVAILABLE BALANCE */}
                <div style={{
                  backgroundColor: '#f9faf9',
                  border: '1.5px solid #d4ded9',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5b52', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      CURRENT AVAILABLE BALANCE
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {getGuestEarnedPoints(selectedGuest)} Points Earned − {getGuestRedeemedPoints(selectedGuest)} Redeemed
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#17271f', lineHeight: 1.1 }}>
                      {getGuestAvailablePoints(selectedGuest)} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17653e' }}>Points</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                      Available for redemption
                    </div>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleConfirmRewardAdjustment();
                }}>
                  {/* Adjustment Dropdown */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Adjustment
                    </label>
                    <select
                      value={rewardAdjType}
                      onChange={(e) => setRewardAdjType(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                    >
                      <option value="Add Reward Points">Add Reward Points</option>
                      <option value="Deduct Reward Points">Deduct Reward Points</option>
                    </select>
                  </div>

                  {/* Adjustment Amount (Points) */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Adjustment Amount (Points)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={rewardAdjNights}
                      onChange={(e) => setRewardAdjNights(e.target.value)}
                      placeholder="e.g. 5, 10, or 25"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Required Reason for Adjustment (Permanently Audited) */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Required Reason for Adjustment (Permanently Audited)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Service recovery courtesy points / Folio reconciliation"
                      value={rewardAdjReason}
                      onChange={(e) => setRewardAdjReason(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Supporting reference */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                      Supporting reference
                    </label>
                    <input
                      type="text"
                      placeholder="Cloudbeds reservation or case number (e.g. CB-10482)"
                      value={rewardAdjRef}
                      onChange={(e) => setRewardAdjRef(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#17271f',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Confirm and Add to Audit Log
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===================================================================
                VIEW 6: LATEST QUALIFIED STAY (MATCHING SCREENSHOT)
            =================================================================== */}
            {guestModalView === 'latestStay' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: '#b3832c', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      PROPERTY MANAGER WORKSPACE
                    </div>
                    <h2 style={{ margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 800, color: '#17271f' }}>
                      {selectedGuest.name} • Latest Qualified Stay
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#55665e' }}>
                      Completed Cloudbeds stay matched to the member and credited automatically.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedGuest(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '14px 0 18px 0' }} />

                {/* Navigation: Back to Guest Profile */}
                <div style={{ marginBottom: '22px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setGuestModalView('profile')}
                  >
                    <ArrowLeft size={15} />
                    <span>Guest Profile</span>
                  </button>
                </div>

                {/* 3 Metric Cards Grid matching Screenshot */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '18px'
                }}>
                  {/* Card 1: REWARD NIGHTS CREDITED */}
                  <div className="admin-security-metric-tile" style={{ padding: '14px 18px' }}>
                    <span className="admin-security-metric-eyebrow">REWARD NIGHTS CREDITED</span>
                    <h3 className="admin-security-metric-val">+2</h3>
                  </div>

                  {/* Card 2: RESERVATION */}
                  <div className="admin-security-metric-tile" style={{ padding: '14px 18px' }}>
                    <span className="admin-security-metric-eyebrow">RESERVATION</span>
                    <h3 className="admin-security-metric-val">EV-4218</h3>
                  </div>

                  {/* Card 3: STATUS */}
                  <div className="admin-security-metric-tile" style={{ padding: '14px 18px' }}>
                    <span className="admin-security-metric-eyebrow">STATUS</span>
                    <h3 className="admin-security-metric-val" style={{ color: '#17271f' }}>Credited ✓</h3>
                  </div>
                </div>

                {/* Detailed Record Box matching Screenshot */}
                <div className="admin-security-users-card" style={{ marginBottom: '22px' }}>
                  {/* Row 1: Stay dates */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Stay dates</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Aug 12–14, 2026 • 2 completed nights
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                      Direct booking
                    </div>
                  </div>

                  {/* Row 2: Cloudbeds checkout */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Cloudbeds checkout</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Aug 14, 2026 • 10:18 AM
                      </div>
                      <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                        Completed-stay event received successfully
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                      Confirmed ✓
                    </div>
                  </div>

                  {/* Row 3: Member identity match */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Member identity match</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        {selectedGuest.phone}
                      </div>
                      <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                        Cloudbeds guest {selectedGuest.cloudbedsReference || 'CB-10482'} matched to the verified Evolve phone number
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                      Matched ✓
                    </div>
                  </div>

                  {/* Row 4: Qualification decision */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Qualification decision</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Eligible source: Evolve direct • Reservation completed • No duplicate credit
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                      Qualified
                    </div>
                  </div>

                  {/* Row 5: Reward ledger entry */}
                  <div className="admin-security-user-row">
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Reward ledger entry</h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        +25 Reward Points credited after checkout
                      </div>
                      <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                        Source reference: Cloudbeds EV-4218
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                      Automatic
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons matching Screenshot */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowAuditModal(true)}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#17271f',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    View Audit Entry
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBookingHistoryModal(true)}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: '1px solid #d4ded9',
                      backgroundColor: '#ffffff',
                      color: '#17271f',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    View All Stays
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================================
                VIEW 7: CASES & MISSING STAYS (MATCHING SCREENSHOT)
            =================================================================== */}
            {guestModalView === 'cases' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: '#b3832c', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      PROPERTY MANAGER WORKSPACE
                    </div>
                    <h2 style={{ margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: 800, color: '#17271f' }}>
                      {selectedGuest.name} • Cases & Missing Stays
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#55665e' }}>
                      Guest and staff requests connected to this member.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-btn-dashboard-back"
                      onClick={() => setSelectedGuest(null)}
                    >
                      <ArrowLeft size={15} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #edf1ef', margin: '14px 0 18px 0' }} />

                {/* Navigation: Back to Guest Profile */}
                <div style={{ marginBottom: '22px' }}>
                  <button
                    type="button"
                    className="admin-btn-dashboard-back"
                    onClick={() => setGuestModalView('profile')}
                  >
                    <ArrowLeft size={15} />
                    <span>Guest Profile</span>
                  </button>
                </div>

                {/* Cases Card matching Screenshot */}
                <div className="admin-security-users-card" style={{ marginBottom: '22px' }}>
                  {/* Row 1: CASE-1042 • Missing stay */}
                  <div
                    className="admin-security-user-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const caseItem = guestCasesList.find(c => c.id === 'CASE-1042') || guestCasesList[0];
                      openCaseModal(caseItem);
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.05rem', fontWeight: 700, color: '#17271f' }}>
                        CASE-1042 • Missing stay
                      </h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Cloudbeds EV-4218 verified • Manager credited 2 nights
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.95rem' }}>
                      Completed
                    </div>
                  </div>

                  {/* Row 2: CASE-0981 • Account question */}
                  <div
                    className="admin-security-user-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const caseItem = guestCasesList.find(c => c.id === 'CASE-0981') || guestCasesList[0];
                      openCaseModal(caseItem);
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 3px 0', fontSize: '1.05rem', fontWeight: 700, color: '#17271f' }}>
                        CASE-0981 • Account question
                      </h4>
                      <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                        Created by Front Desk • Resolution emailed to guest
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.95rem' }}>
                      Completed
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button matching Screenshot */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCaseMember(selectedGuest.name);
                      setShowCreateCaseModal(true);
                    }}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#17271f',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    + Create Case
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedCreditedStayModal && selectedGuest && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '540px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="admin-ops-eyebrow">CLOUDBEDS PMS RECORD</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#17271f' }}>
                  Latest Credited Stay • EV-4218
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCreditedStayModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#f6f8f7', borderRadius: '8px', padding: '16px', border: '1px solid #e1e7e4', fontSize: '0.85rem', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>GUEST</span>
                  <strong style={{ color: '#17271f' }}>{selectedGuest.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>PROPERTY</span>
                  <strong style={{ color: '#17271f' }}>Evolve Texarkana</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>STAY DATES</span>
                  <strong style={{ color: '#17271f' }}>Aug 12–14, 2026</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>CREDITED REWARD NIGHTS</span>
                  <strong style={{ color: '#15803d' }}>+2 Nights Qualified</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>FOLIO ID</span>
                  <strong style={{ color: '#17271f' }}>CB-832104</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>CHANNEL</span>
                  <strong style={{ color: '#17271f' }}>Direct Website (Qualifying)</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedCreditedStayModal(false)}
                style={{ padding: '8px 18px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRewardDetailsModal && selectedGuest && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="admin-ops-eyebrow">LOYALTY ACCOUNT SPECIFICATION</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#17271f' }}>
                  Reward Night Ledger • {selectedGuest.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRewardDetailsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#f6f8f7', borderRadius: '8px', padding: '16px', border: '1px solid #e1e7e4', fontSize: '0.85rem', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>AVAILABLE REWARD NIGHTS</span>
                  <strong style={{ fontSize: '1.2rem', color: '#15803d' }}>{selectedGuest.rewardNights ?? 12} Nights</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>QUALIFIED ACCUMULATED NIGHTS</span>
                  <strong style={{ fontSize: '1.2rem', color: '#17271f' }}>{selectedGuest.qualifiedNights ?? 34} Nights</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>MEMBERSHIP STATUS</span>
                  <strong style={{ color: '#17271f' }}>{selectedGuest.tier} Tier (VIP)</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>POINTS BALANCE</span>
                  <strong style={{ color: '#17271f' }}>{(selectedGuest.pointsBalance || 4850).toLocaleString()} pts</strong>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #e1e7e4', paddingTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                Rules: 7 qualifying nights unlock 1 complimentary reward night certificate. Valid across all Evolve properties.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowRewardDetailsModal(false)}
                style={{ padding: '8px 18px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ===================================================================
          MODAL: QUICK ACCESS ACTION
      =================================================================== */}
      {activeQuickAccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="admin-ops-eyebrow">QUICK ACCESS WORKFLOW</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  {activeQuickAccess.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuickAccess(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 18px 0' }}>
              {activeQuickAccess.description}
            </p>

            {/* Content tailored to the specific shortcut tile */}
            {activeQuickAccess.id === 'missing-stays' && (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px', backgroundColor: '#f9fafb', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: '#17271f', fontSize: '0.9rem' }}>Reservation #EV-4218</strong>
                  <span style={{ fontSize: '0.75rem', color: '#b45309', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Pending Review</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4b5563', marginBottom: '10px' }}>
                  Guest: <strong>Emily Anderson</strong> • Stay: Aug 28 – Aug 30 (2 Nights) at Evolve Texarkana.
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      addToast('success', 'Stay Approved', '2 qualifying nights and 1,850 points credited to Emily Anderson.');
                      setActiveQuickAccess(null);
                    }}
                    className="admin-btn-add-property"
                    style={{ margin: 0, padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    Credit 2 Nights
                  </button>
                </div>
              </div>
            )}

            {activeQuickAccess.id === 'gift-cards' && (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px', backgroundColor: '#f9fafb', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: '#17271f', fontSize: '0.9rem' }}>Gift Request #GFT-3821</strong>
                  <span style={{ fontSize: '0.75rem', color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>$70.00 Digital Card</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: '#4b5563', marginBottom: '10px' }}>
                  Recipient: <strong>Robert Martinez</strong> (Origins Member) • Redemption Points: 7,000 pts.
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      addToast('success', 'Gift Dispatched', 'Digital card voucher issued to robert.m@example.com.');
                      setActiveQuickAccess(null);
                    }}
                    className="admin-btn-add-property"
                    style={{ margin: 0, padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    Issue Voucher
                  </button>
                </div>
              </div>
            )}

            {activeQuickAccess.id === 'phone-recovery' && (
              <div style={{ marginBottom: '18px' }}>
                <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                  Member Phone Number Lookup
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="text"
                    defaultValue="+1 (555) 234-5678"
                    className="admin-input"
                    style={{ border: '1.5px solid #d1d5db', color: '#111827', flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToast('info', 'Recovery SMS Sent', 'SMS verification code sent to member terminal.');
                      setActiveQuickAccess(null);
                    }}
                    className="admin-btn-add-property"
                    style={{ margin: 0, whiteSpace: 'nowrap' }}
                  >
                    Send SMS Code
                  </button>
                </div>
              </div>
            )}

            {activeQuickAccess.id === 'api-status' && (
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span>PMS Core Engine (Cloudbeds):</span>
                  <strong style={{ color: '#15803d' }}>ONLINE (99.99%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span>SynXis CRS Distribution:</span>
                  <strong style={{ color: '#15803d' }}>ONLINE (Synced 1m ago)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Evolve Rewards Engine:</span>
                  <strong style={{ color: '#15803d' }}>OPERATIONAL</strong>
                </div>
              </div>
            )}

            {activeQuickAccess.id === 'create-case' && (
              <div style={{ marginBottom: '18px' }}>
                <div className="admin-field-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                    Guest Name / Reservation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Thompson - Suite 304"
                    className="admin-input"
                    style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}
                  />
                </div>
                <div className="admin-field-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                    Category
                  </label>
                  <select
                    className="admin-input"
                    style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}
                  >
                    <option>Room Comfort / HVAC</option>
                    <option>Billing & Incidental Adjustment</option>
                    <option>VIP Special Request</option>
                    <option>Maintenance Request</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      addToast('success', 'Case Created', 'Operations ticket logged and assigned to Front Desk duty manager.');
                      setActiveQuickAccess(null);
                    }}
                    className="admin-btn-add-property"
                    style={{ margin: 0 }}
                  >
                    Create Ticket
                  </button>
                </div>
              </div>
            )}

            {activeQuickAccess.id === 'guest-account-status' && (
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.85rem', color: '#17271f', marginBottom: '10px' }}>
                  <strong>Account Verification System:</strong> All 127 member accounts are in good standing. 0 accounts currently flagged for suspension.
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      addToast('info', 'Audit Complete', 'All guest account credentials verified.');
                      setActiveQuickAccess(null);
                    }}
                    className="admin-btn-add-property"
                    style={{ margin: 0, padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    Run Identity Verification
                  </button>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setActiveQuickAccess(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#374151',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: BOOKING DETAILS (MATCHING REFERENCE SCREENSHOT)
      =================================================================== */}
      {selectedBookingDetails && (
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
            width: '100%',
            maxWidth: '820px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '28px 32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">{isFrontDesk ? 'FRONT DESK WORKSPACE • VIEW ONLY' : 'PROPERTY MANAGER WORKSPACE'}</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#17271f', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span>{selectedBookingDetails.confirmationCode} • {selectedBookingDetails.guestName?.replace(/\s*\(\+.*?\)/g, '') || 'Guest User'}</span>
                  {isFrontDesk && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', border: '1px solid #cbd5e1', letterSpacing: '0.03em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                      View Only Mode
                    </span>
                  )}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Complete reservation record received from Cloudbeds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingDetails(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* Back to Active Bookings button matching screenshot */}
            <div style={{ marginBottom: '18px' }}>
              <button
                type="button"
                className="admin-btn-dashboard-back"
                onClick={() => setSelectedBookingDetails(null)}
              >
                <ArrowLeft size={15} />
                <span>Active Bookings</span>
              </button>
            </div>

            {/* 3 Top Metric Cards in a row matching screenshot */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '14px',
              marginBottom: '20px'
            }}>
              {/* Card 1: RESERVATION STATUS */}
              <div className="admin-security-metric-tile">
                <span className="admin-security-metric-eyebrow">RESERVATION STATUS</span>
                <h3 className="admin-security-metric-val">{selectedBookingDetails.status}</h3>
                <p className="admin-security-metric-subtext">Read-only from Cloudbeds</p>
              </div>

              {/* Card 2: ASSIGNED SUITE / SUITES */}
              <div className="admin-security-metric-tile">
                <span className="admin-security-metric-eyebrow">
                  {(selectedBookingDetails.suitesCount || 1) > 1 || selectedBookingDetails.suiteNumber?.includes(',') ? 'ASSIGNED SUITES' : 'ASSIGNED SUITE'}
                </span>
                <h3 className="admin-security-metric-val">
                  {selectedBookingDetails.suiteNumber?.includes(',') 
                    ? `Suite ${selectedBookingDetails.suiteNumber}` 
                    : (selectedBookingDetails.suiteNumber?.startsWith('Suite') 
                        ? selectedBookingDetails.suiteNumber 
                        : `Suite ${selectedBookingDetails.suiteNumber || '214'}`)}
                </h3>
                <p className="admin-security-metric-subtext">
                  {(selectedBookingDetails.suitesCount || 1) > 1 || selectedBookingDetails.suiteNumber?.includes(',')
                    ? `${selectedBookingDetails.suitesCount || selectedBookingDetails.suiteNumber?.split(',').length} suites assigned`
                    : 'Read-only from Cloudbeds'}
                </p>
              </div>

              {/* Card 3: CLOUDBEDS ID */}
              <div className="admin-security-metric-tile">
                <span className="admin-security-metric-eyebrow">CLOUDBEDS ID</span>
                <h3 className="admin-security-metric-val">{selectedBookingDetails.pmsId || 'CBR-772941'}</h3>
              </div>
            </div>

            {/* Main Reservation Record Box matching screenshot rows */}
            <div className="admin-security-users-card" style={{ marginBottom: '20px' }}>
              {/* Row 1: Guest */}
              <div className="admin-security-user-row">
                <div>
                  <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Guest</h4>
                  <div style={{ color: '#55665e', fontSize: '0.85rem' }}>{selectedBookingDetails.guestName?.replace(/\s*\(\+.*?\)/g, '') || 'Guest User'}</div>
                  <div style={{ color: '#6a7c73', fontSize: '0.82rem' }}>
                    {selectedBookingDetails.phone} • {selectedBookingDetails.email}
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                  {selectedBookingDetails.adultsCount || 2} adults
                </div>
              </div>

              {/* Row 2: Property and stay */}
              <div className="admin-security-user-row">
                <div>
                  <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Property and stay</h4>
                  <div style={{ color: '#55665e', fontSize: '0.85rem' }}>{selectedBookingDetails.property}</div>
                  <div style={{ color: '#6a7c73', fontSize: '0.82rem' }}>{selectedBookingDetails.dateRange}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: '#17271f', fontSize: '0.92rem' }}>
                    {selectedBookingDetails.roomType} • {selectedBookingDetails.suitesCount || 1} {(selectedBookingDetails.suitesCount || 1) > 1 ? 'suites' : 'suite'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#17271f', marginTop: '3px', fontWeight: 600 }}>
                    Assigned: {selectedBookingDetails.suiteNumber?.includes(',')
                      ? `Suite ${selectedBookingDetails.suiteNumber}`
                      : (selectedBookingDetails.suiteNumber?.startsWith('Suite')
                          ? selectedBookingDetails.suiteNumber
                          : `Suite ${selectedBookingDetails.suiteNumber || '214'}`)}
                  </div>
                </div>
              </div>

              {/* Row 3: Breakfast order or Guest User No-Breakfast Policy */}
              {selectedBookingDetails.isGuestUser ? (
                <div className="admin-security-user-row" style={{ backgroundColor: '#fff7ed', borderRadius: '8px', padding: '14px 18px', border: '1px solid #fed7aa' }}>
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.02rem', fontWeight: 700, color: '#9a3412', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🚫 No Breakfast Access</span>
                      <span style={{ fontSize: '0.72rem', backgroundColor: '#ea580c', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        Policy Enforced
                      </span>
                    </h4>
                    <div style={{ color: '#c2410c', fontSize: '0.85rem' }}>
                      Direct Website Booking • Room-Only Stay (Ineligible for Complimentary Breakfast Buffet).
                    </div>
                    {selectedBookingDetails.notes && (
                      <div style={{ color: '#7c2d12', fontSize: '0.82rem', marginTop: '4px', fontWeight: 500 }}>
                        Notes: {selectedBookingDetails.notes}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="admin-btn-security-action"
                      style={{ backgroundColor: '#17271f', color: '#ffffff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => openGuestUserModalFromBooking(selectedBookingDetails)}
                    >
                      <FileText size={14} />
                      <span>Guest Details & Notes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-security-user-row">
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>
                      Breakfast order {selectedBookingDetails.breakfastOrder?.orderNumber || 'K-2322'}
                    </h4>
                    <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                      Assigned {selectedBookingDetails.suiteNumber?.includes(',') ? 'Suites' : 'Suite'} {selectedBookingDetails.suiteNumber || '214'} • {selectedBookingDetails.breakfastOrder?.pickupTime || '8:15 AM pickup'} • {selectedBookingDetails.breakfastOrder?.platesCount || 2} plates
                    </div>
                    <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                      Connected to reservation {selectedBookingDetails.confirmationCode}; Kitchen status changes update this record.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 600, color: '#17271f', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {selectedBookingDetails.breakfastOrder?.status || 'Not Started'}
                    </span>

                    <button
                      type="button"
                      className="admin-btn-security-action"
                      onClick={() => setSelectedBreakfastOrder({
                        orderNumber: selectedBookingDetails.breakfastOrder?.orderNumber || 'K-2322',
                        suiteNumber: selectedBookingDetails.suiteNumber || '214',
                        guestName: selectedBookingDetails.guestName,
                        pickupTime: selectedBookingDetails.breakfastOrder?.pickupTime || '8:15 AM pickup',
                        platesCount: selectedBookingDetails.breakfastOrder?.platesCount || 2,
                        status: selectedBookingDetails.breakfastOrder?.status || 'Not Started',
                        confirmationCode: selectedBookingDetails.confirmationCode
                      })}
                    >
                      View Breakfast Order
                    </button>
                  </div>
                </div>
              )}

              {/* Row 4: Cloudbeds synchronization */}
              <div className="admin-security-user-row">
                <div>
                  <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Cloudbeds synchronization</h4>
                  <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                    Reservation status and assigned suite update automatically after Cloudbeds changes.
                  </div>
                  <div style={{ color: '#6a7c73', fontSize: '0.82rem', marginTop: '2px' }}>
                    Last Cloudbeds update: {selectedBookingDetails.lastCloudbedsSync || '2 minutes ago'}
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: '#15803d', fontSize: '0.92rem' }}>
                  Synced
                </div>
              </div>

              {/* Row 5: Booking source */}
              <div className="admin-security-user-row">
                <div>
                  <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Booking source</h4>
                  <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                    {selectedBookingDetails.bookingSource || 'Direct website'}
                  </div>
                </div>
                <div style={{ fontWeight: 500, color: '#64748b', fontSize: '0.9rem' }}>
                  View only
                </div>
              </div>

              {/* Row 6: Folio Total & Financials (Retained existing field) */}
              <div className="admin-security-user-row">
                <div>
                  <h4 style={{ margin: '0 0 3px 0', fontSize: '1.02rem', fontWeight: 700, color: '#17271f' }}>Folio Total & Billing</h4>
                  <div style={{ color: '#55665e', fontSize: '0.85rem' }}>
                    Cloudbeds PMS Gateway synchronized invoice balance
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#15803d', fontSize: '1.05rem' }}>
                  {selectedBookingDetails.totalAmount || '$420.00'}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              {!isFrontDesk ? (
                <button
                  type="button"
                  onClick={() => {
                    addToast('info', 'Confirmation Resent', `Booking confirmation email dispatched to ${selectedBookingDetails.email}.`);
                  }}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    background: '#f3f4f6',
                    color: '#1f2937',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Resend Confirmation Email
                </button>
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#475569" />
                  <span>Front Desk Officer Clearance: <strong>View Only</strong></span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                {!isFrontDesk && selectedBookingDetails.status === 'Arriving' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveBookingsList(activeBookingsList.map(b =>
                        b.id === selectedBookingDetails.id ? { ...b, status: 'In House', pmsStatusText: 'Cloudbeds In House' } : b
                      ));
                      addToast('success', 'Guest Checked In', `${selectedBookingDetails.guestName} is now In House.`);
                      setSelectedBookingDetails({
                        ...selectedBookingDetails,
                        status: 'In House',
                        pmsStatusText: 'Cloudbeds In House'
                      });
                    }}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#17271f',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Check In Guest
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedBookingDetails(null)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    background: '#ffffff',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: VIEW BREAKFAST ORDER
      =================================================================== */}
      {selectedBreakfastOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">KITCHEN TICKET</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Breakfast Order {selectedBreakfastOrder.orderNumber}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Reservation {selectedBreakfastOrder.confirmationCode} • Suite {selectedBreakfastOrder.suiteNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBreakfastOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              backgroundColor: '#f6f8f7',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #e1e7e4',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>GUEST</span>
                  <strong style={{ color: '#17271f' }}>{selectedBreakfastOrder.guestName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>SCHEDULED TIME</span>
                  <strong style={{ color: '#17271f' }}>{selectedBreakfastOrder.pickupTime}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>QUANTITY</span>
                  <strong style={{ color: '#17271f' }}>{selectedBreakfastOrder.platesCount} Plates</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>KITCHEN STATUS</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: selectedBreakfastOrder.status === 'Delivered' ? '#dcfce7' : selectedBreakfastOrder.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                    color: selectedBreakfastOrder.status === 'Delivered' ? '#15803d' : selectedBreakfastOrder.status === 'Cancelled' ? '#b91c1c' : '#92400e'
                  }}>
                    {selectedBreakfastOrder.status}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e1e7e4', fontSize: '0.82rem', color: '#334155' }}>
                <strong>Menu:</strong> Artisanal pastries, organic fruit medley, Greek yogurt parfait, fresh orange juice & house blend roast coffee.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {!isFrontDesk && (
                <button
                  type="button"
                  onClick={() => {
                    const confCode = selectedBreakfastOrder.confirmationCode;
                    const orderNum = selectedBreakfastOrder.orderNumber;

                    setActiveBookingsList(prev => prev.map(b => {
                      if (b.confirmationCode === confCode || (selectedBookingDetails && b.id === selectedBookingDetails.id)) {
                        return {
                          ...b,
                          breakfastOrder: b.breakfastOrder ? { ...b.breakfastOrder, status: 'Cancelled' } : undefined
                        };
                      }
                      return b;
                    }));

                    if (selectedBookingDetails) {
                      setSelectedBookingDetails(prev => prev ? {
                        ...prev,
                        breakfastOrder: prev.breakfastOrder ? { ...prev.breakfastOrder, status: 'Cancelled' } : undefined
                      } : null);
                    }

                    addToast('info', 'Breakfast Cancelled', `Breakfast order ${orderNum} has been cancelled.`);
                    setSelectedBreakfastOrder(null);
                  }}
                  disabled={selectedBreakfastOrder.status === 'Cancelled'}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '7px',
                    border: '1px solid #f87171',
                    backgroundColor: selectedBreakfastOrder.status === 'Cancelled' ? '#f3f4f6' : '#fef2f2',
                    color: selectedBreakfastOrder.status === 'Cancelled' ? '#9ca3af' : '#b91c1c',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: selectedBreakfastOrder.status === 'Cancelled' ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBreakfastOrder.status !== 'Cancelled') {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBreakfastOrder.status !== 'Cancelled') {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                    }
                  }}
                >
                  {selectedBreakfastOrder.status === 'Cancelled' ? 'Breakfast Cancelled' : 'Cancel Breakfast'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedBreakfastOrder(null)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '7px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ===================================================================
          MODAL: RESTAURANT CHECK-IN & GUEST USER PROFILE CAPTURE
      =================================================================== */}
      {selectedGuestUserForModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 22px',
              backgroundColor: '#17271f',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={18} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#ffffff' }}>
                    Edit Notes
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: '#93c5aa', marginTop: '2px' }}>
                    {selectedGuestUserForModal.name ? `${selectedGuestUserForModal.name.replace(/\s*\(\+.*?\)/g, '')} • ` : ''}Suite {selectedGuestUserForModal.suiteNumber} • Ref: {selectedGuestUserForModal.bookingRef}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuestUserForModal(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#93c5aa',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  padding: '4px',
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Notes Editor Only */}
            <div style={{ padding: '20px 22px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>
                Guest Notes
              </label>
              <textarea
                rows={5}
                value={modalGuestNotes}
                onChange={(e) => setModalGuestNotes(e.target.value)}
                placeholder="Enter notes for this guest booking (e.g. room preferences, special requests, arrival details)..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  color: '#1e293b',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  lineHeight: 1.5,
                  fontFamily: 'inherit'
                }}
                autoFocus
              />
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 22px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                type="button"
                onClick={() => setSelectedGuestUserForModal(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGuestUserDetails}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#17271f',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Check size={14} />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ===================================================================
          MODAL: BOOKING HISTORY
      =================================================================== */}
      {showBookingHistoryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '640px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">PROPERTY RESERVATION ARCHIVE</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Booking History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingHistoryModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#55665e', margin: '0 0 16px 0' }}>
              Completed, departed, and archived reservations synchronized from Cloudbeds.
            </p>

            <div style={{ maxHeight: '340px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              {mockBookingHistory.map(item => (
                <div key={item.id} style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.92rem' }}>
                      {item.confirmationCode} • {item.guestName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#55665e', marginTop: '2px' }}>
                      {item.property} • {item.dateRange} • {item.roomType}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.88rem' }}>{item.totalAmount}</div>
                    <span style={{ fontSize: '0.75rem', color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setShowBookingHistoryModal(false)}
                className="admin-btn-add-property"
                style={{ margin: 0 }}
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: GUEST QUICK ACTION WORKFLOWS
      =================================================================== */}
      {guestQuickAction && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="admin-ops-eyebrow">GUEST OPERATIONS WORKFLOW</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  {guestQuickAction === 'create-case' && 'Create Guest Case'}
                  {guestQuickAction === 'phone-recovery' && 'Guest Phone Recovery Queue'}
                  {guestQuickAction === 'account-status' && 'Guest Account Status'}
                  {guestQuickAction === 'latest-stay' && 'Latest Qualified Stays'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuestQuickAction(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {guestQuickAction === 'create-case' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '16px' }}>
                  Open an operational inquiry, service request, or missing stay credit for a registered member.
                </p>
                <div className="admin-field-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                    Select Member
                  </label>
                  <select className="admin-input" style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}>
                    <option>Emily Anderson ((555) 123-4567 • Prestige)</option>
                    <option>Robert Martinez ((555) 234-5678 • Origins)</option>
                    <option>Sarah Thompson ((555) 345-6789 • Prestige)</option>
                  </select>
                </div>
                <div className="admin-field-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                    Case Type
                  </label>
                  <select className="admin-input" style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}>
                    <option>Missing Stay Credit Request</option>
                    <option>Reward Points Folio Adjustment</option>
                    <option>VIP Special Concierge Request</option>
                    <option>Profile Data Correction</option>
                  </select>
                </div>
                <div className="admin-field-group" style={{ marginBottom: '18px' }}>
                  <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                    Case Summary / Notes
                  </label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    placeholder="Provide details for duty manager review..."
                    style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setGuestQuickAction(null)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToast('success', 'Case Logged', 'Operations ticket logged into queue with permanent audit tracking.');
                      setGuestQuickAction(null);
                    }}
                    className="admin-btn-add-property"
                    style={{ margin: 0 }}
                  >
                    Create Case
                  </button>
                </div>
              </div>
            )}

            {guestQuickAction === 'phone-recovery' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '16px' }}>
                  Pending identity recovery exceptions verified via member's primary work/personal email.
                </p>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px', backgroundColor: '#f9fafb', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ color: '#17271f', fontSize: '0.9rem' }}>Emily Anderson</strong>
                    <span style={{ fontSize: '0.75rem', color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Email Verified</span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#4b5563', marginBottom: '10px' }}>
                    Requested update: Link verified number <strong>(555) 123-4567</strong> to member identity. Authenticated via emily@example.com.
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => {
                        addToast('success', 'Recovery Approved', 'Phone number linked and account unlocked for Emily Anderson.');
                        setGuestQuickAction(null);
                      }}
                      className="admin-btn-add-property"
                      style={{ margin: 0, padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      Authorize Phone Link
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setGuestQuickAction(null)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Close Queue
                  </button>
                </div>
              </div>
            )}

            {guestQuickAction === 'account-status' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '16px' }}>
                  Activate or disable a member account. Manager adjustments require a documented reason and are recorded in the audit trail.
                </p>
                <div className="admin-field-group" style={{ marginBottom: '12px' }}>
                  <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                    Select Member
                  </label>
                  <select className="admin-input" style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}>
                    <option>Emily Anderson (Status: Active • Prestige)</option>
                    <option>Robert Martinez (Status: Active • Origins)</option>
                    <option>Sarah Thompson (Status: Active • Prestige)</option>
                  </select>
                </div>
                <div className="admin-field-group" style={{ marginBottom: '18px' }}>
                  <label className="admin-field-label" style={{ color: '#17271f', fontWeight: 700, fontSize: '0.85rem' }}>
                    Mandatory Audit Reason
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Enter business reason for account status update"
                    style={{ border: '1.5px solid #d1d5db', color: '#111827', width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setGuestQuickAction(null)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToast('info', 'Status Confirmed', 'Account status confirmed in good standing.');
                      setGuestQuickAction(null);
                    }}
                    className="admin-btn-add-property"
                    style={{ margin: 0 }}
                  >
                    Confirm Status
                  </button>
                </div>
              </div>
            )}

            {guestQuickAction === 'latest-stay' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '16px' }}>
                  Most recent verified stays synchronized from Cloudbeds that earned qualifying Reward Points.
                </p>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px', backgroundColor: '#f9fafb', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: '#17271f' }}>Emily Anderson • Cloudbeds EV-4218</strong>
                    <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.85rem' }}>+25 pts</span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#55665e' }}>
                    Evolve Texarkana • Aug 12–Aug 14, 2026 • Suite 204 • Direct Booking Completed
                  </div>
                </div>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px', backgroundColor: '#f9fafb', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: '#17271f' }}>Robert Martinez • Cloudbeds EV-4166</strong>
                    <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.85rem' }}>+1 night</span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#55665e' }}>
                    Evolve Texarkana • Aug 10–Aug 12, 2026 • Suite 108 • Direct Booking Completed
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setGuestQuickAction(null)}
                    className="admin-btn-add-property"
                    style={{ margin: 0 }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* ===================================================================
          MODAL: CREDIT COMPLETED STAY (CLOUDBEDS NIGHTS -> POINTS)
      =================================================================== */}
      {showRewardAdjModal && selectedRewardsMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '540px',
            padding: '28px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.22)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <div style={{ color: '#b3832c', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  PROPERTY MANAGER WORKSPACE
                </div>
                <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 800, color: '#17271f' }}>
                  {selectedRewardsMember.name} • Reward Points Adjustment
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowRewardAdjModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* Metric Card: CURRENT AVAILABLE BALANCE */}
            <div style={{
              backgroundColor: '#f9faf9',
              border: '1.5px solid #d4ded9',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5b52', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  CURRENT AVAILABLE BALANCE
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {getGuestEarnedPoints(selectedRewardsMember)} Points Earned − {getGuestRedeemedPoints(selectedRewardsMember)} Redeemed
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#17271f', lineHeight: 1.1 }}>
                  {getGuestAvailablePoints(selectedRewardsMember)} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17653e' }}>Points</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                  Available for redemption
                </div>
              </div>
            </div>

            <form onSubmit={handleRewardPointsAdjustment}>
              {/* Adjustment Dropdown */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                  Adjustment
                </label>
                <select
                  value={rewardAdjAction}
                  onChange={(e) => setRewardAdjAction(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Add Reward Points">Add Reward Points</option>
                  <option value="Deduct Reward Points">Deduct Reward Points</option>
                </select>
              </div>

              {/* Adjustment Amount (Points) */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                  Adjustment Amount (Points)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={rewardAdjNightsInput}
                  onChange={(e) => setRewardAdjNightsInput(e.target.value)}
                  placeholder="e.g. 5, 10, or 25"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                />
              </div>

              {/* Required Reason for Adjustment (Permanently Audited) */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                  Required Reason for Adjustment (Permanently Audited)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Service recovery courtesy points / Folio reconciliation"
                  value={rewardAdjReasonInput}
                  onChange={(e) => setRewardAdjReasonInput(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                />
              </div>

              {/* Supporting reference */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#17271f', marginBottom: '6px' }}>
                  Supporting reference
                </label>
                <input
                  type="text"
                  placeholder="Cloudbeds reservation or case number (e.g. CB-10482)"
                  value={rewardAdjRefInput}
                  onChange={(e) => setRewardAdjRefInput(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', color: '#17271f', boxSizing: 'border-box' }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowRewardAdjModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Confirm and Add to Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ===================================================================
          MODAL: QUICK ADD / EDIT NOTE FOR GIFT REQUEST
      =================================================================== */}
      {editingNoteReq && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 20, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '460px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="admin-ops-eyebrow">CUSTOMER REDEMPTION NOTE</span>
                <h3 style={{ margin: '2px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#17271f' }}>
                  {editingNoteReq.guestName}
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {editingNoteReq.requestCode} • Phone: {editingNoteReq.phone || '(555) 234-5678'} • {editingNoteReq.amount.replace(/Digital Gift Card/i, '').trim()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingNoteReq(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Note Details & Instructions
              </label>
              <textarea
                rows={5}
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Type note details here (e.g. member request for Amazon voucher, confirmation status, delivery notes)..."
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  padding: '10px 12px',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setEditingNoteReq(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGiftNote}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#173f34',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: SHARED GUEST CASE TIMELINE & UPDATE
      =================================================================== */}
      {/* ===================================================================
          MODAL: SHARED GUEST CASE TIMELINE & UPDATE (FULL EDIT & RESOLUTION CLEARANCE)
      =================================================================== */}
      {selectedCaseForModal && (() => {
        return (
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
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
            }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className="admin-ops-eyebrow">
                    SHARED CASE RECORD • {selectedCaseForModal.property}
                  </span>
                  <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span>{selectedCaseForModal.caseNumber} • {selectedCaseForModal.title}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#15803d', padding: '3px 10px', borderRadius: '12px', border: '1px solid #bbf7d0', letterSpacing: '0.03em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                      Collaborative Case Edit
                    </span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCaseForModal(null); setCaseReplyNote(''); }}
                  style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
                >
                  ✕
                </button>
              </div>

              {/* Case Key Metadata Bar (Editable Priority, Assigned Role, and Status) */}
              <div style={{
                backgroundColor: '#f6f8f7',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #e1e7e4'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>GUEST MEMBER</span>
                    <strong style={{ color: '#17271f', fontSize: '0.90rem' }}>{selectedCaseForModal.guestName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>PRIORITY</span>
                    <select
                      value={editCasePriority}
                      onChange={(e) => setEditCasePriority(e.target.value as any)}
                      title="Update Priority"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: editCasePriority === 'Urgent' ? '#fee2e2' : editCasePriority === 'High' ? '#fef3c7' : '#e0f2fe',
                        color: editCasePriority === 'Urgent' ? '#991b1b' : editCasePriority === 'High' ? '#92400e' : '#0369a1',
                        fontSize: '0.80rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        outline: 'none',
                        width: '100%'
                      }}
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>ASSIGNED ROLE</span>
                    <select
                      value={editCaseAssignedRole}
                      onChange={(e) => setEditCaseAssignedRole(e.target.value)}
                      title="Reassign Case"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#17271f',
                        fontSize: '0.80rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        outline: 'none',
                        width: '100%'
                      }}
                    >
                      <option value="Front Desk">Front Desk</option>
                      <option value="Property Manager">Property Manager</option>
                      <option value="General Manager">General Manager</option>
                    </select>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>STATUS</span>
                    <select
                      value={editCaseStatus}
                      onChange={(e) => setEditCaseStatus(e.target.value as any)}
                      title="Update Status"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: editCaseStatus === 'Resolved' || editCaseStatus === 'Closed' ? '#dcfce7' : editCaseStatus === 'In Progress' ? '#fef9c3' : '#e0f2fe',
                        color: editCaseStatus === 'Resolved' || editCaseStatus === 'Closed' ? '#15803d' : editCaseStatus === 'In Progress' ? '#854d0e' : '#0369a1',
                        fontSize: '0.80rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        outline: 'none',
                        width: '100%'
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">✓ Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e1e7e4', fontSize: '0.88rem', color: '#334155' }}>
                  <strong>Issue Details:</strong> {selectedCaseForModal.description}
                </div>
              </div>

              {/* Shared Timeline Section */}
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#17271f', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Shared Audit Timeline ({selectedCaseForModal.timelineUpdates?.length || 0} Entries)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedCaseForModal.timelineUpdates && selectedCaseForModal.timelineUpdates.length > 0 ? (
                    selectedCaseForModal.timelineUpdates.map((t, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid #17271f'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 700, color: '#17271f' }}>
                            {t.author} <span style={{ fontWeight: 500, color: '#64748b' }}>({t.role})</span>
                          </span>
                          <span style={{ color: '#94a3b8' }}>{t.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.4 }}>
                          {t.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>No timeline entries yet.</p>
                  )}
                </div>
              </div>

              {/* Post Note / Update Section */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#17271f' }}>
                    {isFrontDesk ? 'Front Desk Review Inputs & Resolution Remarks' : 'Case Investigation Updates & Remarks'}
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                    Authorized to Edit & Resolve
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={isFrontDesk
                    ? "Log Front Desk review input, room/stay verification, Cloudbeds confirmation, or resolution steps..."
                    : "Log findings, Cloudbeds verification notes, stay adjustment details, or resolution remarks..."}
                  value={caseReplyNote}
                  onChange={(e) => setCaseReplyNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    marginBottom: '14px',
                    outline: 'none'
                  }}
                />

                {/* Action Buttons Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {editCaseStatus !== 'In Progress' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditCaseStatus('In Progress');
                          handleAddCaseNote('In Progress');
                        }}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '6px',
                          border: '1px solid #d97706',
                          backgroundColor: '#fffbeb',
                          color: '#b45309',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Mark In Progress
                      </button>
                    )}
                    {editCaseStatus !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditCaseStatus('Resolved');
                          handleAddCaseNote('Resolved');
                        }}
                        style={{
                          padding: '8px 15px',
                          borderRadius: '6px',
                          border: '1px solid #16a34a',
                          backgroundColor: '#f0fdf4',
                          color: '#15803d',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>✓ Mark Resolved</span>
                      </button>
                    )}
                    {(editCaseStatus === 'Resolved' || editCaseStatus === 'Closed') && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditCaseStatus('Open');
                          handleAddCaseNote('Open');
                        }}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '6px',
                          border: '1px solid #0284c7',
                          backgroundColor: '#f0fdf4',
                          color: '#0369a1',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Reopen Case
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => { setSelectedCaseForModal(null); setCaseReplyNote(''); }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        color: '#4b5563',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCaseNote()}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#17271f',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Save & Update Case
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    {/* ===================================================================
        MODAL: CREATE GUEST CASE
    =================================================================== */}
    {showCreateCaseModal && (
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
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">NEW ESCALATION</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Create Guest Case
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateCaseModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Guest Member Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCaseMember}
                    onChange={(e) => setNewCaseMember(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Property
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Evolve Texarkana"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #e5e7eb',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Case Type / Subject
                  </label>
                  <select
                    value={newCaseType}
                    onChange={(e) => setNewCaseType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Missing Stay">Missing Stay</option>
                    <option value="Points Dispute">Points Dispute</option>
                    <option value="Reward Night Redemption">Reward Night Redemption</option>
                    <option value="Billing & Rate Dispute">Billing & Rate Dispute</option>
                    <option value="Tier Status Discrepancy">Tier Status Discrepancy</option>
                    <option value="Special Accommodations">Special Accommodations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Priority Level
                  </label>
                  <select
                    value={newCasePriority}
                    onChange={(e) => setNewCasePriority(e.target.value as 'Normal' | 'High' | 'Urgent')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Assigned To Dropdown (Property Manager / Front Desk) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Assigned To
                  </label>
                  <select
                    value={newCaseAssignedRole}
                    onChange={(e) => setNewCaseAssignedRole(e.target.value as 'Property Manager' | 'Front Desk')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Property Manager">Property Manager</option>
                    <option value="Front Desk">Front Desk</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                  Investigation Details / Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="E.g. Cloudbeds stay requires verification for check-in on Sep 14..."
                  value={newCaseDesc}
                  onChange={(e) => setNewCaseDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateCaseModal(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '7px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Create & Log in Shared Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: MEMBERSHIP REPORT
      =================================================================== */}
      {showMembershipReportModal && (
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
            width: '100%',
            maxWidth: '860px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">PROPERTY MANAGER WORKSPACE • EVOLVE TEXARKANA</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Membership Report
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Property-scoped member directory, tier distributions, qualified nights, and available loyalty balances.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMembershipReportModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* Quick KPI Summary Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>TOTAL PROPERTY MEMBERS</span>
                <strong style={{ fontSize: '1.25rem', color: '#17271f' }}>{guestsList.length} Members</strong>
              </div>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>TIER BREAKDOWN</span>
                <strong style={{ fontSize: '0.95rem', color: '#17271f' }}>Prestige (2) • Origins (1) • Elite (1)</strong>
              </div>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>TOTAL QUALIFIED NIGHTS</span>
                <strong style={{ fontSize: '1.25rem', color: '#17271f' }}>42 Nights</strong>
              </div>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>AVAILABLE POINTS</span>
                <strong style={{ fontSize: '1.25rem', color: '#17271f' }}>11,350 pts</strong>
              </div>
            </div>

            {/* Search Input Bar */}
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Search member by name, phone, or tier..."
                value={membershipReportSearch}
                onChange={(e) => setMembershipReportSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #d1d5db',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Membership Table */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '10px 14px' }}>Guest Member</th>
                    <th style={{ padding: '10px 14px' }}>Tier Level</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px' }}>Qualified Nights</th>
                    <th style={{ padding: '10px 14px' }}>Reward Points</th>
                    <th style={{ padding: '10px 14px' }}>Points Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {guestsList
                    .filter(g =>
                      g.name.toLowerCase().includes(membershipReportSearch.toLowerCase()) ||
                      g.tier.toLowerCase().includes(membershipReportSearch.toLowerCase()) ||
                      g.phone.includes(membershipReportSearch) ||
                      (g.squareId && g.squareId.toLowerCase().includes(membershipReportSearch.toLowerCase()))
                    )
                    .map((g, idx) => (
                      <tr key={g.id} style={{ borderBottom: idx !== guestsList.length - 1 ? '1px solid #edf2f7' : 'none' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: '#17271f', display: 'block' }}>{g.name}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{g.phone}</span>
                            <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#166534', padding: '1px 5px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                              Square: {g.squareId || `sq_cust_${g.customerId?.replace('CUST-', '') || 1000 + idx}`}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            backgroundColor: g.tier === 'Prestige' ? '#fef3c7' : g.tier === 'Origins' ? '#e2e8f0' : '#fce7f3',
                            color: g.tier === 'Prestige' ? '#92400e' : g.tier === 'Origins' ? '#334155' : '#831843'
                          }}>
                            {g.tier}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#15803d', fontWeight: 600 }}>Active</td>
                        <td style={{ padding: '12px 14px', color: '#17271f', fontWeight: 600 }}>{(g.rewardNights || 0) + 3} nights</td>
                        <td style={{ padding: '12px 14px', color: '#17271f', fontWeight: 700 }}>{getGuestAvailablePoints(g)} pts</td>
                        <td style={{ padding: '12px 14px', color: '#17271f', fontWeight: 700 }}>{(g.pointsBalance || 0).toLocaleString()} pts</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Property: Evolve Texarkana • Certified Operational Report
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '7px',
                    border: '1px solid #17271f',
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMembershipReportModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '7px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: REWARDS & REDEMPTIONS REPORT
      =================================================================== */}
      {showRewardsReportModal && (
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
            width: '100%',
            maxWidth: '860px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">PROPERTY MANAGER WORKSPACE • EVOLVE TEXARKANA</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Rewards & Redemptions Report
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Qualified-night credits and free-night, dining and gift-card deductions for this property.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRewardsReportModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* Quick KPI Summary Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>TOTAL TRANSACTIONS</span>
                <strong style={{ fontSize: '1.25rem', color: '#17271f' }}>{mockRewardsReportEntries.length} Records</strong>
              </div>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>NIGHTS CREDITED</span>
                <strong style={{ fontSize: '1.25rem', color: '#15803d' }}>+5 Nights</strong>
              </div>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>REWARD NIGHTS REDEEMED</span>
                <strong style={{ fontSize: '1.25rem', color: '#b45309' }}>16 Nights</strong>
              </div>
              <div style={{ backgroundColor: '#f6f8f7', padding: '14px', borderRadius: '8px', border: '1px solid #e1e7e4' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>GIFT & DINING FULFILLED</span>
                <strong style={{ fontSize: '1.25rem', color: '#17271f' }}>$170 Issued</strong>
              </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {(['all', 'credits', 'redemptions'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setRewardsReportFilter(filterKey)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: rewardsReportFilter === filterKey ? '#17271f' : '#d1d5db',
                    backgroundColor: rewardsReportFilter === filterKey ? '#17271f' : '#ffffff',
                    color: rewardsReportFilter === filterKey ? '#ffffff' : '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  {filterKey === 'all' && 'All Activity'}
                  {filterKey === 'credits' && 'Credits Only'}
                  {filterKey === 'redemptions' && 'Redemptions Only'}
                </button>
              ))}
            </div>

            {/* Ledger Table */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '10px 14px' }}>Date</th>
                    <th style={{ padding: '10px 14px' }}>Member</th>
                    <th style={{ padding: '10px 14px' }}>Type</th>
                    <th style={{ padding: '10px 14px' }}>Transaction Details</th>
                    <th style={{ padding: '10px 14px' }}>Impact</th>
                    <th style={{ padding: '10px 14px' }}>Ref Code</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRewardsReportEntries
                    .filter(r => {
                      if (rewardsReportFilter === 'credits') return r.status === 'Applied';
                      if (rewardsReportFilter === 'redemptions') return r.status === 'Deducted';
                      return true;
                    })
                    .map((entry, idx) => (
                      <tr key={entry.id} style={{ borderBottom: idx !== mockRewardsReportEntries.length - 1 ? '1px solid #edf2f7' : 'none' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b' }}>{entry.date}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: '#17271f' }}>{entry.guestName}</strong>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            backgroundColor: entry.status === 'Applied' ? '#dcfce7' : '#fee2e2',
                            color: entry.status === 'Applied' ? '#15803d' : '#991b1b'
                          }}>
                            {entry.transactionType}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#334155' }}>{entry.amountText}</td>
                        <td style={{
                          padding: '12px 14px',
                          fontWeight: 700,
                          color: entry.status === 'Applied' ? '#15803d' : '#b45309'
                        }}>
                          {entry.balanceImpact}
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#64748b' }}>{entry.refCode}</td>
                        <td style={{ padding: '12px 14px', color: '#15803d', fontWeight: 600 }}>{entry.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Property: Evolve Texarkana • Certified Operational Report
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '7px',
                    border: '1px solid #17271f',
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRewardsReportModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '7px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: AUTOMATED RULE DECISIONS
      =================================================================== */}
      {showRuleDecisionsModal && (
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
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">SYSTEM DECISION LEDGER • EVOLVE TEXARKANA</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Automated Rule Decisions
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Clear eligibility failures rejected by the system without creating an Admin review item.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRuleDecisionsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* Explanatory Notice */}
            <div style={{
              backgroundColor: '#f6f8f7',
              borderLeft: '4px solid #17271f',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '0.84rem',
              color: '#334155'
            }}>
              Automated rules maintain reward integrity by evaluating direct-booking requirements, minimum night thresholds, time limits, and duplicate claims in real time.
            </div>

            {/* Decisions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
              {mockAutomatedRuleDecisions.map((decision) => (
                <div
                  key={decision.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px 18px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}>
                        AUTO-REJECTED
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: '#17271f' }}>
                        {decision.ruleCode} • {decision.category}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{decision.timestamp}</span>
                  </div>

                  <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '6px' }}>
                    <strong>Member / Target:</strong> {decision.guestName} — <em>"{decision.attemptedAction}"</em>
                  </div>

                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '0.84rem',
                    color: '#991b1b',
                    marginBottom: '8px'
                  }}>
                    <strong>Rejection Reason:</strong> {decision.rejectionReason}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    <strong>Policy Reference:</strong> {decision.policyRef}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Evolve Autonomous Policy Enforcement Engine
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '7px',
                    border: '1px solid #17271f',
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} />
                  <span>Print Decisions Log</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRuleDecisionsModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '7px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD FRONT DESK USER
      =================================================================== */}
      {showAddUserModal && (
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
            width: '100%',
            maxWidth: '540px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">PROPERTY ACCESS PROVISIONING</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Add Front Desk User
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFrontDeskUser}>
              {/* Row 1: Employee ID & Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. EMP-${100 + propertyUsersList.length + 1}`}
                    value={newUserEmployeeId}
                    onChange={(e) => setNewUserEmployeeId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Wright"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Business Email & Contact No */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alexander.w@evolve.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Contact No
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 (903) 555-0199"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Designation & Property */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Designation
                  </label>
                  <select
                    value={newUserDesignation === 'Property Manager' ? 'Property Manager' : 'Front Desk'}
                    onChange={(e) => setNewUserDesignation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Front Desk">Front Desk</option>
                    <option value="Property Manager">Property Manager</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                    Property
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Evolve Texarkana"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #e5e7eb',
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  />
                </div>
              </div>

              {/* Row 4: Notes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#17271f', marginBottom: '4px' }}>
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Shift assignment, onboarding notes, system credentials..."
                  value={newUserNotes}
                  onChange={(e) => setNewUserNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                backgroundColor: '#f6f8f7',
                borderLeft: '4px solid #17271f',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                color: '#334155',
                marginBottom: '18px'
              }}>
                <strong>Security Enforcement:</strong> 2FA is <strong>Mandatory</strong>. The officer will be prompted to enroll their mobile device for OTP verification on first login.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '7px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Provision & Send Activation Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: USER SECURITY & ACCESS DETAILS
      =================================================================== */}
      {selectedUserForModal && (
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
            width: '100%',
            maxWidth: '580px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">USER CREDENTIAL & SECURITY AUDIT</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  {selectedUserForModal.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  ID: <strong style={{ color: '#17271f' }}>{selectedUserForModal.employeeId || selectedUserForModal.id}</strong> • {selectedUserForModal.designation || selectedUserForModal.role} • {selectedUserForModal.property}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* User Details Grid */}
            <div style={{
              backgroundColor: '#f6f8f7',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #e1e7e4',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>EMPLOYEE ID</span>
                  <strong style={{ color: '#17271f' }}>{selectedUserForModal.employeeId || selectedUserForModal.id}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>DESIGNATION</span>
                  <strong style={{ color: '#17271f' }}>{selectedUserForModal.designation || selectedUserForModal.role}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>BUSINESS EMAIL</span>
                  <strong style={{ color: '#17271f' }}>{selectedUserForModal.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>CONTACT NO</span>
                  <strong style={{ color: '#17271f' }}>{selectedUserForModal.phone || '+1 (903) 555-0142'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>CURRENT ACCESS</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: selectedUserForModal.status === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: selectedUserForModal.status === 'Active' ? '#15803d' : '#991b1b'
                  }}>
                    {selectedUserForModal.status}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>2FA REQUIREMENT</span>
                  <strong style={{ color: '#17271f' }}>Mandatory • Enforced</strong>
                </div>
              </div>
              {selectedUserForModal.notes && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e1e7e4', fontSize: '0.82rem', color: '#334155' }}>
                  <strong style={{ color: '#17271f' }}>Notes:</strong> {selectedUserForModal.notes}
                </div>
              )}
              <div style={{ marginTop: selectedUserForModal.notes ? '8px' : '12px', paddingTop: selectedUserForModal.notes ? '0' : '10px', borderTop: selectedUserForModal.notes ? 'none' : '1px solid #e1e7e4', fontSize: '0.82rem', color: '#64748b' }}>
                Last activity: {selectedUserForModal.lastActive}
              </div>
            </div>

            {/* Quick Security Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              <button
                type="button"
                onClick={() => handleToggleUserAccess(selectedUserForModal.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedUserForModal.status === 'Active' ? '#fca5a5' : '#86efac',
                  backgroundColor: selectedUserForModal.status === 'Active' ? '#fef2f2' : '#f0fdf4',
                  color: selectedUserForModal.status === 'Active' ? '#b91c1c' : '#15803d',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {selectedUserForModal.status === 'Active'
                  ? '⚠️ Suspend Property Access (Revoke Active Sessions)'
                  : '✓ Re-activate Property Access'}
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast('info', '2FA Reset Dispatched', `New 2FA setup email sent to ${selectedUserForModal.email}.`);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#17271f',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🔑 Reset Two-Factor Authentication (Issue New Verification Secret)
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast('success', 'Password Reset Email Sent', `Password instructions delivered to ${selectedUserForModal.email}.`);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#17271f',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                ✉️ Trigger Password Reset Email
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedUserForModal(null)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '7px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: PROPERTY SECURITY LOG
      =================================================================== */}
      {showPropertySecurityLogModal && (
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
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="admin-ops-eyebrow">SECURITY AUDIT LEDGER • EVOLVE TEXARKANA</span>
                <h3 style={{ margin: '3px 0 0 0', fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#17271f' }}>
                  Property Security Log
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Two-factor verifications, credential rotations, session events, and officer access history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPropertySecurityLogModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* Security Log Table */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '10px 14px' }}>Timestamp</th>
                    <th style={{ padding: '10px 14px' }}>Officer</th>
                    <th style={{ padding: '10px 14px' }}>Event Action</th>
                    <th style={{ padding: '10px 14px' }}>Result</th>
                    <th style={{ padding: '10px 14px' }}>Source / IP</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: 'Today • 6:45 AM', user: 'Mike Johnson (Front Desk)', event: '2FA OTP Verification & Login', result: 'Success', ip: '192.168.1.88' },
                    { time: 'Today • 8:12 AM', user: 'Jane Smith (Property Manager)', event: '2FA OTP Verification & Login', result: 'Success', ip: '192.168.1.42' },
                    { time: 'Yesterday • 11:20 PM', user: 'Priya Shah (Front Desk)', event: 'Shift Checkout & Session Logout', result: 'Success', ip: '192.168.1.95' },
                    { time: 'Yesterday • 3:15 PM', user: 'Mike Johnson (Front Desk)', event: 'Cloudbeds API Token Check', result: 'Authorized', ip: 'Internal PMS' },
                    { time: 'Sep 15 • 10:00 AM', user: 'Jane Smith (Property Manager)', event: 'Access Audit Ledger Inspection', result: 'Authorized', ip: '192.168.1.42' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== 4 ? '1px solid #edf2f7' : 'none' }}>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{row.time}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: '#17271f' }}>{row.user}</strong>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{row.event}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: '#dcfce7',
                          color: '#15803d'
                        }}>
                          {row.result}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#64748b' }}>{row.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Property: Evolve Texarkana • Certified Security Audit Ledger
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '7px',
                    border: '1px solid #17271f',
                    backgroundColor: '#17271f',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} />
                  <span>Print Security Log</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPropertySecurityLogModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '7px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   ROOT EXPORT
========================================================================= */
export const AdminPortal: React.FC = () => {
  return (
    <AdminProvider>
      <AdminPortalContent />
    </AdminProvider>
  );
};

const AdminPortalContent: React.FC = () => {
  const { currentAdmin } = useAdmin();

  if (!currentAdmin) {
    return <AdminLoginFlow />;
  }

  return <PropertyManagerDashboard />;
};

export default AdminPortal;
