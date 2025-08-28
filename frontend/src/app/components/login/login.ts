import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials = {
    email: '',
    password: ''
  };
  error = '';

  constructor(private authService: Auth, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        localStorage.setItem('userEmailForOTP', this.credentials.email);
        this.router.navigate(['/verify-otp']);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'ورود با خطا مواجه شد. لطفا اطلاعات خود را بررسی کنید.';
      }
    });
  }
}
