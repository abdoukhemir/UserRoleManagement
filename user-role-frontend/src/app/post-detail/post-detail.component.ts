// src/app/post-detail/post-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router'; // Import Router
import { PostService } from '../post.service';
import { Post } from '../post';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
// === Import UserService and User interface ===
import { UserService } from '../user.service'; // Import UserService
import { User } from '../user'; // Import User interface (adjust path if needed)
// ===========================================
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================


@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], // Make sure these are imported
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  post: Post | undefined;
  // === Property to hold the author's user data ===
  author: User | undefined;
  // =============================================

  // === Inject UserService in addition to others, AND NotificationService ===
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService, // Inject UserService
    private router: Router, // Inject Router if needed for navigation on error
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // =======================================================================

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const idNumber = +idParam;

      if (!isNaN(idNumber)) {
         console.log(`Fetching Post with ID: ${idNumber}`); // Changed from 'Workspaceing'
         this.postService.getPostById(idNumber)
           .subscribe({
             next: (post: Post) => {
               this.post = post; // Assign the fetched post

               // === After fetching the post, fetch the author's user data ===
               // Check if the post has a valid userId
               if (this.post.userId !== undefined && this.post.userId !== null) {
                  console.log(`Fetching Author with User ID: ${this.post.userId}`); // Changed from 'Workspaceing'
                  this.userService.getUserById(this.post.userId) // Call UserService to get the user by ID
                     .subscribe({
                        next: (user: User) => {
                           this.author = user; // Assign the fetched user as the author
                           console.log('Fetched Author:', this.author);
                           // Optional success notification for fetching author if desired
                           // this.notificationService.showSuccess(`Author data loaded for ${user.username}.`);
                        },
                        // === Use NotificationService for author fetch error ===
                        error: (userError: HttpErrorResponse) => {
                           console.error(`Error fetching author with ID ${this.post?.userId}:`, userError);
                           // Replace console.error with notification service call
                           this.notificationService.showError(`Error loading author data: ${userError.statusText || 'Unknown error'}`);
                           this.author = undefined; // Ensure author is undefined on error
                        }
                        // ======================================================
                     });
               } else {
                   console.warn('Post does not have a valid Author User ID.');
                   this.author = undefined; // Ensure author is undefined if no userId on post
                   // Optional notification if no author ID
                   // this.notificationService.showError('Post does not have an assigned author.');
               }
               // =============================================================

               console.log('Fetched Post:', this.post); // Log post after attempting to fetch author
               // Optional success notification for fetching post if desired
               // this.notificationService.showSuccess(`Post details loaded.`);
             },
             // === Use NotificationService for post fetch error ===
             error: (error: HttpErrorResponse) => {
               console.error('Error fetching post:', error);
               if (error.status === 404) {
                  // Replace alert with notification service call
                  this.notificationService.showError('Post not found!');
                  // Consider navigating back
                  // this.router.navigate(['/posts']);
               } else {
                    // Replace alert with notification service call
                   this.notificationService.showError(`Error fetching post: ${error.statusText || 'Unknown error'}`);
               }
               this.post = undefined; // Ensure post is undefined on error
             }
             // ======================================================
           });
         } else {
            console.error('Invalid post ID in route parameters.');
            // === Use NotificationService for invalid ID error ===
            // Replace console.error with notification service call
            this.notificationService.showError('Invalid post ID provided.');
            // ==================================================
            // Optional: Handle invalid ID - display message or navigate back
            // this.router.navigate(['/posts']);
         }
      } else {
        console.error('No post ID found in route parameters.');
        // === Use NotificationService for missing ID error ===
        // Replace console.error with notification service call
        this.notificationService.showError('No post ID found.');
        // ==================================================
        // Optional: Handle missing ID - display message or navigate back
        // this.router.navigate(['/posts']);
      }
  }

  // Optional: Add deletePost method here if you want to delete from detail view
  // (We added this previously, ensure it's still there if you want it)
  // deletePost(): void { ... }
}
