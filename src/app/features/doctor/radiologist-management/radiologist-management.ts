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
    <div class="management-container">
      <div class="header">
        <h2>Radiologi Afiliați</h2>
        <p>Gestionați lista radiologilor cu care colaborați pentru cererile de radiografie.</p>
      </div>

      <div class="grid">
        <!-- Add Form -->
        <div class="card add-card">
          <h3>Adaugă Colaborator Nou</h3>
          <form (submit)="addRadiologist()" class="form">
            <div class="input-group">
              <label>Prenume Radiolog</label>
              <input type="text" [(ngModel)]="newRadiologist.firstName" name="firstName" required placeholder="Ex: Daiana">
            </div>
            <div class="input-group">
              <label>Nume Radiolog</label>
              <input type="text" [(ngModel)]="newRadiologist.lastName" name="lastName" required placeholder="Ex: Mutilica">
            </div>
            <div class="input-group">
              <label>Clinică / Centru</label>
              <input type="text" [(ngModel)]="newRadiologist.clinicName" name="clinic" required placeholder="Ex: DentScan 3D">
            </div>
            <div class="input-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="newRadiologist.email" name="email" required placeholder="email@radiologie.ro">
            </div>
            <div class="input-group">
              <label>Telefon</label>
              <input type="text" [(ngModel)]="newRadiologist.phone" name="phone" placeholder="07xx xxx xxx">
            </div>
            <div class="input-group">
              <label>Adresă</label>
              <input type="text" [(ngModel)]="newRadiologist.clinicAddress" name="address" placeholder="Str. Exemplu, Nr. 1">
            </div>
            <button type="submit" class="btn-add" [disabled]="loading()">
              {{ loading() ? 'Se salvează...' : '+ Adaugă în Listă' }}
            </button>
          </form>
        </div>

        <!-- List -->
        <div class="list-section">
          <div *ngIf="radiologists().length === 0" class="empty-state">
            <div class="icon">📡</div>
            <p>Nu aveți încă radiologi în lista de colaboratori.</p>
          </div>

          <div *ngFor="let r of radiologists()" class="radiologist-card">
            <div class="r-info">
              <div class="r-name">{{ r.lastName }} {{ r.firstName }}</div>
              <div class="r-clinic">🏢 {{ r.clinicName }}</div>
              <div class="r-contact">📧 {{ r.email }} | 📞 {{ r.phone }}</div>
            </div>
            <button class="btn-remove" (click)="removeRadiologist(r.id)">Șterge</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .management-container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
    .header { margin-bottom: 2rem; }
    .header h2 { color: #1e293b; font-size: 1.875rem; margin-bottom: 0.5rem; }
    .grid { display: grid; grid-template-columns: 400px 1fr; gap: 2rem; }
    
    .card { background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .card h3 { margin-top: 0; margin-bottom: 1.5rem; color: #334155; }
    
    .form { display: grid; gap: 1rem; }
    .input-group label { display: block; font-size: 0.875rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.9375rem; }
    input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    
    .btn-add { background: #3b82f6; color: white; border: none; padding: 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; }
    .btn-add:hover { background: #2563eb; }
    
    .radiologist-card { background: white; padding: 1.25rem; border-radius: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border: 1px solid #f1f5f9; }
    .r-name { font-weight: 700; color: #1e293b; font-size: 1.125rem; }
    .r-clinic { color: #3b82f6; font-size: 0.875rem; font-weight: 600; margin: 0.25rem 0; }
    .r-contact { color: #64748b; font-size: 0.875rem; }
    
    .btn-remove { background: #fee2e2; color: #dc2626; border: none; padding: 0.5rem 1rem; border-radius: 0.4rem; font-weight: 600; cursor: pointer; }
    .btn-remove:hover { background: #fecaca; }
    
    .empty-state { text-align: center; padding: 4rem; color: #94a3b8; background: #f8fafc; border-radius: 1rem; border: 2px dashed #e2e8f0; }
    .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; }
  `]
})
export class RadiologistManagement implements OnInit {
  private doctorService = inject(DoctorService);

  radiologists = signal<Radiologist[]>([]);
  loading = signal(false);

  newRadiologist = {
    firstName: '',
    lastName: '',
    clinicName: '',
    email: '',
    phone: '',
    clinicAddress: ''
  };

  ngOnInit() {
    this.loadRadiologists();
  }

  loadRadiologists() {
    this.doctorService.listAffiliatedRadiologists().subscribe(data => this.radiologists.set(data));
  }

  addRadiologist() {
    this.loading.set(true);
    this.doctorService.addAffiliatedRadiologist(this.newRadiologist).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadRadiologists();
        this.resetForm();
      },
      error: () => this.loading.set(false)
    });
  }

  removeRadiologist(id: number) {
    if (confirm('Sigur doriți să ștergeți acest radiolog din listă?')) {
      this.doctorService.removeAffiliatedRadiologist(id).subscribe(() => this.loadRadiologists());
    }
  }

  private resetForm() {
    this.newRadiologist = { firstName: '', lastName: '', clinicName: '', email: '', phone: '', clinicAddress: '' };
  }
}
