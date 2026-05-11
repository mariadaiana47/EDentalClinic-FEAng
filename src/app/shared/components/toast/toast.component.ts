import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()" 
           class="toast-item" 
           [class]="toast.type"
           (click)="toastService.remove(toast.id)">
        <div class="toast-icon">
          <i class="bi" [class.bi-check-circle-fill]="toast.type === 'success'"
                       [class.bi-exclamation-triangle-fill]="toast.type === 'error'"
                       [class.bi-info-circle-fill]="toast.type === 'info'"></i>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      min-width: 280px;
      max-width: 400px;
      background: #ffffff;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid #3cbdd4;
    }

    .toast-item.success { border-left-color: #3cbdd4; }
    .toast-item.error { border-left-color: #ef4444; }
    .toast-item.info { border-left-color: #3b82f6; }

    .toast-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .success .toast-icon { color: #3cbdd4; }
    .error .toast-icon { color: #ef4444; }
    .info .toast-icon { color: #3b82f6; }

    .toast-message {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1a202c;
      line-height: 1.4;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
