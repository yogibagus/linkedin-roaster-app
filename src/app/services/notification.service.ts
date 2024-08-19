import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<any>(null);
  notification$ = this.notificationSubject.asObservable();

  private notificationTimeout: any; // Simpan referensi timer

  showNotification(
    type: string = 'success',
    title: string, 
    message: string, 
    duration: number = 5000
  ) {
    this.notificationSubject.next({ type, title, message });

    // Bersihkan timer sebelumnya
    clearTimeout(this.notificationTimeout);

    // Set timer baru
    this.notificationTimeout = setTimeout(() => {
      this.hideNotification();
    }, duration);
  }

  hideNotification() {
    this.notificationSubject.next(null);
  }
}