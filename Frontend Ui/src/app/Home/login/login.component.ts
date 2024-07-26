import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf , FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private apiService:ApiServiceService
  ) {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      const payload = this.form.value;
      this.apiService.login(payload).subscribe({
        next: (res:any) => {
          if (res) {
      this.router.navigate(['/user']);
          }
        },
        error: (err) => {
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }

}