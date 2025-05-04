// src/app/post-create/post-create.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { PostService } from '../post.service';
import { Post } from '../post';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../user.service';
import { User } from '../user';
import { combineLatest } from 'rxjs'; // Import combineLatest
import { map, take } from 'rxjs/operators'; // Import operators
// === Import NotificationService ===
import { NotificationService } from '../notification.service';
// ==================================


@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  postForm!: FormGroup;
  users: User[] = []; // List of users for the dropdown
  private prefillUserId: number | null = null; // Property to store potential prefill ID


  // === Inject ActivatedRoute, FormBuilder, Router, PostService, UserService, AND NotificationService ===
  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private notificationService: NotificationService // Inject NotificationService
  ) { }
  // ===================================================================================================

  ngOnInit(): void {
     // Initialize the form group first
    this.postForm = this.formBuilder.group({
      content: ['', Validators.required],
      userId: [null, Validators.required],
    });

    // Get potential prefill userId from query parameters
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
       const userIdParam = params.get('userId');
       if (userIdParam) {
          const idNumber = +userIdParam;
          if (!isNaN(idNumber)) {
             this.prefillUserId = idNumber; // Store the prefill ID
             console.log('Prefill userId found in query params:', this.prefillUserId);
          }
       }
    });

    // Fetch users and then potentially pre-fill the form
    this.userService.getUsers().subscribe({
        next: (users: User[]) => {
          this.users = users;
          console.log('Fetched Users for dropdown:', this.users);

          // If a prefillUserId exists and is valid among fetched users, set the form control value
          if (this.prefillUserId !== null) {
             const userToPrefill = this.users.find(user => user.id === this.prefillUserId);
             if (userToPrefill) {
                this.postForm.get('userId')?.setValue(this.prefillUserId);
                console.log(`Prefilled userId form control with ID: ${this.prefillUserId}`);
             } else {
                console.warn(`Prefill userId ${this.prefillUserId} not found in the list of users.`);
                // Optional: Show a notification if prefill user not found
                // this.notificationService.showError(`Prefill user with ID ${this.prefillUserId} not found.`);
             }
          } else {
             // Optional: If no prefill ID, set the default dropdown value if users are loaded
             // if (this.users.length > 0) {
             //    this.postForm.get('userId')?.setValue(this.users[0].id);
             // }
          }
        },
        // === Update error handling to use NotificationService ===
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching users for dropdown:', error);
          // Replace alert with notification service call
          this.notificationService.showError('Error loading users for author selection.');
        }
        // ======================================================
      });
  }

  // === Updated onSubmit method to use NotificationService ===
  onSubmit(): void {
    if (this.postForm.valid) {
      const newPostData = this.postForm.value;

      const userIdNumber = typeof newPostData.userId === 'string' ? +newPostData.userId : newPostData.userId;

      const newPost: Omit<Post, 'id'> = {
         content: newPostData.content,
         userId: userIdNumber
      };

      console.log('Attempting to create post:', newPost);

      this.postService.createPost(newPost)
        .subscribe({
          next: (createdPost: Post) => {
            console.log('Post created successfully:', createdPost);
            // === Use NotificationService for success ===
            // Replace console.log with notification service call
            this.notificationService.showSuccess(`Post created successfully!`); // You could add post ID or content preview
            // =========================================
            this.router.navigate(['/posts']); // Navigate after showing success message
          },
          // === Update error handling to use NotificationService ===
          error: (error: HttpErrorResponse) => {
            console.error('Error creating post:', error);
             // Replace alert with notification service call
             this.notificationService.showError(`Error creating post: ${error.statusText || 'Unknown error'}`);
          }
          // ======================================================
        });
    } else {
      this.postForm.markAllAsTouched();
      console.log('Form is invalid, not submitting.');
      // Optional: Show an error notification for invalid form
      // this.notificationService.showError('Please fill in all required fields correctly.');
    }
  }
  // ======================================================
}
