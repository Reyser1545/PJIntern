import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';  // Import RouterModule for routing
import { UserInfo } from '../Services/Userinfo.service';

// Import Videogular Modules
import { VgCoreModule, } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

// PrimeNG Modules
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, 
    RouterModule, CardModule, VgCoreModule, 
    VgControlsModule, VgOverlayPlayModule, 
    VgBufferingModule]  // Include RouterModule here
})
export class MainpageComponent implements OnInit {
  user: any;
  showUpdateForm = false;
  updateForm: FormGroup;
  
  // Video Source (ensure the path is correct for Angular assets)
  videoSource = 'assets/video/MooDeng.mp4'; // Ensure correct relative path for assets

  @ViewChild('media') media!: ElementRef<HTMLVideoElement>; // Use non-null assertion here

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.user = this.userService.gettingUser(); 

    if (this.user) {
      this.updateForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
      });
    }
  }

  toggleUpdateForm() {
    this.showUpdateForm = !this.showUpdateForm;
  }

  onUpdate() {
    if (this.updateForm.valid) {
      const updatedUser = this.updateForm.value;
      this.http.put(`http://localhost:3000/signupUsers/${this.user.id}`, updatedUser)
        .subscribe({
          next: () => {
            alert('Account updated successfully!');
            console.log("Updated user:", updatedUser); // Log the updated user
            this.userService.setUser(updatedUser);
            console.log("User after setting in service:", this.userService.gettingUser()); // Log the user from service
            this.user = updatedUser;
            this.showUpdateForm = false;
          },
          error: () => alert('Failed to update account!')
        });
    }
  }

  deleteAccount() {
    if (confirm("Are you sure you want to delete your account?")) {
      const currentUser = this.userService.gettingUser();
      console.log("Deleting user with id:", currentUser?.id); // Log the ID being used for delete
      
      if (currentUser) {
        this.http.delete(`http://localhost:3000/signupUsers/${currentUser.id}`)
          .subscribe({
            next: () => {
              alert('Account deleted successfully!');
              this.userService.setUser(null); // Clear the user data from the service
              this.router.navigate(['/']); // Redirect to home page after deletion
            },
            error: () => alert('Failed to delete account!')
          });
      } else {
        alert('No user data available for deletion');
      }
    }
  }

  // Function to check if the logged-in user is an admin
  isAdminUser(): boolean {
    return this.user?.username === 'admin' && this.user?.password === 'admin123';
  }
}
