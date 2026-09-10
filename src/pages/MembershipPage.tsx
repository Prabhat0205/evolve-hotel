import React from 'react';
import { useApp } from '../context/AppContext';

export const MembershipPage: React.FC = () => {
  const { currentUser, navigateTo } = useApp();

  const profile = currentUser?.memberProfile || {
    memberId: 'EV-319084',
    tier: 'The Prestige',
    unusedRewardNights: 7,
    qualifyingNightsThisYear: 28,
    qualifyingNightsNeededForNextTier: 22,
    lifetimeQualifyingNights: 94,
    memberSinceYear: 2022,
  };

  const firstName = currentUser?.firstName || 'Prabhat';

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div className="app-container-wide" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>
              EVOLVE EXPERIENCE REWARDS
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: '#17271f', margin: '0 0 12px 0', lineHeight: 1.1 }}>
              Welcome back, {firstName}
            </h1>
            <p style={{ color: '#6e7a76', fontSize: '1.05rem', margin: 0 }}>
              Your stays, available Reward Nights and member benefits—all in one place.
            </p>
          </div>
          <button 
            onClick={() => navigateTo('landing')}
            style={{ backgroundColor: '#dda943', color: '#17271f', border: 'none', borderRadius: '12px', padding: '14px 24px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(221, 169, 67, 0.2)' }}
          >
            Book Your Next Stay
          </button>
        </div>

        {/* 3 Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          {/* Card 1 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AVAILABLE BALANCE</span>
              <div style={{ fontSize: '3rem', fontFamily: 'Playfair Display, serif', color: '#173f34', margin: '8px 0', lineHeight: 1 }}>
                {profile.unusedRewardNights}
              </div>
              <div style={{ color: '#17271f', fontSize: '1rem', marginBottom: '16px' }}>Reward Nights ready to use</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#173f34', fontWeight: 800, fontSize: '0.875rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View My Rewards <span style={{ fontSize: '1.1em' }}>→</span>
            </button>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase' }}>LIFETIME PROGRESS</span>
              <div style={{ fontSize: '3rem', fontFamily: 'Playfair Display, serif', color: '#173f34', margin: '8px 0', lineHeight: 1 }}>
                37
              </div>
              <div style={{ color: '#17271f', fontSize: '1rem', marginBottom: '16px' }}>Qualifying Nights earned</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#173f34', fontWeight: 800, fontSize: '0.875rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Booking History <span style={{ fontSize: '1.1em' }}>→</span>
            </button>
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CURRENT TIER</span>
              <div style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', color: '#173f34', margin: '12px 0 8px 0', lineHeight: 1 }}>
                The Prestige
              </div>
              <div style={{ color: '#17271f', fontSize: '1rem', marginBottom: '16px' }}>13 nights to The Legacy</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#173f34', fontWeight: 800, fontSize: '0.875rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Reward Tiers <span style={{ fontSize: '1.1em' }}>→</span>
            </button>
          </div>

        </div>

        {/* Info Box */}
        <div style={{ backgroundColor: '#fdf6e3', borderLeft: '4px solid #dda943', borderRadius: '0 8px 8px 0', padding: '16px 24px', marginBottom: '48px' }}>
          <p style={{ color: '#17271f', margin: 0, fontSize: '0.9375rem', lineHeight: 1.5 }}>
            <strong>Use the mobile number registered to your Evolve account when booking.</strong><br/>
            Eligible direct stays are matched to your verified number and credited automatically after checkout. Current verified number: <strong>Not provided.</strong>
          </p>
        </div>

        {/* YOUR CHOICES */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>YOUR CHOICES</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#17271f', margin: 0 }}>Available Rewards</h2>
          </div>
          <button 
            onClick={() => navigateTo('rewards-catalog')}
            style={{ backgroundColor: '#ffffff', color: '#173f34', border: '1px solid #eeece5', borderRadius: '8px', padding: '10px 20px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}
          >
            View All Rewards
          </button>
        </div>

        {/* Rewards List */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: '48px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #eeece5' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', color: '#17271f', margin: '0 0 4px 0', fontWeight: 800 }}>Free Fine-Dining Experience</h3>
              <p style={{ color: '#6e7a76', margin: 0, fontSize: '0.875rem' }}>5 Reward Nights · Available now</p>
            </div>
            <button style={{ backgroundColor: '#173f34', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}>
              Redeem
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #eeece5' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', color: '#17271f', margin: '0 0 4px 0', fontWeight: 800 }}>Free Night</h3>
              <p style={{ color: '#6e7a76', margin: 0, fontSize: '0.875rem' }}>9 Reward Nights · 2 more nights needed</p>
            </div>
            <button style={{ backgroundColor: '#ffffff', color: '#17271f', border: '1px solid #eeece5', borderRadius: '8px', padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}>
              View Progress
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', color: '#17271f', margin: '0 0 4px 0', fontWeight: 800 }}>$70 Digital Gift Card</h3>
              <p style={{ color: '#6e7a76', margin: 0, fontSize: '0.875rem' }}>9 Reward Nights · 2 more nights needed</p>
            </div>
            <button style={{ backgroundColor: '#ffffff', color: '#17271f', border: '1px solid #eeece5', borderRadius: '8px', padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}>
              View Progress
            </button>
          </div>

        </div>

        {/* 2x2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* YOUR STAYS */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>YOUR STAYS</span>
            <h2 style={{ fontSize: '1.75rem', color: '#17271f', margin: '0 0 24px 0', fontWeight: 800 }}>Upcoming Stay</h2>
            
            <div style={{ border: '1px solid #eeece5', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#eeece5', borderRadius: '12px', width: '70px', height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76' }}>SEP</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17271f', lineHeight: 1 }}>18</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#17271f', fontWeight: 800 }}>King Suite · Evolve Texarkana</h4>
                  <span style={{ backgroundColor: '#eaf5ee', color: '#17653e', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Confirmed</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6e7a76' }}>Sep 18–20 · Confirmation EV-2041</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => navigateTo('stays')} style={{ flex: 1, backgroundColor: '#ffffff', color: '#17271f', border: '1px solid #eeece5', borderRadius: '8px', padding: '12px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}>View My Stays</button>
              <button style={{ flex: 1, backgroundColor: '#ffffff', color: '#17271f', border: '1px solid #eeece5', borderRadius: '8px', padding: '12px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}>Report a Missing Stay</button>
            </div>
          </div>

          {/* ISSUED REWARDS */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>ISSUED REWARDS</span>
            <h2 style={{ fontSize: '1.75rem', color: '#17271f', margin: '0 0 24px 0', fontWeight: 800 }}>Ready to Use</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#17271f', fontWeight: 800 }}>Free Fine-Dining Experience</h4>
                <div style={{ fontSize: '0.875rem', color: '#6e7a76' }}>Reference DIN-5194 · Issued Aug 28</div>
              </div>
              <span style={{ backgroundColor: '#eaf5ee', color: '#17653e', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Issued</span>
            </div>

            <p style={{ fontSize: '0.9375rem', color: '#6e7a76', lineHeight: 1.5, marginBottom: '24px', margin: '0 0 24px 0' }}>
              Dining rewards are verified at the hotel restaurant using the mobile number, first name, and last name connected to your account. Gift-card requests show their delivery status here.
            </p>

            <button style={{ backgroundColor: '#ffffff', color: '#17271f', border: '1px solid #eeece5', borderRadius: '8px', padding: '12px 20px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}>
              View Reward Details
            </button>
          </div>

          {/* RECENT ACTIVITY */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>RECENT ACTIVITY</span>
            <h2 style={{ fontSize: '1.75rem', color: '#17271f', margin: '0 0 24px 0', fontWeight: 800 }}>Reward & Stay History</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #eeece5' }}>
              <span style={{ color: '#17271f', fontSize: '1rem' }}>Eligible stay credited · EV-4218</span>
              <strong style={{ color: '#17271f', fontSize: '1.125rem' }}>+2</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #eeece5', marginBottom: '24px' }}>
              <span style={{ color: '#17271f', fontSize: '1rem' }}>Dining reward issued · DIN-5194</span>
              <strong style={{ color: '#17271f', fontSize: '1.125rem' }}>−5</strong>
            </div>

            <button style={{ background: 'none', border: 'none', color: '#173f34', fontWeight: 800, fontSize: '0.9375rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View complete history <span style={{ fontSize: '1.1em' }}>→</span>
            </button>
          </div>

          {/* ACCOUNT */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #eeece5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>ACCOUNT</span>
            <h2 style={{ fontSize: '1.75rem', color: '#17271f', margin: '0 0 24px 0', fontWeight: 800 }}>Verified Mobile Number</h2>
            
            <div style={{ color: '#17271f', fontWeight: 800, fontSize: '1rem', marginBottom: '16px' }}>
              Not provided
            </div>

            <p style={{ fontSize: '0.9375rem', color: '#6e7a76', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Keep this number current so eligible direct stays connect to the correct account.
            </p>

            <button 
              onClick={() => navigateTo('profile')}
              style={{ backgroundColor: '#ffffff', color: '#17271f', border: '1px solid #eeece5', borderRadius: '8px', padding: '12px 20px', fontSize: '0.9375rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Manage Account & Preferences
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MembershipPage;
