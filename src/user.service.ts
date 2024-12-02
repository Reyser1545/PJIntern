import { Injectable } from '@angular/core';
//
@Injectable({
  providedIn: 'root'
})
export class UserService {
  clearUser() {
    sessionStorage.removeItem('user'); // Remove user data from sessionStorage
  }
  user: any;
  // Set user data in sessionStorage
  setUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  // Get user data from sessionStorage
  gettingUser() {
    if (typeof sessionStorage !== 'undefined') {//protect reserver and session not found
      // Safe to use sessionStorage here
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null; // or some fallback
  }
  getUserRole(): string {
    const user = this.gettingUser();
    return user?.role || ''; // Return role if exists
  }
  // Check if the user is admin
  isAdmin(): boolean {
    const user = this.gettingUser(); // Retrieve user from sessionStorage
    return user?.role === 'admin'; // Directly access role from the user object
  }
  
}
