import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../../Services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  constructor(private authService: AuthenticationService, private router: Router) {}

  login(): void {
    this.isLoading = true; // Start loading
    this.authService.authenticate({ email: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          console.log("API response received: ", response);
          if (response.access_token) {
            localStorage.setItem('accessToken', response.access_token);
            this.router.navigate(['/navbar']).then(() => {
              console.log("Redirected to /admin");
              this.isLoading = false; // End loading
            });
          } else {
            this.errorMessage = 'Login failed: Please check your credentials and try again.';
            this.isLoading = false; // End loading
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = `Login failed: ${error.message}`;
          this.isLoading = false; // End loading
        }
      });
  }

}
