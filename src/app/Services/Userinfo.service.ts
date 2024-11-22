import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usermodel } from '../Model/user';
@Injectable({
  providedIn: 'root'
})
export class UserInfo {
  private apiUrl = "http://localhost:3000/users"
  //constructor() { }
    
    //http = inject(HttpClient);
    constructor(private http: HttpClient) {}  // Correct constructor injection
  
    
    getUsers() :Observable<Usermodel[]>
    {
      return this.http.get<Usermodel[]>(this.apiUrl)
    }
    addUser(user : Usermodel): Observable<Usermodel>
    {
      return this.http.post<Usermodel>(this.apiUrl, user);
    }
    updateUser(user: Usermodel): Observable<Usermodel> {
      return this.http.put<Usermodel>(`${this.apiUrl}/${user.id}`, user);
    }
    deleteUser(id: number): Observable<void> 
    {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

  
  
}
