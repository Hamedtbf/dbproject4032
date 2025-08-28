import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JalaliPipe } from '../../pipes/jalali-pipe';

@Component({
  selector: 'app-buys',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JalaliPipe, DecimalPipe],
  templateUrl: './buys.html',
  styleUrls: ['./buys.css']
})
export class Buys implements OnInit {
  boughtTickets: any[] = [];
  message = '';
  isLoading = true;

  // State for the report form
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
        this.message = 'خطا در بارگذاری سوابق خرید.';
        this.isLoading = false;
      }
    });
  }

  cancel(reservationId: number) {
    if (confirm('آیا از لغو این بلیط اطمینان دارید؟ ممکن است شامل جریمه شود.')) {
      this.apiService.cancelTicket(reservationId).subscribe({
        next: (res: any) => {
          this.message = `بلیط با موفقیت لغو شد. مبلغ ${res.data.refundAmount} تومان به حساب شما بازگردانده شد.`;
          this.loadBoughtTickets(); // Refresh the list
        },
        error: (err: HttpErrorResponse) => {
          this.message = err.error.message || 'خطا در لغو بلیط.';
        }
      });
    }
  }

  // --- Report Methods ---

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
      this.message = 'لطفا توضیحات گزارش خود را وارد کنید.';
      return;
    }

    const reportData = {
      reservation_id: this.reportingTicket.reservation_id,
      category: this.report.category,
      description: this.report.description
    };

    this.apiService.createReport(reportData).subscribe({
      next: () => {
        this.message = 'گزارش شما با موفقیت ثبت شد.';
        this.closeReportForm();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'خطا در ثبت گزارش.';
      }
    });
  }
}
