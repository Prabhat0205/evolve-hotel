import { BreakfastItem, BreakfastOrder } from '../types';

export const mockBreakfastMenu: BreakfastItem[] = [
  {
    id: 'bf-01',
    name: 'Artisan Continental Basket',
    category: 'CONTINENTAL',
    description: 'Freshly baked flaky butter croissants, pain au chocolat, sourdough brioche, seasonal berry compotes, and Normandy cultured butter.',
    price: 32,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    isIncludedInPackage: true,
    dietaryTags: ['VEGETARIAN'],
    prepTimeMinutes: 15,
    calories: 480,
  },
  {
    id: 'bf-02',
    name: 'Truffled Farm Eggs Florentine',
    category: 'HOT_SPECIALS',
    description: 'Free-range poached heritage eggs over wilted baby spinach and toasted brioche, draped in shaved black Périgord truffles and warm hollandaise.',
    price: 38,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80',
    isIncludedInPackage: true,
    dietaryTags: ['VEGETARIAN'],
    prepTimeMinutes: 20,
    calories: 540,
  },
  {
    id: 'bf-03',
    name: 'Kyoto Uji Matcha Soufflé Pancakes',
    category: 'HOT_SPECIALS',
    description: 'Cloud-light fluffy soufflé pancakes infused with first-harvest ceremonial Uji matcha, Hokkaido cream, and sweet red bean paste.',
    price: 34,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    isIncludedInPackage: false,
    dietaryTags: ['VEGETARIAN'],
    prepTimeMinutes: 25,
    calories: 620,
  },
  {
    id: 'bf-04',
    name: 'Organic Acai & Pitaya Superfood Bowl',
    category: 'WELLNESS_BOWLS',
    description: 'Blended organic Amazonian acai and dragonfruit topped with chia seeds, toasted coconut ribbons, goji berries, raw almond butter, and local honeycomb.',
    price: 26,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    isIncludedInPackage: true,
    dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
    prepTimeMinutes: 12,
    calories: 380,
  },
  {
    id: 'bf-05',
    name: 'Single-Origin Pour Over Coffee',
    category: 'BEVERAGES',
    description: 'Geisha varietal light-roasted beans with notes of jasmine, peach, and bergamot, hand-poured bedside.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isIncludedInPackage: true,
    dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
    prepTimeMinutes: 8,
    calories: 5,
  },
  {
    id: 'bf-06',
    name: 'Cold-Pressed Green Vitality Elixir',
    category: 'BEVERAGES',
    description: 'Raw cold-pressed cucumber, celery, Granny Smith apple, kale, ginger root, and Japanese yuzu citrus.',
    price: 16,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    isIncludedInPackage: true,
    dietaryTags: ['VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'],
    prepTimeMinutes: 5,
    calories: 110,
  },
];

export const initialActiveBreakfastOrder: BreakfastOrder = {
  id: 'order-bf-7721',
  orderNumber: 'BF-7721',
  reservationId: 'res-active-01',
  roomNumber: 'Suite 408',
  guestName: 'Marcus Sterling',
  items: [
    {
      item: mockBreakfastMenu[1], // Truffled Farm Eggs Florentine
      quantity: 1,
      specialInstructions: 'Hollandaise sauce on the side please.',
    },
    {
      item: mockBreakfastMenu[4], // Pour Over Coffee
      quantity: 2,
      specialInstructions: 'Warm oat milk.',
    },
    {
      item: mockBreakfastMenu[3], // Acai Superfood Bowl
      quantity: 1,
    },
  ],
  deliverySlot: '08:00 AM - 08:30 AM',
  status: 'BEING_PREPARED',
  orderTime: '07:15 AM',
  estimatedDeliveryTime: '08:15 AM',
  totalAmount: 66,
  isComplimentary: true, // Included in Prestige suite package
  dietaryNote: 'Gluten-conscious, oat milk only',
};
