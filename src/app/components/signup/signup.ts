import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  userData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    city: ''
  };
  error = '';

  constructor(private authService: Auth, private router: Router) {}

  signup() {
    this.authService.signup(this.userData).subscribe({
      next: () => {
        localStorage.setItem('userEmailForOTP', this.userData.email);
        this.router.navigate(['/verify-otp']);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'Signup failed. Please try again.';
      }
    });
  }
}
