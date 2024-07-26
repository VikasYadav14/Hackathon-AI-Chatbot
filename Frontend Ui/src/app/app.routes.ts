import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home/home.component';
import { UserInformationComponent } from './Home/user-information/user-information.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'user', component: UserInformationComponent },
    { path: '**', redirectTo: '' }
];
