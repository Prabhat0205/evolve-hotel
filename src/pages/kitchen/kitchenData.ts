import { mockBreakfastMenu } from '../../data/mockBreakfast';
import { KitchenOrderRecord, KitchenStaffUser } from './kitchenTypes';

export const kitchenDefaultStaff: KitchenStaffUser = {
  id: 'staff-k-01',
  name: 'Chef Prabhat',
  email: 'prabhat.appzoro@gmail.com',
  role: 'head_chef',
  roleTitle: 'Executive Kitchen Lead',
  station: 'ALL',
};

export const kitchenStaffTeam: KitchenStaffUser[] = [
  kitchenDefaultStaff,
  {
    id: 'staff-k-02',
    name: 'Chef Mateo Vance',
    email: 'mateo.kitchen@evolvehotel.com',
    role: 'line_cook',
    roleTitle: 'Hot Line Lead',
    station: 'HOT_LINE',
  },
  {
    id: 'staff-k-03',
    name: 'Sous Chef Aliyah Noor',
    email: 'aliyah.bakery@evolvehotel.com',
    role: 'pastry_chef',
    roleTitle: 'Bakery & Pastry Chef',
    station: 'COLD_BAKERY',
  },
];

export const initialKitchenOrders: KitchenOrderRecord[] = [
  {
    id: 'kord-101',
    orderNumber: 'BF-7721',
    roomNumber: 'Suite 408',
    guestName: 'Marcus Sterling',
    guestTier: 'Prestige',
    tableOrRoomType: 'Penthouse Heritage Suite',
    deliverySlot: '08:00 AM - 08:30 AM',
    orderPlacedAt: '07:15 AM',
    estimatedDeliveryTime: '08:15 AM',
    status: 'BEING_PREPARED',
    items: [
      {
        id: 'ki-101-1',
        item: mockBreakfastMenu[1], // Truffled Farm Eggs Florentine
        quantity: 1,
        specialInstructions: 'Hollandaise sauce on the side please.',
        station: 'HOT_LINE',
        isPrepared: false,
      },
      {
        id: 'ki-101-2',
        item: mockBreakfastMenu[4], // Pour Over Coffee
        quantity: 2,
        specialInstructions: 'Warm oat milk in small pitcher.',
        station: 'BARISTA',
        isPrepared: true,
      },
      {
        id: 'ki-101-3',
        item: mockBreakfastMenu[3], // Acai Superfood Bowl
        quantity: 1,
        specialInstructions: 'Extra raw almond butter drizzle.',
        station: 'COLD_BAKERY',
        isPrepared: true,
      },
    ],
    dietaryNotes: ['Gluten-conscious', 'Oat milk only'],
    allergies: [],
    specialInstructions: 'Please knock softly, guest on conference call.',
    assignedCook: 'Chef Mateo Vance',
    prepStartedAt: '07:30 AM',
    elapsedMinutes: 14,
    targetMinutes: 20,
    isUrgent: false,
  },
  {
    id: 'kord-102',
    orderNumber: 'BF-7722',
    roomNumber: 'Suite 214',
    guestName: 'Elena Rostova',
    guestTier: 'Gold',
    tableOrRoomType: 'Executive King Courtyard',
    deliverySlot: '08:15 AM - 08:45 AM',
    orderPlacedAt: '07:35 AM',
    estimatedDeliveryTime: '08:25 AM',
    status: 'RECEIVED',
    items: [
      {
        id: 'ki-102-1',
        item: mockBreakfastMenu[2], // Kyoto Uji Matcha Soufflé Pancakes
        quantity: 2,
        specialInstructions: 'Warm maple syrup on side, extra berries.',
        station: 'HOT_LINE',
        isPrepared: false,
      },
      {
        id: 'ki-102-2',
        item: mockBreakfastMenu[5], // Cold-Pressed Green Vitality Elixir
        quantity: 2,
        specialInstructions: 'Extra chilled, no ice cubes.',
        station: 'BARISTA',
        isPrepared: false,
      },
    ],
    dietaryNotes: ['Vegetarian'],
    allergies: ['SHELLFISH ALLERGY (Severe)'],
    specialInstructions: 'VIP welcome amenity breakfast credit applied.',
    elapsedMinutes: 6,
    targetMinutes: 25,
    isUrgent: true,
  },
  {
    id: 'kord-103',
    orderNumber: 'BF-7723',
    roomNumber: 'Villa 12',
    guestName: 'David & Sarah Chen',
    guestTier: 'Prestige',
    tableOrRoomType: 'Private Sanctuary Villa',
    deliverySlot: '08:30 AM - 09:00 AM',
    orderPlacedAt: '07:40 AM',
    estimatedDeliveryTime: '08:40 AM',
    status: 'BEING_PREPARED',
    items: [
      {
        id: 'ki-103-1',
        item: mockBreakfastMenu[0], // Artisan Continental Basket
        quantity: 2,
        specialInstructions: 'Warm croissants, extra berry compote.',
        station: 'COLD_BAKERY',
        isPrepared: true,
      },
      {
        id: 'ki-103-2',
        item: mockBreakfastMenu[1], // Truffled Farm Eggs Florentine
        quantity: 2,
        specialInstructions: 'Eggs medium poached, light truffle.',
        station: 'HOT_LINE',
        isPrepared: false,
      },
      {
        id: 'ki-103-3',
        item: mockBreakfastMenu[4], // Pour Over Coffee
        quantity: 2,
        specialInstructions: 'Black, extra hot.',
        station: 'BARISTA',
        isPrepared: false,
      },
    ],
    dietaryNotes: ['No peanuts'],
    allergies: ['PEANUT ALLERGY'],
    specialInstructions: 'Deliver to private patio dining table.',
    assignedCook: 'Chef Prabhat',
    prepStartedAt: '07:48 AM',
    elapsedMinutes: 18,
    targetMinutes: 20,
    isUrgent: false,
  },
  {
    id: 'kord-104',
    orderNumber: 'BF-7724',
    roomNumber: 'Room 310',
    guestName: 'Siddharth Patel',
    guestTier: 'Silver',
    tableOrRoomType: 'Deluxe Queen Garden View',
    deliverySlot: '07:45 AM - 08:15 AM',
    orderPlacedAt: '07:10 AM',
    estimatedDeliveryTime: '07:55 AM',
    status: 'READY',
    items: [
      {
        id: 'ki-104-1',
        item: mockBreakfastMenu[3], // Organic Acai Bowl
        quantity: 2,
        specialInstructions: 'Double chia seeds, no honey (vegan agave only).',
        station: 'COLD_BAKERY',
        isPrepared: true,
      },
      {
        id: 'ki-104-2',
        item: mockBreakfastMenu[5], // Green Vitality Elixir
        quantity: 2,
        specialInstructions: 'Freshly pressed.',
        station: 'BARISTA',
        isPrepared: true,
      },
    ],
    dietaryNotes: ['Strict Vegan', 'Dairy-Free'],
    allergies: ['DAIRY INTOLERANCE'],
    specialInstructions: 'Silver tier guest - package breakfast voucher.',
    assignedCook: 'Sous Chef Aliyah Noor',
    prepStartedAt: '07:15 AM',
    readyAt: '07:32 AM',
    elapsedMinutes: 24,
    targetMinutes: 15,
    isUrgent: false,
  },
  {
    id: 'kord-105',
    orderNumber: 'BF-7720',
    roomNumber: 'Suite 501',
    guestName: 'Emily Anderson',
    guestTier: 'Prestige',
    tableOrRoomType: 'Presidential Terrace Suite',
    deliverySlot: '07:30 AM - 08:00 AM',
    orderPlacedAt: '06:50 AM',
    estimatedDeliveryTime: '07:35 AM',
    status: 'DELIVERED',
    items: [
      {
        id: 'ki-105-1',
        item: mockBreakfastMenu[0], // Artisan Basket
        quantity: 1,
        station: 'COLD_BAKERY',
        isPrepared: true,
      },
      {
        id: 'ki-105-2',
        item: mockBreakfastMenu[4], // Coffee
        quantity: 1,
        station: 'BARISTA',
        isPrepared: true,
      },
    ],
    dietaryNotes: ['Vegetarian'],
    specialInstructions: 'Confirmed delivered by Butler Team at 07:38 AM.',
    assignedCook: 'Chef Mateo Vance',
    elapsedMinutes: 45,
    targetMinutes: 15,
    isUrgent: false,
  },
  {
    id: 'kord-106',
    orderNumber: 'BF-7725',
    roomNumber: 'Room 105',
    guestName: 'Jordan Taylor',
    guestTier: 'Standard VIP',
    tableOrRoomType: 'Accessible Deluxe King',
    deliverySlot: '08:45 AM - 09:15 AM',
    orderPlacedAt: '07:55 AM',
    estimatedDeliveryTime: '08:50 AM',
    status: 'RECEIVED',
    items: [
      {
        id: 'ki-106-1',
        item: mockBreakfastMenu[1], // Eggs Florentine
        quantity: 1,
        specialInstructions: 'Well done eggs please.',
        station: 'HOT_LINE',
        isPrepared: false,
      },
      {
        id: 'ki-106-2',
        item: mockBreakfastMenu[0], // Artisan Basket
        quantity: 1,
        station: 'COLD_BAKERY',
        isPrepared: false,
      },
      {
        id: 'ki-106-3',
        item: mockBreakfastMenu[4], // Coffee
        quantity: 1,
        station: 'BARISTA',
        isPrepared: false,
      },
    ],
    dietaryNotes: [],
    specialInstructions: 'Room close to elevator.',
    elapsedMinutes: 3,
    targetMinutes: 20,
    isUrgent: false,
  },
];
