import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, CreditCard, ShieldCheck, Mail, 
  Phone, Plus, Check, Star, Lock, Heart, Settings,
  Eye, EyeOff, Key
} from 'lucide-react';
import { mockPersonas } from '../data/mockUsers';

export const AccountPage: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const user = currentUser || mockPersonas['member_prestige'];

  const [activeTab, setActiveTab] = useState<'profile' | 'payment'>('profile');

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  // Password Change & 2FA State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorSent, setTwoFactorSent] = useState(false);
  const [showTwoFactorStep, setShowTwoFactorStep] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Add Card Modal
  const [addCardModal, setAddCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    addToast('success', 'Profile Updated', 'Personal information and verified contacts saved.');
  };

  const handleSend2FACode = () => {
    setTwoFactorSent(true);
    addToast('info', '2FA Code Dispatched', `A 6-digit authentication code has been sent to ${phone || 'your verified mobile'}. (Demo code: 123456)`);
  };

  const handleInitiatePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('error', 'Current Password Required', 'Please provide your current password.');
      return;
    }
    if (newPassword.length < 8) {
      addToast('error', 'Weak Password', 'New password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', 'Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    setTwoFactorSent(true);
    setShowTwoFactorStep(true);
    addToast('info', '2FA Code Dispatched', `A 6-digit authentication code has been sent to ${phone || 'your verified mobile'}. (Demo code: 123456)`);
  };

  const handleConfirmPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode || twoFactorCode.length < 6) {
      addToast('error', '2FA Verification Required', 'Please enter the 6-digit verification code sent to your phone.');
      return;
    }

    addToast('success', 'Password Changed Successfully', 'Your account credentials have been updated securely with 2FA verification.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTwoFactorCode('');
    setTwoFactorSent(false);
    setShowTwoFactorStep(false);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    user.paymentMethods.push({
      id: `pm-${Date.now()}`,
      brand: 'visa',
      last4: newCardNumber.slice(-4) || '9912',
      expiry: newExpiry || '10/28',
      cardholderName: `${firstName} ${lastName}`,
      isDefault: false
    });
    setAddCardModal(false);
    addToast('success', 'Payment Method Added', 'Card successfully verified and saved.');
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '36px 20px 80px' }}>
      <div className="app-container" style={{ maxWidth: '1050px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <span className="eyebrow-text">GUEST SETTINGS & SECURITY</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#17271f' }}>
            Member Profile & Account
          </h1>
          <p style={{ color: '#6e7a76', fontSize: '1rem', marginTop: '6px' }}>
            Manage your personal profile, contact information, and account security.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '28px',
          borderBottom: '1px solid #e2ddd5',
          paddingBottom: '12px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'profile' ? '#173f34' : 'transparent',
              color: activeTab === 'profile' ? '#ffffff' : '#6e7a76',
              transition: 'all 0.2s ease'
            }}
          >
            <UserIcon size={16} /> Profile & Details
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'payment' ? '#173f34' : 'transparent',
              color: activeTab === 'payment' ? '#ffffff' : '#6e7a76',
              transition: 'all 0.2s ease'
            }}
          >
            <CreditCard size={16} /> Payment & Security
          </button>
        </div>

        {/* TAB 1: PROFILE & PERSONAL DETAILS */}
        {activeTab === 'profile' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '28px',
            alignItems: 'stretch'
          }}>
            {/* CARD 1: PERSONAL INFORMATION */}
            <div className="evolve-card" style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <div>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                  minHeight: '44px'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(23, 63, 52, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#173f34',
                    flexShrink: 0
                  }}>
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#17271f', margin: 0, fontWeight: 700 }}>
                      Personal Information
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#6e7a76', margin: '2px 0 0 0' }}>
                      Verified contact information & profile details
                    </p>
                  </div>
                </div>

                <form id="profile-form" onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Email Address</label>
                      <span style={{ fontSize: '0.75rem', color: '#17653e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} /> Verified
                      </span>
                    </div>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Mobile Phone</label>
                      <span style={{ fontSize: '0.75rem', color: user.isPhoneVerified ? '#17653e' : '#997125', fontWeight: 700 }}>
                        {user.isPhoneVerified ? '✓ Verified SMS' : 'Pending Verification'}
                      </span>
                    </div>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button
                  type="submit"
                  form="profile-form"
                  className="btn btn-primary btn-full"
                  style={{
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  Save Personal Details
                </button>
              </div>
            </div>

            {/* CARD 2: CHANGE PASSWORD & 2FA */}
            <div className="evolve-card" style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <div>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                  minHeight: '44px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(23, 63, 52, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#173f34',
                      flexShrink: 0
                    }}>
                      <Key size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#17271f', margin: 0, fontWeight: 700 }}>
                        Change Password
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#6e7a76', margin: '2px 0 0 0' }}>
                        Protected with Two-Factor Authentication (2FA)
                      </p>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(23, 101, 62, 0.1)',
                    color: '#17653e',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={14} /> 2FA Active
                  </span>
                </div>

                <form
                  id="password-form"
                  onSubmit={showTwoFactorStep ? handleConfirmPasswordChange : handleInitiatePasswordChange}
                >
                  {/* Current Password */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={showTwoFactorStep}
                        required
                        style={{ paddingRight: '40px', backgroundColor: showTwoFactorStep ? '#f6f3ec' : '#ffffff' }}
                      />
                      {!showTwoFactorStep && (
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#6e7a76',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0
                          }}
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* New and Confirm Password in 2 columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: showTwoFactorStep ? '14px' : 0 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Min 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={showTwoFactorStep}
                          required
                          style={{ paddingRight: '40px', backgroundColor: showTwoFactorStep ? '#f6f3ec' : '#ffffff' }}
                        />
                        {!showTwoFactorStep && (
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#6e7a76',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              padding: 0
                            }}
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={showTwoFactorStep}
                        required
                        style={{ backgroundColor: showTwoFactorStep ? '#f6f3ec' : '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* 2FA Verification Box: Hidden until Change Password is clicked! */}
                  {showTwoFactorStep ? (
                    <div style={{
                      backgroundColor: '#f2f6f4',
                      border: '1.5px solid #173f34',
                      borderRadius: '12px',
                      padding: '16px',
                      marginTop: '14px',
                      animation: 'fadeIn 0.25s ease'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Lock size={15} color="#173f34" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17271f' }}>
                            2FA Verification Code Sent
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSend2FACode}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#997125',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Resend Code
                        </button>
                      </div>

                      <p style={{ fontSize: '0.78125rem', color: '#4e5b57', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        Enter the 6-digit code sent to <strong>{phone || '+1 (214) 555-0192'}</strong> to confirm password update.
                      </p>

                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        className="form-input"
                        placeholder="Enter 6-digit code (e.g. 123456)"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                        required
                        style={{
                          letterSpacing: '0.2em',
                          fontWeight: 700,
                          textAlign: 'center',
                          backgroundColor: '#ffffff'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '0.78125rem',
                      color: '#6e7a76',
                      marginTop: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Lock size={13} color="#997125" />
                      <span>Two-factor SMS verification code will be requested upon proceeding.</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Action Button aligned parallel to Card 1 button */}
              <div style={{ marginTop: '24px' }}>
                {showTwoFactorStep ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowTwoFactorStep(false)}
                      className="btn btn-outline"
                      style={{
                        height: '46px',
                        flex: '0 0 100px',
                        fontSize: '0.875rem'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="password-form"
                      className="btn btn-primary"
                      style={{
                        height: '46px',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 700
                      }}
                    >
                      <ShieldCheck size={16} />
                      <span>Confirm & Save</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    form="password-form"
                    className="btn btn-primary btn-full"
                    style={{
                      height: '46px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}
                  >
                    <Key size={16} />
                    <span>Proceed to Change Password</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENT & SECURITY */}
        {activeTab === 'payment' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <div className="evolve-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: 0 }}>
                  Saved Payment Cards
                </h3>
                <button
                  onClick={() => setAddCardModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#173f34',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} /> Add Card
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {user.paymentMethods.map(pm => (
                  <div
                    key={pm.id}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      border: pm.isDefault ? '2px solid #173f34' : '1px solid #eeece5',
                      backgroundColor: pm.isDefault ? '#f6f3ec' : '#faf9f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '28px',
                        backgroundColor: '#17271f',
                        borderRadius: '6px',
                        color: '#dda943',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {pm.brand.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.875rem' }}>
                          •••• •••• •••• {pm.last4}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6e7a76' }}>
                          Expires {pm.expiry} • {pm.cardholderName}
                        </div>
                      </div>
                    </div>

                    {pm.isDefault && (
                      <span style={{
                        fontSize: '0.6875rem',
                        backgroundColor: '#173f34',
                        color: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontWeight: 700
                      }}>
                        DEFAULT
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div style={{
              backgroundColor: '#faf9f5',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #eeece5',
              height: 'fit-content'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#173f34', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
                <Lock size={16} /> Two-Factor Authentication Guard
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6e7a76', lineHeight: 1.5, margin: 0 }}>
                Your account is protected by 2FA verification. High-value transactions and folio modifications require real-time SMS or email authorization.
              </p>
            </div>
          </div>
        )}

        {/* ADD CARD MODAL */}
        {addCardModal && (
          <div className="modal-overlay" onClick={() => setAddCardModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#17271f', marginBottom: '8px' }}>
                Add Payment Card
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6e7a76', marginBottom: '20px' }}>
                Card details are securely stored in PCI-DSS Level 1 tokenized vaults.
              </p>

              <form onSubmit={handleAddCard}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="4000 1234 5678 9010"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="12/28"
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC</label>
                    <input type="text" className="form-input" placeholder="123" required />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" onClick={() => setAddCardModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Verify & Save Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
