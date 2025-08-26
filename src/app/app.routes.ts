import { Routes } from '@angular/router';

// Import all the components we created
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

export const routes: Routes = [
  // Redirect the base URL to the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Define the path for each component
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'verify-otp', component: Otp },
  { path: 'dashboard', component: Dashboard },
  { path: 'tickets', component: Tickets },
  { path: 'reservations', component: Reservations },
  { path: 'buys', component: Buys },
  { path: 'admin', component: AdminPanel },
  { path: 'admin/reservations', component: AdminReservations },
  { path: 'admin/reports', component: AdminReports },
];
