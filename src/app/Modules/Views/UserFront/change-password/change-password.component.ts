import { Component } from '@angular/core';
import {UserService} from '../../../Services/user.service';
import {ChangePasswordRequest} from '../../../Classes/change-password-request';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent {
  changePasswordRequest: ChangePasswordRequest = new ChangePasswordRequest();
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService) {}

  changePassword(): void {
    this.errorMessage = ''; // Clear previous errors
    this.successMessage = ''; // Clear previous success messages

    if (!this.isValid()) {
      return;
    }

    this.userService.changePassword(this.changePasswordRequest).subscribe({
      next: (response) => {
        this.successMessage = 'Password changed successfully.';
        this.resetForm();
      },
      error: (error) => {
        console.error('Error:', error);
        this.handleErrors(error);
      }
    });
  }

  isValid(): boolean {
    if (!this.changePasswordRequest.currentPassword ||
      !this.changePasswordRequest.newPassword ||
      !this.changePasswordRequest.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return false;
    }

    if (this.changePasswordRequest.newPassword !== this.changePasswordRequest.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.changePasswordRequest = new ChangePasswordRequest(); // Reset the model
  }

  private handleErrors(error: any): void {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      this.errorMessage = "Client side network error";
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      this.errorMessage = error.error.message || `Password changed successfully.`;
    }
  }
}
