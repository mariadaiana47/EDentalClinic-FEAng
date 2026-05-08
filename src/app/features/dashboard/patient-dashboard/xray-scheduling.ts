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
    <div class="scheduling-container">
      <div class="header">
        <h1>📅 Programare Radiografie</h1>
        <p>Alege un radiolog colaborator și stabilește data pentru investigația ta.</p>
      </div>

      <div class="requests-grid">
        <div *ngFor="let x of pendingRequests()" class="request-card">
          <div class="req-header">
            <span class="badge">PENDING</span>
            <span class="type">{{ x.type }}</span>
          </div>
          <div class="details">
            <p><strong>Dinți:</strong> {{ x.teethInvolved }}</p>
            <p><strong>Medic:</strong> Dr. {{ x.doctor.lastName }}</p>
          </div>

          <div class="scheduler">
            <label>Alege Radiologul</label>
            <select [(ngModel)]="selectedRadId" class="input">
              <option [value]="null">Selectează un radiolog...</option>
              <option *ngFor="let r of affiliatedRadiologists()" [value]="r.id">
                {{ r.firstName }} {{ r.lastName }} ({{ r.email }})
              </option>
            </select>

            <label>Data și Ora</label>
            <input type="datetime-local" [(ngModel)]="appointmentDate" class="input">

            <button class="confirm-btn" (click)="confirmScheduling(x.id!)" [disabled]="!selectedRadId || !appointmentDate">
              Confirmă Programarea
            </button>
          </div>
        </div>

        <div *ngIf="pendingRequests().length === 0" class="empty-state">
          <div class="icon">✨</div>
          <p>Nu aveți nicio cerere de radiografie în așteptare.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scheduling-container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .header { margin-bottom: 2rem; }
    .header h1 { color: #1e293b; margin: 0; }
    
    .requests-grid { display: grid; gap: 1.5rem; }
    .request-card { background: white; border-radius: 1.25rem; padding: 2rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; }
    
    .req-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .badge { background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 700; }
    .type { font-size: 1.25rem; font-weight: 700; color: #4f46e5; }
    
    .scheduler { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; background: #f8fafc; padding: 1.5rem; border-radius: 1rem; }
    .scheduler label { font-size: 0.875rem; font-weight: 600; color: #64748b; }
    .input { padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; }
    .confirm-btn { background: #4f46e5; color: white; border: none; padding: 1rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem; }
    .confirm-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-2px); }
    .confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 1.25rem; color: #94a3b8; }
    .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; }
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
      // Show only pending and not yet scheduled
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
