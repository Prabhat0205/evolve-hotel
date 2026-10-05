import { BuffetMenuItem, KitchenOrderRecord, KitchenStaffUser } from './kitchenTypes';

export const kitchenDefaultStaff: KitchenStaffUser = {
  id: 'staff-k-01',
  name: 'Chef Prabhat',
  email: 'prabhat.appzoro@gmail.com',
  roleTitle: 'Kitchen Lead',
};

export const kitchenStaffTeam: KitchenStaffUser[] = [
  kitchenDefaultStaff,
  {
    id: 'staff-k-02',
    name: 'Chef Mateo Vance',
    email: 'mateo.kitchen@evolvehotel.com',
    roleTitle: 'Hot Line Cook',
  },
  {
    id: 'staff-k-03',
    name: 'Sous Chef Aliyah',
    email: 'aliyah.bakery@evolvehotel.com',
    roleTitle: 'Pastry & Buffet Lead',
  },
];

export const initialKitchenOrders: KitchenOrderRecord[] = [
  // 1. UPCOMING ORDERS (6 orders · 10 plates) - MATCHING SCREENSHOT EXACTLY
  {
    id: 'kord-108',
    ticketId: 'K-2316',
    roomNumber: 'Room 108',
    guestName: 'Robert Martinez',
    pickupTime: '7:15 AM',
    platesCount: 1,
    status: 'NOT_STARTED',
    plates: [
      {
        id: 'p-108-1',
        plateNumber: 1,
        items: [
          '2 eggs — over easy',
          'No toppings',
          'Turkey sausage',
        ],
        specialRequest: 'Gluten-free toast',
      },
    ],
  },
  {
    id: 'kord-215',
    ticketId: 'K-2317',
    roomNumber: 'Room 215',
    guestName: 'Emily Anderson',
    pickupTime: '7:15 AM',
    platesCount: 2,
    status: 'NOT_STARTED',
    plates: [
      {
        id: 'p-215-1',
        plateNumber: 1,
        items: ['3 scrambled eggs', 'Aged cheddar', 'Applewood bacon'],
        specialRequest: 'Well-done bacon',
      },
      {
        id: 'p-215-2',
        plateNumber: 2,
        items: ['Fluffy buttermilk pancakes', 'Warm maple syrup', 'Whipped butter'],
      },
    ],
  },
  {
    id: 'kord-302',
    ticketId: 'K-2318',
    roomNumber: 'Room 302',
    guestName: 'Sarah Thompson',
    pickupTime: '7:30 AM',
    platesCount: 1,
    status: 'NOT_STARTED',
    plates: [
      {
        id: 'p-302-1',
        plateNumber: 1,
        items: ['2 poached eggs', 'Avocado sourdough toast', 'Campari tomatoes'],
        specialRequest: 'Extra virgin olive oil drizzle on side',
      },
    ],
  },
  {
    id: 'kord-317',
    ticketId: 'K-2319',
    roomNumber: 'Room 317',
    guestName: 'Michael Davis',
    pickupTime: '7:30 AM',
    platesCount: 2,
    status: 'NOT_STARTED',
    plates: [
      {
        id: 'p-317-1',
        plateNumber: 1,
        items: ['Eggs Benedict', 'Canadian bacon', 'Hollandaise sauce'],
      },
      {
        id: 'p-317-2',
        plateNumber: 2,
        items: ['Brioche French toast', 'Fresh mixed berries', 'Turkey sausage'],
      },
    ],
  },
  {
    id: 'kord-204',
    ticketId: 'K-2320',
    roomNumber: 'Room 204',
    guestName: 'Jessica Wilson',
    pickupTime: '7:45 AM',
    platesCount: 2,
    status: 'NOT_STARTED',
    plates: [
      {
        id: 'p-204-1',
        plateNumber: 1,
        items: ['2 sunny side up eggs', 'Chicken sausage', 'Crisp hash browns'],
      },
      {
        id: 'p-204-2',
        plateNumber: 2,
        items: ['Sourdough toast', 'Strawberry preserves', 'Seasonal fruit bowl'],
      },
    ],
  },
  {
    id: 'kord-214',
    ticketId: 'K-2321',
    roomNumber: 'Room 214',
    guestName: 'John Parker',
    pickupTime: '8:15 AM',
    platesCount: 2,
    status: 'NOT_STARTED',
    plates: [
      {
        id: 'p-214-1',
        plateNumber: 1,
        items: ['3-egg garden omelette', 'Baby spinach & mushrooms', 'Feta cheese'],
      },
      {
        id: 'p-214-2',
        plateNumber: 2,
        items: ['Steel cut oatmeal', 'Honey drizzle', 'Toasted pecans'],
        specialRequest: 'Almond milk on side',
      },
    ],
  },

  // 2. PREPARING ORDERS (2 orders · 3 plates)
  {
    id: 'kord-408',
    ticketId: 'K-2314',
    roomNumber: 'Room 408',
    guestName: 'Marcus Sterling',
    pickupTime: '7:00 AM',
    platesCount: 2,
    status: 'PREPARING',
    plates: [
      {
        id: 'p-408-1',
        plateNumber: 1,
        items: ['Truffled eggs Florentine', 'Sautéed spinach', 'Mornay glaze'],
      },
      {
        id: 'p-408-2',
        plateNumber: 2,
        items: ['Smoked salmon platter', 'Mini bagels', 'Cream cheese & capers'],
      },
    ],
  },
  {
    id: 'kord-112',
    ticketId: 'K-2315',
    roomNumber: 'Room 112',
    guestName: 'Amanda Brooks',
    pickupTime: '7:00 AM',
    platesCount: 1,
    status: 'PREPARING',
    plates: [
      {
        id: 'p-112-1',
        plateNumber: 1,
        items: ['2 poached eggs', 'Crisp bacon', 'Multigrain toast'],
        specialRequest: 'No butter on toast',
      },
    ],
  },

  // 3. PICKED UP ORDERS (1 order · 2 plates)
  {
    id: 'kord-501',
    ticketId: 'K-2312',
    roomNumber: 'Room 501',
    guestName: 'David Chen',
    pickupTime: '6:45 AM',
    platesCount: 2,
    status: 'PICKED_UP',
    plates: [
      {
        id: 'p-501-1',
        plateNumber: 1,
        items: ['Scrambled egg whites', 'Turkey sausage', 'Steamed spinach'],
      },
      {
        id: 'p-501-2',
        plateNumber: 2,
        items: ['Belgian waffle', 'Pure maple syrup', 'Fresh berries'],
      },
    ],
  },
];

