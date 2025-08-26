import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buys',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './buys.html',
  styleUrls: ['./buys.css']
})
export class Buys implements OnInit {
  boughtTickets: any[] = [];
  message = '';
  isLoading = true;
  reportingTicket: any = null;
  report = {
    category: 'delay',
    description: ''
  };

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.loadBoughtTickets();
  }

  loadBoughtTickets() {
    this.isLoading = true;
    this.apiService.getPaidTickets().subscribe({
      next: (res: any) => {
        this.boughtTickets = res.data.buys;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to load purchase history.';
        this.isLoading = false;
      }
    });
  }

  cancel(reservationId: number) {
    if (confirm('Are you sure you want to cancel this ticket? A penalty may apply.')) {
      this.apiService.cancelTicket(reservationId).subscribe({
        next: (res: any) => {
          this.message = `Ticket canceled successfully. Refund amount: $${res.data.refundAmount}`;
          this.loadBoughtTickets();
        },
        error: (err: HttpErrorResponse) => {
          this.message = err.error.message || 'Failed to cancel ticket.';
        }
      });
    }
  }

  showReportForm(ticket: any) {
    this.reportingTicket = ticket;
    this.message = '';
  }

  closeReportForm() {
    this.reportingTicket = null;
    this.report = { category: 'delay', description: '' };
  }

  submitReport() {
    if (!this.report.description) {
      this.message = 'Please provide a description for your report.';
      return;
    }
    const reportData = {
      reservation_id: this.reportingTicket.reservation_id,
      category: this.report.category,
      description: this.report.description
    };
    this.apiService.createReport(reportData).subscribe({
      next: () => {
        this.message = 'Your report has been submitted successfully.';
        this.closeReportForm();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to submit report.';
      }
    });
  }
}
