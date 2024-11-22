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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;  // Declare showPassword to toggle password visibility

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter for form controls
  get f() {
    return this.loginForm.controls;
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.invalid) {
      // If form is invalid, show an alert and prevent submission
      alert('Please fill all the required fields.');
      return;
    }
    
    // Make HTTP request to verify user login
    this.http.get<any>("http://localhost:3000/signupUsers")
      .subscribe({
        next: (res) => {
          console.log(res);  // Check the response in the console
  
          const user = res.find((a: any) => 
            a.username === this.loginForm.value.username && a.password === this.loginForm.value.password
          );
  
          if (user) {
            // User found, successful login
            this.userService.setUser(user);
            alert('Login Successful! Welcome back!');
            this.loginForm.reset();
            this.router.navigate(['mainpage']);
          } else {
            // Login failed, show an alert message
            alert('Login Failed: User not found!');
          }
        },
        error: (err) => {
          console.log(err); // Log the error to debug
          alert('Error: Something went wrong!');
        }
      });
  }
  

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
