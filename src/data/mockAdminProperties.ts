import { AdminPropertyItem } from '../types/admin';

export const mockAdminProperties: AdminPropertyItem[] = [
  {
    id: 'prop-texarkana',
    name: 'Evolve Texarkana',
    membersCount: 127,
    openCasesCount: 1,
    managerName: 'Jane Smith',
    status: 'Active',
    integrationReadiness: 'Healthy',
  },
  {
    id: 'prop-brooklyn',
    name: 'Evolve Brooklyn',
    membersCount: 94,
    openCasesCount: 1,
    managerName: 'Alex Rivera',
    status: 'Active',
    integrationReadiness: 'Healthy',
  },
  {
    id: 'prop-prospect-park',
    name: 'Evolve Prospect Park',
    membersCount: 0,
    openCasesCount: 0,
    managerName: 'Unassigned',
    status: 'Pre-Launch',
    integrationReadiness: 'Credentials required',
  },
];
