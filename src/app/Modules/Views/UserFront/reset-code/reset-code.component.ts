import { Component } from '@angular/core';
import {PasswordResetService} from "../../../Services/password-reset.service";

@Component({
  selector: 'app-reset-code',
  templateUrl: './reset-code.component.html',
  styleUrls: ['./reset-code.component.css']
})
export class ResetCodeComponent {
  email: string = '';
  resetCode: string = '';
  newPassword: string = '';
  passwordResetSuccess: boolean = false;
  errorMessage: string = '';

  constructor(private passwordResetService: PasswordResetService) {}

  resetPassword() {
    if (!this.resetCode || !this.newPassword || !this.email) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.passwordResetService.resetPassword(this.email, this.resetCode, this.newPassword).subscribe({
      next: (response) => {
        this.passwordResetSuccess = true;
        this.errorMessage = '';
        console.log('Password reset successfully.');
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.errorMessage = 'Failed to reset password. Please check your reset code and try again.';
        this.passwordResetSuccess = false;
      }
    });
  }
}
