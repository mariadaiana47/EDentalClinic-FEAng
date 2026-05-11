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
    <div class="dental-chart-wrapper">
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
        Dinti selectati: <strong>{{ selectedTeeth().join(', ') }}</strong>
      </div>
    </div>
    </div>
  `,
  styles: [`
    .dental-chart-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .dental-chart { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 1.25rem; background: #f8fafc; border-radius: 0.75rem; min-width: 640px; }
    .jaw { display: flex; gap: 0.375rem; justify-content: center; }
    .tooth {
      width: 38px; height: 56px;
      border: 1.5px solid #d1d5db; border-radius: 0.3rem;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: #fff; cursor: pointer; transition: all 0.15s; gap: 2px;
    }
    .tooth:hover { border-color: #3cbdd4; background: #f0fbfd; }
    .tooth.selected { background: #3cbdd4; border-color: #2aa8bf; }
    .tooth.selected .tooth-label { color: #fff; }
    .tooth-label { font-size: 0.68rem; font-weight: 700; color: #374151; }
    .tooth-icon { font-size: 1.2rem; }
    .divider { width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #3cbdd4, transparent); margin: 0.25rem 0; }
    .selection-info { font-size: 0.82rem; color: #6b7280; }
    .selection-info strong { color: #3cbdd4; }
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
