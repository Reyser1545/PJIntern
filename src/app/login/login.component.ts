// Angular core and reactive forms imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../user.service'; // Custom service to manage user state

// PrimeNG imports for UI components
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password'; // PrimeNG p-password input field
import { MessageService } from 'primeng/api'; // Service for displaying messages (optional)

@Component({
  selector: 'app-login', // Component selector for usage in HTML
  standalone: true, // Indicates this component is not dependent on app.module.ts
  imports: [
    CommonModule, // Provides common directives like ngIf, ngFor
    ReactiveFormsModule, // Enables reactive forms
    RouterModule, // Adds router features
    HttpClientModule, // Enables HTTP requests
    InputTextModule, // PrimeNG input text field
    ButtonModule, // PrimeNG buttons
    PasswordModule, // PrimeNG password input field with toggle visibility
  ],
  templateUrl: './login.component.html', // HTML template for the component
  styleUrls: ['./login.component.css'], // External CSS for styling
  providers: [MessageService], // Provide MessageService for use in this component
})
export class LoginComponent implements OnInit {
  // Reactive form for managing login inputs
  loginForm!: FormGroup;

  // Toggle password visibility
  showPassword: boolean = false;

  // Injecting required services
  constructor(
    private fb: FormBuilder, // For creating and managing forms
    private http: HttpClient, // For HTTP requests
    private router: Router, // For navigation between routes
    private userService: UserService // Custom service to store user data
  ) {}

  // Lifecycle hook to initialize the component
  ngOnInit(): void {
    // Initializing the login form with validation rules
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Username must be at least 3 characters
      password: ['', [Validators.required, Validators.minLength(6)]], // Password must be at least 6 characters
    });
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.loginForm.controls;
  }

  // Form submission handler
  onSubmit() {
    // If the form is invalid, show an alert and stop further processing
    if (this.loginForm.invalid) {
      alert('Please fill all the required fields.'); // Alert user about invalid form
      return;
    }

    // Sending HTTP GET request to fetch registered users from the server
    this.http.get<any>('http://localhost:3000/signupUsers').subscribe({
      next: (res) => {
        console.log(res); // Log response for debugging purposes

        // Check if the entered username and password match any user in the response
        const user = res.find(
          (a: any) =>
            a.username === this.loginForm.value.username && // Match username
            a.password === this.loginForm.value.password // Match password
        );

        if (user) {
          // If user is found, log in successfully
          this.userService.setUser(user); // Save user data using the service
          alert('Login Successful! Welcome back!'); // Inform user of success
          this.loginForm.reset(); // Reset the form
          this.router.navigate(['mainpage']); // Navigate to the main page
        } else {
          // If no matching user is found, show a failure message
          alert('Login Failed: User not found!');
        }
      },
      error: (err) => {
        console.error(err); // Log the error for debugging
        alert('Error: Something went wrong!'); // Inform user of server error
      },
    });
  }

  // Function to toggle password visibility (used in the template)
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Switch visibility state
  }
}

/*
### Quick Summary of Dependencies and Functionality:

// **File Links/Dependencies**:
- `./login.component.html`: Template with form inputs and buttons.
- `./login.component.css`: Styles for the login page.
- `UserService`: Custom service that manages user state and data.

// **PrimeNG Dependencies**:
- **InputTextModule**: For text input fields.
- **ButtonModule**: For styled buttons.
- **PasswordModule**: For password input with visibility toggle.

// **Main Features**:
1. **Login Form**: 
   - Validates `username` (min 3 characters) and `password` (min 6 characters).
2. **User Authentication**:
   - Fetches a list of users via HTTP GET request and verifies credentials.
3. **Password Visibility**:
   - Toggle between showing or hiding password input.
4. **Error Handling**:
   - Alerts for invalid input, login failures, or server issues.
5. **Navigation**:
   - Successful login redirects the user to the `mainpage`.
*/
