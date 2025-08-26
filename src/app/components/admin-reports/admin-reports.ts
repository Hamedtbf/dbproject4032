import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.css']
})
export class AdminReports implements OnInit {
  reports: any[] = [];
  message = '';
  isLoading = true;
  selectedReport: any = null;
  responseForm = {
    status: 'pending',
    response: ''
  };

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.apiService.adminGetReports().subscribe({
      next: (res: any) => {
        this.reports = res.data.reports;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to load reports.';
        this.isLoading = false;
      }
    });
  }

  viewReport(report: any) {
    this.selectedReport = report;
    this.responseForm.status = report.status;
    this.responseForm.response = report.response || '';
    this.message = '';
  }

  submitResponse() {
    if (!this.selectedReport) return;
    this.apiService.adminUpdateReport(this.selectedReport.id, this.responseForm.status, this.responseForm.response).subscribe({
      next: () => {
        this.message = `Report #${this.selectedReport.id} has been updated.`;
        this.selectedReport = null;
        this.loadReports();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.message || 'Failed to update report.';
      }
    });
  }
}
