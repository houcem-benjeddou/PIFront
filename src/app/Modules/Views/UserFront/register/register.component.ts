import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthenticationResponse } from '../../../Classes/authentication-response';
import {AuthenticationService} from '../../../Services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', [Validators.required]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      job: ['', Validators.required],
      region: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response: AuthenticationResponse) => {
          localStorage.setItem('access_token', response.access_token);
          if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
          }

          this.message = 'User registered successfully.';
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          console.error('Error while registering user:', error);
        }
      });
    }
  }
}
