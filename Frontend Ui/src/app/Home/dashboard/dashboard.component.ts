import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  addEmployee() {
    //
  }

  deleteEmployee(Id: Number) {
    console.log(Id)
  }

  logout() {
    //
  }
}
