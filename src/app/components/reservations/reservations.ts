import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class Reservations implements OnInit {
  reservations: any[] = [];
  message = '';

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.apiService.getReservations().subscribe({
      next: (res: any) => {
        this.reservations = res.data.reservations.filter((r: any) => r.status === 'reserved');
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to load reservations.';
      }
    });
  }

  pay(reservationId: number) {
    this.message = '';
    this.apiService.makePayment(reservationId).subscribe({
      next: () => {
        this.message = 'Payment successful! Your ticket has been moved to "My Purchase History".';
        this.loadReservations();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Payment failed.';
      }
    });
  }
}
