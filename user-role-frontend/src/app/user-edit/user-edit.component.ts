// src/app/user-edit/user-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================


@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Ensure RouterLink is here
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'] // Use styleUrls consistently
})
export class UserEditComponent implements OnInit {

  editUserForm!: FormGroup;
  userId!: number;

  // === Inject NotificationService ===
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // ==================================

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const idNumber = +idParam;

      if (!isNaN(idNumber)) {
        this.userId = idNumber; // Store the ID
        this.getUser(idNumber); // Fetch the user data
      } else {
        console.error('Invalid user ID in route parameters for edit.');
         // === Use NotificationService for invalid ID error ===
         this.notificationService.showError('Invalid user ID provided for editing.');
         // ==================================================
         // Optional: Navigate back to user list if ID is invalid
         // this.router.navigate(['/users']);
      }
    } else {
      console.error('No user ID found in route parameters for edit.');
       // === Use NotificationService for missing ID error ===
       this.notificationService.showError('No user ID found for editing.');
       // ==================================================
       // Optional: Navigate back to user list if ID is missing
       // this.router.navigate(['/users']);
    }
  }

  // Method to fetch the user data for editing
  getUser(id: number): void {
    this.userService.getUserById(id)
      .subscribe({
        next: (user: User) => {
          // Initialize the form with the fetched user data
          this.editUserForm = this.formBuilder.group({
            username: [user.username, Validators.required],
            email: [user.email, [Validators.required, Validators.email]],
            // Add password field here if you included it in the FormGroup and want to edit it
            // password: ['', [Validators.minLength(6)]] // You might want to handle password edits separately
          });
           console.log('Fetched user data for editing:', user);
        },
        // === Update error handling to use NotificationService ===
        error: (error: HttpErrorResponse) => { // Use HttpErrorResponse for typing
          console.error(`Error fetching user with ID ${id} for edit:`, error);
           if (error.status === 404) {
              this.notificationService.showError(`User with ID ${id} not found.`);
           } else {
              this.notificationService.showError(`Error loading user data: ${error.statusText || 'Unknown error'}`);
           }
           // Optional: Navigate back to user list on error
           // this.router.navigate(['/users']);
        }
        // ======================================================
      });
  }


  // === Updated onSubmit method to use NotificationService ===
  onSubmit(): void {
    if (this.editUserForm?.valid && this.userId !== undefined) { // Use ?. for safety
      const updatedUser = this.editUserForm.value;

      const userWithId: User = {
        id: this.userId,
        username: updatedUser.username,
        email: updatedUser.email,
        userRoles: [] // <--- Add this empty array to satisfy the User interface
        // Include other properties if you added them to the form and User interface
        // password: updatedUser.password // Include password if you are editing it
    };

      console.log('Attempting to update user:', userWithId);

      this.userService.updateUser(userWithId)
        .subscribe({
          next: () => {
            console.log(`User with ID ${this.userId} updated successfully!`);
             // === Use NotificationService for success ===
             this.notificationService.showSuccess(`User updated successfully.`); // You could add username if you fetched it
             // =========================================
            this.router.navigate(['/users']); // Navigate back to list
          },
          // === Update error handling to use NotificationService ===
          error: (error: HttpErrorResponse) => { // Use HttpErrorResponse if imported
            console.error(`Error updating user with ID ${this.userId}:`, error);
            // Replace console.error/alert with notification service call
            this.notificationService.showError(`Error updating user: ${error.statusText || 'Unknown error'}`);
            // ======================================================
            // Optional: Keep form data for correction
          }
        });
    } else {
      this.editUserForm?.markAllAsTouched();
      console.log('Edit form is invalid or User ID is missing, not submitting.');
      // Optional: Show an error notification for invalid form
      // this.notificationService.showError('Please correct the errors in the form.');
    }
  }
  // ================================================================
}
