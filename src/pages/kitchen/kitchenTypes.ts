import { BreakfastItem, OrderStatus } from '../../types';

export type KitchenStation = 'ALL' | 'HOT_LINE' | 'COLD_BAKERY' | 'BARISTA';

export type KitchenTab = 'live_kds' | 'orders_queue' | 'stations' | 'inventory_86' | 'delivered_archive';

export type KitchenOrderStatus = 'RECEIVED' | 'BEING_PREPARED' | 'READY' | 'EN_ROUTE' | 'DELIVERED';

export interface KitchenOrderItemDetail {
  id: string;
  item: BreakfastItem;
  quantity: number;
  specialInstructions?: string;
  station: KitchenStation;
  isPrepared?: boolean;
}

export interface KitchenOrderRecord {
  id: string;
  orderNumber: string;
  roomNumber: string;
  guestName: string;
  guestTier?: 'Prestige' | 'Gold' | 'Silver' | 'Standard VIP';
  deliverySlot: string; // e.g. "08:00 AM - 08:30 AM"
  orderPlacedAt: string; // e.g. "07:15 AM"
  estimatedDeliveryTime: string;
  status: KitchenOrderStatus;
  items: KitchenOrderItemDetail[];
  dietaryNotes?: string[];
  allergies?: string[];
  specialInstructions?: string;
  assignedCook?: string;
  prepStartedAt?: string;
  readyAt?: string;
  elapsedMinutes: number;
  targetMinutes: number;
  isUrgent?: boolean;
  tableOrRoomType?: string;
}

export interface KitchenStaffUser {
  id: string;
  name: string;
  email: string;
  role: 'head_chef' | 'line_cook' | 'pastry_chef' | 'station_lead';
  roleTitle: string;
  avatarUrl?: string;
  station: KitchenStation;
}

export interface KitchenShiftStats {
  totalActive: number;
  pendingQueue: number;
  cookingNow: number;
  readyForPickup: number;
  deliveredToday: number;
  avgPrepMinutes: number;
}
