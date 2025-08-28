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
  user: any = null;
  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    password: ''
  };

  isFormDirty = false;
  message = '';
  error = '';

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.apiService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.data.user;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'خطا در بارگذاری اطلاعات پروفایل.';
      }
    });
  }

  onFormChange() {
    this.isFormDirty = true;
  }

  saveProfile() {
    const payload: any = {};
    if (this.editForm.firstName) payload.firstName = this.editForm.firstName;
    if (this.editForm.lastName) payload.lastName = this.editForm.lastName;
    if (this.editForm.email) payload.email = this.editForm.email;
    if (this.editForm.city) payload.city = this.editForm.city;
    if (this.editForm.password) payload.password = this.editForm.password;

    this.apiService.editProfile(payload).subscribe({
      next: () => {
        this.message = 'پروفایل با موفقیت بروزرسانی شد!';
        this.error = '';

        this.editForm = { firstName: '', lastName: '', email: '', city: '', password: '' };
        this.isFormDirty = false;
        
        this.ngOnInit();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'خطا در بروزرسانی پروفایل.';
        this.message = '';
      }
    });
  }
}