export const initialBuffetMenu: BuffetMenuItem[] = [
  {
    id: 'bf-m-01',
    category: 'Eggs & Omelettes',
    name: 'Farm Fresh Eggs (Cooked to Order)',
    description: 'Two organic farm eggs prepared to your choice: over easy, sunny side up, poached, or scrambled.',
    options: ['Over Easy', 'Sunny Side Up', 'Scrambled', 'Poached', 'Egg Whites Only'],
    isAvailable: true,
  },
  {
    id: 'bf-m-02',
    category: 'Eggs & Omelettes',
    name: 'Custom Breakfast Omelette',
    description: 'Three-egg folded omelette with choice of aged cheddar, baby spinach, forest mushrooms, and bell peppers.',
    options: ['Cheddar Cheese', 'Baby Spinach', 'Sautéed Mushrooms', 'Diced Ham', 'Tomatoes'],
    isAvailable: true,
  },
  {
    id: 'bf-m-03',
    category: 'Eggs & Omelettes',
    name: 'Classic Eggs Benedict',
    description: 'Poached eggs on toasted English muffin with Canadian bacon and creamy hollandaise.',
    isAvailable: true,
  },
  {
    id: 'bf-m-04',
    category: 'Meats & Proteins',
    name: 'Turkey Sausage Links',
    description: 'Lean and savory oven-roasted turkey sausage links.',
    isAvailable: true,
  },
  {
    id: 'bf-m-05',
    category: 'Meats & Proteins',
    name: 'Applewood Smoked Bacon',
    description: 'Thick cut, crispy smoked pork bacon strips.',
    isAvailable: true,
  },
  {
    id: 'bf-m-06',
    category: 'Meats & Proteins',
    name: 'Grilled Plant-Based Sausage',
    description: 'Savory vegan breakfast sausage patty seasoned with sage and black pepper.',
    isAvailable: true,
  },
  {
    id: 'bf-m-07',
    category: 'Breads & Toast',
    name: 'Artisan Sourdough Toast',
    description: 'Naturally leavened sourdough bread toasted with butter and jam.',
    options: ['Sourdough', 'Whole Grain', 'English Muffin', 'Gluten-Free Toast'],
    isAvailable: true,
  },
  {
    id: 'bf-m-08',
    category: 'Breads & Toast',
    name: 'Golden Buttermilk Pancakes',
    description: 'Fluffy stack served with 100% Vermont maple syrup and whipped cream.',
    isAvailable: true,
  },
  {
    id: 'bf-m-09',
    category: 'Breads & Toast',
    name: 'Brioche French Toast',
    description: 'Cinnamon-soaked brioche served with fresh berries and powdered sugar.',
    isAvailable: true,
  },
  {
    id: 'bf-m-10',
    category: 'Sides & Toppings',
    name: 'Crisp Herb Hash Browns',
    description: 'Golden fried shredded Idaho potatoes seasoned with sea salt and rosemary.',
    isAvailable: true,
  },
  {
    id: 'bf-m-11',
    category: 'Sides & Toppings',
    name: 'Sliced Hass Avocado',
    description: 'Fresh ripe avocado slices with flaky sea salt and lemon zest.',
    isAvailable: true,
  },
  {
    id: 'bf-m-12',
    category: 'Sides & Toppings',
    name: 'Seasonal Fruit & Berry Bowl',
    description: 'Chilled melon, pineapple, blackberries, blueberries, and fresh mint.',
    isAvailable: true,
  },
  {
    id: 'bf-m-13',
    category: 'Beverages & Juices',
    name: 'Fresh Squeezed Orange Juice',
    description: 'Cold-pressed Florida oranges with natural pulp.',
    isAvailable: true,
  },
  {
    id: 'bf-m-14',
    category: 'Beverages & Juices',
    name: 'Artisan Drip Coffee & Espresso',
    description: 'Locally roasted Colombian single-origin coffee or double espresso.',
    options: ['Whole Milk', 'Oat Milk', 'Almond Milk', 'Black'],
    isAvailable: true,
  },
];
