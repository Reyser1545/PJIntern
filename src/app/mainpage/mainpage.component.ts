import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; // Import necessary Angular core modules
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import form handling modules
import { Router } from '@angular/router'; // Import the router for navigation
import { UserService } from '../../user.service'; // Import user service for getting and setting user data
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API calls
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule for form handling
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for HTTP requests
import { CommonModule } from '@angular/common';  // Import CommonModule for common Angular functionalities
import { RouterModule } from '@angular/router';  // Import RouterModule for routing
import { UserInfo } from '../Services/Userinfo.service'; // Import UserInfo service for user-related data

// PrimeNG Modules
import { CardModule } from 'primeng/card'; // Import Card module for displaying user info in a card format
import { BreadcrumbModule } from 'primeng/breadcrumb'; // Import Breadcrumb module for navigation links
import { ButtonModule } from 'primeng/button'; // Import Button module for buttons
import { PrimeIcons } from 'primeng/api'; // Import PrimeNG icons
import { MenuItem } from 'primeng/api'; // Import MenuItem type for menu items
import { MenubarModule } from 'primeng/menubar'; // Import Menubar module for displaying a menu bar

@Component({
  selector: 'app-mainpage',
  standalone: true, // Indicating this is a standalone component
  templateUrl: './mainpage.component.html', // Path to the component's HTML template
  styleUrls: ['./mainpage.component.css'], // Path to the component's styles
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, 
    RouterModule, CardModule, ButtonModule, BreadcrumbModule, MenubarModule] // Import the necessary modules for this component
})
export class MainpageComponent implements OnInit {
  user: any; // Variable to store user information
  showUpdateForm = false; // Flag to control the visibility of the update form
  updateForm: FormGroup; // Form group to manage user update form
  items: any[] | undefined; // Array to store breadcrumb items
  Menuitems: MenuItem[] | undefined; // Array to store menu items
  currentUser: any = null; // Holds logged-in user data
  selectedFile: File | null = null;
  // Video Source (ensure the path is correct for Angular assets)
  videoSource = 'assets/video/MooDeng.mp4'; // Path to the video file

  @ViewChild('media') media!: ElementRef<HTMLVideoElement>; // ViewChild to access the video element

  constructor(
    public userService: UserService, // Inject UserService for managing user data
    private fb: FormBuilder, // Inject FormBuilder for form creation
    private http: HttpClient, // Inject HttpClient for making HTTP requests
    private router: Router // Inject Router for navigation
  ) {
    // Initialize the update form with validators for user inputs
    this.updateForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Username with validation
      email: ['', [Validators.required, Validators.email]], // Email with validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password with validation
    });

    // Set up the breadcrumb navigation items
    this.items = [
      { label: 'Mainpage', icon: 'pi pi-home'},
    
    ];
  }

  ngOnInit(): void {
    this.user = this.userService.gettingUser(); // Retrieve the user data from the service

    // If the user exists, prefill the update form with their data
    if (this.user) {
      this.updateForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
      });
    }
  
    // Set up the menu items for the navigation menu
    this.Menuitems = [
      {
        label: 'User Page',
        icon: 'pi pi-user',
        routerLink: '/user'
      },
      {
        label: 'Playground',
        icon: 'pi pi-play',
        routerLink: '/play'
      },
      {
        label: 'Admin Page', // This will only be visible if the user is an admin
        icon: 'pi pi-cog',
        routerLink: '/admin',
        visible: this.isAdminUser() // Function to check if the user is an admin
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout()
      }
      
    ];

  }
