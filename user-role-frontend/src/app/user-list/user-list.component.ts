
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http'; 
import { RouterLink } from '@angular/router';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  // === Make sure RouterLink is added to the imports array ===
  imports: [CommonModule, RouterLink],
  // ========================================================
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService ,
    private notificationService: NotificationService 
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          console.log('Fetched Users:', this.users);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching users:', error);
           // Use alert for now, will replace later
           alert('Error fetching users.'); // Will replace with notification
        }
      });
  }

  deleteUser(id: number): void {
    // Optional: Add a confirmation dialog before deleting
    if (confirm(`Are you sure you want to delete user with ID ${id}?`)) {
      console.log(`Attempting to delete User with ID ${id}.`);
      // Call the userService.deleteUser method
      this.userService.deleteUser(id)
        .subscribe({
          next: () => {
            // === Use NotificationService for success ===
            this.notificationService.showSuccess(`User with ID ${id} deleted successfully.`);
            // =========================================
            this.getUsers(); // Re-fetch the user list
          },
          error: (error: HttpErrorResponse) => {
            console.error(`Error deleting user with ID ${id}:`, error);
             // === Use NotificationService for error ===
             // Make sure the old alert() call is removed or commented out!
             this.notificationService.showError(`Error deleting user: ${error.statusText || 'Unknown error'}`);
             // ==================================================================
          }
        });
    }
  }
}