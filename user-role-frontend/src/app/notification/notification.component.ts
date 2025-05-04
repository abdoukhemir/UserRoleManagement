import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnInit, OnDestroy
// === Import CommonModule, NotificationService, Notification, Subscription ===
import { CommonModule } from '@angular/common'; // Needed for *ngIf in the template
import { NotificationService, Notification } from '../notification.service'; // Import the service and the Notification type
import { Subscription } from 'rxjs'; // Needed to manage the subscription
// ========================================================================


@Component({
  selector: 'app-notification',
  standalone: true, // === ENSURE THIS IS TRUE ===
  // === Add CommonModule to imports ===
  imports: [CommonModule], // Add CommonModule here for *ngIf in template
  // ===================================
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'] // Link to CSS file (or remove if using inline styles)
})
export class NotificationComponent implements OnInit, OnDestroy { // Implement OnInit, OnDestroy

  // Properties to hold the current notification state
  message: string | null = null;
  type: 'success' | 'error' | null = null;

  // Subscription to manage the observable subscription for cleanup
  private notificationSubscription!: Subscription; // Use ! because it's initialized in ngOnInit

  // Inject the NotificationService
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // === Subscribe to the notification service's observable ===
    this.notificationSubscription = this.notificationService.notification$
      .subscribe((notification: Notification | null) => {
        // When the service emits a value:
        if (notification) {
          // If it's a Notification object (not null), set the message and type
          this.message = notification.message;
          this.type = notification.type;
           console.log(`NotificationComponent: Received ${this.type} message: "${this.message}"`); // Log for debugging
        } else {
          // If it's null, clear the current message and type
          this.message = null;
          this.type = null;
          console.log('NotificationComponent: Received clear signal.'); // Log for debugging
        }
      });
    // ========================================================
  }

  ngOnDestroy(): void {
    // === Crucial: Unsubscribe when the component is destroyed ===
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
      console.log('NotificationComponent: Subscription unsubscribed.'); // Log
    }
    // =========================================================
  }

  // Optional: Method to manually close the notification (if you add a close button)
  closeNotification(): void {
    this.notificationService.clear(); // Call the service's clear method
  }
}