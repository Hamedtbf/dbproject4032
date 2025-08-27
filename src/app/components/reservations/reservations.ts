import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JalaliPipe } from '../../pipes/jalali-pipe';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, JalaliPipe],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class Reservations implements OnInit {
  reservations: any[] = [];
  message = '';
  isLoading = true;

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    this.apiService.getReservations().subscribe({
      next: (res: any) => {
        // Filter to only show reservations that are pending payment
        this.reservations = res.data.reservations.filter((r: any) => r.status === 'reserved');
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.message = 'خطا در بارگذاری رزروها.';
        this.isLoading = false;
      }
    });
  }

  pay(reservationId: number) {
    this.message = '';
    this.apiService.makePayment(reservationId).subscribe({
      next: () => {
        this.message = 'پرداخت با موفقیت انجام شد! بلیط شما به "سوابق خرید" منتقل شد.';
        // Refresh the list to remove the paid reservation
        this.loadReservations();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'پرداخت با خطا مواجه شد.';
      }
    });
  }
}
