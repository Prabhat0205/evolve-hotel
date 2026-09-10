import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, CreditCard, ShieldCheck, Mail, 
  Phone, Plus, Check, Star, Lock, Heart, Settings 
} from 'lucide-react';

import { mockPersonas } from '../data/mockUsers';

export const AccountPage: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const user = currentUser || mockPersonas['member_prestige'];

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [idType, setIdType] = useState('PASSPORT');
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  // Preferences
  const [floor, setFloor] = useState(user.preferences.roomFloor || 'HIGH');
  const [bed, setBed] = useState(user.preferences.bedType || 'KING');
  const [quiet, setQuiet] = useState(user.preferences.quietRoom);
  const [pillow, setPillow] = useState(user.preferences.pillowType || 'FEATHER');

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

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    user.preferences = {
      roomFloor: floor as any,
      bedType: bed as any,
      quietRoom: quiet,
      pillowType: pillow as any,
    };
    addToast('success', 'Preferences Saved', 'Your stay preferences have been updated across all Evolve properties.');
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
      <div className="app-container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow-text">GUEST SETTINGS</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#17271f' }}>
            Profile & Hospitality Preferences
          </h1>
          <p style={{ color: '#6e7a76', fontSize: '1rem', marginTop: '6px' }}>
            Manage verified contact methods, saved cards for 1-click booking, and room comfort settings.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Column 1: Personal Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="evolve-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#17271f', marginBottom: '20px' }}>
                Personal Information
              </h3>

              <form onSubmit={handleSaveProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
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
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
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

                <div className="form-group">
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
                <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #eeece5' }} />
                
                <h4 style={{ fontSize: '1rem', color: '#17271f', marginBottom: '16px' }}>Identification Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Valid ID Type</label>
                    <select className="form-input" value={idType} onChange={(e) => setIdType(e.target.value)}>
                      <option value="PASSPORT">Passport</option>
                      <option value="DRIVERS_LICENSE">Driver's License</option>
                      <option value="NATIONAL_ID">National ID</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">ID Number</label>
                    <input type="text" className="form-input" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', color: '#17271f', marginBottom: '16px' }}>Residential Address</h4>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Street Address</label>
                  <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province</label>
                    <input type="text" className="form-input" value={stateProv} onChange={(e) => setStateProv(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input type="text" className="form-input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input type="text" className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
                  Save Profile Details
                </button>
              </form>
            </div>


          </div>

          {/* Column 2: Saved Payment Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
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
              border: '1px solid #eeece5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#173f34', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
                <Lock size={16} /> Two-Factor Authentication Guard
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6e7a76', lineHeight: 1.5, margin: 0 }}>
                Your account is protected by 2FA verification. High-value transactions and folio modifications require real-time SMS or email authorization.
              </p>
            </div>
          </div>
        </div>

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
