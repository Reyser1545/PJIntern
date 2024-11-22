import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Ensure HttpClientModule is here
import { UserInfo } from '../../Services/Userinfo.service';
import { Usermodel } from '../../Model/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../../user.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
//primeNG
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule,ReactiveFormsModule,
  ButtonModule,
  ],  // Add HttpClientModule here
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']  // Corrected styleUrls (not styleUrl)
})
export class UserComponent implements OnInit{
  userList: Usermodel[] = [];
  editMode: boolean = false;
  searchQuery: string = '';  // Store the search query
  filteredUserList: Usermodel[] = [];
  userForm: FormGroup;

  user: Usermodel = {
    department: "",
    name: "",
    mobile: "",
    email: "",
    gender: "",
    doj: "",
    city: "",
    salary: 0,
    address: "",
    status: false,
  };
//set validator requirement
  constructor(private _userService: UserInfo, private _toastrService: ToastrService, private router: Router, private fb: FormBuilder) {
    // Initialize the form group with validation
    this.userForm = this.fb.group({
      department: ['', Validators.required],
      name: ['', Validators.required,],
      mobile: ['', Validators.required,], 
      email: ['', Validators.required,],  // Email validation
      doj: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      salary: [this.user.salary ], 
      address: ['', Validators.required],  
      status: [false, Validators.required]
    });
  }
    
  // Inject UserInfo service

  CityList: string[] = ["Bangkok", "Seoul", "Tokyo", "Barcelona", "London"];
  departmentList: string[] = ["IT", "HR", "Accounts", "Sales", "Management"];

  ngOnInit(): void {
    this.getUserList();

  }

  getUserList() {
    this._userService.getUsers().subscribe((res) => {
      this.userList = res;
      this.filteredUserList = res;  // Direct assignment ensures filteredUserList matches the fetched data
    });
  }
  

  onSubmit(form: NgForm): void {
    debugger;
    if(this.editMode)
    { 
      console.log('Form submitted:', form);
      this._userService.updateUser(this.user).subscribe((res) => {
        this.getUserList();
        this.editMode = false;
        form.reset();
        this._toastrService.success('User Update','success')
      });
    }else{
      console.log('Form submitted:', form);
      this._userService.addUser(this.user).subscribe((res) => {
        this.getUserList();
        form.reset();
        this._toastrService.success('User adding','success')
      });
    }
   
  }

  onEdit(userdata: Usermodel): void {
    // Edit functionality here
    this.user = userdata
    this.editMode = true;
  }

  onDelete(id: any){
    // Delete functionality here
    const isConfrim = confirm('Are you Sure');
    if (isConfrim){
    this._userService.deleteUser(id).subscribe((res)=>{
      this._toastrService.error('User Deleted Succesfully','Deleted')
      this.getUserList();
    });
  }
}

  onRestForm(form : NgForm): void {
    // Reset form fields here
    form.reset();
    this.editMode = false;
    this.getUserList();
  }

  goBack(): void {
    this.router.navigate(['/mainpage']);
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredUserList = [...this.userList];  // Fresh copy of the user list
    } else {
      this.filteredUserList = this.userList.filter(user => 
        // Search by name
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        // Search by department
        user.department.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        // Search by mobile (ensure the search query can match mobile numbers)
        user.mobile.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
  

  trackByIndex(index: number, item: any): number {
    return index;  // Just return the index as the identifier for simplicity
  }
}
