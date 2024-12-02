// Angular core and reactive forms imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// PrimeNG imports for UI components and styling
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-register', // Component selector
  standalone: true, // Independent of app.module.ts
  imports: [
    CommonModule, // Angular directives (e.g., ngIf, ngFor)
    ReactiveFormsModule, // For reactive forms
    RouterModule, // Routing (e.g., routerLink)
    HttpClientModule, // HTTP requests
    InputTextModule, // PrimeNG input
    ButtonModule, // PrimeNG button
    PasswordModule, // PrimeNG password input
    MessageModule, // PrimeNG message
  ],
  templateUrl: './register.component.html', // Template file
  styleUrls: ['./register.component.css'], // Styling file
  providers: [MessageService], // MessageService for error/success messages
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // FormGroup to manage form fields
  showPassword: boolean = false; // Toggle password visibility

  constructor(
    private fb: FormBuilder, // FormBuilder for creating forms
    private http: HttpClient, // HttpClient for backend requests
    private router: Router, // Router for navigation
    private messageService: MessageService // MessageService for messages
  ) {}

  ngOnInit(): void {
    // Initializing the form with validation rules
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Username validation
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password validation
      role: ['user']
    });
  }

  // Getter for form controls
  get f() {
    return this.registerForm.controls;
  }

  // Toggles password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Handles form submission
  onSubmit() {
    if (this.registerForm.valid) {
      // POST the form data to the backend
      this.http.post<any>('http://localhost:3000/signupUsers', this.registerForm.value).subscribe({
        next: (res) => {
          // Success: Show a message and redirect to login page
          this.messageService.add({ severity: 'success', summary: 'Registration Success', detail: 'Account created successfully.' });
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Error: Show an error message
          this.messageService.add({ severity: 'error', summary: 'Registration Failed', detail: 'Something went wrong, please try again.' });
        },
      });
    } else {
      // Form invalid: Show an error message
      this.messageService.add({ severity: 'error', summary: 'Form Invalid', detail: 'Please fill all the required fields correctly.' });
    }
  }
}

/**
 * Quick Reminder:
 * - Template: Uses `register.component.html` for UI layout.
 * - Styling: Styled using `register.component.css`.
 * - HTTP Endpoint: Sends POST requests to `http://localhost:3000/signupUsers` for user registration.
 * - Form Validation:
 *    - Username: Required, minimum 3 characters.
 *    - Email: Required, must be a valid email.
 *    - Password: Required, minimum 6 characters.
 * - Dependencies:
 *    - PrimeNG modules for UI (`InputTextModule`, `ButtonModule`, `PasswordModule`, `MessageModule`).
 *    - Angular modules (`ReactiveFormsModule`, `RouterModule`, `HttpClientModule`).
 * - Navigation: Redirects to `/login` on successful registration.
 */
