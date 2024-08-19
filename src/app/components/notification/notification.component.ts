import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  @Input() showNotification: boolean = false;
  @Input() notificationType: string = 'success'; // 'success', 'error', etc.
  @Input() title: string = '';
  @Input() message: string = '';

  closeNotification() {
    this.showNotification = false;
  }

  ngOnInit() {
    console.log(this.notificationType);
  } 
}