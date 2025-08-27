import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  user: any = null;
  error = '';

  constructor(private router: Router, private apiService: Api) {}

  ngOnInit() {
    this.apiService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.data.user;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Could not load user profile.';
      }
    });
  }

  logout() {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.router.navigate(['/login']);
  }
}
