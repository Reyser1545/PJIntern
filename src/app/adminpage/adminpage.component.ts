import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service'; // Custom service to manage user data
import { HttpClient } from '@angular/common/http'; // For making HTTP requests
import { Router } from '@angular/router'; // For navigation
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb'; // PrimeNG Breadcrumb module for navigation
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';  // Import InputTextModule for p-inputText

@Component({
  selector: 'app-adminpage', // Component selector
  standalone: true, // Marks this component as standalone, independent of app.module.ts
  templateUrl: './adminpage.component.html', // Template file
  styleUrls: ['./adminpage.component.css'], // Styles for the component
  imports: [ReactiveFormsModule,InputTextModule, CommonModule,ButtonModule, HttpClientModule, FormsModule, BreadcrumbModule] // Modules used in this component
})
export class AdminPageComponent implements OnInit {
  users: any[] = []; // Array to hold all users
  filteredUsers: any[] = []; // Array to hold filtered users based on search
  searchTerm: string = ''; // Search term for filtering users
  showUpdateForm = false; // Flag to toggle the display of the update form
  showAddForm = false; // Flag to toggle the display of the add form
  showPassword = false; // Flag to toggle password visibility
  updateForm: FormGroup; // FormGroup for the update user form
  addForm: FormGroup; // FormGroup for the add new user form
  items: any[] | undefined; // Breadcrumb items for navigation
  sortOrder: { [key: string]: boolean } = { username: true, email: true }; // Tracks sort order for each field

