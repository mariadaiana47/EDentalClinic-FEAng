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

        <div class="jaw-row-label">
          <span class="q-label">Q1 — Dreapta Sus</span>
          <span class="q-label right">Q2 — Stânga Sus</span>
        </div>

        <div class="jaw upper">
          <div class="quadrant">
            <div *ngFor="let t of q1"
                 class="tooth"
                 [class.selected]="isSelected(t)"
                 [attr.data-type]="toothType(t)"
                 (click)="toggleTooth(t)"
                 [title]="toothLabel(t)">
              <span class="tooth-num">{{ t }}</span>
              <div class="tooth-shape"></div>
            </div>
          </div>
          <div class="midline"></div>
          <div class="quadrant">
            <div *ngFor="let t of q2"
                 class="tooth"
                 [class.selected]="isSelected(t)"
                 [attr.data-type]="toothType(t)"
                 (click)="toggleTooth(t)"
                 [title]="toothLabel(t)">
              <span class="tooth-num">{{ t }}</span>
              <div class="tooth-shape"></div>
            </div>
          </div>
        </div>

        <div class="jaw-separator">
          <div class="sep-line"></div>
        </div>

        <div class="jaw lower">
          <div class="quadrant">
            <div *ngFor="let t of q4"
                 class="tooth lower"
                 [class.selected]="isSelected(t)"
                 [attr.data-type]="toothType(t)"
                 (click)="toggleTooth(t)"
                 [title]="toothLabel(t)">
              <div class="tooth-shape"></div>
              <span class="tooth-num">{{ t }}</span>
            </div>
          </div>
          <div class="midline"></div>
          <div class="quadrant">
            <div *ngFor="let t of q3"
                 class="tooth lower"
                 [class.selected]="isSelected(t)"
                 [attr.data-type]="toothType(t)"
                 (click)="toggleTooth(t)"
                 [title]="toothLabel(t)">
              <div class="tooth-shape"></div>
              <span class="tooth-num">{{ t }}</span>
            </div>
          </div>
        </div>

        <div class="jaw-row-label">
          <span class="q-label">Q4 — Dreapta Jos</span>
          <span class="q-label right">Q3 — Stânga Jos</span>
        </div>

        <div class="selection-bar" *ngIf="selectedTeeth().length > 0">
          <span>Selectați: <strong>{{ selectedTeeth().join(', ') }}</strong></span>
          <button class="clear-btn" (click)="clearSelection()">✕ Sterge</button>
        </div>
        <div class="hint" *ngIf="selectedTeeth().length === 0">
          Apasă pe un dinte pentru a-l selecta
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dental-chart-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }

    .dental-chart {
      display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
      padding: 1rem 1.25rem; background: #f8fafc; border-radius: 0.75rem;
      min-width: 580px; border: 1px solid #e5e7eb;
    }

    .jaw-row-label {
      display: flex; width: 100%; justify-content: space-between; padding: 0 2px;
    }
    .q-label {
      font-size: 0.62rem; font-weight: 700; color: #9ca3af;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .q-label.right { text-align: right; }

    .jaw { display: flex; align-items: flex-end; gap: 0; }
    .jaw.lower { align-items: flex-start; }

    .quadrant { display: flex; gap: 2px; }
    .midline { width: 10px; flex-shrink: 0; position: relative; }
    .midline::after {
      content: ''; position: absolute; top: 0; bottom: 0; left: 50%;
      width: 1px; background: #d1d5db;
    }

    .tooth {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      cursor: pointer; padding: 3px 2px; border-radius: 4px;
      transition: background 0.12s; user-select: none;
    }
    .tooth:hover { background: rgba(60,189,212,0.1); }
    .tooth.selected .tooth-shape { background: #3cbdd4; border-color: #2aa8bf; }
    .tooth.selected .tooth-num { color: #2aa8bf; font-weight: 800; }

    .tooth-shape {
      border: 1.5px solid #d1d5db;
      background: #fff;
      transition: all 0.12s;
      width: 22px; height: 24px;
      border-radius: 40% 40% 30% 30% / 50% 50% 30% 30%;
    }
    .tooth.lower .tooth-shape {
      border-radius: 30% 30% 40% 40% / 30% 30% 50% 50%;
    }

    .tooth[data-type="molar"] .tooth-shape    { width: 28px; }
    .tooth[data-type="premolar"] .tooth-shape { width: 22px; }
    .tooth[data-type="incisor"] .tooth-shape  { width: 16px; }
    .tooth[data-type="canine"] .tooth-shape   {
      width: 17px;
      border-radius: 40% 40% 15% 15% / 50% 50% 15% 15%;
    }
    .tooth.lower[data-type="canine"] .tooth-shape {
      border-radius: 15% 15% 40% 40% / 15% 15% 50% 50%;
    }

    .tooth-num { font-size: 0.6rem; font-weight: 700; color: #6b7280; line-height: 1; }

    .jaw-separator {
      width: 100%; display: flex; align-items: center; margin: 0.2rem 0;
    }
    .sep-line {
      flex: 1; height: 2px;
      background: linear-gradient(90deg, transparent, #3cbdd4 20%, #3cbdd4 80%, transparent);
    }

    .selection-bar {
      display: flex; align-items: center; gap: 1rem;
      font-size: 0.82rem; color: #374151;
      background: #e0f7fb; border-radius: 0.4rem;
      padding: 0.4rem 0.75rem; width: 100%; box-sizing: border-box;
    }
    .selection-bar strong { color: #0891b2; }
    .clear-btn {
      margin-left: auto; background: none; border: none;
      color: #6b7280; cursor: pointer; font-size: 0.78rem; padding: 0 0.25rem;
    }
    .clear-btn:hover { color: #ef4444; }
    .hint { font-size: 0.75rem; color: #9ca3af; font-style: italic; }
  `]
})
export class DentalChart {
  q1 = [18, 17, 16, 15, 14, 13, 12, 11];
  q2 = [21, 22, 23, 24, 25, 26, 27, 28];
  q3 = [31, 32, 33, 34, 35, 36, 37, 38];
  q4 = [48, 47, 46, 45, 44, 43, 42, 41];

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
      this.selectedTeeth.set([...current, id].sort((a, b) => a - b));
    }
    this.selectionChange.emit(this.selectedTeeth());
  }

  isSelected(id: number) {
    return this.selectedTeeth().includes(id);
  }

  clearSelection() {
    this.selectedTeeth.set([]);
    this.selectionChange.emit([]);
  }

  toothType(id: number): 'incisor' | 'canine' | 'premolar' | 'molar' {
    const pos = id % 10;
    if (pos === 1 || pos === 2) return 'incisor';
    if (pos === 3) return 'canine';
    if (pos === 4 || pos === 5) return 'premolar';
    return 'molar';
  }

  toothLabel(id: number): string {
    const names: Record<string, string> = {
      'incisor': 'Incisiv', 'canine': 'Canin',
      'premolar': 'Premolar', 'molar': 'Molar'
    };
    return `${id} — ${names[this.toothType(id)]}`;
  }
}
