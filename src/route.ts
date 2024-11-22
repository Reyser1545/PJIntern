import { Routes } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { MainpageComponent } from './app/mainpage/mainpage.component';
import { AdminPageComponent } from './app/adminpage/adminpage.component';
import { UserComponent } from './app/Components/user/user.component';
import { PlaygroundComponent } from './app/playground/playground.component';


export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home Page' },
  { path: 'login', component: LoginComponent, title: 'Login Page' },
  { path: 'register', component: RegisterComponent, title: 'Register Page' },
  { path: 'mainpage', component: MainpageComponent, title: 'Main Page' },  // Ensure this path exists
  { path: 'admin', component: AdminPageComponent },
  { path: 'user', component: UserComponent },
  { path: 'play' , component: PlaygroundComponent}

];

export default routes;