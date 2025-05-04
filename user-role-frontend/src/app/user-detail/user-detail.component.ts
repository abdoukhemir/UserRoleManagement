// src/app/user-detail/user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { User, UserRole } from '../user';
import { RoleService } from '../role.service';
import { Role } from '../role';
import { forkJoin, Observable, EMPTY, catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PostService } from '../post.service'; // Ensure PostService is imported
import { Post } from '../post'; // Ensure Post is imported
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User | undefined;
  allRoles: Role[] = [];
  userId: number | undefined;
  selectedRoleIdToAssign: number | undefined;
  userPosts: Post[] = []; // Property holding the user's posts

  // === Inject PostService, Router, AND NotificationService ===
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService,
    private postService: PostService,
    private router: Router,
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // =========================================================

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const idNumber = +idParam;

      if (!isNaN(idNumber)) {
        this.userId = idNumber;
        this.fetchUserDataWithRolesAndPosts(); // Call the helper method to fetch data
      } else {
        console.error('Invalid user ID in route parameters.');
        // === Use NotificationService for invalid ID error ===
        this.notificationService.showError('Invalid user ID provided.');
        // ==================================================
        // Optional: Navigate back
        // this.router.navigate(['/users']);
      }
    } else {
      console.error('No user ID found in route parameters.');
      // === Use NotificationService for missing ID error ===
      this.notificationService.showError('No user ID found.');
      // ==================================================
      // Optional: Navigate back
      // this.router.navigate(['/users']);
    }
  }

  // === Helper method to fetch user data (with roles) AND user's posts ===
  fetchUserDataWithRolesAndPosts(): void {
     if (this.userId !== undefined) {
        console.log(`Fetching data for User ID: ${this.userId}`);
        // Use forkJoin to fetch user (with roles), all roles, AND user's posts concurrently
        forkJoin({
           userWithRoles: this.userService.getUserWithRoles(this.userId).pipe(
             catchError(error => {
               console.error('Error fetching user with roles:', error);
               // === Use NotificationService for user fetch error ===
               if (error.status === 404) {
                 this.notificationService.showError(`User with ID ${this.userId} not found.`);
               } else {
                 this.notificationService.showError(`Error loading user data: ${error.statusText || 'Unknown error'}`);
               }
               // ==================================================
               return EMPTY; // Return an empty observable to allow other fetches to complete
             })
           ),
           allRoles: this.roleService.getRoles().pipe(
             catchError(error => {
                console.error('Error fetching all roles:', error);
                // === Use NotificationService for roles fetch error ===
                this.notificationService.showError(`Error loading roles: ${error.statusText || 'Unknown error'}`);
                // ===================================================
                return EMPTY;
             })
           ),
           userPosts: this.postService.getPostsByUserId(this.userId).pipe(
              catchError(error => {
                 console.error('Error fetching user posts:', error);
                 // === Use NotificationService for user posts fetch error ===
                 this.notificationService.showError(`Error loading user posts: ${error.statusText || 'Unknown error'}`);
                 // ========================================================
                 return EMPTY;
              })
           )
        }).subscribe({
           next: (results: { userWithRoles: User, allRoles: Role[], userPosts: Post[] }) => {
              // Assign results to this.user, this.allRoles, this.userPosts
              if (results.userWithRoles) {
                 this.user = results.userWithRoles;
                 console.log('Fetched User with Roles:', this.user);
              } else {
                 this.user = undefined; // Ensure user is undefined if fetch failed
                 // Notification already shown in catchError for 404
              }

              this.allRoles = results.allRoles;
              console.log('Fetched All Roles:', this.allRoles);

              this.userPosts = results.userPosts; // Assign fetched user posts
              console.log('Fetched User Posts:', this.userPosts);


              // Pre-select the first role in the dropdown if roles are available
              if (this.allRoles.length > 0 && this.selectedRoleIdToAssign === undefined) {
                 const firstAssignableRole = this.allRoles.find(role =>
                    !this.user?.userRoles?.some(userRole => userRole.roleId === role.id) // Use ?. on userRoles
                 );
                 this.selectedRoleIdToAssign = firstAssignableRole ? firstAssignableRole.id : undefined;

              }
           },
           error: (error: HttpErrorResponse) => { // This error block might be less used due to catchError in pipe
               console.error('An error occurred during forkJoin subscribe:', error);
               // Generic error notification if something goes wrong in the subscribe itself
               this.notificationService.showError('An unexpected error occurred while loading data.');
           }
        });
     }
  }

  // This method seems redundant now that fetchUserDataWithRolesAndPosts exists.
  // It's recommended to remove this method if it's not used elsewhere.
  // If it is used, update its error handling as well.
  // fetchUserDataWithRoles(): void { ... }


 // === Updated assignRole method to use NotificationService and show correct role name ===
 assignRole(roleId: number | undefined): void {
  // Check if user ID is available and a role is selected from the dropdown
  if (this.userId !== undefined && roleId !== undefined) {

     // === Find the role name *before* making the API call ===
     const roleToAssign = this.allRoles.find(role => role.id === roleId);
     const roleName = roleToAssign ? roleToAssign.name : 'Unknown Role';
     // ========================================================

     // Check if role is already assigned using the *current* user data
      if (this.user?.userRoles?.some(userRole => userRole.roleId === roleId)) {
          // === Use NotificationService instead of alert ===
          this.notificationService.showError(`Role "${roleName}" is already assigned to this user.`);
          // ==============================================
          return; // Exit the method if already assigned
      }

    console.log(`Attempting to assign Role ID ${roleId} (${roleName}) to User ID ${this.userId}`);
    this.userService.assignRoleToUser(this.userId, roleId)
      .subscribe({
        next: () => {
          console.log('Role assigned successfully, refreshing user data.');
          // === Use NotificationService for success with the captured role name ===
          this.notificationService.showSuccess(`Role "${roleName}" assigned successfully.`);
          // =====================================================================
          this.fetchUserDataWithRolesAndPosts(); // Re-fetch user data and all roles
          // Optional: Reset the dropdown selection after successful assignment
          // this.selectedRoleIdToAssign = undefined; // Or set back to the first unassigned role
        },
        // === Update error handling to use NotificationService ===
        error: (error: HttpErrorResponse) => {
          console.error('Error assigning role:', error);
           // Replace alert with notification service call
           if (error.status === 409) { // Example: backend returns 409 if already assigned
               this.notificationService.showError(`Role "${roleName}" is already assigned to this user.`); // Use captured name here too
           } else {
              this.notificationService.showError(`An error occurred while assigning the role: ${error.statusText || 'Unknown error'}`);
           }
           // =======================================
        }
      });
  } else {
      console.warn('Cannot assign role: User ID or selected Role ID is missing.');
      // Optional: Show notification for missing data
      // this.notificationService.showError('Please select a role to assign.');
  }
}
// ======================================================

