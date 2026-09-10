import React from 'react';
import { RewardItem, RewardRedemption, MemberProfile, MembershipTier } from '../../types';
import { Sparkles, Check, Clock, ShieldCheck, Gift, UtensilsCrossed, Moon, ArrowRight, Bed, Info } from 'lucide-react';

/* =========================================================================
   1. RewardBalanceCard:
   Visually prominent dark pine card matching the UX reference image:
   - "Unused reward-night balance"
   - "7"
   - "qualifying nights"
   ========================================================================= */
export const RewardBalanceCard: React.FC<{ profile: MemberProfile }> = ({ profile }) => {
  return (
    <div
      style={{
        backgroundColor: '#173f34',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '24px 28px',
        boxShadow: '0 12px 32px rgba(23, 63, 52, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: '220px',
        maxWidth: '320px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#dbdedd',
          marginBottom: '8px',
          letterSpacing: '0.01em',
        }}
      >
        Unused reward-night balance
      </span>

      <div
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.75rem, 5vw, 3.5rem)',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1,
          marginBottom: '6px',
        }}
      >
        {profile.unusedRewardNights}
      </div>

      <span
        style={{
          fontSize: '0.875rem',
          color: '#dbdedd',
          fontWeight: 500,
        }}
      >
        qualifying nights
      </span>
    </div>
  );
};

/* =========================================================================
   2. RewardTabs:
   4 Pills matching reference:
   Available rewards | Redemption history | How it works | Reward tiers
   ========================================================================= */
export type RewardTabKey = 'AVAILABLE' | 'HISTORY' | 'HOW_IT_WORKS' | 'TIERS';

interface RewardTabsProps {
  activeTab: RewardTabKey;
  onSelectTab: (tab: RewardTabKey) => void;
  redemptionCount: number;
}

