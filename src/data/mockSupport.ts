import { SupportTicket } from '../types';

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket-1092',
    ticketNumber: 'TKT-1092',
    subject: 'Kyoto Private Tea Ceremony Booking Request',
    category: 'IN_STAY',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-08T18:40:00Z',
    reservationReference: 'EV-882910',
    messages: [
      {
        id: 'msg-1',
        sender: 'GUEST',
        senderName: 'Marcus Sterling',
        text: 'Hello Concierge, could you arrange a private tea ceremony for two at the Tea Pavilion tomorrow afternoon around 3:30 PM?',
        timestamp: '18:40',
      },
      {
        id: 'msg-2',
        sender: 'CONCIERGE',
        senderName: 'Kenji (Head Concierge)',
        text: 'Good evening Mr. Sterling. We would be delighted to host you. Tea Master Sosei has confirmed availability for 3:30 PM. We have noted your preference for ceremonial Uji matcha and delicate seasonal wagashi confections. Your appointment is now reserved.',
        timestamp: '18:52',
      },
    ],
  },
  {
    id: 'ticket-1085',
    ticketNumber: 'TKT-1085',
    subject: 'High-floor room preference confirmation',
    category: 'RESERVATION',
    status: 'RESOLVED',
    createdAt: '2026-08-30T10:15:00Z',
    reservationReference: 'EV-994102',
    messages: [
      {
        id: 'msg-3',
        sender: 'GUEST',
        senderName: 'Marcus Sterling',
        text: 'Hi, just re-confirming that our Maldives villa is positioned for the sunset view side of the reef.',
        timestamp: '10:15',
      },
      {
        id: 'msg-4',
        sender: 'CONCIERGE',
        senderName: 'Aishath (Island Host)',
        text: 'Greetings Mr. Sterling. Your Sunset Overwater Infinity Villa is guaranteed on the western jetty with direct western ocean sunset vistas.',
        timestamp: '10:45',
      },
    ],
  },
];
