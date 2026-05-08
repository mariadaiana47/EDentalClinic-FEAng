import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="list-container">
      <div class="header">
        <h2>Listă Pacienți</h2>
        <p>Gestionați și vizualizați dosarele medicale ale pacienților clinicii.</p>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (input)="onSearch()"
          placeholder="Caută după nume sau CNP..."
          class="search-input"
        >
        <span class="count" *ngIf="filteredPatients().length > 0">
          {{ filteredPatients().length }} pacienți găsiți
        </span>
      </div>

      <div class="table-card">
        <table *ngIf="!loading(); else loadingTemplate">
          <thead>
            <tr>
              <th>Nume și Prenume</th>
              <th>CNP</th>
              <th>Telefon</th>
              <th>Ultima Vizită</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredPatients()">
              <td>
                <div class="name-cell">
                  <div class="avatar">{{ p.lastName[0] }}{{ p.firstName[0] }}</div>
                  <span>{{ p.lastName }} {{ p.firstName }}</span>
                </div>
              </td>
              <td><code>{{ p.cnp }}</code></td>
              <td>{{ p.phone }}</td>
              <td><span class="status-chip">Recent</span></td>
              <td>
                <button class="btn-view" (click)="viewPatient(p.id)">Vezi Dosar</button>
              </td>
            </tr>
            <tr *ngIf="filteredPatients().length === 0">
              <td colspan="5" class="empty-state">Nu s-au găsit pacienți conform criteriilor.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-state">Se încarcă lista pacienților...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .list-container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
    .header { margin-bottom: 2rem; }
    .header h2 { color: #1e293b; font-size: 1.875rem; margin-bottom: 0.5rem; }
    .header p { color: #64748b; }

    .search-bar { 
      display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
      background: white; padding: 0.75rem 1.5rem; border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .search-input { flex: 1; border: none; font-size: 1rem; outline: none; }
    .count { font-size: 0.875rem; color: #3b82f6; font-weight: 600; background: #eff6ff; padding: 0.25rem 0.75rem; border-radius: 1rem; }

    .table-card { background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.875rem; color: #475569; font-weight: 600; border-bottom: 1px solid #f1f5f9; }
    td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9375rem; }
    
    .name-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; }
    
    code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; color: #0f172a; }
    .status-chip { background: #dcfce7; color: #166534; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.5rem; font-weight: 600; }
    
    .btn-view { background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-view:hover { background: #2563eb; }
    
    .empty-state { text-align: center; padding: 3rem; color: #64748b; font-style: italic; }
    .loading-state { text-align: center; padding: 4rem; color: #3b82f6; font-weight: 600; }
  `]
})
export class PatientList implements OnInit {
  private patientService = inject(PatientService);
  private router = inject(Router);

  allPatients = signal<Patient[]>([]);
  filteredPatients = signal<Patient[]>([]);
  loading = signal(true);
  searchQuery = '';

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.list().subscribe({
      next: (data) => {
        this.allPatients.set(data);
        this.filteredPatients.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.filteredPatients.set(this.allPatients());
      return;
    }

    this.filteredPatients.set(
      this.allPatients().filter(p => 
        p.lastName.toLowerCase().includes(query) || 
        p.firstName.toLowerCase().includes(query) || 
        p.cnp.includes(query)
      )
    );
  }

  viewPatient(id: number) {
    this.router.navigate(['/doctor/patient', id]);
  }
}