// === Updated removeRole method to use NotificationService ===
removeRole(userId: number, roleId: number): void {
 // Optional: Confirmation dialog
 if (confirm(`Are you sure you want to remove this role assignment?`)) {

    // === Find the role name *before* making the API call ===
    // Note: This finds the role in the *current* user's assigned roles list
    const assignedUserRole = this.user?.userRoles?.find(ur => ur.roleId === roleId);
    const roleName = assignedUserRole?.role?.name || 'Unknown Role'; // Use safe navigation for role name
    // ========================================================

    console.log(`Attempting to remove Role ID ${roleId} (${roleName}) from User ID ${userId}`);
    this.userService.removeRoleFromUser(userId, roleId)
      .subscribe({
        next: () => {
          console.log('Role assignment removed successfully, refreshing user data.');
          // === Use NotificationService for success with the captured role name ===
           this.notificationService.showSuccess(`Role "${roleName}" removed successfully.`);
          // =====================================================================
          this.fetchUserDataWithRolesAndPosts(); // Re-fetch user data and all roles
        },
        // === Update error handling to use NotificationService ===
        error: (error: HttpErrorResponse) => {
          console.error('Error removing role assignment:', error);
           // Replace alert with notification service call
           this.notificationService.showError(`An error occurred while removing the role assignment: ${error.statusText || 'Unknown error'}`);
           // =======================================
        }
      });
 }
}
// ======================================================

isRoleAlreadyAssigned(roleId: number): boolean {
  return this.user?.userRoles?.some(userRole => userRole.roleId === roleId) || false; // Used ?. for safety
}

// === Updated deletePost method (in UserDetailComponent) to use NotificationService ===
 deletePost(postId: number): void {
   if (confirm(`Are you sure you want to delete this post (ID: ${postId})?`)) {
     console.log(`Attempting to delete Post with ID ${postId} from User Detail view.`);
     this.postService.deletePost(postId)
       .subscribe({
         next: () => {
           console.log(`Post with ID ${postId} deleted successfully.`);
           // === Use NotificationService for success ===
           this.notificationService.showSuccess(`Post with ID ${postId} deleted successfully.`);
           // =========================================
           // Re-fetch the list of user's posts after successful deletion
           this.fetchUserDataWithRolesAndPosts(); // Re-fetch all data for the page
         },
         // === Use NotificationService for error ===
         error: (error: HttpErrorResponse) => {
           console.error(`Error deleting post with ID ${postId}:`, error);
           // Replace alert with notification service call
           this.notificationService.showError(`Error deleting post: ${error.statusText || 'Unknown error'}`);
           // =======================================
         }
       });
   }
 }
 // ==================================================================================
}
