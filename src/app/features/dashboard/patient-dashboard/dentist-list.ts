import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/auth';
import { PatientService } from '../../../core/services/patient.service';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-dentist-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dentist-page">
      <div class="page-header">
        <h1 class="page-title">Echipa Noastra de Medici</h1>
        <p class="page-sub">Alegeti specialistul potrivit pentru zambetul dumneavoastra.</p>
      </div>

      <div class="dentist-grid">
        <div *ngFor="let doc of doctors()" class="dentist-card">
          <div class="card-inner">
            <div class="doc-image">
              <img [src]="doc.profilePictureUrl || 'https://via.placeholder.com/150'" alt="Avatar">
            </div>
            <div class="doc-info">
              <h3 class="doc-name">Dr. {{ doc.firstName }} {{ doc.lastName }}</h3>
              <span class="doc-spec">{{ doc.specialization }}</span>
              <p class="doc-desc">{{ doc.description }}</p>
            </div>
            <div class="card-footer">
              <button class="btn-book" (click)="bookAppointment(doc)">Programeaza Vizita</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dentist-page { padding: 1.5rem; }
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 800; color: #1a202c; margin: 0 0 0.5rem; }
    .page-sub { color: #6b7280; font-size: 1rem; margin: 0; }

    .dentist-grid { 
      display: grid; 
      grid-template-columns: 1fr; 
      gap: 1.5rem; 
      max-width: 900px;
    }

    .dentist-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      overflow: hidden;
      display: flex;
    }

    .card-inner { 
      padding: 1.5rem; 
      display: flex; 
      flex-direction: row; 
      align-items: center; 
      text-align: left;
      width: 100%;
      gap: 2rem;
    }

    .doc-image { 
      width: 120px; height: 120px; 
      border-radius: 50%; 
      overflow: hidden; 
      border: 4px solid #f0fbfd;
      flex-shrink: 0;
    }
    .doc-image img { width: 100%; height: 100%; object-fit: cover; }

    .doc-info { flex: 1; }
    .doc-name { font-size: 1.25rem; font-weight: 700; color: #1a202c; margin: 0 0 0.25rem; }
    .doc-spec { 
      font-size: 0.85rem; font-weight: 700; 
      color: #3cbdd4; text-transform: uppercase; 
      letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block;
    }
    .doc-desc { 
      font-size: 0.9rem; color: #6b7280; line-height: 1.5; 
      margin: 0;
    }

    .card-footer { width: auto; flex-shrink: 0; }
    .btn-book {
      padding: 0.75rem 1.5rem;
      background: #3cbdd4;
      color: #fff;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .dentist-grid { 
        grid-template-columns: repeat(2, 1fr); 
        gap: 1rem;
      }
      .dentist-card { flex-direction: column; }
      .card-inner { 
        flex-direction: column; 
        text-align: center; 
        padding: 1.25rem;
        gap: 1rem;
      }
      .doc-image { width: 100px; height: 100px; }
      .card-footer { width: 100%; }
      .btn-book { width: 100%; padding: 0.6rem; font-size: 0.8rem; }
      .doc-name { font-size: 1rem; }
      .doc-desc { display: none; }
    }
  `]
})
export class DentistListComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);
  doctors = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/doctors`).subscribe(d => this.doctors.set(d));
  }

  bookAppointment(doc: any) {
    this.patientService.me().subscribe(p => {
      const body = {
        patientId: p.id,
        doctorId: doc.id,
        appointmentTime: new Date(Date.now() + 86400000).toISOString().split('.')[0], // Tomorrow
        reason: 'Consultatie initiala'
      };
      this.http.post(`${environment.apiUrl}/appointments`, body).subscribe({
        next: () => {
          this.toastService.show(`Programare trimisa catre Dr. ${doc.lastName}!`, 'success');
        },
        error: (err) => {
          this.toastService.show(err.error?.message || "Aveti deja o programare activa!", 'error');
        }
      });
    });
  }
}
