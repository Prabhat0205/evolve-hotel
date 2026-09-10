import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockRewardCatalog, mockRedemptionHistory } from '../data/mockRewards';
import { RewardItem, RewardRedemption } from '../types';
import { 
  RewardBalanceCard, 
  RewardTabs, 
  RewardTabKey, 
  RewardCard, 
  RedemptionModal, 
  RedemptionHistoryTab, 
  HowItWorksTab, 
  RewardTiersTab 
} from '../components/rewards/RewardComponents';
import { rewardsService } from '../services';

export const RewardsCatalogPage: React.FC = () => {
  const { currentUser, addToast } = useApp();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<RewardTabKey>('AVAILABLE');

  // Selected reward for redemption modal
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);

  // Redemption history state
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>(mockRedemptionHistory);

  // Profile data
  const profile = currentUser?.memberProfile || {
    memberId: 'EV-319084',
    tier: 'PRESTIGE',
    unusedRewardNights: 7,
    qualifyingNightsThisYear: 28,
    qualifyingNightsNeededForNextTier: 22,
    lifetimeQualifyingNights: 94,
    memberSinceYear: 2022,
  };

  const handleOpenRedeem = (reward: RewardItem) => {
    setSelectedReward(reward);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;

    if (profile.unusedRewardNights < selectedReward.requiredNights) {
      addToast('error', 'Not Enough Nights', `You need ${selectedReward.requiredNights - profile.unusedRewardNights} more reward nights.`);
      return;
    }

    setIsRedeeming(true);
    try {
      const activeUser = currentUser || { id: 'guest', firstName: 'Guest', lastName: 'Visitor', email: 'guest@evolve.com', phone: '', isEmailVerified: false, isPhoneVerified: false, isMember: false, paymentMethods: [], preferences: { quietRoom: true } };
      const newRedemption = await rewardsService.redeemReward(selectedReward.id, activeUser);
      setRedemptions([newRedemption, ...redemptions]);
      setIsRedeeming(false);
      setSelectedReward(null);
      addToast(
        'success',
        'Reward Redeemed Successfully!',
        `${selectedReward.title} confirmed. Voucher code ${newRedemption.voucherCode} issued.`
      );
    } catch (err: any) {
      setIsRedeeming(false);
      addToast('error', 'Redemption Error', err.message || 'Unable to complete redemption.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div className="app-container-wide">
        
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.4rem, 4.5vw, 3.25rem)',
                fontWeight: 600,
                color: '#17271f',
                lineHeight: 1.15,
                margin: '0 0 14px',
                letterSpacing: '-0.02em',
              }}
            >
              My Rewards
            </h1>

            <div style={{ fontSize: '1.05rem', color: '#17271f', lineHeight: 1.5 }}>
              <strong>One shared balance. Three real rewards.</strong>
              <div style={{ color: '#6e7a76', marginTop: '4px', fontSize: '0.9375rem' }}>
                Choose a Free Night, Fine Dining Experience, or $70 Gift Card—no points or complicated calculations.
              </div>
            </div>
          </div>

          <RewardBalanceCard profile={profile} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <RewardTabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            redemptionCount={redemptions.length}
          />
        </div>

        {activeTab === 'AVAILABLE' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {mockRewardCatalog.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userNights={profile.unusedRewardNights}
                  onRedeem={handleOpenRedeem}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: '32px',
                padding: '16px 20px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #eeece5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '0.8125rem',
                color: '#6e7a76',
              }}
            >
              <div>
                Reward nights are earned automatically upon check-out of eligible stays. Current membership tier: <strong style={{ color: '#173f34' }}>{profile.tier}</strong>.
              </div>
              <button
                onClick={() => setActiveTab('HOW_IT_WORKS')}
                style={{
                  color: '#173f34',
                  fontWeight: 700,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                }}
              >
                Learn how reward nights work →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <RedemptionHistoryTab
            history={redemptions}
            onExploreRewards={() => setActiveTab('AVAILABLE')}
          />
        )}

        {activeTab === 'HOW_IT_WORKS' && (
          <HowItWorksTab onStartJourney={() => setActiveTab('AVAILABLE')} />
        )}

        {activeTab === 'TIERS' && (
          <RewardTiersTab currentTier={profile.tier as any} />
        )}

        {selectedReward && (
          <RedemptionModal
            reward={selectedReward}
            currentBalance={profile.unusedRewardNights}
            onConfirm={handleConfirmRedeem}
            onCancel={() => setSelectedReward(null)}
            isRedeeming={isRedeeming}
          />
        )}
      </div>
    </div>
  );
};
