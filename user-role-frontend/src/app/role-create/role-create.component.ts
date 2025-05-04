// src/app/role-create/role-create.component.ts
import { Component, OnInit } from '@angular/core'; // Import OnInit
// === Import modules for Reactive Forms and Router ===
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router ,RouterLink } from '@angular/router';
// =====================================================
import { RoleService } from '../role.service'; // Import RoleService (adjust path if needed)
import { CommonModule } from '@angular/common'; // For standalone components
import { Role } from '../role'; // Import Role interface (optional, for typing)
import { HttpErrorResponse } from '@angular/common/http'; // For typing error
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================

@Component({
  selector: 'app-role-create',
  standalone: true,
  // === Add ReactiveFormsModule and CommonModule to imports ===
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  // =========================================================
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css'] // Use styleUrls consistently
})
export class RoleCreateComponent implements OnInit { // Implement OnInit

  // Define the FormGroup for the role creation form
  roleForm!: FormGroup; // Use ! to assert that it will be initialized in ngOnInit

  // === Inject FormBuilder, RoleService, Router, AND NotificationService ===
  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // ====================================================================

  ngOnInit(): void {
    // Initialize the form group with a form control for the role name
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.required], // FormControl for role name, required
    });
  }

  // === Updated onSubmit method to use NotificationService ===
  onSubmit(): void {
    // Check if the form is valid before attempting to submit
    if (this.roleForm.valid) {
      // Get the form value (which is an object { name: '...' })
      const newRole: Omit<Role, 'id'> = this.roleForm.value; // Use Omit as backend generates ID

      console.log('Attempting to create role:', newRole); // Keep console log if helpful

      // Call the roleService.createRole method and subscribe to the observable
      this.roleService.createRole(newRole)
        .subscribe({
          next: (createdRole: Role) => { // 'next' handles the successful response
            console.log('Role created successfully:', createdRole);
             // === Use NotificationService for success ===
             this.notificationService.showSuccess(`Role "${createdRole.name}" created successfully.`);
             // =========================================
            // Navigate back to the role list page after successful creation
            this.router.navigate(['/roles']);
          },
          // === Update error handling to use NotificationService ===
          error: (error: HttpErrorResponse) => { // Use HttpErrorResponse for typing
            console.error('Error creating role:', error);
            this.notificationService.showError(`Error creating role: ${error.statusText || 'Unknown error'}`);
          }
          // ======================================================
        });
    } else {
      // If the form is invalid (e.g., due to validation errors),
      // mark fields as touched to display validation messages
      this.roleForm.markAllAsTouched();
      console.log('Role form is invalid, not submitting.'); // Keep console log
       // Optional: Show an error notification for invalid form
       // this.notificationService.showError('Please fill in the role name.');
    }
  }
  // ======================================================
}
