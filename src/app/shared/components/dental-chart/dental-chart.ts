import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToothCondition {
  id: number;
  label: string;
  color: string;
}

@Component({
  selector: 'app-dental-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dental-chart">
      <div class="jaw upper">
        <div *ngFor="let t of upperTeeth" 
             class="tooth" 
             [class.selected]="isSelected(t)"
             (click)="toggleTooth(t)">
          <div class="tooth-label">{{ t }}</div>
          <div class="tooth-icon">🦷</div>
        </div>
      </div>
      
      <div class="divider"></div>

      <div class="jaw lower">
        <div *ngFor="let t of lowerTeeth" 
             class="tooth" 
             [class.selected]="isSelected(t)"
             (click)="toggleTooth(t)">
          <div class="tooth-icon">🦷</div>
          <div class="tooth-label">{{ t }}</div>
        </div>
      </div>

      <div class="selection-info" *ngIf="selectedTeeth().length > 0">
        Dinți selectați: <strong>{{ selectedTeeth().join(', ') }}</strong>
      </div>
    </div>
  `,
  styles: [`
    .dental-chart { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 1.5rem; background: #f8fafc; border-radius: 1rem; }
    .jaw { display: flex; gap: 0.5rem; justify-content: center; }
    .tooth { 
      width: 40px; height: 60px; 
      border: 1px solid #cbd5e1; border-radius: 0.25rem;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: white; cursor: pointer; transition: all 0.2s;
    }
    .tooth:hover { border-color: #3b82f6; background: #eff6ff; }
    .tooth.selected { background: #3b82f6; border-color: #2563eb; color: white; }
    .tooth-label { font-size: 0.75rem; font-weight: bold; }
    .tooth-icon { font-size: 1.25rem; }
    .divider { width: 100%; height: 2px; background: #e2e880; opacity: 0.5; margin: 0.5rem 0; }
    .selection-info { margin-top: 1rem; font-size: 0.875rem; color: #475569; }
  `]
})
export class DentalChart {
  upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  @Input() set initialSelection(val: number[]) {
    if (val) this.selectedTeeth.set(val);
  }
  @Output() selectionChange = new EventEmitter<number[]>();

  selectedTeeth = signal<number[]>([]);

  toggleTooth(id: number) {
    const current = this.selectedTeeth();
    if (current.includes(id)) {
      this.selectedTeeth.set(current.filter(t => t !== id));
    } else {
      this.selectedTeeth.set([...current, id].sort());
    }
    this.selectionChange.emit(this.selectedTeeth());
  }

  isSelected(id: number) {
    return this.selectedTeeth().includes(id);
  }
}
