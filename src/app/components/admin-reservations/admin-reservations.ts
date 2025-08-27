import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JalaliPipe } from '../../pipes/jalali-pipe';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JalaliPipe],
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
        this.message = 'خطا در بارگذاری رزروها.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.message = '';
    this.apiService.adminUpdateReservation(id, status).subscribe({
      next: () => {
        this.message = `وضعیت رزرو شماره ${id} با موفقیت به '${status}' تغییر یافت.`;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'خطا در بروزرسانی وضعیت رزرو.';
      }
    });
  }
}
