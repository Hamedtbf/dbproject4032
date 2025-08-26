import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-reservations.html',
  styleUrls: ['./admin-reservations.css']
})
export class AdminReservations implements OnInit {
  reservations: any[] = [];
  message = '';
  isLoading = true;

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    this.apiService.adminGetReservations().subscribe({
      next: (res: any) => {
        this.reservations = res.data.reservations;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to load reservations.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.message = '';
    this.apiService.adminUpdateReservation(id, status).subscribe({
      next: () => {
        this.message = `Reservation #${id} status has been updated to '${status}'.`;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to update reservation status.';
      }
    });
  }
}
