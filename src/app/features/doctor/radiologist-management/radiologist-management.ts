import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { Radiologist } from '../../../core/models/radiologist.model';

@Component({
  selector: 'app-radiologist-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="page-header">
        <h2 class="page-title">Radiologi Afiliați</h2>
        <p class="page-sub">Adăugați radiologi din sistem pentru a le putea trimite cereri de radiografie.</p>
      </div>

      <div class="layout-grid">
        <!-- Add Form -->
        <div class="form-panel">
          <div class="panel-head">
            <i class="bi bi-person-plus-fill"></i> Adaugă Colaborator
          </div>
          <div class="panel-body">
            <p class="form-hint">Introduceți emailul unui radiolog care are deja cont în sistem.</p>
            <form (submit)="addRadiologist()">
              <div class="field">
                <label>Email Radiolog</label>
                <input type="email" [(ngModel)]="emailInput" name="email" required placeholder="email@radiologie.ro">
              </div>
              <div *ngIf="errorMsg()" class="error-msg">{{ errorMsg() }}</div>
              <button type="submit" class="btn-add" [disabled]="loading()">
                <span *ngIf="!loading()"><i class="bi bi-plus-lg"></i> Adaugă în Listă</span>
                <span *ngIf="loading()"><span class="spinner-border spinner-border-sm me-2"></span>Se adaugă...</span>
              </button>
            </form>
          </div>
        </div>

        <!-- List -->
        <div class="list-panel">
          <div *ngIf="radiologists().length === 0" class="empty-state">
            <i class="bi bi-broadcast-pin"></i>
            <p>Nu aveți încă radiologi în lista de colaboratori.</p>
          </div>

          <div *ngFor="let r of radiologists()" class="rad-card">
            <div class="rad-info">
              <div class="rad-avatar">{{ r.email[0].toUpperCase() }}</div>
              <div>
                <div class="rad-name">{{ r.email }}</div>
                <div class="rad-role"><i class="bi bi-person-badge"></i> Radiolog</div>
              </div>
            </div>
            <button class="btn-remove" (click)="removeRadiologist(r.id)" title="Șterge">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.75rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1a202c; margin: 0 0 0.25rem; }
    .page-sub { color: #6b7280; font-size: 0.9rem; margin: 0; }

    .layout-grid { display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; align-items: start; }

    /* Form panel */
    .form-panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; }
    .panel-head {
      background: #f7fdfe; border-bottom: 1px solid #d9f2f7;
      padding: 1rem 1.25rem; font-weight: 600; color: #1a202c;
      display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;
    }
    .panel-head i { color: #3cbdd4; }
    .panel-body { padding: 1.25rem; }

    .field { display: flex; flex-direction: column; margin-bottom: 0.875rem; }
    .field label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; margin-bottom: 0.3rem; }
    .field input {
      border: 1px solid #d1d5db; border-radius: 0.4rem; padding: 0.5rem 0.75rem;
      font-size: 0.875rem; color: #1a202c; outline: none; transition: border-color 0.15s;
    }
    .field input:focus { border-color: #3cbdd4; box-shadow: 0 0 0 3px rgba(60,189,212,0.1); }
    .field input::placeholder { color: #9ca3af; }

    .btn-add {
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
      width: 100%; padding: 0.65rem; background: #3cbdd4; border: none;
      border-radius: 0.4rem; color: #fff; font-weight: 600; font-size: 0.875rem;
      cursor: pointer; transition: background 0.15s; margin-top: 0.25rem;
    }
    .btn-add:hover:not(:disabled) { background: #2aa8bf; }
    .btn-add:disabled { background: #a8dfe9; cursor: not-allowed; }

    /* List panel */
    .list-panel { display: flex; flex-direction: column; gap: 0.75rem; }

    .empty-state {
      text-align: center; padding: 3rem 2rem;
      background: #f9fafb; border: 2px dashed #e5e7eb; border-radius: 0.75rem;
    }
    .empty-state i { font-size: 2rem; color: #d1d5db; display: block; margin-bottom: 0.75rem; }
    .empty-state p { color: #9ca3af; margin: 0; }

    .rad-card {
      background: #fff; border: 1px solid #e5e7eb; border-left: 3px solid #3cbdd4;
      border-radius: 0.75rem; padding: 1rem 1.25rem;
      display: flex; align-items: center; justify-content: space-between;
    }
    .rad-info { display: flex; align-items: center; gap: 0.875rem; }
    .rad-avatar {
      width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #3cbdd4, #2891a8);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.85rem;
    }
    .form-hint { font-size: 0.82rem; color: #6b7280; margin: 0 0 1rem; }
    .error-msg { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 0.82rem; padding: 0.5rem 0.75rem; border-radius: 0.4rem; margin-bottom: 0.75rem; }
    .rad-name { font-weight: 600; color: #1a202c; font-size: 0.9rem; }
    .rad-role { color: #6b7280; font-size: 0.78rem; margin-top: 0.15rem; }
    .rad-role i { margin-right: 0.25rem; color: #3cbdd4; }

    .btn-remove {
      width: 34px; height: 34px; border-radius: 50%; border: 1px solid #fecaca;
      background: transparent; color: #ef4444; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s; font-size: 0.875rem;
    }
    .btn-remove:hover { background: #fef2f2; }
  `]
})
export class RadiologistManagement implements OnInit {
  private doctorService = inject(DoctorService);

  radiologists = signal<Radiologist[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  emailInput = '';

  ngOnInit() {
    this.loadRadiologists();
  }

  loadRadiologists() {
    this.doctorService.listAffiliatedRadiologists().subscribe(data => this.radiologists.set(data));
  }

  addRadiologist() {
    if (!this.emailInput.trim()) return;
    this.loading.set(true);
    this.errorMsg.set(null);
    this.doctorService.addAffiliatedRadiologist({ email: this.emailInput } as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.emailInput = '';
        this.loadRadiologists();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Emailul introdus nu a fost găsit în sistem.');
      }
    });
  }

  removeRadiologist(id: number) {
    if (confirm('Sigur doriți să ștergeți acest radiolog din listă?')) {
      this.doctorService.removeAffiliatedRadiologist(id).subscribe(() => this.loadRadiologists());
    }
  }
}
