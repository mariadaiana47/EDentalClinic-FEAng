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
           [class]="'toast-item ' + toast.type"
           (click)="toastService.remove(toast.id)">
        <div class="toast-icon">
          <i class="bi"
             [class.bi-check-circle-fill]="toast.type === 'success'"
             [class.bi-x-circle-fill]="toast.type === 'error'"
             [class.bi-info-circle-fill]="toast.type === 'info'"></i>
        </div>
        <div class="toast-body">
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="$event.stopPropagation(); toastService.remove(toast.id)">
          <i class="bi bi-x"></i>
        </button>
        <div class="toast-progress" [class]="'toast-progress ' + toast.type"></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      min-width: 300px;
      max-width: 420px;
      background: #ffffff;
      border-radius: 0.75rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      padding: 0.875rem 1rem 0.875rem 1.125rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border-left: 4px solid #3cbdd4;
      animation: toastIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
    }

    .toast-item.success { border-left-color: #3cbdd4; }
    .toast-item.error   { border-left-color: #ef4444; }
    .toast-item.info    { border-left-color: #3b82f6; }

    .toast-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
      line-height: 1;
    }
    .success .toast-icon { color: #3cbdd4; }
    .error   .toast-icon { color: #ef4444; }
    .info    .toast-icon { color: #3b82f6; }

    .toast-body {
      flex: 1;
      min-width: 0;
    }

    .toast-message {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1a202c;
      line-height: 1.45;
    }

    .toast-close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      flex-shrink: 0;
      line-height: 1;
      transition: color 0.15s;
    }
    .toast-close:hover { color: #374151; }

    /* Progress bar */
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      animation: toastProgress 4s linear forwards;
      border-radius: 0 0 0.75rem 0.75rem;
    }
    .toast-progress.success { background: #3cbdd4; }
    .toast-progress.error   { background: #ef4444; }
    .toast-progress.info    { background: #3b82f6; }

    @keyframes toastIn {
      from {
        transform: translateX(calc(100% + 1.5rem));
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes toastProgress {
      from { width: 100%; }
      to   { width: 0%; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
