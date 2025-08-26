import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private dashboardUrl = 'http://localhost:3000/api/dashboard';
  private adminUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) { }

  // --- Dashboard APIs ---

  getProfile(): Observable<any> {
    return this.http.get(`${this.dashboardUrl}/profile`, { withCredentials: true });
  }

  // NEW: Add a method to update the user's profile
  editProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.dashboardUrl}/editprofile`, profileData, { withCredentials: true });
  }

  getTickets(filters: any): Observable<any> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }
    return this.http.get(`${this.dashboardUrl}/tickets`, { withCredentials: true, params });
  }

  getTicketDetails(id: number): Observable<any> {
    return this.http.get(`${this.dashboardUrl}/tickets/${id}`, { withCredentials: true });
  }

  reserveTicket(ticketId: number): Observable<any> {
    return this.http.post(`${this.dashboardUrl}/reserve`, { ticket_id: ticketId }, { withCredentials: true });
  }

  getReservations(): Observable<any> {
      return this.http.get(`${this.dashboardUrl}/reservations`, { withCredentials: true });
  }

  makePayment(reservationId: number): Observable<any> {
      return this.http.post(`${this.dashboardUrl}/payment`, { reservation_id: reservationId, method: 'balance' }, { withCredentials: true });
  }

  getPaidTickets(): Observable<any> {
      return this.http.get(`${this.dashboardUrl}/buys`, { withCredentials: true });
  }

  cancelTicket(reservationId: number): Observable<any> {
      return this.http.put(`${this.dashboardUrl}/cancel`, { reservation_id: reservationId }, { withCredentials: true });
  }

  createReport(reportData: any): Observable<any> {
      return this.http.post(`${this.dashboardUrl}/report`, reportData, { withCredentials: true });
  }

  // --- Admin APIs ---

  adminGetReservations(): Observable<any> {
    return this.http.get(`${this.adminUrl}/reservations`, { withCredentials: true });
  }

  adminUpdateReservation(id: number, status: string): Observable<any> {
      return this.http.post(`${this.adminUrl}/reservations/${id}`, { status }, { withCredentials: true });
  }

  adminGetReports(): Observable<any> {
    return this.http.get(`${this.adminUrl}/reports`, { withCredentials: true });
  }

  adminUpdateReport(id: number, status: string, response: string): Observable<any> {
      return this.http.post(`${this.adminUrl}/reports/${id}`, { status, response }, { withCredentials: true });
  }
}
