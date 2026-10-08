import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, CreditCard, ShieldCheck, Mail, 
  Phone, Plus, Check, Star, Lock, Heart, Settings,
  Award, TrendingUp, ArrowDownRight, ArrowUpRight, BedDouble, Calendar, CheckCircle2, Clock
} from 'lucide-react';
import { MemberRewardTransaction } from '../types/admin';
import { mockPersonas } from '../data/mockUsers';

const defaultMemberTransactions: MemberRewardTransaction[] = [
  {
    id: 'tx-101',
    date: 'Oct 02, 2026',
    activity: 'Giftgram Redeemed',
    stayOrBooking: 'GG-88210',
    giftogramRefId: 'GG-88210',
    points: -15,
    status: 'Redeemed',
    notes: 'Giftgram e-gift boutique card redemption'
  },
  {
    id: 'tx-102',
    date: 'Sep 30, 2026',
    activity: 'Fine Dining Redeemed',
    stayOrBooking: 'FD-40182',
    points: -15,
    status: 'Redeemed',
    notes: 'Chef tasting dinner experience at Le Jardin'
  },
  {
    id: 'tx-103',
    date: 'Sep 29, 2026',
    activity: 'Nights Redeemed',
    stayOrBooking: 'EV-BK-4019',
    nights: 1,
    points: -10,
    status: 'Redeemed',
    notes: 'Reward nights redeemed for suite stay & room upgrade'
  },
  {
    id: 'tx-104',
    date: 'Sep 28, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-10245',
    nights: 3,
    points: 3,
    status: 'Credited',
    notes: 'Completed 3-night stay at The Grand Manor'
  },
  {
    id: 'tx-105',
    date: 'Sep 15, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-10122',
    nights: 2,
    points: 2,
    status: 'Credited',
    notes: 'Completed 2-night stay at Cliffside Haven'
  },
  {
    id: 'tx-106',
    date: 'Aug 20, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-9821',
    nights: 5,
    points: 5,
    status: 'Credited',
    notes: 'Completed 5-night stay at Alpine Chalet'
  },
  {
    id: 'tx-107',
    date: 'Jul 10, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-9410',
    nights: 115,
    points: 115,
    status: 'Credited',
    notes: 'Historical verified completed stays'
  }
];

