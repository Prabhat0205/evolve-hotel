import { AdminUser } from '../types/admin';

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'usr-pm-001',
    name: 'Marcus Sterling',
    email: 'manager@stayatevolve.com',
    role: 'property_manager',
    roleTitle: 'General Property Manager',
    department: 'Property Operations & Management',
    assignedPropertyId: 'evolve-texarkana',
    assignedPropertyName: 'Evolve Hotels & Suites Texarkana',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    lastLogin: 'Today at 08:30 AM',
  },
  {
    id: 'usr-fd-002',
    name: 'Elena Rostova',
    email: 'frontdesk@stayatevolve.com',
    role: 'front_desk',
    roleTitle: 'Front Desk Lead Agent',
    department: 'Guest Services & Front Office',
    assignedPropertyId: 'evolve-texarkana',
    assignedPropertyName: 'Evolve Hotels & Suites Texarkana',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    lastLogin: 'Today at 07:15 AM',
  },
];
