import { RewardItem, RewardRedemption } from '../types';

export const mockRewardCatalog: RewardItem[] = [
  {
    id: 'reward-free-night',
    title: 'Free Night',
    category: 'FREE_NIGHT',
    description: 'Apply one eligible free night to a direct reservation.',
    requiredNights: 9,
    buttonLabel: 'Use free night',
    terms: 'Valid for one standard or deluxe room night at any Evolve Hotel or Resort globally. Subject to reservation availability.',
  },
  {
    id: 'reward-fine-dining',
    title: 'Free Fine Dining Experience',
    category: 'DINING',
    description: 'One applicable restaurant menu item through the guest profile.',
    requiredNights: 5,
    buttonLabel: 'Use dinner reward',
    terms: 'Applicable towards a multi-course dinner tasting or signature culinary experience at any Evolve restaurant.',
  },
  {
    id: 'reward-gift-card',
    title: '$70 Gift Card',
    category: 'GIFT_CARD',
    description: 'Receive a digital gift card using your available Reward Nights.',
    requiredNights: 9,
    buttonLabel: 'Request gift card',
    terms: 'Predefined digital gift card delivered to your verified member email. Redeemable for future accommodations or hotel dining folios.',
  },
];

export const mockRedemptionHistory: RewardRedemption[] = [
  {
    id: 'red-01',
    voucherCode: 'EV-DINE-4418',
    rewardTitle: 'Free Fine Dining Experience',
    category: 'DINING',
    nightsUsed: 5,
    redeemedAt: 'August 20, 2026',
    expiresAt: 'August 20, 2027',
    status: 'ACTIVE',
    propertyApplicable: 'The Evolve Grand Palace Kyoto',
  },
  {
    id: 'red-02',
    voucherCode: 'EV-NIGHT-9921',
    rewardTitle: 'Free Night',
    category: 'FREE_NIGHT',
    nightsUsed: 9,
    redeemedAt: 'May 12, 2026',
    expiresAt: 'May 12, 2027',
    status: 'USED',
    propertyApplicable: 'The Evolve Metropolis Manhattan',
  },
  {
    id: 'red-03',
    voucherCode: 'GFT-2194',
    rewardTitle: '$70 Gift Card',
    category: 'GIFT_CARD',
    nightsUsed: 9,
    redeemedAt: 'March 21, 2026',
    expiresAt: 'March 21, 2027',
    status: 'USED',
  },
];
