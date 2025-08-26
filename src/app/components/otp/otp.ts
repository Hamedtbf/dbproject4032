import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp.html',
  styleUrls: ['./otp.css']
})
export class Otp implements OnInit {
  otp = '';
  email = '';
  error = '';

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit() {
    this.email = localStorage.getItem('userEmailForOTP') || '';
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  verifyOtp() {
    this.authService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
      next: (res: any) => {
        localStorage.removeItem('userEmailForOTP');
        if (res.data.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'OTP verification failed. Please try again.';
      }
    });
  }
}
