import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-appointments-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="appointments-page">
      <div class="page-header">
        <h2 class="page-title">{{ title() }}</h2>
        <p class="page-sub">Gestionați programările și interacțiunea cu pacienții.</p>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Pacient</th>
              <th>Data & Ora</th>
              <th>Motiv</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of appointments()" class="app-row">
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ app.patient?.lastName?.[0] }}{{ app.patient?.firstName?.[0] }}</div>
                  <div>
                    <div class="name">{{ app.patient?.lastName }} {{ app.patient?.firstName }}</div>
                    <div class="sub">CNP: {{ app.patient?.cnp }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <span class="date">{{ app.appointmentTime | date:'dd/MM/yyyy' }}</span>
                  <span class="time">{{ app.appointmentTime | date:'HH:mm' }}</span>
                </div>
              </td>
              <td class="reason">{{ app.reason || 'Consult stomatologic' }}</td>
              <td>
                <span class="status-badge" [class]="app.status.toLowerCase()">
                  {{ app.status === 'CONFIRMED' ? 'CONFIRMAT' : (app.status === 'COMPLETED' ? 'FINALIZAT' : app.status) }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button *ngIf="app.status === 'PENDING' && role() === 'DOCTOR'" class="btn-take" (click)="updateStatus(app.id, 'CONFIRMED')">
                    Preia Pacient
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="appointments().length === 0">
              <td colspan="5" class="empty-row">Nu există programări înregistrate.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .appointments-page { padding: 1.5rem; }
    .page-header { margin-bottom: 1.75rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1a202c; margin: 0 0 0.25rem; }
    .page-sub { color: #6b7280; font-size: 0.9rem; margin: 0; }

    .table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 0.75rem 1.25rem; background: #f9fafb; font-size: 0.72rem; font-weight: 700; color: #6b7280; text-transform: uppercase; text-align: left; border-bottom: 1px solid #e5e7eb; }
    td { padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
    
    .user-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: #f0fbfd; color: #3cbdd4; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; border: 1px solid #d9f2f7; }
    .name { font-weight: 600; color: #1a202c; font-size: 0.9rem; }
    .sub { font-size: 0.75rem; color: #9ca3af; }

    .date-cell { display: flex; flex-direction: column; }
    .date { font-weight: 600; color: #1a202c; font-size: 0.875rem; }
    .time { font-size: 0.8rem; color: #3cbdd4; font-weight: 700; }

    .reason { font-size: 0.875rem; color: #4b5563; }

    .status-badge { font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 0.375rem; text-transform: uppercase; }
    .status-badge.pending { background: #f0fbfd; color: #3cbdd4; border: 1px solid #d9f2f7; }
    .status-badge.confirmed { background: #e6f5f9; color: #4bb8d0; border: 1px solid #c7e9f1; }
    .status-badge.completed { background: #f3f4f6; color: #6b7280; }

    .btn-take { background: #3cbdd4; color: #fff; border: none; padding: 0.4rem 0.75rem; border-radius: 0.4rem; font-weight: 600; font-size: 0.8rem; cursor: pointer; }
    .btn-done { background: #4bb8d0; color: #fff; border: none; padding: 0.4rem 0.75rem; border-radius: 0.4rem; font-weight: 600; font-size: 0.8rem; cursor: pointer; border: 1px solid #c7e9f1; }
    
    .empty-row { text-align: center; padding: 3rem !important; color: #9ca3af; font-style: italic; }
  `]
})
export class AppointmentsManagement implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  
  appointments = signal<any[]>([]);
  role = signal(this.auth.currentRole());
  title = signal(this.auth.currentRole() === 'DOCTOR' ? 'Agenda Mea' : 'Programări Clinică');

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.http.get<any[]>(`${environment.apiUrl}/appointments/me`).subscribe(a => this.appointments.set(a));
  }

  updateStatus(id: number, status: string) {
    this.http.patch(`${environment.apiUrl}/appointments/${id}/status?status=${status}`, {}).subscribe(() => {
      this.loadAppointments();
    });
  }
}