  // Constructor to inject necessary services
  constructor(
    private userService: UserService, // Custom service for user-related operations
    private fb: FormBuilder, // Angular FormBuilder for creating reactive forms
    private http: HttpClient, // HttpClient for making HTTP requests
    private router: Router // Router for navigation
  ) {
    // Initializing the update form with validators
    this.updateForm = this.fb.group({
      id: [null],  // Added id field to the form for update
      username: ['', [Validators.required, Validators.minLength(3)]], // Username validation
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password validation
      role: ['user', Validators.required],  // Ensure 'role' is initialized here

    });

    // Initializing the add user form with validators
    this.addForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Username validation
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password validation
      role: ['user', Validators.required],  // Ensure 'role' is initialized here

    });

    // Defining breadcrumb items for navigation
    this.items = [
      { label: 'Mainpage', icon: 'pi pi-home', routerLink: ['/mainpage'] },
      { label: 'AdminPage' } // Current page in breadcrumb
    ]
  }

  // ngOnInit lifecycle hook to load users when the component is initialized
  ngOnInit(): void {
    this.loadUsers(); // Load all users from the server
  }

  // Function to fetch all users from the server
  loadUsers() {
    this.http.get<any[]>('http://localhost:3000/signupUsers') // HTTP GET request to fetch users
      .subscribe(users => {
        console.log('Users loaded:', users);  // Debugging line
        this.users = users; // Store all users in the users array
        this.filteredUsers = users;  // Initially, show all users
      }, (err) => {
        console.error('Error loading users:', err);  // Debugging line for error handling
      });
  }

  // Navigation function to go back to the main page
  goBack(): void {
    this.router.navigate(['/mainpage']); // Navigates to the main page
  }

  // Function to open the update form and pre-fill it with the selected user's data
  openUpdateForm(userId: number) {
    const user = this.users.find(user => user.id === userId); // Find the user by ID
    if (user) {
      console.log('User being patched into the form:', user);  // Debugging line
      this.updateForm.patchValue({
        id: user.id,           // Pre-fill the form with user data
        username: user.username,
        email: user.email,
        password: user.password,
      });
      this.showUpdateForm = true; // Show the update form
    } else {
      console.error('User not found with id:', userId);  // Debugging line
    }
  }

  // Function to close the update form
  closeUpdateForm() {
    this.showUpdateForm = false; // Hide the update form
  }

  // Function to submit the update form and send the PUT request to update the user data
  onUpdate() {
    if (this.updateForm.valid) { // Check if the update form is valid
      const updatedUser = this.updateForm.value;  // Get the form values
      console.log('Updated user data before submitting:', updatedUser);  // Debugging line

      if (updatedUser.id) { // Ensure the 'id' is available in the form data
        // Send a PUT request to update the user data on the server
        this.http.put(`http://localhost:3000/signupUsers/${updatedUser.id}`, updatedUser)
          .subscribe({
            next: (response) => {
              console.log('User updated successfully:', response);  // Debugging line
              alert('User updated successfully!');
              this.loadUsers();  // Reload users after successful update
              this.closeUpdateForm();  // Close the update form modal
            },
            error: (error) => {
              console.error('Error updating user:', error);  // Debugging line
              alert('Failed to update user! Please try again.');
            }
          });
      } else {
        console.error('User ID is missing:', updatedUser);  // Debugging line
        alert('User ID is missing. Please try again.');
      }
    } else {
      console.error('Form is invalid:', this.updateForm.errors);  // Debugging line
      alert('Please fill out all required fields correctly.');
    }
  }

  // Function to delete a user
  deleteUser(userId: number) {
    if (confirm("Are you sure you want to delete this user?")) { // Confirm the deletion
      this.http.delete(`http://localhost:3000/signupUsers/${userId}`) // HTTP DELETE request
        .subscribe({
          next: () => {
            alert('User deleted successfully!');
            this.loadUsers();  // Reload users after deletion
          },
          error: () => alert('Failed to delete user!') // Error handling if delete fails
        });
    }
  }

  // Function to open the add form
  openAddForm() {
    this.showAddForm = true; // Show the add form
  }

  // Function to close the add form
  closeAddForm() {
    this.showAddForm = false; // Hide the add form
  }

  // Function to submit the add form and send the POST request to add a new user
  onAddUser() {
    if (this.addForm.valid) { // Check if the add form is valid
      const newUser = this.addForm.value; // Get the form values
      this.http.post('http://localhost:3000/signupUsers', newUser) // HTTP POST request to add user
        .subscribe({
          next: () => {
            alert('User added successfully!');
            this.loadUsers(); // Reload users after adding the new user
            this.showAddForm = false; // Close the add form
          },
          error: () => alert('Failed to add user!') // Error handling if add fails
        });
    }
  }

  // Function to toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle the password visibility
  }

  // Function to filter users based on the search term
  filterUsers() {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) // Filter users by username
      );
    } else {
      this.filteredUsers = this.users; // Show all users if search term is empty
    }
  }


  sortUsers(field: string) {
    const isAscending = this.sortOrder[field];
    this.filteredUsers.sort((a, b) => {
      const valueA = a[field].toLowerCase();
      const valueB = b[field].toLowerCase();

      if (valueA < valueB) {
        return isAscending ? -1 : 1;
      } else if (valueA > valueB) {
        return isAscending ? 1 : -1;
      }
      return 0;
    });

    // Toggle the sort order for the next click
    this.sortOrder[field] = !isAscending;
  }

  // Other functions like openUpdateForm, onAddUser, etc.
}

/*
### Quick Summary:

**Functionality**:
- The component allows an admin to **add**, **update**, and **delete** users.
- Users are fetched from a backend API (`http://localhost:3000/signupUsers`).
- There are forms for adding and updating users, both with validation.
- Password visibility can be toggled, and user list can be filtered by username.

**Interaction with Other Pages**:
- The **AdminPageComponent** uses a breadcrumb for navigation and allows the admin to navigate back to the **Mainpage**.
- When users are updated, deleted, or added, the user list is reloaded to reflect the changes.

**Dependencies**:
- Angular forms (`ReactiveFormsModule`, `FormsModule`).
- PrimeNG components (`BreadcrumbModule`).
- `HttpClientModule` for making API requests.

**Error Handling**:
- Error messages are displayed if there are issues with loading users, updating, deleting, or adding users.
*/
