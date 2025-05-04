// src/app/post-edit/post-edit.component.ts
import { Component, OnInit } from '@angular/core'; // Import OnInit
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Import ActivatedRoute, Router, RouterLink
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import FormBuilder, FormGroup, Validators, ReactiveFormsModule
import { PostService } from '../post.service'; // Import PostService
import { Post } from '../post'; // Import Post interface
import { UserService } from '../user.service'; // Import UserService
import { User } from '../user'; // Import User interface
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { forkJoin, Observable } from 'rxjs'; // Import forkJoin
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================


@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Ensure these are imported
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'] // Use styleUrls consistently
})
export class PostEditComponent implements OnInit { // Implement OnInit

  // Define the FormGroup for the post edit form
  editPostForm!: FormGroup; // Use ! to assert initialization

  // Property to store the post ID from the route
  postId!: number; // Use ! to assert initialization

  // Property to hold the list of all users for the dropdown
  users: User[] = [];

  // === Inject ActivatedRoute, FormBuilder, Router, PostService, UserService, AND NotificationService ===
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private postService: PostService,
    private userService: UserService, // Inject UserService
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // ===================================================================================================

  ngOnInit(): void {
    // Get the post ID from the route parameters
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const idNumber = +idParam; // Convert string ID to number

      if (!isNaN(idNumber)) {
        this.postId = idNumber; // Store the post ID

        // === Use forkJoin to fetch both the post to edit AND the list of all users ===
        forkJoin({
           post: this.postService.getPostById(this.postId), // Fetch the specific post
           users: this.userService.getUsers() // Fetch all users for the dropdown
        }).subscribe({
           next: (results: { post: Post, users: User[] }) => {
              this.users = results.users; // Assign fetched users

              // Initialize the form *after* data is fetched
              this.editPostForm = this.formBuilder.group({
                 // Use fetched post data to pre-fill the form controls
                 content: [results.post.content, Validators.required],
                 // Pre-fill userId from fetched post data
                 userId: [results.post.userId, [Validators.required, Validators.min(1)]],
              });
              console.log('Fetched Post for edit:', results.post);
              console.log('Fetched Users for dropdown:', this.users);
           },
           // === Update error handling to use NotificationService ===
           error: (error: HttpErrorResponse) => {
               console.error('Error fetching data for post edit:', error);
               if (error.status === 404) {
                  // Replace alert with notification service call
                  this.notificationService.showError('Post not found!');
                  // Consider navigating back
                  // this.router.navigate(['/posts']);
               } else {
                   // Replace alert with notification service call
                   this.notificationService.showError(`Error loading post data: ${error.statusText || 'Unknown error'}`);
               }
           }
           // ==========================================================================
        });

      } else {
        console.error('Invalid post ID in route parameters.');
         // === Use NotificationService for invalid ID error ===
         this.notificationService.showError('Invalid post ID provided for editing.');
         // ==================================================
         // Optional: Navigate back to post list
         // this.router.navigate(['/posts']);
      }
    } else {
      console.error('No post ID found in route parameters for edit.');
       // === Use NotificationService for missing ID error ===
       this.notificationService.showError('No post ID found for editing.');
       // ==================================================
       // Optional: Navigate back to post list
       // this.router.navigate(['/posts']);
    }
  }

  // === Updated onSubmit method to use NotificationService ===
  onSubmit(): void {
    // Check if the form is initialized and valid, and postId is set
    if (this.editPostForm?.valid && this.postId !== undefined) { // Use ?. for safety
      // Get the form value
      const updatedPostData = this.editPostForm.value;

       // Ensure userId is a number if it came from a string input (select value is usually string)
      const userIdNumber = typeof updatedPostData.userId === 'string' ? +updatedPostData.userId : updatedPostData.userId;

      // Create a Post object to send for update, including the ID
      const postToUpdate: Post = {
          id: this.postId, // Include the ID from the route
          content: updatedPostData.content,
          userId: userIdNumber // Use the value from the form (selected user ID)
          // Include other properties if you added them to the form and Post interface
      };

      console.log('Attempting to update post:', postToUpdate);

      this.postService.updatePost(postToUpdate) // Call the update service method
        .subscribe({
          next: () => { // 'next' handles the successful response (often no body for PUT)
            console.log(`Post with ID ${this.postId} updated successfully!`);
             // === Use NotificationService for success ===
             // Replace console.log with notification service call
             this.notificationService.showSuccess(`Post updated successfully.`); // You could add post ID or content preview
             // =========================================
            // Navigate back to the post list page after successful update
            this.router.navigate(['/posts']);
          },
          // === Update error handling to use NotificationService ===
          error: (error: HttpErrorResponse) => { // Use HttpErrorResponse for typing
            console.error(`Error updating post with ID ${this.postId}:`, error);
            // Replace console.error/alert with notification service call
            this.notificationService.showError(`Error updating post: ${error.statusText || 'Unknown error'}`);
            // ======================================================
            // Optional: Keep form data for correction
          }
        });
    } else {
       // Handle form invalid or missing ID case
      this.editPostForm?.markAllAsTouched(); // Use ?. for safety
      console.log('Edit form is invalid or Post ID is missing, not submitting.');
      // Optional: Show an error notification for invalid form
      // this.notificationService.showError('Please correct the errors in the form.');
    }
  }
}
