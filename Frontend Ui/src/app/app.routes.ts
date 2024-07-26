import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home/home.component';
import { UserInformationComponent } from './Home/user-information/user-information.component';
import { DashboardComponent } from './Home/dashboard/dashboard.component';
import { LoginComponent } from './Home/login/login.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'home', component: HomeComponent },
    { path: 'user', component: UserInformationComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '' }
];
