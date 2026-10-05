export type KitchenTab =
  | 'upcoming'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'all_orders'
  | 'order_history'
  | 'buffet_menu'
  | 'reports'
  | 'settings';

export type KitchenOrderStatus = 'NOT_STARTED' | 'PREPARING' | 'READY' | 'PICKED_UP';

export interface PlateDetail {
  id: string;
  plateNumber: number;
  items: string[];
  specialRequest?: string;
}

export interface KitchenOrderRecord {
  id: string;
  ticketId: string; // e.g. "K-2316"
  roomNumber: string; // e.g. "Room 108"
  guestName: string; // e.g. "Robert Martinez"
  pickupTime: string; // e.g. "7:15 AM"
  platesCount: number;
  plates: PlateDetail[];
  status: KitchenOrderStatus;
  orderDate?: string;
}

export interface BuffetMenuItem {
  id: string;
  category: 'Eggs & Omelettes' | 'Meats & Proteins' | 'Breads & Toast' | 'Sides & Toppings' | 'Beverages & Juices';
  name: string;
  description: string;
  options?: string[];
  isAvailable: boolean;
}

export interface KitchenStaffUser {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
}
