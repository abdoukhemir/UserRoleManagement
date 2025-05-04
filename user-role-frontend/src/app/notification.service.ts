// src/app/notification.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable, timer, Subscription } from 'rxjs'; // Import necessary RxJS items
import { takeUntil } from 'rxjs/operators';

// === Define a type for the notification message ===
export interface Notification {
  message: string;
  type: 'success' | 'error'; // 'success' or 'error'
}
// ================================================

@Injectable({
  providedIn: 'root' // Provided in 'root' makes it a singleton service
})
export class NotificationService {

  // === Subject to emit notification messages ===
  // Emits Notification objects or null (to clear)
  private notificationSubject = new Subject<Notification | null>();
  // Public Observable that components subscribe to
  notification$ = this.notificationSubject.asObservable();
  // ============================================

  private timerSubscription: Subscription | undefined; // To manage the timer subscription

  constructor() { }

  // Method to show a success notification
  showSuccess(message: string, duration: number = 5000): void {
    this.clear(); // Clear any existing notification
    const notification: Notification = { message, type: 'success' };
    this.notificationSubject.next(notification); // Emit the success notification
    this.startTimer(duration); // Start timer to auto-clear
  }

  // Method to show an error notification
  showError(message: string, duration: number = 7000): void {
    this.clear(); // Clear any existing notification
    const notification: Notification = { message, type: 'error' };
    this.notificationSubject.next(notification); // Emit the error notification
    this.startTimer(duration); // Start timer to auto-clear
  }

  // Method to clear the current notification
  clear(): void {
    // Stop the timer if it's running
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined; // Reset subscription
    }
    this.notificationSubject.next(null); // Emit null to clear the notification
  }

  // Helper method to start the timer for auto-clearing
  private startTimer(duration: number): void {
      // Clear any existing timer before starting a new one
      if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
      }
      // Create a timer observable that emits after 'duration' milliseconds
      this.timerSubscription = timer(duration).subscribe(() => {
          this.clear(); // Clear the notification when the timer completes
      });
  }
}