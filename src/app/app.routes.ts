import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Otp } from './components/otp/otp';
import { Dashboard } from './components/dashboard/dashboard';
import { Tickets } from './components/tickets/tickets';
import { Reservations } from './components/reservations/reservations';
import { Buys } from './components/buys/buys';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { AdminReservations } from './components/admin-reservations/admin-reservations';
import { AdminReports } from './components/admin-reports/admin-reports';
import { EditProfile } from './components/edit-profile/edit-profile';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'verify-otp', component: Otp },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'tickets', component: Tickets, canActivate: [authGuard] },
  { path: 'reservations', component: Reservations, canActivate: [authGuard] },
  { path: 'buys', component: Buys, canActivate: [authGuard] },
  { path: 'admin', component: AdminPanel, canActivate: [authGuard] },
  { path: 'admin/reservations', component: AdminReservations, canActivate: [authGuard] },
  { path: 'admin/reports', component: AdminReports, canActivate: [authGuard] },
];
