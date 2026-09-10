export type MembershipTier = 'MEMBER' | 'PRESTIGE' | 'LEGACY';

export interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  cardholderName: string;
  isDefault: boolean;
}

export interface GuestPreferences {
  roomFloor?: 'HIGH' | 'LOW' | 'NO_PREFERENCE';
  bedType?: 'KING' | 'TWIN' | 'NO_PREFERENCE';
  quietRoom: boolean;
  pillowType?: 'FEATHER' | 'FOAM' | 'HYPOALLERGENIC';
  dietaryNotes?: string;
  specialOccasion?: string;
}

export interface MemberProfile {
  memberId: string;
  tier: MembershipTier;
  unusedRewardNights: number; // e.g. 7 unused reward nights available to redeem
  qualifyingNightsThisYear: number; // e.g. 28 qualifying nights earned towards tier
  qualifyingNightsNeededForNextTier: number; // e.g. 22 nights to next tier
  lifetimeQualifyingNights: number; // e.g. 94 lifetime nights
  memberSinceYear: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isMember: boolean;
  memberProfile?: MemberProfile;
  paymentMethods: PaymentMethod[];
  preferences: GuestPreferences;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  city: string;
  country: string;
  address: string;
  heroImage: string;
  gallery: string[];
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  startingRate: number;
  amenities: string[];
  diningOptions: string[];
  checkInTime: string;
  checkOutTime: string;
  featured?: boolean;
}

export interface RoomRate {
  id: string;
  rateType: 'BEST_AVAILABLE' | 'MEMBER_EXCLUSIVE' | 'CORPORATE' | 'MILITARY_GOV';
  title: string;
  description: string;
  nightlyPrice: number;
  cancellationPolicy: {
    isFreeCancellation: boolean;
    deadlineHoursPrior: number;
    penaltyDescription: string;
  };
  includesBreakfast: boolean;
  bonusPoints: number;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  category: 'DELUXE' | 'PREMIUM' | 'SUITE' | 'VILLA';
  description: string;
  maxGuests: number;
  bedConfig: string;
  sizeSqm: number;
  images: string[];
  amenities: string[];
  rates: RoomRate[];
}

export type ReservationStatus = 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';

export interface Reservation {
  id: string;
  confirmationCode: string;
  propertyId: string;
  propertyName: string;
  propertyCity: string;
  propertyImage: string;
  propertyAddress: string;
  roomName: string;
  roomCategory: string;
  checkInDate: string;   // YYYY-MM-DD
  checkOutDate: string;  // YYYY-MM-DD
  nightsCount: number;
  guestsCount: { adults: number; children: number };
  status: ReservationStatus;
  rateType: string;
  nightlyRate: number;
  taxesAndFees: number;
  totalAmount: number;
  currency: string;
  paymentMethod: { brand: string; last4: string };
  assignedRoomNumber?: string;
  cancellationDeadline: string;
  specialRequests?: string;
  guestPhone?: string;
  guestCode?: string;
  userId?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'FREE_NIGHT' | 'DINING' | 'GIFT_CARD' | 'SPA';
  description: string;
  requiredNights: number; // e.g. 5, 9
  buttonLabel: string; // e.g. 'Use free night', 'Use dinner reward', 'Request gift card'
  terms: string;
}

export interface RewardRedemption {
  id: string;
  voucherCode: string;
  rewardTitle: string;
  category: string;
  nightsUsed: number; // e.g. 5, 9
  redeemedAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  propertyApplicable?: string;
}

export type BreakfastCategory = 'CONTINENTAL' | 'HOT_SPECIALS' | 'WELLNESS_BOWLS' | 'BEVERAGES' | 'BAKERY';

export interface BreakfastItem {
  id: string;
  name: string;
  category: BreakfastCategory;
  description: string;
  price: number;
  image: string;
  isIncludedInPackage: boolean;
  dietaryTags: ('VEGAN' | 'VEGETARIAN' | 'GLUTEN_FREE' | 'DAIRY_FREE' | 'NUT_FREE')[];
  prepTimeMinutes: number;
  calories?: number;
}

export interface BreakfastCartItem {
  item: BreakfastItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'RECEIVED' | 'BEING_PREPARED' | 'EN_ROUTE' | 'DELIVERED';

export interface BreakfastOrder {
  id: string;
  orderNumber: string;
  reservationId: string;
  roomNumber: string;
  guestName: string;
  items: { item: BreakfastItem; quantity: number; specialInstructions?: string }[];
  deliverySlot: string;
  status: OrderStatus;
  orderTime: string;
  estimatedDeliveryTime: string;
  totalAmount: number;
  isComplimentary: boolean;
  dietaryNote?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'BILLING' | 'RESERVATION' | 'IN_STAY' | 'MEMBERSHIP' | 'GENERAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  reservationReference?: string;
  messages: {
    id: string;
    sender: 'GUEST' | 'CONCIERGE';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  channel: 'SMS' | 'EMAIL' | 'PUSH';
  category: 'BOOKING' | 'REWARD' | 'IN_STAY' | 'SECURITY';
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
}

export interface SearchCriteria {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  rooms: number;
  rateCategory?: string;
}
