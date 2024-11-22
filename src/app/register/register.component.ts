import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

// PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';  // Use p-password for password input
import { MessageService } from 'primeng/api';  // To show error messages (optional)
import { PrimeNGConfig } from 'primeng/api';   // To configure global PrimeNG settings if needed
import { MessageModule } from 'primeng/message'; // Import p-message to show error messages

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    HttpClientModule,
    InputTextModule, 
    ButtonModule,
    PasswordModule,    // Import p-password module for password field
    MessageModule      // Import Message module for error messages
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]  // Provide MessageService for showing messages
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter to access form controls
  get f() {
    return this.registerForm.controls;
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);

      this.http.post<any>("http://localhost:3000/signupUsers", this.registerForm.value)
        .subscribe({
          next: res => {
            this.messageService.add({ severity: 'success', summary: 'Registration Success', detail: 'Account created successfully.' });
            this.registerForm.reset();
            this.router.navigate(['/login']);
          },
          error: err => {
            this.messageService.add({ severity: 'error', summary: 'Registration Failed', detail: 'Something went wrong, please try again.' });
          }
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Form Invalid', detail: 'Please fill all the required fields correctly.' });
    }
  }
}
