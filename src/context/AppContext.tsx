import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  User, Property, Room, RoomRate, Reservation, 
  BreakfastItem, BreakfastOrder, NotificationItem,
  BreakfastCartItem 
} from '../types';
import { mockPersonas } from '../data/mockUsers';
import { mockProperties } from '../data/mockProperties';
import { mockReservations, mockReservations as initialMockReservations } from '../data/mockStays';
import { initialActiveBreakfastOrder } from '../data/mockBreakfast';
import { mockNotifications } from '../data/mockNotifications';
import { authService } from '../services';

export type AppRoute = 
  | 'landing' 
  | 'search' 
  | 'property-detail' 
  | 'checkout' 
  | 'confirmation' 
  | 'stays' 
  | 'membership' 
  | 'rewards-catalog'
  | 'in-stay-breakfast' 
  | 'profile' 
  | 'support'
  | 'corporate-booking';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute, params?: any) => void;
  routeParams: any;

  // Authentication & Persona
  currentUser: User | null;
  currentPersona: string;
  switchPersona: (personaKey: string) => void;
  loginUser: (user: User) => void;
  signOut: () => void;
  loginAs: (personaKey?: string) => void;
  isMember: boolean;
  activeStay: Reservation | null;

  // Booking Flow State
  selectedProperty: Property;
  setSelectedProperty: (prop: Property) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  selectedRate: RoomRate | null;
  setSelectedRate: (rate: RoomRate | null) => void;
  searchDates: { checkIn: string; checkOut: string; adults: number; children: number; destination: string };
  setSearchDates: React.Dispatch<React.SetStateAction<{ checkIn: string; checkOut: string; adults: number; children: number; destination: string }>>;
  lastConfirmedReservation: Reservation | null;
  setLastConfirmedReservation: (res: Reservation | null) => void;

  // Stays
  reservations: Reservation[];
  cancelReservation: (id: string) => void;
  addReservation: (res: Reservation) => void;

  // In-Stay & Breakfast
  breakfastCart: BreakfastCartItem[];
  addToBreakfastCart: (item: BreakfastItem, quantity?: number, instructions?: string) => void;
  removeFromBreakfastCart: (itemId: string) => void;
  clearBreakfastCart: () => void;
  activeBreakfastOrder: BreakfastOrder | null;
  setActiveBreakfastOrder: React.Dispatch<React.SetStateAction<BreakfastOrder | null>>;
  advanceBreakfastStatus: () => void;

  // Auth Modal
  authModal: { isOpen: boolean; mode: 'signin' | 'signup' | 'otp' | 'recovery' | 'guest_login' | 'convert_to_member' };
  openAuthModal: (mode?: 'signin' | 'signup' | 'otp' | 'recovery' | 'guest_login' | 'convert_to_member') => void;
  closeAuthModal: () => void;

  // Feedback Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotifAsRead: (id: string) => void;

  activeGuestCode: string | null;
  activeGuestPhone: string | null;
  guestCode?: string | null;
  loginAsGuest: (guestCode: string, phone: string) => void;
  convertToMember: (firstName: string, lastName: string, email: string, password?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helpers for normalized matching
export const normalizePhone = (phone?: string | null): string => {
  if (!phone) return '';
  return phone.replace(/\D/g, '').slice(-10);
};

export const normalizeGuestCode = (code?: string | null): string => {
  if (!code) return '';
  return code.trim().toUpperCase();
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // LocalStorage Helper
  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // Navigation state
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  const [routeParams, setRouteParams] = useState<any>({});

  // Persona & User state: Default to unauthenticated visitor for landing page!
  const [currentPersona, setCurrentPersona] = useState<string>(() => loadFromStorage('evolve_currentPersona_v2', 'visitor'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('evolve_currentUser_v2', null));

  // Booking state
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRate, setSelectedRate] = useState<RoomRate | null>(null);
  const [searchDates, setSearchDates] = useState({
    checkIn: '2026-10-14',
    checkOut: '2026-10-18',
    adults: 2,
    children: 0,
    destination: 'Kyoto, Japan',
  });
  const [lastConfirmedReservation, setLastConfirmedReservation] = useState<Reservation | null>(() => loadFromStorage('evolve_lastConfirmedReservation_v2', null));

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const loaded = loadFromStorage<Reservation[] | null>('evolve_reservations_v2', null);
    if (loaded && Array.isArray(loaded) && loaded.length > 0) {
      return loaded;
    }
    // Seed fallback reservations immediately to storage
    try {
      localStorage.setItem('evolve_reservations_v2', JSON.stringify(initialMockReservations));
    } catch {}
    return initialMockReservations;
  });

  // In-Stay Breakfast state
  const [breakfastCart, setBreakfastCart] = useState<BreakfastCartItem[]>([]);
  const [activeBreakfastOrder, setActiveBreakfastOrder] = useState<BreakfastOrder | null>(initialActiveBreakfastOrder);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Auth Modal
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' | 'otp' | 'recovery' | 'guest_login' | 'convert_to_member' }>({
    isOpen: false,
    mode: 'signin',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Guest Session State
  const [activeGuestCode, setActiveGuestCode] = useState<string | null>(() => loadFromStorage('evolve_activeGuestCode_v2', null));
  const [activeGuestPhone, setActiveGuestPhone] = useState<string | null>(() => loadFromStorage('evolve_activeGuestPhone_v2', null));

  // Real-time synchronization across tabs via window storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'evolve_reservations_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReservations(parsed);
          }
        } catch (err) {
          console.error('Storage sync error (reservations):', err);
        }
      }
      if (e.key === 'evolve_currentUser_v2') {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
      if (e.key === 'evolve_currentPersona_v2') {
        setCurrentPersona(e.newValue || 'visitor');
      }
      if (e.key === 'evolve_activeGuestCode_v2') {
        try {
          setActiveGuestCode(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
      if (e.key === 'evolve_activeGuestPhone_v2') {
        try {
          setActiveGuestPhone(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
      if (e.key === 'evolve_lastConfirmedReservation_v2') {
        try {
          setLastConfirmedReservation(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Synchronization with LocalStorage on state changes
  useEffect(() => {
    localStorage.setItem('evolve_reservations_v2', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('evolve_currentUser_v2', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('evolve_currentPersona_v2', currentPersona);
  }, [currentPersona]);

  useEffect(() => {
    localStorage.setItem('evolve_activeGuestCode_v2', JSON.stringify(activeGuestCode));
  }, [activeGuestCode]);

  useEffect(() => {
    localStorage.setItem('evolve_activeGuestPhone_v2', JSON.stringify(activeGuestPhone));
  }, [activeGuestPhone]);

  useEffect(() => {
    localStorage.setItem('evolve_lastConfirmedReservation_v2', JSON.stringify(lastConfirmedReservation));
  }, [lastConfirmedReservation]);

  // Navigation helper
  const navigateTo = (route: AppRoute, params: any = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    setCurrentPersona('authenticated');
    setActiveGuestCode(null);
    setActiveGuestPhone(null);
    addToast(
      'success',
      'Welcome',
      `Signed in successfully`
    );
  };

  // Sign out helper
  const signOut = () => {
    setCurrentUser(null);
    setCurrentPersona('visitor');
    setActiveGuestCode(null);
    setActiveGuestPhone(null);
    addToast('info', 'Signed Out', 'You have been safely signed out. Browsing as visitor.');
  };

  // Login as specific persona
  const loginAs = (personaKey: string = 'member_prestige') => {
    const user = mockPersonas[personaKey] || mockPersonas['member_prestige'];
    setCurrentUser(user);
    setCurrentPersona(personaKey);
    setActiveGuestCode(null);
    setActiveGuestPhone(null);
    addToast(
      'success',
      'Welcome to Evolve',
      `Signed in as ${user.firstName} ${user.lastName} (${user.memberProfile?.tier || 'Classic'} Member)`
    );
  };

  // Switch persona handler
  const switchPersona = (personaKey: string) => {
    setCurrentPersona(personaKey);
    if (personaKey === 'visitor' || personaKey === 'guest_unauthenticated') {
      setCurrentUser(null);
      setActiveGuestCode(null);
      setActiveGuestPhone(null);
      return;
    }
    const user = mockPersonas[personaKey];
    if (user) {
      setCurrentUser(user);
      setActiveGuestCode(null);
      setActiveGuestPhone(null);
      addToast(
        'info',
        'Signed In',
        `Signed in as: ${user.firstName} ${user.lastName} (${user.isMember ? `${user.memberProfile?.tier} Member` : 'Standard Guest'})`
      );
    }
  };

  // Guest Login Logic
  const loginAsGuest = (guestCode: string, phone: string) => {
    const cleanCode = normalizeGuestCode(guestCode);
    const cleanPhone = normalizePhone(phone);

    // Look up reservation matching this phone number and guest code
    const matchingReservation = reservations.find(r => {
      const codeMatch = normalizeGuestCode(r.guestCode) === cleanCode;
      const phoneMatch = normalizePhone(r.guestPhone) === cleanPhone;
      return codeMatch && phoneMatch;
    });
    
    if (!matchingReservation) {
      addToast('error', 'Login Failed', 'Invalid guest code or phone number. Please check your confirmation.');
      return;
    }

    // Check if checkOutDate is passed
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkout = new Date(matchingReservation.checkOutDate);
    
    if (checkout < today) {
      addToast('error', 'Access Expired', 'This reservation has completed. Please create a member account or make a new booking.');
      return;
    }

    setActiveGuestCode(cleanCode);
    setActiveGuestPhone(matchingReservation.guestPhone || phone);
    setCurrentUser(null);
    setCurrentPersona('guest');
    addToast('success', 'Guest Session Active', `Welcome back. Viewing reservations for Guest ${cleanCode}`);
    closeAuthModal();
    navigateTo('stays');
  };

  // Convert to Member Logic
  const convertToMember = async (firstName: string, lastName: string, email: string, password?: string) => {
    if (!activeGuestPhone && !activeGuestCode) {
      addToast('error', 'Error', 'No active guest session found.');
      return;
    }
    
    const newUser: User = {
      id: `member-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone: activeGuestPhone || '+1 (555) 000-0000',
      isEmailVerified: false,
      isPhoneVerified: true, // Phone was already verified via guest flow conceptually
      isMember: true,
      memberProfile: {
        memberId: `EV-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: 'MEMBER',
        unusedRewardNights: 0,
        qualifyingNightsThisYear: 0,
        qualifyingNightsNeededForNextTier: 20,
        lifetimeQualifyingNights: 0,
        memberSinceYear: new Date().getFullYear(),
      },
      paymentMethods: [],
      preferences: { quietRoom: true }
    };
    
    // Save account credentials for future logins!
    authService.saveRegisteredAccount({
      email: email.trim().toLowerCase(),
      password: password || 'password123',
      user: newUser
    });
    
    const cleanCode = normalizeGuestCode(activeGuestCode);
    const cleanPhone = normalizePhone(activeGuestPhone);

    // Transfer matching guest reservations to new member
    setReservations(prev => {
      const updated = prev.map(res => {
        const codeMatches = cleanCode && normalizeGuestCode(res.guestCode) === cleanCode;
        const phoneMatches = cleanPhone && normalizePhone(res.guestPhone) === cleanPhone;
        if (codeMatches || phoneMatches) {
          return { ...res, userId: newUser.id, guestCode: undefined, guestPhone: undefined };
        }
        return res;
      });
      localStorage.setItem('evolve_reservations_v2', JSON.stringify(updated));
      return updated;
    });

    loginUser(newUser);
    closeAuthModal();
    addToast('success', 'Account Upgraded', `Welcome to Evolve Rewards, ${firstName}! Your guest stays are now linked to your member account.`);
    navigateTo('membership');
  };

  // Dynamic Active Stay
  const activeStay = (currentUser && currentPersona === 'checked_in_guest')
    ? (reservations.find(r => r.status === 'CHECKED_IN') || null)
    : null;

  const isMember = currentUser ? currentUser.isMember : false;

  // Add toast helper
  const addToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth modal helpers
  const openAuthModal = (mode: 'signin' | 'signup' | 'otp' | 'recovery' | 'guest_login' | 'convert_to_member' = 'signin') => {
    setAuthModal({ isOpen: true, mode });
  };
  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  // Cancel reservation helper
  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
    addToast('success', 'Reservation Cancelled', 'Refund processed according to hotel cancellation policy.');
  };

  const addReservation = (res: Reservation) => {
    setReservations(prev => [res, ...prev]);
  };

  // Breakfast cart helpers
  const addToBreakfastCart = (item: BreakfastItem, quantity: number = 1, instructions?: string) => {
    setBreakfastCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { item, quantity, specialInstructions: instructions }];
    });
    addToast('success', 'Added to Breakfast Order', `${item.name} added to room service cart.`);
  };

  const removeFromBreakfastCart = (itemId: string) => {
    setBreakfastCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const clearBreakfastCart = () => {
    setBreakfastCart([]);
  };

  // Advance breakfast pipeline: RECEIVED -> BEING_PREPARED -> EN_ROUTE -> DELIVERED
  const advanceBreakfastStatus = () => {
    if (!activeBreakfastOrder) return;
    const stages: BreakfastOrder['status'][] = ['RECEIVED', 'BEING_PREPARED', 'EN_ROUTE', 'DELIVERED'];
    const currentIndex = stages.indexOf(activeBreakfastOrder.status);
    const nextIndex = (currentIndex + 1) % stages.length;
    const nextStatus = stages[nextIndex];
    setActiveBreakfastOrder(prev => prev ? { ...prev, status: nextStatus } : null);
    addToast('info', 'Breakfast Order Updated', `Status changed to: ${nextStatus.replace('_', ' ')}`);
  };

  // Notification helpers
  const markNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      currentRoute,
      navigateTo,
      routeParams,
      currentUser,
      currentPersona,
      switchPersona,
      loginUser,
      signOut,
      loginAs,
      isMember,
      activeStay,
      selectedProperty,
      setSelectedProperty,
      selectedRoom,
      setSelectedRoom,
      selectedRate,
      setSelectedRate,
      searchDates,
      setSearchDates,
      lastConfirmedReservation,
      setLastConfirmedReservation,
      reservations,
      cancelReservation,
      addReservation,
      breakfastCart,
      addToBreakfastCart,
      removeFromBreakfastCart,
      clearBreakfastCart,
      activeBreakfastOrder,
      setActiveBreakfastOrder,
      advanceBreakfastStatus,
      authModal,
      openAuthModal,
      closeAuthModal,
      toasts,
      addToast,
      removeToast,
      notifications,
      unreadNotifsCount,
      markNotifAsRead,
      activeGuestCode,
      activeGuestPhone,
      loginAsGuest,
      convertToMember,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
