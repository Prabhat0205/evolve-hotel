import { NotificationItem } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Breakfast Being Prepared',
    message: 'Executive Kitchen has commenced preparation of your Truffled Farm Eggs Florentine for Suite 408.',
    channel: 'PUSH',
    category: 'IN_STAY',
    timestamp: '10 mins ago',
    isRead: false,
    linkAction: 'in-stay-breakfast',
  },
  {
    id: 'notif-2',
    title: 'Reward Nights Credited',
    message: '4 qualifying stay nights have been credited to your Evolve Prestige balance.',
    channel: 'EMAIL',
    category: 'REWARD',
    timestamp: 'Yesterday',
    isRead: false,
    linkAction: 'membership',
  },
  {
    id: 'notif-3',
    title: 'Maldives Reservation Confirmed',
    message: 'Your upcoming stay EV-994102 at Evolve Sanctuary Maldives (Nov 15-20) is confirmed.',
    channel: 'SMS',
    category: 'BOOKING',
    timestamp: '3 days ago',
    isRead: true,
    linkAction: 'stays',
  },
];
