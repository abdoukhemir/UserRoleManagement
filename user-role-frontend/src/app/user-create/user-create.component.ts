// src/app/user-create/user-create.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { User } from '../user';
// === Import HttpErrorResponse for better error typing ===
import { HttpErrorResponse } from '@angular/common/http';
// ======================================================
// Notification Service is already correctly imported
import { NotificationService } from '../notification.service';


@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'] // Use styleUrls consistently
})
export class UserCreateComponent implements OnInit {

  userForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService // Correctly injected
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // === Updated onSubmit method to use NotificationService ===
  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      console.log('Attempting to create user:', newUser);

      this.userService.createUser(newUser)
        .subscribe({
          next: (createdUser: User) => {
            console.log('User created successfully:', createdUser);
            // === Use NotificationService for success ===
            this.notificationService.showSuccess(`User "${createdUser.username}" created successfully.`);
            // =========================================
            this.router.navigate(['/users']); // Navigate after showing success message
          },
          // === Use HttpErrorResponse type and NotificationService for error ===
          error: (error: HttpErrorResponse) => { // Use HttpErrorResponse for typing
            console.error('Error creating user:', error);
            this.notificationService.showError(`Error creating user: ${error.statusText || 'Unknown error'}`);
            // ==============================================================
          }
        });
    } else {
      this.userForm.markAllAsTouched();
      console.log('Form is invalid, not submitting.');
      // Optional: Show an error notification for invalid form
      // this.notificationService.showError('Please fill in all required fields correctly.');
    }
  }
  // ======================================================
}