import React from 'react';
import { RewardItem, RewardRedemption, MemberProfile, MembershipTier } from '../../types';
import { 
  Sparkles, Check, Clock, ShieldCheck, Gift, UtensilsCrossed, Moon, ArrowRight, Bed, Info,
  Award, ArrowUpRight, ArrowDownRight, BedDouble, Calendar, CheckCircle2 
} from 'lucide-react';
import { defaultMemberRewardTransactions } from '../../data/mockRewards';
import { MemberRewardTransaction } from '../../types/admin';

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
  profile?: MemberProfile;
  onExploreRewards?: () => void;
}> = ({ history, profile }) => {
  const [filter, setFilter] = React.useState<string>('ALL');

  // Merge base verified transactions with any active dynamic redemptions from history that aren't already represented
  const mergedTransactions: MemberRewardTransaction[] = React.useMemo(() => {
    const list: MemberRewardTransaction[] = [...defaultMemberRewardTransactions];
    history.forEach(r => {
      const exists = list.some(tx => tx.stayOrBooking === r.voucherCode || tx.giftogramRefId === r.voucherCode);
      if (!exists) {
        list.unshift({
          id: r.id,
          date: r.redeemedAt || 'Today',
          activity: r.category === 'DINING'
            ? 'Fine Dining Redeemed'
            : r.category === 'GIFT_CARD'
            ? 'Giftgram Redeemed'
            : 'Nights Redeemed',
          stayOrBooking: r.voucherCode,
          points: -r.nightsUsed,
          nights: r.category === 'FREE_NIGHT' ? 1 : undefined,
          status: 'Redeemed',
          notes: r.propertyApplicable ? `Redeemed for ${r.propertyApplicable}` : `${r.rewardTitle} redeemed`
        });
      }
    });
    return list;
  }, [history]);

  const isTransactionCredited = (tx: MemberRewardTransaction) =>
    tx.activity.includes('Credited') || tx.points > 0;

  const isTransactionRedeemed = (tx: MemberRewardTransaction) =>
    tx.activity.includes('Redeem') || tx.points < 0;

  const totalNightsEarned = 125;
  const nightsRedeemed = 40;
  const nightsAvailable = totalNightsEarned - nightsRedeemed;

  const creditedCount = mergedTransactions.filter(isTransactionCredited).length;
  const redeemedCount = mergedTransactions.filter(isTransactionRedeemed).length;
  const freeNightsCount = mergedTransactions.filter(tx => tx.activity.includes('Nights Redeemed')).length;
  const diningCount = mergedTransactions.filter(tx => tx.activity.includes('Dining')).length;
  const giftCardsCount = mergedTransactions.filter(tx => tx.activity.includes('Gift')).length;

  const filteredTransactions = mergedTransactions.filter(tx => {
    if (filter === 'ALL') return true;
    if (filter === 'CREDITED') return isTransactionCredited(tx);
    if (filter === 'REDEEMED') return isTransactionRedeemed(tx);
    if (filter === 'FREE_NIGHT') return tx.activity.includes('Nights Redeemed');
    if (filter === 'DINING') return tx.activity.includes('Dining');
    if (filter === 'GIFT_CARD') return tx.activity.includes('Gift');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      {/* 1. Rewards Summary Cards */}
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
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
            <Award size={14} color="#dda943" /> Tier: {profile?.tier || 'PRESTIGE'}
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

      {/* 2. Rewards Nights History Card & Table */}
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

          <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f6f3ec', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'ALL' ? '#ffffff' : 'transparent',
                color: filter === 'ALL' ? '#17271f' : '#6e7a76',
                boxShadow: filter === 'ALL' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              All ({mergedTransactions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('CREDITED')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'CREDITED' ? '#ffffff' : 'transparent',
                color: filter === 'CREDITED' ? '#17653e' : '#6e7a76',
                boxShadow: filter === 'CREDITED' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Nights Credited ({creditedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('REDEEMED')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'REDEEMED' ? '#ffffff' : 'transparent',
                color: filter === 'REDEEMED' ? '#997125' : '#6e7a76',
                boxShadow: filter === 'REDEEMED' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Nights Redeemed ({redeemedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('FREE_NIGHT')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'FREE_NIGHT' ? '#ffffff' : 'transparent',
                color: filter === 'FREE_NIGHT' ? '#17271f' : '#6e7a76',
                boxShadow: filter === 'FREE_NIGHT' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Free Nights ({freeNightsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('DINING')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'DINING' ? '#ffffff' : 'transparent',
                color: filter === 'DINING' ? '#17271f' : '#6e7a76',
                boxShadow: filter === 'DINING' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Dining ({diningCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('GIFT_CARD')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === 'GIFT_CARD' ? '#ffffff' : 'transparent',
                color: filter === 'GIFT_CARD' ? '#17271f' : '#6e7a76',
                boxShadow: filter === 'GIFT_CARD' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Gift Cards ({giftCardsCount})
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
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: tx.status === 'Credited' ? 'rgba(23, 101, 62, 0.1)' : 'rgba(153, 113, 37, 0.1)',
                        color: tx.status === 'Credited' ? '#17653e' : '#997125'
                      }}>
                        <CheckCircle2 size={12} />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
