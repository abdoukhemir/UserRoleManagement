// src/app/role-edit/role-edit.component.ts
import { Component, OnInit } from '@angular/core'; // Import OnInit
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RoleService } from '../role.service'; // Import RoleService (adjust path if needed)
import { Role } from '../role'; // Import Role interface (adjust path if needed)
import { CommonModule } from '@angular/common'; // For standalone components using *ngIf
import { HttpErrorResponse } from '@angular/common/http'; // For typing error
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================

@Component({
  selector: 'app-role-edit',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, RouterLink],

  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css'] // Use styleUrls consistently
})
export class RoleEditComponent implements OnInit { // Implement OnInit

  // Define the FormGroup for the role edit form
  editRoleForm!: FormGroup; // Use ! to assert that it will be initialized in ngOnInit

  // Property to store the role ID from the route
  roleId!: number; // Use ! to assert that it will be initialized in ngOnInit

  // === Inject ActivatedRoute, FormBuilder, RoleService, Router, AND NotificationService ===
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // ====================================================================================

  ngOnInit(): void {
    // Get the role ID from the route parameters
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const idNumber = +idParam; // Convert string ID to number

      // Check if the conversion resulted in a valid number
      if (!isNaN(idNumber)) {
        this.roleId = idNumber; // Store the role ID

        // Fetch the existing role data using the RoleService
        this.roleService.getRoleById(this.roleId)
          .subscribe({
            next: (role: Role) => {
              // Initialize the form with the fetched role data
              this.editRoleForm = this.formBuilder.group({
                // We usually don't allow editing the ID in the form itself
                // id: [role.id], // Optional if you need the ID in the form control
                name: [role.name, Validators.required], // Pre-fill with role's name, add validation
              });
               console.log('Fetched role data for editing:', role); // Log data
            },
            // === Update error handling to use NotificationService ===
            error: (error: HttpErrorResponse) => {
              console.error('Error fetching role for edit:', error);
              // Optional: Display an error message or navigate back if role not found
              if (error.status === 404) {
                 this.notificationService.showError('Role not found!');
                 this.router.navigate(['/roles']); // Navigate back if role not found
              } else {
                 this.notificationService.showError(`Error fetching role: ${error.statusText || 'Unknown error'}`);
                 // Optional: Navigate back on other errors too
                 // this.router.navigate(['/roles']);
              }
            }
            // ======================================================
          });
      } else {
         console.error('Invalid role ID in route parameters.');
         // === Use NotificationService for invalid ID error ===
         this.notificationService.showError('Invalid role ID provided for editing.');
         // ==================================================
         // Optional: Navigate back or display an error
         this.router.navigate(['/roles']); // Navigate back if ID is invalid
      }
    } else {
      console.error('No role ID found in route parameters for edit.');
       // === Use NotificationService for missing ID error ===
      this.notificationService.showError('No role ID found for editing.');
      // ==================================================
       // Optional: Navigate back or display an error
      this.router.navigate(['/roles']); // Navigate back if no ID is provided
    }
  }


  // === Updated onSubmit method to use NotificationService ===
  onSubmit(): void {
    // Check if the form is valid before attempting to submit and if roleId is set
    if (this.editRoleForm?.valid && this.roleId !== undefined) { // Use ?. for safety
      // Get the form value (which is an object { name: '...' })
      const updatedRoleData = this.editRoleForm.value;

      // === Create a Role object including the ID for the update ===
      const roleToUpdate: Role = {
          id: this.roleId, // Include the ID from the route
          name: updatedRoleData.name
          // Include other properties if you added them to the form and Role interface
      };
      // ============================================================

      console.log('Attempting to update role:', roleToUpdate); // Log the data being sent

      this.roleService.updateRole(roleToUpdate) // Call the update service method
        .subscribe({
          next: () => { // 'next' handles the successful response (often no body for PUT)
            console.log('Role updated successfully!');
             // === Use NotificationService for success ===
             this.notificationService.showSuccess(`Role updated successfully.`); // You could add the new name if desired
             // =========================================
            // Navigate back to the role list page after successful update
            this.router.navigate(['/roles']);
          },
          // === Update error handling to use NotificationService ===
          error: (error: HttpErrorResponse) => { // Use HttpErrorResponse if imported
            console.error('Error updating role:', error);
            this.notificationService.showError(`Error updating role: ${error.statusText || 'Unknown error'}`);
            // ======================================================
            // Optional: Keep form data for correction
          }
        });
    } else {
      // If the form is invalid or roleId is missing
      this.editRoleForm?.markAllAsTouched(); // Use ?. for safety
      console.log('Edit form is invalid or Role ID is missing, not submitting.');
       // Optional: Show an error notification for invalid form
       // this.notificationService.showError('Please correct the errors in the form.');
    }
  }
}