export const AccountPage: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const user = currentUser || mockPersonas['member_prestige'];

  const [activeTab, setActiveTab] = useState<'profile' | 'rewards' | 'payment'>('profile');
  const [rewardsFilter, setRewardsFilter] = useState<'ALL' | 'CREDITED' | 'REDEEMED'>('ALL');

  // Rewards calculation in nights
  const totalNightsEarned = 125;
  const nightsRedeemed = 40;
  // Available = Total Earned - Nights Redeemed (calculated dynamically)
  const nightsAvailable = totalNightsEarned - nightsRedeemed;

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

  const isTransactionCredited = (tx: MemberRewardTransaction) =>
    tx.activity.includes('Credited') || tx.points > 0;

  const isTransactionRedeemed = (tx: MemberRewardTransaction) =>
    tx.activity.includes('Redeem') || tx.points < 0;

  const filteredTransactions = defaultMemberTransactions.filter(tx => {
    if (rewardsFilter === 'CREDITED') return isTransactionCredited(tx);
    if (rewardsFilter === 'REDEEMED') return isTransactionRedeemed(tx);
    return true;
  });

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '36px 20px 80px' }}>
      <div className="app-container" style={{ maxWidth: '1050px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <span className="eyebrow-text">GUEST SETTINGS & REWARDS</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#17271f' }}>
            Member Profile & Account
          </h1>
          <p style={{ color: '#6e7a76', fontSize: '1rem', marginTop: '6px' }}>
            Manage your personal profile, hospitality preferences, and member reward nights balance.
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
            onClick={() => setActiveTab('rewards')}
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
              backgroundColor: activeTab === 'rewards' ? '#173f34' : 'transparent',
              color: activeTab === 'rewards' ? '#ffffff' : '#6e7a76',
              transition: 'all 0.2s ease'
            }}
          >
            <Award size={16} /> Rewards & Nights
            <span style={{
              backgroundColor: activeTab === 'rewards' ? '#dda943' : '#e6e2d8',
              color: activeTab === 'rewards' ? '#17271f' : '#6e7a76',
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: 800
            }}>
              {nightsAvailable} nights
            </span>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div className="evolve-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#17271f', marginBottom: '20px' }}>
                  Stay & Room Preferences
                </h3>
                <form onSubmit={handleSavePreferences}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Preferred Floor Level</label>
                    <select className="form-input" value={floor} onChange={(e) => setFloor(e.target.value as any)}>
                      <option value="HIGH">High Floor (Panoramic Views)</option>
                      <option value="LOW">Ground / Low Floor (Fast Accessibility)</option>
                      <option value="NO_PREFERENCE">No Preference</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Bed Setup</label>
                    <select className="form-input" value={bed} onChange={(e) => setBed(e.target.value as any)}>
                      <option value="KING">King Bed</option>
                      <option value="TWIN">Two Twin Beds</option>
                      <option value="NO_PREFERENCE">Standard Allocation</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Pillow Selection</label>
                    <select className="form-input" value={pillow} onChange={(e) => setPillow(e.target.value as any)}>
                      <option value="FEATHER">Goose Feather & Down</option>
                      <option value="FOAM">Ergonomic Memory Foam</option>
                      <option value="HYPOALLERGENIC">Hypoallergenic Microfiber</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '24px' }}>
                    <input
                      type="checkbox"
                      id="quietRoom"
                      checked={quiet}
                      onChange={(e) => setQuiet(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#173f34' }}
                    />
                    <label htmlFor="quietRoom" style={{ fontSize: '0.875rem', color: '#17271f', fontWeight: 600, cursor: 'pointer' }}>
                      Prioritize quiet room away from elevators and service areas
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Save Preferences
                  </button>
                </form>
              </div>

              {/* Quick Rewards Teaser */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #eeece5',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    MEMBER REWARDS BALANCE
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17271f', marginTop: '4px' }}>
                    {nightsAvailable} Nights Available
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '2px' }}>
                    {totalNightsEarned} earned · {nightsRedeemed} redeemed
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('rewards')}
                  className="btn btn-outline"
                  style={{ fontSize: '0.875rem', padding: '8px 16px' }}
                >
                  View Rewards →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED REWARDS SECTION */}
        {activeTab === 'rewards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* 1. Rewards Summary Cards */}
            <div>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: 0, fontWeight: 700 }}>
                    Rewards Nights Summary
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6e7a76', margin: '4px 0 0 0' }}>
                    Nights earned from qualified completed stays and available for member redemptions.
                  </p>
                </div>
                <span style={{
                  fontSize: '0.8125rem',
                  backgroundColor: '#f0ede6',
                  color: '#173f34',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Award size={14} color="#dda943" /> Tier: {user.memberProfile?.tier || 'PRESTIGE'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {/* Card 1: Total Nights Earned */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #eeece5',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#6e7a76', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Nights Earned
                      </span>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(23, 101, 62, 0.1)',
                        color: '#17653e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#17271f', lineHeight: 1 }}>
                      {totalNightsEarned}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f6f3ec', fontSize: '0.8125rem', color: '#6e7a76' }}>
                    Earned through qualified completed stays
                  </div>
                </div>

                {/* Card 2: Nights Redeemed */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #eeece5',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#6e7a76', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Nights Redeemed
                      </span>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(153, 113, 37, 0.1)',
                        color: '#997125',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ArrowDownRight size={20} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#17271f', lineHeight: 1 }}>
                      {nightsRedeemed}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f6f3ec', fontSize: '0.8125rem', color: '#6e7a76' }}>
                    Nights already used for bookings & member rewards
                  </div>
                </div>

                {/* Card 3: Nights Available / Remaining */}
                <div style={{
                  backgroundColor: '#173f34',
                  color: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #173f34',
                  boxShadow: '0 4px 16px rgba(23, 63, 52, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(221, 169, 67, 0.15)',
                    pointerEvents: 'none'
                  }} />

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#dda943', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Nights Available / Remaining
                      </span>
                      <span style={{
                        fontSize: '0.6875rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 700
                      }}>
                        CALCULATED
                      </span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                      {nightsAvailable}
                    </div>
                  </div>

                  <div style={{
                    marginTop: '16px',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '0.8125rem',
                    color: '#e2ddd5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{totalNightsEarned} Earned − {nightsRedeemed} Redeemed</span>
                    <span style={{ color: '#dda943', fontWeight: 700 }}>Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Rewards Nights History */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #eeece5',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              {/* Header and Filter */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#17271f', margin: 0, fontWeight: 700 }}>
                    Rewards Nights History
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6e7a76', margin: '4px 0 0 0' }}>
                    Complete audit trail of earned stay credits and redeemed nights.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f6f3ec', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRewardsFilter('ALL')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: rewardsFilter === 'ALL' ? '#ffffff' : 'transparent',
                      color: rewardsFilter === 'ALL' ? '#17271f' : '#6e7a76',
                      boxShadow: rewardsFilter === 'ALL' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    All ({defaultMemberTransactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRewardsFilter('CREDITED')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: rewardsFilter === 'CREDITED' ? '#ffffff' : 'transparent',
                      color: rewardsFilter === 'CREDITED' ? '#17653e' : '#6e7a76',
                      boxShadow: rewardsFilter === 'CREDITED' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    Nights Credited ({defaultMemberTransactions.filter(isTransactionCredited).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRewardsFilter('REDEEMED')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: rewardsFilter === 'REDEEMED' ? '#ffffff' : 'transparent',
                      color: rewardsFilter === 'REDEEMED' ? '#997125' : '#6e7a76',
                      boxShadow: rewardsFilter === 'REDEEMED' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    Nights Redeemed ({defaultMemberTransactions.filter(isTransactionRedeemed).length})
                  </button>
                </div>
              </div>

              {/* Transaction Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eeece5' }}>
                      <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Date
                      </th>
                      <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Activity
                      </th>
                      <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Stay / Booking
                      </th>
                      <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Nights
                      </th>
                      <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                        Reward Nights
                      </th>
                      <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => {
                      const isCredited = isTransactionCredited(tx);
                      return (
                        <tr key={tx.id} style={{ borderBottom: '1px solid #f6f3ec', transition: 'background-color 0.15s ease' }}>
                          <td style={{ padding: '16px 14px', fontSize: '0.875rem', color: '#17271f', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Calendar size={14} color="#6e7a76" />
                              {tx.date}
                            </div>
                          </td>

                          <td style={{ padding: '16px 14px', fontSize: '0.875rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                              backgroundColor: isCredited ? 'rgba(23, 101, 62, 0.08)' : 'rgba(153, 113, 37, 0.08)',
                              color: isCredited ? '#17653e' : '#997125'
                            }}>
                              {isCredited ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                              {tx.activity}
                            </span>
                          </td>

                          <td style={{ padding: '16px 14px', fontSize: '0.875rem', color: '#17271f' }}>
                            <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#173f34' }}>
                              {tx.stayOrBooking}
                            </div>
                            {tx.notes && (
                              <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>
                                {tx.notes}
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '16px 14px', fontSize: '0.875rem', color: '#6e7a76' }}>
                            {tx.nights ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#17271f' }}>
                                <BedDouble size={14} color="#6e7a76" /> {tx.nights} {tx.nights === 1 ? 'night' : 'nights'}
                              </span>
                            ) : (
                              <span style={{ color: '#aaa' }}>—</span>
                            )}
                          </td>

                          <td style={{ padding: '16px 14px', fontSize: '1rem', fontWeight: 800, textAlign: 'right' }}>
                            <span style={{ color: isCredited ? '#17653e' : '#b44a22' }}>
                              {tx.points > 0 ? `+${tx.points}` : tx.points}
                            </span>
                          </td>

                          <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: tx.status === 'Credited' ? '#eaf5ee' : tx.status === 'Redeemed' ? '#fdf5e6' : '#f0f0f0',
                              color: tx.status === 'Credited' ? '#17653e' : tx.status === 'Redeemed' ? '#997125' : '#666'
                            }}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cloudbeds stay rule notice */}
              <div style={{
                marginTop: '20px',
                padding: '14px 18px',
                backgroundColor: '#f6f3ec',
                borderRadius: '10px',
                border: '1px solid #eeece5',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle2 size={18} color="#17653e" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.8125rem', color: '#6e7a76', lineHeight: 1.5 }}>
                  <strong style={{ color: '#17271f' }}>Cloudbeds Stay Calculation Rule:</strong> Reward nights are calculated automatically based on qualified nights from completed Cloudbeds stays (e.g., <strong>3-night completed stay → +3 reward nights</strong>). Nights are credited immediately upon confirmed checkout.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & SECURITY */}
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