export const RewardTabs: React.FC<RewardTabsProps> = ({ activeTab, onSelectTab, redemptionCount }) => {
  const tabs: { key: RewardTabKey; label: string; count?: number }[] = [
    { key: 'AVAILABLE', label: 'Available rewards' },
    { key: 'HISTORY', label: 'Redemption history', count: redemptionCount },
    { key: 'HOW_IT_WORKS', label: 'How it works' },
    { key: 'TIERS', label: 'Reward tiers' },
  ];

  return (
    <nav 
      aria-label="Reward Category Tabs"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '6px',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onSelectTab(tab.key)}
            style={{
              padding: '9px 22px',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              border: isActive ? 'none' : '1.5px solid #d8d6cf',
              backgroundColor: isActive ? '#173f34' : '#ffffff',
              color: isActive ? '#ffffff' : '#17271f',
              boxShadow: isActive ? '0 2px 8px rgba(23, 63, 52, 0.18)' : 'none',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

/* =========================================================================
   3. RewardCard:
   Single card matching the 3 cards in reference image:
   - Free Night (9 nights)
   - Free Fine Dining Experience (5 nights) [Available]
   - $70 Gift Card (9 nights)
   ========================================================================= */
interface RewardCardProps {
  reward: RewardItem;
  userNights: number;
  onRedeem: (reward: RewardItem) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, userNights, onRedeem }) => {
  const isAvailable = userNights >= reward.requiredNights;
  const nightsNeeded = reward.requiredNights - userNights;

  return (
    <div
      className="evolve-card"
      style={{
        borderRadius: '22px',
        padding: '32px 28px 28px',
        backgroundColor: '#ffffff',
        border: isAvailable ? '2px solid #173f34' : '1.5px solid #eeece5',
        boxShadow: isAvailable ? '0 12px 32px rgba(23, 63, 52, 0.08)' : '0 4px 16px rgba(23, 39, 31, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        minHeight: '320px',
      }}
    >
      <div>
        {/* Reward Title in Playfair Display serif font */}
        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.45rem',
            fontWeight: 600,
            color: isAvailable ? '#17271f' : '#6e7a76',
            lineHeight: 1.25,
            marginBottom: '14px',
            letterSpacing: '-0.01em',
          }}
        >
          {reward.title}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.9375rem',
            color: '#6e7a76',
            lineHeight: 1.55,
            marginBottom: '28px',
          }}
        >
          {reward.description}
        </p>
      </div>

      <div>
        {/* Required Qualifying Nights */}
        <div
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: isAvailable ? '#173f34' : '#6e7a76',
            marginBottom: '18px',
            letterSpacing: '-0.02em',
          }}
        >
          {reward.requiredNights} nights
        </div>

        {/* Action Button: Deep Pine if eligible, Muted gray disabled if not enough nights */}
        {isAvailable ? (
          <button
            onClick={() => onRedeem(reward)}
            style={{
              width: '100%',
              backgroundColor: '#173f34',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '0.9375rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(23, 63, 52, 0.2)',
              transition: 'background-color 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#12332a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#173f34')}
          >
            {reward.buttonLabel}
          </button>
        ) : (
          <div>
            <button
              disabled
              style={{
                width: '100%',
                backgroundColor: '#e5e3dc',
                color: '#8c8a82',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: 'not-allowed',
              }}
            >
              {reward.buttonLabel}
            </button>
            <div
              style={{
                textAlign: 'center',
                marginTop: '8px',
                fontSize: '0.75rem',
                color: '#997125',
                fontWeight: 600,
              }}
            >
              Earn {nightsNeeded} more {nightsNeeded === 1 ? 'night' : 'nights'} to unlock
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   4. RedemptionModal:
   Confirms redemption in terms of qualifying nights:
   - Reward Cost: 5 qualifying nights
   - Your Balance: 7 qualifying nights
   - Remaining Balance: 2 qualifying nights
   ========================================================================= */
interface RedemptionModalProps {
  reward: RewardItem;
  currentBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
  isRedeeming: boolean;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  reward,
  currentBalance,
  onConfirm,
  onCancel,
  isRedeeming,
}) => {
  const remaining = currentBalance - reward.requiredNights;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '36px 32px', maxWidth: '480px' }}
      >
        <span className="eyebrow-text">CONFIRM REWARD REDEMPTION</span>

        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            color: '#17271f',
            marginTop: '4px',
            marginBottom: '8px',
          }}
        >
          Redeem {reward.title}
        </h3>

        <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.6, marginBottom: '24px' }}>
          {reward.description}
        </p>

        {/* Balance Calculation Breakdown */}
        <div
          style={{
            backgroundColor: '#faf9f5',
            border: '1.5px solid #eeece5',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#6e7a76' }}>Reward Cost:</span>
            <strong style={{ color: '#17271f' }}>{reward.requiredNights} qualifying nights</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#6e7a76' }}>Your Current Balance:</span>
            <strong style={{ color: '#17271f' }}>{currentBalance} qualifying nights</strong>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9375rem',
              borderTop: '1.5px solid #e2ded5',
              paddingTop: '12px',
            }}
          >
            <span style={{ color: '#17653e', fontWeight: 600 }}>Remaining Balance:</span>
            <strong style={{ color: '#17653e' }}>
              {remaining} {remaining === 1 ? 'qualifying night' : 'qualifying nights'}
            </strong>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#8c8a82', lineHeight: 1.5, marginBottom: '24px' }}>
          By confirming, {reward.requiredNights} reward nights will be deducted from your account. An official digital voucher code will be issued immediately.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isRedeeming}
            className="btn btn-outline"
            style={{ padding: '12px 20px' }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isRedeeming}
            className="btn btn-primary"
            style={{ padding: '12px 24px' }}
          >
            {isRedeeming ? 'Redeeming...' : 'Confirm Redemption'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. RedemptionHistoryTab:
   List of redeemed rewards showing:
   - Reward name, date, nights used, status, confirmation code, property
   ========================================================================= */
export const RedemptionHistoryTab: React.FC<{
  history: RewardRedemption[];
  onExploreRewards: () => void;
}> = ({ history, onExploreRewards }) => {
  const [filter, setFilter] = React.useState<'All' | 'Free Nights' | 'Dining' | 'Gift Cards'>('All');

  const filteredHistory = history.filter(record => {
    if (filter === 'All') return true;
    if (filter === 'Free Nights' && record.category === 'FREE_NIGHT') return true;
    if (filter === 'Dining' && record.category === 'DINING') return true;
    if (filter === 'Gift Cards' && record.category === 'GIFT_CARD') return true;
    return false;
  });

  const getMonthAndDay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { month: 'TBD', day: '--' };
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = date.getDate().toString().padStart(2, '0');
      return { month, day };
    } catch {
      return { month: 'TBD', day: '--' };
    }
  };

  const getSubtext = (record: RewardRedemption) => {
    if (record.category === 'DINING') {
      return 'Square profile ending in 4567';
    } else if (record.category === 'FREE_NIGHT') {
      return 'Reservation EV-1028';
    } else if (record.category === 'GIFT_CARD') {
      return 'Sent to verified email';
    }
    return '';
  };

  const getThirdLine = (record: RewardRedemption) => {
    if (record.category === 'DINING' || record.category === 'GIFT_CARD') {
      return `Reference ${record.voucherCode}`;
    } else if (record.category === 'FREE_NIGHT') {
      return 'Stay completed June 4';
    }
    return '';
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>YOUR ACTIVITY</span>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#17271f', margin: 0 }}>Redemption history</h2>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {(['All', 'Free Nights', 'Dining', 'Gift Cards'] as const).map(label => {
          const isActive = filter === label;
          return (
            <button
              key={label}
              onClick={() => setFilter(label)}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                border: isActive ? 'none' : '1px solid #eeece5',
                backgroundColor: isActive ? '#173f34' : '#ffffff',
                color: isActive ? '#ffffff' : '#17271f',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: isActive ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filteredHistory.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eeece5', color: '#6e7a76' }}>
          No redemptions found for this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredHistory.map((record) => {
            const { month, day } = getMonthAndDay(record.redeemedAt);
            const statusBadgeText = record.status === 'ACTIVE' || record.category === 'GIFT_CARD' ? 'Delivered' : 'Used';
            
            return (
              <div
                key={record.id}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #eeece5',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1 }}>
                  <div style={{ backgroundColor: '#eeece5', borderRadius: '12px', width: '70px', height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6e7a76' }}>{month}</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17271f', lineHeight: 1 }}>{day}</span>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '1.125rem', color: '#17271f', margin: '0 0 4px 0', fontWeight: 800 }}>
                      {record.rewardTitle}
                    </h4>
                    <div style={{ fontSize: '0.9375rem', color: '#6e7a76', marginBottom: '2px' }}>
                      {record.nightsUsed} Reward Nights deducted · {getSubtext(record)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#929b98' }}>
                      {getThirdLine(record)}
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#eaf5ee',
                      color: '#17653e',
                    }}
                  >
                    {statusBadgeText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   6. HowItWorksTab:
   Visual 4-step explanation:
   Stay -> Earn -> Choose -> Redeem
   ========================================================================= */
export const HowItWorksTab: React.FC<{ onStartJourney: () => void }> = ({ onStartJourney }) => {
  const steps = [
    {
      num: 'STEP 1',
      title: 'Stay',
      desc: 'Complete an eligible stay at any Evolve Hotel or Resort globally.',
      icon: <Bed size={24} color="#dda943" />,
    },
    {
      num: 'STEP 2',
      title: 'Earn',
      desc: 'Qualified nights are added directly to your unused reward-night balance.',
      icon: <Sparkles size={24} color="#dda943" />,
    },
    {
      num: 'STEP 3',
      title: 'Choose',
      desc: 'Select an eligible Evolve reward—Free Night, Fine Dining, or Gift Card.',
      icon: <Gift size={24} color="#dda943" />,
    },
    {
      num: 'STEP 4',
      title: 'Redeem',
      desc: 'Use the required reward nights. No points or complicated monetary conversions.',
      icon: <Check size={24} color="#dda943" strokeWidth={3} />,
    },
  ];

  return (
    <div className="evolve-card" style={{ padding: '40px 32px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
        <span className="eyebrow-text">TRANSPARENT REWARDS</span>
        <h3 style={{ fontSize: '1.75rem', color: '#17271f', marginTop: '4px' }}>
          One Shared Balance. Simple Rewards.
        </h3>
        <p style={{ color: '#6e7a76', fontSize: '0.9375rem', marginTop: '8px' }}>
          Evolve members earn reward nights through qualified stays. No points, no conversion rates, and no complicated math.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#faf9f5',
              border: '1px solid #eeece5',
              borderRadius: '18px',
              padding: '28px 22px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#173f34',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              {step.icon}
            </div>

            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                color: '#997125',
                letterSpacing: '0.1em',
                marginBottom: '4px',
              }}
            >
              {step.num}
            </span>

            <h4
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.35rem',
                color: '#17271f',
                margin: '0 0 10px',
              }}
            >
              {step.title}
            </h4>

            <p style={{ fontSize: '0.8125rem', color: '#6e7a76', lineHeight: 1.6, margin: 0 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={onStartJourney} className="btn btn-primary" style={{ padding: '14px 28px' }}>
          Browse Available Rewards
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   7. RewardTiersTab:
   Member -> Prestige -> Legacy progression table
   ========================================================================= */
export const RewardTiersTab: React.FC<{ currentTier: MembershipTier }> = ({ currentTier }) => {
  const tiers = [
    {
      name: 'Member',
      threshold: '0 – 19 Qualifying Nights',
      highlight: currentTier === 'MEMBER',
      perks: [
        'Earn 1 reward night for every qualifying night stayed',
        'Guaranteed Member Direct Booking Discount (10-15% off)',
        'Complimentary high-speed fiber Wi-Fi',
        'Standard flexible cancellation privileges',
      ],
    },
    {
      name: 'Prestige',
      threshold: '20 – 49 Qualifying Nights',
      highlight: currentTier === 'PRESTIGE',
      perks: [
        'All Member privileges included',
        'Complimentary daily artisan breakfast for two',
        'Guaranteed 2:00 PM late check-out',
        'Next-category room upgrade priority upon arrival',
        'Dedicated VIP guest line',
      ],
    },
    {
      name: 'Legacy',
      threshold: '50+ Qualifying Nights',
      highlight: currentTier === 'LEGACY',
      perks: [
        'All Prestige privileges included',
        'Guaranteed Suite Upgrade upon reservation confirmation',
        'Complimentary Rolls-Royce / Luxury Chauffeur Airport Service',
        'Guaranteed 4:00 PM late check-out',
        'Personal Dedicated On-Property Host',
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="evolve-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.4rem', color: '#17271f', marginBottom: '8px' }}>
          Membership Tier Progression
        </h3>
        <p style={{ color: '#6e7a76', fontSize: '0.875rem', marginBottom: '28px' }}>
          Qualifying nights are accumulated through completed stays each calendar year and determine your tier status and elevated hospitality privileges.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              style={{
                backgroundColor: tier.highlight ? '#fcf6eb' : '#faf9f5',
                border: tier.highlight ? '2px solid #dda943' : '1px solid #eeece5',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.35rem',
                      color: '#17271f',
                      margin: 0,
                    }}
                  >
                    {tier.name}
                  </h4>
                  {tier.highlight && (
                    <span
                      style={{
                        backgroundColor: '#dda943',
                        color: '#17271f',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                      }}
                    >
                      CURRENT TIER
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.8125rem', color: '#997125', fontWeight: 700, marginBottom: '16px' }}>
                  {tier.threshold}
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                  {tier.perks.map((perk, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.8125rem',
                        color: '#57534e',
                        lineHeight: 1.5,
                      }}
                    >
                      <Check size={14} color="#17653e" strokeWidth={3} style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
