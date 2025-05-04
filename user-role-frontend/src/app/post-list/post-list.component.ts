// src/app/post-list/post-list.component.ts
import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../user.service';
import { User } from '../user';
import { forkJoin, Observable } from 'rxjs';
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================


@Component({
  selector: 'app-post-list',
  standalone: true,
  // Keep existing imports and add CommonModule/RouterLink if not there
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];
  // === Property to hold the list of all users ===
  users: User[] = [];
  // ============================================

  // === Inject UserService in addition to PostService ===
  constructor(
    private postService: PostService,
    private userService: UserService,
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // ===================================================

  ngOnInit(): void {
    // === Use forkJoin to fetch both posts and users concurrently ===
    forkJoin({
       posts: this.postService.getPosts(), // Fetch all posts
       users: this.userService.getUsers() // Fetch all users
    }).subscribe({
       // 'next' receives an object with results from both observables
       next: (results: { posts: Post[], users: User[] }) => {
          this.posts = results.posts; // Assign fetched posts
          this.users = results.users; // Assign fetched users
          console.log('Fetched Posts:', this.posts);
          console.log('Fetched Users:', this.users);
       },
       // === Update error handling to use NotificationService ===
       error: (error: HttpErrorResponse) => {
           console.error('Error fetching data for post list:', error);
           // Replace alert with notification service call
           this.notificationService.showError('Error loading posts or users.');
       }
       // ==========================================================
    });
    // ============================================================
  }

  // === Helper method to find author name by User ID ===
  getAuthorName(userId: number): string {
    // Find the user in the 'users' array whose id matches the post's userId
    const author = this.users.find(user => user.id === userId);
    // Return the username if found, otherwise return a placeholder
    return author ? author.username : 'Unknown Author';
  }
  // ==================================================

  // Method to re-fetch only posts (used after deletion)
  getPosts(): void {
    this.postService.getPosts()
      .subscribe({
        next: (posts: Post[]) => {
          this.posts = posts; // Assign the fetched posts
          // Optional: The users list is NOT refreshed here, only posts
        },
        // === Update error handling to use NotificationService ===
        error: (error) => {
          console.error('Error fetching posts:', error);
          // Use notification service for error
          this.notificationService.showError('Error refreshing posts list.');
        }
        // ======================================================
      });
  }

  // === Updated deletePost method to use NotificationService ===
  deletePost(id: number): void {
    if (confirm(`Are you sure you want to delete post with ID ${id}?`)) {
      console.log(`Attempting to delete Post with ID ${id} (from list).`);
      this.postService.deletePost(id)
        .subscribe({
          next: () => {
            // === Use NotificationService for success ===
            // Replace console.log with notification service call
            this.notificationService.showSuccess(`Post with ID ${id} deleted successfully.`);
            // =========================================
            this.getPosts(); // Re-fetch the list of posts
          },
          // === Update error handling to use NotificationService ===
          error: (error: HttpErrorResponse) => {
            console.error(`Error deleting post with ID ${id}:`, error);
             // Replace alert with notification service call
             this.notificationService.showError(`Error deleting post: ${error.statusText || 'Unknown error'}`);
          }
          // ======================================================
        });
    }
  }
  // ======================================================
}
