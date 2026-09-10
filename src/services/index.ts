import { 
  User, Property, Room, Reservation, RewardItem, 
  RewardRedemption, BreakfastItem, BreakfastOrder, 
  SupportTicket, NotificationItem, SearchCriteria 
} from '../types';
import { mockProperties, mockRoomsByProperty } from '../data/mockProperties';
import { mockPersonas } from '../data/mockUsers';
import { mockReservations } from '../data/mockStays';
import { mockRewardCatalog, mockRedemptionHistory } from '../data/mockRewards';
import { mockBreakfastMenu, initialActiveBreakfastOrder } from '../data/mockBreakfast';
import { mockSupportTickets } from '../data/mockSupport';
import { mockNotifications } from '../data/mockNotifications';

// Simulates network latency for API readiness
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export interface RegisteredAccount {
  email: string;
  password: string;
  user: User;
}

export const authService = {
  getRegisteredAccounts(): RegisteredAccount[] {
    try {
      const item = localStorage.getItem('evolve_registered_users_v2');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },

  saveRegisteredAccount(account: RegisteredAccount) {
    const accounts = this.getRegisteredAccounts().filter(
      a => a.email.toLowerCase() !== account.email.toLowerCase()
    );
    accounts.push(account);
    try {
      localStorage.setItem('evolve_registered_users_v2', JSON.stringify(accounts));
    } catch {}
  },

  async getCurrentUser(personaKey: string = 'checked_in_guest'): Promise<User> {
    await delay();
    return mockPersonas[personaKey] || mockPersonas.guest;
  },

  async signIn(email: string, password?: string): Promise<{ success: boolean; requires2FA: boolean; user?: User }> {
    await delay(200);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check registered accounts created via SignUp or Upgrade
    const registered = this.getRegisteredAccounts().find(a => a.email.toLowerCase() === cleanEmail);
    if (registered) {
      if (password && registered.password && registered.password !== password) {
        throw new Error('Incorrect password. Please enter the password you created during registration.');
      }
      return { success: true, requires2FA: true, user: registered.user };
    }

    // 2. Check built-in mock personas
    const personaUser = Object.values(mockPersonas).find(p => p.email.toLowerCase() === cleanEmail);
    if (personaUser) {
      return { success: true, requires2FA: true, user: personaUser };
    }

    // 3. New dynamic user (auto-register with provided password)
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: 'Guest',
      lastName: 'Member',
      email: cleanEmail,
      phone: '+1 555-0100',
      isEmailVerified: true,
      isPhoneVerified: false,
      isMember: true,
      memberProfile: {
        memberId: `EV-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: 'MEMBER',
        unusedRewardNights: 0,
        qualifyingNightsThisYear: 0,
        qualifyingNightsNeededForNextTier: 20,
        lifetimeQualifyingNights: 0,
        memberSinceYear: 2026,
      },
      paymentMethods: [],
      preferences: { quietRoom: false },
    };
    this.saveRegisteredAccount({
      email: cleanEmail,
      password: password || 'password123',
      user: newUser
    });
    return { success: true, requires2FA: true, user: newUser };
  },

  async verifyOtp(code: string, user: User): Promise<{ success: boolean; user: User }> {
    await delay(150);
    if (code.length === 6) {
      return { success: true, user };
    }
    throw new Error('Invalid 6-digit verification code');
  },

  async signUp(userData: Partial<User>, joinRewards: boolean, password?: string): Promise<User> {
    await delay(250);
    const cleanEmail = (userData.email || 'guest@example.com').trim().toLowerCase();
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: userData.firstName || 'New',
      lastName: userData.lastName || 'Guest',
      email: cleanEmail,
      phone: userData.phone || '+1 555-0100',
      isEmailVerified: true,
      isPhoneVerified: false,
      isMember: joinRewards,
      memberProfile: joinRewards ? {
        memberId: `EV-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: 'MEMBER',
        unusedRewardNights: 1, // 1 welcome reward night
        qualifyingNightsThisYear: 1,
        qualifyingNightsNeededForNextTier: 19,
        lifetimeQualifyingNights: 1,
        memberSinceYear: 2026,
      } : undefined,
      paymentMethods: [],
      preferences: { quietRoom: false },
    };

    // Store credentials for future logins!
    this.saveRegisteredAccount({
      email: cleanEmail,
      password: password || 'password123',
      user: newUser
    });

    return newUser;
  }
};

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    await delay();
    return mockProperties;
  },

  async getPropertyById(id: string): Promise<Property | undefined> {
    await delay();
    return mockProperties.find(p => p.id === id || p.slug === id);
  },

  async getRooms(propertyId: string): Promise<Room[]> {
    await delay();
    return mockRoomsByProperty[propertyId] || mockRoomsByProperty['evolve-kyoto'];
  },

  async search(criteria: Partial<SearchCriteria>): Promise<Property[]> {
    await delay(150);
    if (!criteria.destination || criteria.destination.trim() === '') {
      return mockProperties;
    }
    const term = criteria.destination.toLowerCase();
    return mockProperties.filter(p => 
      p.city.toLowerCase().includes(term) ||
      p.country.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term)
    );
  }
};