onLogout() {
  this.userService.clearUser(); // Clear the session dat
  this.router.navigate(['/login']); // Redirect to the login page
}
  // Toggle the visibility of the update form
  toggleUpdateForm() {
    this.showUpdateForm = !this.showUpdateForm;
  }

  // Handle user data update if the form is valid
  onUpdate() {
    if (this.updateForm.valid) {
      const updatedUser = {
        ...this.updateForm.value,
        profilePicture: this.currentUser?.profilePicture || null, // Include profilePicture
      };
  
      console.log('Updated User:', updatedUser); // Debug log
  
      this.http.put(`http://localhost:3000/signupUsers/${this.user.id}`, updatedUser)
        .subscribe({
          next: () => {
            alert('Account updated successfully!');
            this.userService.setUser(updatedUser);
            this.user = updatedUser;
            this.showUpdateForm = false;
          },
          error: () => alert('Failed to update account!'),
        });
    }
  }

  // Handle account deletion with confirmation
  deleteAccount() {
    if (confirm("Are you sure you want to delete your account?")) {
      const currentUser = this.userService.gettingUser(); // Get the current user data
      console.log("Deleting user with id:", currentUser?.id); // Log the user ID being deleted
      
      if (currentUser) {
        this.http.delete(`http://localhost:3000/signupUsers/${currentUser.id}`) // Make DELETE request to remove user
          .subscribe({
            next: () => {
              alert('Account deleted successfully!');
              this.userService.setUser(null); // Clear the user data from the service
              this.router.navigate(['/']); // Redirect to home page after deletion
            },
            error: () => alert('Failed to delete account!') // Show error message if deletion fails
          });
      } else {
        alert('No user data available for deletion'); // Handle the case if there's no user data
      }
    }
  }

  // Function to check if the logged-in user is an admin
  isAdminUser(): boolean {
    const user = this.userService.gettingUser(); // Retrieve user data from sessionStorage
    return user?.role === 'admin'; // Directly access role from the user object
  }
  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile); // Debug log
    } else {
      console.log('No file selected');
    }
  }
  uploadProfilePicture(): void {
    if (this.selectedFile && this.currentUser) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        console.log('Base64 Image:', base64Image); // Debug log
  
        // Update the profile picture in the currentUser object
        this.currentUser.profilePicture = base64Image;
  
        // Send the updated user data to the backend
        this.updateUserProfilePicture(base64Image);
  
        alert('Profile picture uploaded successfully!');
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      console.log('No file or user selected for upload'); // Debug log
    }
  }
  
  updateUserProfilePicture(base64Image: string): void {
    const updatedUser = { ...this.currentUser, profilePicture: base64Image };
  
    // Send the updated user profile to the backend
    this.http.put(`http://localhost:3000/signupUsers/${this.currentUser.id}`, updatedUser)
      .subscribe({
        next: () => {
          this.currentUser.profilePicture = base64Image; // Update in local state
          console.log('Profile picture updated successfully');
        },
        error: (err) => {
          console.error('Failed to update profile picture:', err);
        }
      });
  }
}

/* 
Summary of the Code:

This Angular component (`MainpageComponent`) manages the user profile page, including updating user information, deleting the account, and displaying personalized navigation.

- **User Service Integration**: It uses `UserService` to get and set user data globally within the app.
- **Form Handling**: The component contains a reactive form (`updateForm`) for user profile updates, with form validation (username, email, password).
- **Menu and Navigation**: It dynamically generates a menu with PrimeNG’s `Menubar` and adjusts visibility based on the user role (i.e., admin visibility).
- **HTTP Requests**: The component communicates with the backend using HTTP requests (`HttpClient`) to update or delete user data.
- **Admin Check**: The `isAdminUser()` method checks if the logged-in user has admin privileges based on predefined credentials (`admin` / `admin123`).
- **Assets**: A video asset is embedded for display on the page.

**Dependencies and Interactions**:
- **UserService**: Used for retrieving and updating user information.
- **PrimeNG Modules**: For UI components like `Card`, `Button`, `Breadcrumb`, and `Menubar`.
- **HttpClientModule**: Facilitates API communication for CRUD operations (update/delete user).
- **ReactiveFormsModule**: Handles the update form's reactive form capabilities and validations.
*/
