import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfile implements OnInit {
  user: any = null; // To hold the current user data for placeholders
  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    password: ''
  };

  isFormDirty = false; // Controls the button state
  message = '';
  error = '';

  constructor(private apiService: Api) {}

  ngOnInit() {
    // Load the user's current profile data when the page loads
    this.apiService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.data.user;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Could not load your profile data.';
      }
    });
  }

  // This function is called every time the user types in an input
  onFormChange() {
    this.isFormDirty = true;
  }

  saveProfile() {
    // Create a payload with only the fields that the user has actually filled in
    const payload: any = {};
    if (this.editForm.firstName) payload.firstName = this.editForm.firstName;
    if (this.editForm.lastName) payload.lastName = this.editForm.lastName;
    if (this.editForm.email) payload.email = this.editForm.email;
    if (this.editForm.city) payload.city = this.editForm.city;
    if (this.editForm.password) payload.password = this.editForm.password;

    this.apiService.editProfile(payload).subscribe({
      next: () => {
        this.message = 'Profile updated successfully!';
        this.error = '';
        // Reset the form and button state after successful save
        this.editForm = { firstName: '', lastName: '', email: '', city: '', password: '' };
        this.isFormDirty = false;
        // Reload the user data to update the placeholders
        this.ngOnInit();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'Failed to update profile.';
        this.message = '';
      }
    });
  }
}
