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
        path: 'events',
        loadComponent: () =>
          import('../../pages/events/events').then((m) => m.Events),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import(
            '../../pages/events/components/event-details/event-details'
          ).then((m) => m.EventDetails),
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
