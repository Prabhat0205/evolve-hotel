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

export const defaultMemberRewardTransactions = [
  {
    id: 'tx-101',
    date: 'Oct 02, 2026',
    activity: 'Giftgram Redeemed',
    stayOrBooking: 'GG-88210',
    giftogramRefId: 'GG-88210',
    points: -15,
    status: 'Redeemed' as const,
    notes: 'Giftgram e-gift boutique card redemption'
  },
  {
    id: 'tx-102',
    date: 'Sep 30, 2026',
    activity: 'Fine Dining Redeemed',
    stayOrBooking: 'FD-40182',
    points: -15,
    status: 'Redeemed' as const,
    notes: 'Chef tasting dinner experience at Le Jardin'
  },
  {
    id: 'tx-103',
    date: 'Sep 29, 2026',
    activity: 'Nights Redeemed',
    stayOrBooking: 'EV-BK-4019',
    nights: 1,
    points: -10,
    status: 'Redeemed' as const,
    notes: 'Reward nights redeemed for suite stay & room upgrade'
  },
  {
    id: 'tx-104',
    date: 'Sep 28, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-10245',
    nights: 3,
    points: 3,
    status: 'Credited' as const,
    notes: 'Completed 3-night stay at The Grand Manor'
  },
  {
    id: 'tx-105',
    date: 'Sep 15, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-10122',
    nights: 2,
    points: 2,
    status: 'Credited' as const,
    notes: 'Completed 2-night stay at Cliffside Haven'
  },
  {
    id: 'tx-106',
    date: 'Aug 20, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-9821',
    nights: 5,
    points: 5,
    status: 'Credited' as const,
    notes: 'Completed 5-night stay at Alpine Chalet'
  },
  {
    id: 'tx-107',
    date: 'Jul 10, 2026',
    activity: 'Nights Credited',
    stayOrBooking: 'CB-9410',
    nights: 115,
    points: 115,
    status: 'Credited' as const,
    notes: 'Historical verified completed stays'
  }
];

