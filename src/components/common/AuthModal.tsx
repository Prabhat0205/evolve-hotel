import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Mail, Lock, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services';
import { User } from '../../types';

export const AuthModal: React.FC = () => {
  const { authModal, closeAuthModal, loginUser, loginAsGuest, convertToMember, switchPersona, addToast, navigateTo, activeGuestPhone } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup' | 'otp' | 'recovery' | 'guest_login' | 'convert_to_member'>('signin');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  useEffect(() => {
    if (authModal.isOpen) {
      setTab(authModal.mode || 'signin');
    }
  }, [authModal.isOpen, authModal.mode]);

  // Form fields
  const [email, setEmail] = useState('alexander.wright@luxury.io');
  const [password, setPassword] = useState('••••••••••••');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [convertPassword, setConvertPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCode, setGuestCode] = useState('');
  const [joinRewards, setJoinRewards] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  // Pre-fill phone if coming from guest mode to convert
  useEffect(() => {
    if (tab === 'convert_to_member' && activeGuestPhone) {
      setPhone(activeGuestPhone);
    }
  }, [tab, activeGuestPhone]);

  if (!authModal.isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.signIn(email, password);
      setLoading(false);
      if (res.requires2FA && res.user) {
        setPendingUser(res.user);
        setTab('otp');
        addToast('info', 'Security Code Sent', 'A 6-digit verification code was sent to your registered contact.');
      }
    } catch (err: any) {
      setLoading(false);
      addToast('error', 'Sign In Failed', err.message || 'Check your credentials.');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      addToast('error', 'Incomplete Code', 'Please enter all 6 digits of the verification code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userToLogin = pendingUser || {
        id: `member-${Date.now()}`,
        firstName: firstName || 'Alexander',
        lastName: lastName || 'Wright',
        email: email || 'alexander.wright@luxury.io',
        phone: phone || '+1 (214) 555-0192',
        isEmailVerified: true,
        isPhoneVerified: true,
        isMember: true,
        memberProfile: {
          memberId: `EV-${Math.floor(100000 + Math.random() * 900000)}`,
          tier: 'PRESTIGE',
          unusedRewardNights: 7,
          qualifyingNightsThisYear: 28,
          qualifyingNightsNeededForNextTier: 22,
          lifetimeQualifyingNights: 94,
          memberSinceYear: 2022,
        },
        paymentMethods: [],
        preferences: { quietRoom: true }
      };
      loginUser(userToLogin);
      closeAuthModal();
      navigateTo('stays');
    }, 400);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !signUpPassword) {
      addToast('error', 'Required Fields', 'Please complete all required fields including a password.');
      return;
    }
    if (signUpPassword.length < 6) {
      addToast('error', 'Password Too Short', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const user = await authService.signUp({ firstName, lastName, email, phone }, joinRewards, signUpPassword);
    setLoading(false);
    setPendingUser(user);
    setTab('otp');
    addToast('info', 'Security Code Sent', `A 6-digit verification code was sent to ${phone || email}.`);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Recovery Link Dispatched', `Password reset instructions sent to ${email}.`);
    setTab('signin');
  };

  const handleGuestLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestCode || !phone) {
      addToast('error', 'Required Fields', 'Both Guest Code and Mobile Number are required.');
      return;
    }
    loginAsGuest(guestCode, phone);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !convertPassword) {
      addToast('error', 'Required Fields', 'Please complete all fields including a password for your account.');
      return;
    }
    if (convertPassword.length < 6) {
      addToast('error', 'Password Too Short', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      await convertToMember(firstName, lastName, email, convertPassword);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ padding: '32px 28px', maxWidth: '460px' }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#6e7a76',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="eyebrow-text">WELCOME TO EVOLVE</span>
          <h2 style={{ fontSize: '1.75rem', color: '#17271f', marginTop: '4px' }}>
            {tab === 'signin' && 'Member Sign In'}
            {tab === 'signup' && 'Create Your Evolve Account'}
            {tab === 'otp' && 'Two-Factor Verification'}
            {tab === 'recovery' && 'Recover Account Access'}
            {tab === 'guest_login' && 'Sign In as Guest'}
            {tab === 'convert_to_member' && 'Upgrade to Member Account'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6e7a76', marginTop: '6px' }}>
            {tab === 'signin' && 'One unified sign-in for hotel bookings, active stays, and rewards.'}
            {tab === 'signup' && 'Enjoy member rates, expedited check-in, and tier privileges.'}
            {tab === 'otp' && 'Enter the 6-digit security code sent to your email or SMS.'}
            {tab === 'recovery' && 'Enter your email address to receive access recovery instructions.'}
            {tab === 'guest_login' && 'Enter your Guest Code and Phone Number to access your reservation.'}
            {tab === 'convert_to_member' && 'Complete your profile to unlock member rates and Evolve Rewards.'}
          </p>
        </div>

        {/* Tab switcher (Sign In vs Sign Up) */}
        {(tab === 'signin' || tab === 'signup') && (
          <div style={{
            display: 'flex',
            backgroundColor: '#f6f3ec',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setTab('signin')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                backgroundColor: tab === 'signin' ? '#173f34' : 'transparent',
                color: tab === 'signin' ? '#ffffff' : '#6e7a76',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                backgroundColor: tab === 'signup' ? '#dda943' : 'transparent',
                color: tab === 'signup' ? '#17271f' : '#6e7a76',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setTab('recovery')}
                  style={{ fontSize: '0.75rem', color: '#997125', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: '16px', padding: '14px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In with Two-Factor'}
            </button>

            {/* Quick Demo Fill Buttons for Testing */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f6f3ec',
              borderRadius: '10px',
              border: '1px dashed #dda943'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#997125', marginBottom: '8px', textTransform: 'uppercase' }}>
                Testing Accounts (Click to Fill)
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alexander.wright@luxury.io');
                    setPassword('••••••••••••');
                  }}
                  style={{ fontSize: '0.75rem', padding: '6px 10px', borderRadius: '6px', border: '1px solid #dcd7cb', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  Alexander Wright (Prestige)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('julian.hayes@example.com');
                    setPassword('••••••••••••');
                  }}
                  style={{ fontSize: '0.75rem', padding: '6px 10px', borderRadius: '6px', border: '1px solid #dcd7cb', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  Julian Hayes (Houston Stay)
                </button>
              </div>
            </div>

            {/* Direct Guest Booking Link */}
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setTab('guest_login')}
                className="btn btn-outline btn-full"
                style={{ marginTop: '8px' }}
              >
                Sign in as Guest
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Eleanor"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Vance"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Password</label>
              <input
                type="password"
                className="form-input"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Create a password (min 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone (Optional for SMS Alerts)</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Evolve Rewards Enrollment Checkbox */}
            <div style={{
              backgroundColor: '#fcf6eb',
              border: '1.5px solid rgba(221, 169, 67, 0.4)',
              borderRadius: '12px',
              padding: '12px',
              margin: '16px 0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <input
                type="checkbox"
                id="joinRewardsCheck"
                checked={joinRewards}
                onChange={(e) => setJoinRewards(e.target.checked)}
                style={{ marginTop: '3px', accentColor: '#dda943', width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="joinRewardsCheck" style={{ fontSize: '0.8125rem', color: '#17271f', cursor: 'pointer' }}>
                <strong style={{ color: '#997125' }}>Enroll me in Evolve Rewards (Complimentary)</strong>
                <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>
                  Earn qualifying nights with every stay toward free reward nights, complimentary dining, and exclusive experiences — no points, no complexity.
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-secondary btn-full"
              disabled={loading}
              style={{ padding: '14px' }}
            >
              {loading ? 'Creating Account...' : (joinRewards ? 'Create Rewards Account & Earn Reward Nights' : 'Create Standard Account')}
            </button>
          </form>
        )}

        {/* TAB 3: 2FA OTP */}
        {tab === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              margin: '20px 0 28px'
            }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  style={{
                    width: '46px',
                    height: '56px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#173f34',
                    border: '2px solid #e2ded5',
                    borderRadius: '10px',
                    backgroundColor: '#faf9f5'
                  }}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8125rem', color: '#6e7a76' }}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={() => addToast('info', 'Code Resent', 'A fresh 6-digit code was transmitted.')}
                  style={{ color: '#997125', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Resend OTP
                </button>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Verifying Code...' : 'Confirm Verification & Enter'}
            </button>

            <button
              type="button"
              onClick={() => setTab('signin')}
              style={{
                display: 'block',
                margin: '14px auto 0',
                background: 'none',
                border: 'none',
                color: '#6e7a76',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* TAB 4: PASSWORD RECOVERY */}
        {tab === 'recovery' && (
          <form onSubmit={handleRecovery}>
            <div className="form-group">
              <label className="form-label">Account Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: '16px' }}
            >
              Dispatch Recovery Instructions
            </button>

            <button
              type="button"
              onClick={() => setTab('signin')}
              style={{
                display: 'block',
                margin: '14px auto 0',
                background: 'none',
                border: 'none',
                color: '#6e7a76',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* TAB 5: GUEST LOGIN */}
        {tab === 'guest_login' && (
          <form onSubmit={handleGuestLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Guest Code</label>
              <input
                type="text"
                className="form-input"
                value={guestCode}
                onChange={(e) => setGuestCode(e.target.value)}
                placeholder="e.g. GUEST-123456"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter the number used at booking"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: '16px', padding: '14px' }}
            >
              Access Guest Reservation
            </button>

            {/* Quick Demo Guest Fill Buttons */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#fcf6eb',
              borderRadius: '10px',
              border: '1px dashed #dda943'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#997125', marginBottom: '8px', textTransform: 'uppercase' }}>
                Pre-loaded Demo Guest Stays (Click to Test)
              </div>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <button
                  type="button"
                  onClick={() => {
                    setGuestCode('GUEST-101010');
                    setPhone('+1 (555) 234-5678');
                  }}
                  style={{ fontSize: '0.75rem', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcd7cb', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <strong>Guest 1: GUEST-101010</strong> · Houston Medical + Dallas (2 Stays)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestCode('GUEST-202020');
                    setPhone('+1 (555) 987-6543');
                  }}
                  style={{ fontSize: '0.75rem', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcd7cb', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <strong>Guest 2: GUEST-202020</strong> · Texarkana Suite (1 Stay)
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTab('signin')}
              style={{
                display: 'block',
                margin: '14px auto 0',
                background: 'none',
                border: 'none',
                color: '#6e7a76',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              ← Back to Member Sign In
            </button>
          </form>
        )}

        {/* TAB 6: CONVERT TO MEMBER */}
        {tab === 'convert_to_member' && (
          <form onSubmit={handleConvertSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Eleanor"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Vance"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Member Password</label>
              <input
                type="password"
                className="form-input"
                value={convertPassword}
                onChange={(e) => setConvertPassword(e.target.value)}
                placeholder="Choose a password for future logins (min 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone (Verified)</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                disabled
                style={{ backgroundColor: '#f0ede8', color: '#6e7a76' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary btn-full"
              disabled={loading}
              style={{ padding: '14px', marginTop: '12px' }}
            >
              {loading ? 'Upgrading Account...' : 'Upgrade & Join Evolve Rewards'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
