import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adminpage',
  standalone: true,
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css'],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, FormsModule]
})
export class AdminPageComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  showUpdateForm = false;
  showAddForm = false;
  showPassword = false;
  updateForm: FormGroup;
  addForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      id: [null],  // Added id field to the form for update
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.addForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:3000/signupUsers')
      .subscribe(users => {
        console.log('Users loaded:', users);  // Debugging line
        this.users = users;
        this.filteredUsers = users;  // Initially, show all users
      }, (err) => {
        console.error('Error loading users:', err);  // Debugging line
      });
  }

  goBack(): void {
    this.router.navigate(['/mainpage']);
  }

  openUpdateForm(userId: number) {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      console.log('User being patched into the form:', user);  // Debugging line
      this.updateForm.patchValue({
        id: user.id,           // Ensure the 'id' is patched here
        username: user.username,
        email: user.email,
        password: user.password,
      });
      this.showUpdateForm = true;
    } else {
      console.error('User not found with id:', userId);  // Debugging line
    }
  }

  closeUpdateForm() {
    this.showUpdateForm = false;
  }

  onUpdate() {
    // Check if the update form is valid
    if (this.updateForm.valid) {
      const updatedUser = this.updateForm.value;  // Get the form values
      console.log('Updated user data before submitting:', updatedUser);  // Debugging line

      // Ensure the 'id' field is included in the form value
      if (updatedUser.id) {
        // Send the PUT request to update the user
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
        // If the 'id' is missing, log and alert the user
        console.error('User ID is missing:', updatedUser);  // Debugging line
        alert('User ID is missing. Please try again.');
      }
    } else {
      // If the form is invalid, log the errors and alert the user
      console.error('Form is invalid:', this.updateForm.errors);  // Debugging line
      alert('Please fill out all required fields correctly.');
    }
  }

  deleteUser(userId: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.http.delete(`http://localhost:3000/signupUsers/${userId}`)
        .subscribe({
          next: () => {
            alert('User deleted successfully!');
            this.loadUsers();
          },
          error: () => alert('Failed to delete user!')
        });
    }
  }

  openAddForm() {
    this.showAddForm = true;
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  onAddUser() {
    if (this.addForm.valid) {
      const newUser = this.addForm.value;
      this.http.post('http://localhost:3000/signupUsers', newUser)
        .subscribe({
          next: () => {
            alert('User added successfully!');
            this.loadUsers();
            this.showAddForm = false;
          },
          error: () => alert('Failed to add user!')
        });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Filtering users based on the search term
  filterUsers() {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;  // Show all users if search term is empty
    }
  }
}