export const staysService = {
  async getReservations(): Promise<Reservation[]> {
    await delay();
    return mockReservations;
  },

  async cancelReservation(resId: string): Promise<{ success: boolean; refundAmount: number; penaltyAmount: number }> {
    await delay(200);
    const res = mockReservations.find(r => r.id === resId);
    if (!res) throw new Error('Reservation not found');
    res.status = 'CANCELLED';
    return {
      success: true,
      refundAmount: res.totalAmount,
      penaltyAmount: 0,
    };
  },

  async modifyDates(resId: string, newCheckIn: string, newCheckOut: string): Promise<Reservation> {
    await delay(200);
    const res = mockReservations.find(r => r.id === resId);
    if (!res) throw new Error('Reservation not found');
    res.checkInDate = newCheckIn;
    res.checkOutDate = newCheckOut;
    return res;
  }
};

export const rewardsService = {
  async getCatalog(): Promise<RewardItem[]> {
    await delay();
    return mockRewardCatalog;
  },

  async getRedemptions(): Promise<RewardRedemption[]> {
    await delay();
    return mockRedemptionHistory;
  },

  async redeemReward(rewardId: string, user: User): Promise<RewardRedemption> {
    await delay(250);
    const item = mockRewardCatalog.find(r => r.id === rewardId);
    if (!item) throw new Error('Reward item not found');
    if (!user.memberProfile || user.memberProfile.unusedRewardNights < item.requiredNights) {
      throw new Error('Not enough reward nights available for this reward');
    }

    user.memberProfile.unusedRewardNights -= item.requiredNights;
    const newRedemption: RewardRedemption = {
      id: `red-${Date.now()}`,
      voucherCode: `EV-${item.category.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      rewardTitle: item.title,
      category: item.category,
      nightsUsed: item.requiredNights,
      redeemedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'ACTIVE',
      propertyApplicable: 'Any Evolve Hotel or Resort',
    };
    mockRedemptionHistory.unshift(newRedemption);
    return newRedemption;
  }
};

export const inStayService = {
  async getMenu(): Promise<BreakfastItem[]> {
    await delay();
    return mockBreakfastMenu;
  },

  async getActiveOrder(): Promise<BreakfastOrder | null> {
    await delay();
    return initialActiveBreakfastOrder;
  },

  async placeOrder(orderData: Partial<BreakfastOrder>): Promise<BreakfastOrder> {
    await delay(300);
    const newOrder: BreakfastOrder = {
      id: `order-bf-${Date.now().toString().slice(-4)}`,
      orderNumber: `BF-${Math.floor(1000 + Math.random() * 9000)}`,
      reservationId: orderData.reservationId || 'res-active-01',
      roomNumber: orderData.roomNumber || 'Suite 408',
      guestName: orderData.guestName || 'Valued Guest',
      items: orderData.items || [],
      deliverySlot: orderData.deliverySlot || '08:30 AM - 09:00 AM',
      status: 'RECEIVED',
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: 'Within 45 mins',
      totalAmount: orderData.totalAmount || 0,
      isComplimentary: orderData.isComplimentary || false,
      dietaryNote: orderData.dietaryNote,
    };
    return newOrder;
  }
};

export const supportService = {
  async getTickets(): Promise<SupportTicket[]> {
    await delay();
    return mockSupportTickets;
  },

  async createTicket(subject: string, category: any, message: string, guestName: string): Promise<SupportTicket> {
    await delay(250);
    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'GUEST',
          senderName: guestName,
          text: message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };
    mockSupportTickets.unshift(newTicket);
    return newTicket;
  }
};

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    await delay();
    return mockNotifications;
  }
};
