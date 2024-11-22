import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private user: any = null; //เก็บเป็น null

  setUser(user: any) { //เก็บค่าที่เข้ามาใส่ใน user
    this.user = user;//
  }
  gettingUser() {
    return this.user; // ข้อมูลผู้ใช้สามารถถูกดึงออกมาใช้งานที่ส่วนต่างๆ ของแอปพลิเคชันผ่านการเรียก
  }
  isAdmin() {
    return this.user && this.user === 'admin'; // Check if user role is 'admin'
  }
  
}
