export type AdminRole = 'property_manager' | 'front_desk';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleTitle: string;
  department: string;
  assignedPropertyId: string;
  assignedPropertyName: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface AdminPropertyItem {
  id: string;
  name: string;
  membersCount: number;
  openCasesCount: number;
  managerName: string;
  status: 'Active' | 'Pre-Launch' | 'Maintenance';
  integrationReadiness: 'Healthy' | 'Credentials required' | 'Offline';
}

export interface DashboardGuestItem {
  id: string;
  customerId?: string;
  name: string;
  phone: string;
  email: string;
  tier: 'Prestige' | 'Origins' | 'Elite';
  joinedDate?: string;
  pointsBalance?: number;
  activeStays?: number;
  rewardNights?: number;
  qualifiedNights?: number;
  cloudbedsReference?: string;
  latestStayText?: string;
  stayHistoryText?: string;
  redemptionHistoryText?: string;
  casesText?: string;
  accountStatus?: 'Active' | 'Inactive';
  commPreferences?: {
    stayMessages: boolean;
    rewardConfirmations: boolean;
    smsMarketing: boolean;
    emailMarketing: boolean;
  };
  totalPointsEarned?: number;
  pointsRedeemed?: number;
  squareId?: string;
  squareSyncStatus?: 'Linked' | 'Pending Sync' | 'Unlinked';
  squareLastSynced?: string;
  rewardTransactions?: MemberRewardTransaction[];
}

export interface MemberRewardTransaction {
  id: string;
  date: string;
  activity: 'Points Credited' | 'Points Redeemed';
  stayOrBooking: string;
  squareRefId?: string;
  giftogramRefId?: string;
  nights?: number;
  points: number;
  status: 'Credited' | 'Redeemed' | 'Pending';
  notes?: string;
}

export interface AuditActivityItem {
  id: string;
  timestamp: string;
  title: string;
  subtitle: string;
  tag: string;
  type: 'stay' | 'gift' | 'account' | 'system';
}

export interface QuickAccessTile {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export interface PhoneGuestUserBooking {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  bookingRef: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  dateRange: string;
  roomType: string;
  suiteNumber: string;
  suitesCount?: number;
  adultsCount: number;
  totalAmount: string;
  status: 'Arriving' | 'In House' | 'Completed' | 'Cancelled';
  hasBreakfastAccess: false; // Guests booking via phone have no breakfast access (room only)
  restaurantStatus: 'Not Checked In' | 'Checked In' | 'Details Captured';
  restaurantCheckInDate?: string;
  tableNumber?: string;
  notes?: string;
}

export interface AdminActiveBooking {
  id: string;
  confirmationCode: string;
  cloudbedsId?: string;
  guestName: string;
  phone: string;
  email: string;
  property: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  roomType: string;
  suitesCount: number;
  pmsStatusText: string;
  status: 'Arriving' | 'Confirmed' | 'In House' | 'Completed' | 'Cancelled';
  totalAmount?: string;
  pmsId?: string;
  suiteNumber?: string;
  adultsCount?: number;
  breakfastOrder?: {
    orderNumber: string;
    pickupTime: string;
    platesCount: number;
    status: 'Not Started' | 'In Preparation' | 'Delivered' | 'Cancelled';
  };
  lastCloudbedsSync?: string;
  bookingSource?: string;
  isGuestUser?: boolean;
  hasBreakfastAccess?: boolean;
  bookingDate?: string;
  restaurantStatus?: 'Not Checked In' | 'Checked In' | 'Details Captured';
  tableNumber?: string;
  notes?: string;
}

export interface GiftCardRequestItem {
  id: string;
  requestCode: string;
  guestName: string;
  guestEmail: string;
  phone?: string;
  tier?: string;
  amount: string;
  pointsRequested: number;
  nightsDeducted?: number;
  requestDate: string;
  statusText?: string;
  status: 'pending' | 'fulfilled';
  providerReference?: string;
  deliveredDate?: string;
  dateProcessed?: string;
  notes?: string;
}

export interface GuestCaseItem {
  id: string;
  caseNumber: string;
  title: string;
  property: string;
  guestName: string;
  description: string;
  priority: 'Normal' | 'High' | 'Urgent';
  assignedRole: string;
  updatedBy: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdDate?: string;
  timelineUpdates?: Array<{
    author: string;
    role: string;
    time: string;
    message: string;
  }>;
}

export interface AutomatedRuleDecisionItem {
  id: string;
  ruleCode: string;
  category: string;
  guestName: string;
  attemptedAction: string;
  rejectionReason: string;
  policyRef: string;
  timestamp: string;
}

export interface RewardsReportEntry {
  id: string;
  date: string;
  guestName: string;
  transactionType: 'Night Credit' | 'Free Night Redemption' | 'Gift Card Issue' | 'Dining Credit';
  amountText: string;
  balanceImpact: string;
  refCode: string;
  status: 'Applied' | 'Deducted';
}

export interface PropertyUserItem {
  id: string;
  employeeId?: string;
  name: string;
  role: 'Property Manager' | 'Front Desk';
  designation?: string;
  property: string;
  email: string;
  phone?: string;
  notes?: string;
  status: 'Active' | 'Inactive';
  twoFactorRequirement: 'Mandatory' | 'Optional';
  recoveryIssuesCount: number;
  lastActive: string;
}
