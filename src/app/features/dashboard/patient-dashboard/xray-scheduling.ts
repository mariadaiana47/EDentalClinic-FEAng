import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { XRayService } from '../../../core/services/xray.service';
import { API_ROUTES } from '../../../core/constants/api-routes';

@Component({
  selector: 'app-xray-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="welcome-banner">
      <h2 class="wb-name">Programare Radiografie</h2>
      <p class="wb-sub">Alege un radiolog colaborator și stabilește data pentru investigația ta.</p>
    </div>

    <div class="scheduling-content">
      <div *ngFor="let x of pendingRequests()" class="section-card">
        <div class="section-head">
          <i class="bi bi-calendar-plus-fill"></i>
          <span>Cerere Radiografie: {{ x.type }}</span>
        </div>
        <div class="section-body">
          <div class="info-row">
            <span class="info-label">Detalii Investigație</span>
            <span class="info-val">Dinți implicați: {{ x.teethInvolved }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Medic Trimitător</span>
            <span class="info-val">Dr. {{ x.doctor.lastName }} {{ x.doctor.firstName }}</span>
          </div>

          <div class="scheduling-box">
            <p class="sched-hint"><i class="bi bi-info-circle"></i> Alegeți un radiolog și data programării:</p>
            <div class="sched-row">
              <select [(ngModel)]="selectedRadId" class="pd-input">
                <option [value]="null">Selectați Radiologul</option>
                <option *ngFor="let r of affiliatedRadiologists()" [value]="r.id">
                  {{ r.firstName }} {{ r.lastName }} – {{ r.clinicName || 'Clinic' }}
                </option>
              </select>
              <input type="datetime-local" [(ngModel)]="appointmentDate" class="pd-input">
              <button class="btn-confirm" (click)="confirmScheduling(x.id!)" [disabled]="!selectedRadId || !appointmentDate">
                <i class="bi bi-check-lg"></i> Confirmă
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="pendingRequests().length === 0" class="section-card">
        <div class="section-body" style="text-align: center; padding: 3rem;">
          <p class="empty-msg">Nu aveți nicio cerere de radiografie în așteptare.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-banner { background: linear-gradient(135deg, #0d3d56 0%, #3cbdd4 100%); color: #fff; padding: 1.75rem 2rem; border-radius: 0.75rem; margin-bottom: 1.5rem; }
    .wb-name { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; color: #fff; }
    .wb-sub { margin: 0; opacity: 0.85; font-size: 0.9rem; color: #fff; }

    .scheduling-content { max-width: 900px; margin: 0 auto; }

    .section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; margin-bottom: 1.5rem; }
    .section-head { background: #f7fdfe; border-bottom: 1px solid #d9f2f7; padding: 0.875rem 1.25rem; font-weight: 600; color: #1a202c; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
    .section-head i { color: #3cbdd4; }
    .section-body { padding: 1.25rem; }

    .info-row { display: flex; flex-direction: column; padding-bottom: 0.75rem; border-bottom: 1px solid #f3f4f6; margin-bottom: 0.75rem; }
    .info-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.04em; margin: 0 0 0.2rem; }
    .info-val { color: #374151; font-size: 0.9rem; margin: 0; }

    .scheduling-box { background: #f7fdfe; border: 1px solid #d9f2f7; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem; }
    .sched-hint { font-size: 0.82rem; color: #6b7280; margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.4rem; }
    .sched-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.75rem; align-items: center; }
    
    .pd-input { padding: 0.6rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.45rem; font-size: 0.875rem; color: #1a202c; background: #fff; outline: none; width: 100%; font-family: inherit; }
    .pd-input:focus { border-color: #3cbdd4; box-shadow: 0 0 0 3px rgba(60,189,212,0.12); }

    .btn-confirm { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.25rem; background: #3cbdd4; color: #fff; border: none; border-radius: 0.45rem; cursor: pointer; font-weight: 600; font-size: 0.875rem; }
    .btn-confirm:disabled { background: #a8dfe9; cursor: not-allowed; }
    .btn-confirm:hover:not(:disabled) { background: #2aa8bf; }

    .empty-msg { color: #9ca3af; font-style: italic; font-size: 0.9rem; margin: 0; }

    @media (max-width: 768px) {
      .sched-row { grid-template-columns: 1fr; }
    }
  `]
})
export class XRayScheduling implements OnInit {
  private http = inject(HttpClient);

  pendingRequests = signal<any[]>([]);
  affiliatedRadiologists = signal<any[]>([]);
  selectedRadId: number | null = null;
  appointmentDate: string = '';

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.http.get<any[]>(`${API_ROUTES.XRAY_REQUESTS.BASE}/my-patient`).subscribe(data => {
      const pending = data.filter(r => r.status === 'PENDING' && !r.selectedRadiologist);
      this.pendingRequests.set(pending);

      if (pending.length > 0) {
        this.loadRadiologists(pending[0].doctor.id);
      }
    });
  }

  loadRadiologists(doctorId: number) {
    this.http.get<any[]>(`${API_ROUTES.DOCTORS.BASE}/${doctorId}/radiologists`).subscribe(rads => {
      this.affiliatedRadiologists.set(rads);
    });
  }

  confirmScheduling(requestId: number) {
    if (!this.selectedRadId || !this.appointmentDate) return;

    this.http.post(`${API_ROUTES.XRAY_REQUESTS.BASE}/${requestId}/select-radiologist`, null, {
      params: {
        radiologistId: this.selectedRadId.toString(),
        appointmentTime: this.appointmentDate
      }
    }).subscribe(() => {
      alert('Programare realizată cu succes!');
      this.loadRequests();
    });
  }
}
