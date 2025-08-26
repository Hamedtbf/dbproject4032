import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
        this.message = err.error.message || 'Failed to fetch tickets.';
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
        this.message = err.error.message || 'Failed to fetch ticket details.';
      }
    });
  }

  reserve(id: number) {
    this.message = '';
    this.apiService.reserveTicket(id).subscribe({
      next: () => {
        this.message = 'Ticket reserved successfully! Please go to "My Pending Reservations" to complete the payment.';
        this.search();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to reserve ticket.';
      }
    });
  }
}
