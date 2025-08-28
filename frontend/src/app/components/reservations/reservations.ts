import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JalaliPipe } from '../../pipes/jalali-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, JalaliPipe, FormsModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class Reservations implements OnInit {
  reservations: any[] = [];
  message = '';
  isLoading = true;

  payingReservationId: number | null = null;
  selectedMethod = 'کیف پول';

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    this.apiService.getReservations().subscribe({
      next: (res: any) => {
        this.reservations = res.data.reservations;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.message = 'خطا در بارگذاری رزروها.';
        this.isLoading = false;
      }
    });
  }

  startPayment(reservationId: number) {
    this.payingReservationId = reservationId;
    this.message = '';
  }


  confirmPayment() {
    if (!this.payingReservationId) return;

    this.apiService.makePayment(this.payingReservationId, this.selectedMethod).subscribe({
      next: () => {
        this.message = 'پرداخت با موفقیت انجام شد! بلیط شما به "سوابق خرید" منتقل شد.';
        this.payingReservationId = null;
        this.loadReservations();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'پرداخت با خطا مواجه شد.';
      }
    });
  }
}
