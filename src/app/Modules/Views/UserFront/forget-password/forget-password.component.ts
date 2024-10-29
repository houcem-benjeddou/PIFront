import { Component } from '@angular/core';
import { PasswordResetService } from '../../../Services/password-reset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: string = '';
  resetCodeSent: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private passwordResetService: PasswordResetService) {}

  sendResetCode() {
    if (!this.email) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    this.resetCodeSent = false;
    this.passwordResetService.sendResetCode(this.email).subscribe(
      response => {
        this.resetCodeSent = true;
        this.errorMessage = '';
        console.log('Reset code sent successfully.'); // Logging for debugging
        // Navigate to reset-password component on successful code send
        //this.router.navigate(['/reset-pass']);
      },
      error => {
        console.error('Error sending reset code:', error);
        this.errorMessage = 'Failed to send reset code. Please try again.';
        this.resetCodeSent = false;
      }
    );
  }
}
