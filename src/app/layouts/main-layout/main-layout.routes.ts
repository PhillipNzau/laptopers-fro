import { Route } from '@angular/router';
import { MainLayout } from './main-layout';

export const PAGES_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'properties',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'hubs',
        loadComponent: () =>
          import('../../pages/hubs/hubs').then((m) => m.Events),
      },
      {
        path: 'hubs/:id',
        loadComponent: () =>
          import('../../pages/hubs/components/hub-details/hub-details').then(
            (m) => m.HubDetails
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../../pages/reports/reports').then((m) => m.Reports),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../../pages/notifications/notifications').then(
            (m) => m.Notifications
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../../pages/settings/settings').then((m) => m.Settings),
      },
    ],
  },
];
