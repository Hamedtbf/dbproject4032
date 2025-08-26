import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth'; // Corrected service name

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth); // Corrected service name
  const router = inject(Router);

  // Use the isLoggedIn function from our service
  if (authService.isLoggedIn()) {
    // If the user is logged in, allow access to the route
    return true;
  } else {
    // If not logged in, redirect them to the login page
    router.navigate(['/login']);
    return false;
  }
};
