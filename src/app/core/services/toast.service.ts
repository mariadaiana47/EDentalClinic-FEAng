import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warn';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/** Toast simplu in memorie — nu necesita biblioteca externa. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private idSeq = 1;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', durationMs = 3500): void {
    const toast: Toast = { id: this.idSeq++, message, type };
    this.toasts.update((arr) => [...arr, toast]);
    setTimeout(() => this.dismiss(toast.id), durationMs);
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string) { this.show(msg, 'error', 5000); }
  info(msg: string) { this.show(msg, 'info'); }
  warn(msg: string) { this.show(msg, 'warn', 4500); }

  dismiss(id: number): void {
    this.toasts.update((arr) => arr.filter((t) => t.id !== id));
  }
}
