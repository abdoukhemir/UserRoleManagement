// src/app/role-list/role-list.component.ts
import { Component, OnInit } from '@angular/core';
import { RoleService } from '../role.service';
import { Role } from '../role';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================


@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'] // Use styleUrls consistently
})
export class RoleListComponent implements OnInit {

  roles: Role[] = [];

  // === Inject RoleService AND NotificationService ===
  constructor(
    private roleService: RoleService,
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // ================================================

  ngOnInit(): void {
    this.getRoles(); // Fetch roles when the component initializes
  }

  getRoles(): void {
    this.roleService.getRoles()
      .subscribe({
        next: (roles: Role[]) => {
          this.roles = roles;
          console.log('Fetched Roles:', this.roles);
        },
        // === Update error handling to use NotificationService ===
        error: (error: HttpErrorResponse) => { // Use HttpErrorResponse for typing
          console.error('Error fetching roles:', error);
           this.notificationService.showError(`Error fetching roles: ${error.statusText || 'Unknown error'}`);
        }
        // ======================================================
      });
  }

  // === Updated deleteRole method to use NotificationService ===
  deleteRole(id: number): void {
    if (confirm(`Are you sure you want to delete role with ID ${id}?`)) {
      console.log(`Attempting to delete Role with ID ${id}.`);
      this.roleService.deleteRole(id)
        .subscribe({
          next: () => {
            console.log(`Role with ID ${id} deleted successfully.`);
            // === Use NotificationService for success ===
            this.notificationService.showSuccess(`Role with ID ${id} deleted successfully.`);
            // =========================================
            // Remove the deleted role from the local 'roles' array (efficient UI update)
            this.roles = this.roles.filter(role => role.id !== id);
          },
          // === Update error handling to use NotificationService ===
          error: (error: HttpErrorResponse) => { // Use HttpErrorResponse for typing
            console.error(`Error deleting role with ID ${id}:`, error);
            // Replace existing alert/console.error logic with NotificationService
             if (error.status === 409) {
                 this.notificationService.showError('Cannot delete role because it is currently assigned to one or more users.');
             } else {
                 this.notificationService.showError(`An error occurred while trying to delete role: ${error.statusText || 'Unknown error'}.`);
             }
          }
          // ======================================================
        });
    }
  }
  // ======================================================
}