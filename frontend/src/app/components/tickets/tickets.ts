import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JalaliPipe } from '../../pipes/jalali-pipe';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    JalaliPipe,
    DecimalPipe
  ],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css']
})
export class Tickets implements OnInit {
  tickets: any[] = [];
  filters = {
    source: '',
    destination: '',
    departure_date: ''
  };
  selectedTicketDetails: any = null;
  message = '';
  hasSearched = false;

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.search();
  }

  search() {
    this.hasSearched = true;
    this.message = '';
    this.apiService.getTickets(this.filters).subscribe({
      next: (res: any) => {
        this.tickets = res.data.tickets;
      },
      error: (err: HttpErrorResponse) => {
        this.message = 'خطا در دریافت بلیط‌ها.';
      }
    });
  }

  viewDetails(id: number) {
    this.message = '';
    this.apiService.getTicketDetails(id).subscribe({
      next: (res: any) => {
        this.selectedTicketDetails = res.data.ticket;
      },
      error: (err: HttpErrorResponse) => {
        this.message = 'خطا در دریافت جزئیات بلیط.';
      }
    });
  }

  reserve(id: number) {
    this.message = '';
    this.apiService.reserveTicket(id).subscribe({
      next: () => {
        this.message = 'بلیط با موفقیت رزرو شد! لطفا برای پرداخت به بخش "رزروهای در انتظار پرداخت" مراجعه کنید.';
        this.search();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'خطا در رزرو بلیط.';
      }
    });
  }
}
