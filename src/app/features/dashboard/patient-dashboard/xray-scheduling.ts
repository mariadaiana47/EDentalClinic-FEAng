import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { API_ROUTES } from '../../../core/constants/api-routes';

@Component({
  selector: 'app-xray-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="welcome-banner">
      <h2 class="wb-name">Programare Radiografie</h2>
      <p class="wb-sub">Alege un radiolog colaborator si stabileste data pentru investigatia ta.</p>
    </div>

    <div class="scheduling-content">
      <div *ngFor="let x of pendingRequests()" class="section-card">
        <div class="section-head">
          <i class="bi bi-calendar-plus-fill"></i>
          <span>Cerere Radiografie: {{ x.type }}</span>
        </div>
        <div class="section-body">
          <div class="info-row">
            <span class="info-label">Detalii Investigatie</span>
            <span class="info-val">Dinti implicati: {{ x.teethInvolved }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Medic Trimitator</span>
            <span class="info-val">Dr. {{ x.doctor.lastName }} {{ x.doctor.firstName }}</span>
          </div>

          <div class="scheduling-box">
            <p class="sched-hint"><i class="bi bi-info-circle"></i> Alegeti un radiolog, data si intervalul orar disponibil:</p>

            <!-- Pasul 1: Selectare radiolog -->
            <div class="sched-step">
              <label class="step-label">1. Selectati radiologul</label>
              <select [(ngModel)]="selectedRadId" (ngModelChange)="onRadiologistChange()" class="pd-input">
                <option [value]="null">— Selectati Radiologul —</option>
                <option *ngFor="let r of affiliatedRadiologists()" [value]="r.id">
                  {{ r.firstName }} {{ r.lastName }} – {{ r.clinicName || 'Clinica' }}
                </option>
              </select>
            </div>

            <!-- Pasul 2: Selectare data -->
            <div class="sched-step" *ngIf="selectedRadId">
              <label class="step-label">2. Alegeti data</label>
              <input
                type="date"
                [(ngModel)]="selectedDate"
                (ngModelChange)="onDateChange()"
                [min]="todayStr"
                class="pd-input"
              />
            </div>

            <!-- Pasul 3: Selectare slot orar -->
            <div class="sched-step" *ngIf="selectedDate && availableSlots().length > 0">
              <label class="step-label">3. Alegeti intervalul orar disponibil</label>
              <div class="slots-grid">
                <button
                  *ngFor="let slot of availableSlots()"
                  class="slot-btn"
                  [class.selected]="selectedSlot === slot"
                  (click)="selectedSlot = slot"
                >
                  {{ slot }}
                </button>
              </div>
            </div>

            <div class="no-slots-msg" *ngIf="selectedDate && availableSlots().length === 0 && !loadingSlots()">
              <i class="bi bi-exclamation-circle"></i> Nu exista intervale disponibile in aceasta zi. Alegeti alta data.
            </div>

            <div class="loading-msg" *ngIf="loadingSlots()">
              <i class="bi bi-hourglass-split"></i> Se incarca intervalele disponibile...
            </div>

            <button
              class="btn-confirm"
              (click)="confirmScheduling(x.id!)"
              [disabled]="!selectedRadId || !selectedDate || !selectedSlot"
            >
              <i class="bi bi-check-lg"></i> Confirma Programarea
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="pendingRequests().length === 0" class="section-card">
        <div class="section-body" style="text-align: center; padding: 3rem;">
          <p class="empty-msg">Nu aveti nicio cerere de radiografie in asteptare.</p>
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
    .sched-hint { font-size: 0.82rem; color: #6b7280; margin: 0 0 1rem; display: flex; align-items: center; gap: 0.4rem; }

    .sched-step { margin-bottom: 1rem; }
    .step-label { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }

    .pd-input { padding: 0.6rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.45rem; font-size: 0.875rem; color: #1a202c; background: #fff; outline: none; width: 100%; font-family: inherit; }
    .pd-input:focus { border-color: #3cbdd4; box-shadow: 0 0 0 3px rgba(60,189,212,0.12); }

    .slots-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .slot-btn { padding: 0.45rem 1rem; border: 1.5px solid #d1d5db; border-radius: 0.4rem; background: #fff; font-size: 0.875rem; cursor: pointer; color: #374151; transition: all 0.15s; }
    .slot-btn:hover { border-color: #3cbdd4; color: #0d3d56; }
    .slot-btn.selected { background: #3cbdd4; border-color: #3cbdd4; color: #fff; font-weight: 600; }

    .no-slots-msg { font-size: 0.85rem; color: #ef4444; display: flex; align-items: center; gap: 0.4rem; margin: 0.5rem 0 1rem; }
    .loading-msg { font-size: 0.85rem; color: #6b7280; display: flex; align-items: center; gap: 0.4rem; margin: 0.5rem 0 1rem; }

    .btn-confirm { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.25rem; background: #3cbdd4; color: #fff; border: none; border-radius: 0.45rem; cursor: pointer; font-weight: 600; font-size: 0.875rem; margin-top: 0.75rem; }
    .btn-confirm:disabled { background: #a8dfe9; cursor: not-allowed; }
    .btn-confirm:hover:not(:disabled) { background: #2aa8bf; }

    .empty-msg { color: #9ca3af; font-style: italic; font-size: 0.9rem; margin: 0; }

    @media (max-width: 768px) {
      .slots-grid { gap: 0.4rem; }
      .slot-btn { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
    }
  `]
})
export class XRayScheduling implements OnInit {
  constructor(private http: HttpClient, private toast: ToastService) {}

  pendingRequests = signal<any[]>([]);
  affiliatedRadiologists = signal<any[]>([]);
  availableSlots = signal<string[]>([]);
  loadingSlots = signal<boolean>(false);

  selectedRadId: number | null = null;
  selectedDate: string = '';
  selectedSlot: string = '';
  todayStr = new Date().toISOString().split('T')[0];

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

  onRadiologistChange() {
    this.selectedDate = '';
    this.selectedSlot = '';
    this.availableSlots.set([]);
  }

  onDateChange() {
    this.selectedSlot = '';
    this.availableSlots.set([]);

    if (!this.selectedRadId || !this.selectedDate) return;

    this.loadingSlots.set(true);
    this.http.get<string[]>(
      `${API_ROUTES.RADIOLOGISTS.BASE}/${this.selectedRadId}/available-slots`,
      { params: { date: this.selectedDate } }
    ).subscribe({
      next: slots => {
        this.availableSlots.set(slots);
        this.loadingSlots.set(false);
      },
      error: () => {
        this.availableSlots.set([]);
        this.loadingSlots.set(false);
      }
    });
  }

  confirmScheduling(requestId: number) {
    if (!this.selectedRadId || !this.selectedDate || !this.selectedSlot) return;

    // Construieste ISO datetime din data + slot orar (HH:mm)
    const appointmentTime = `${this.selectedDate}T${this.selectedSlot}:00`;

    this.http.post(`${API_ROUTES.XRAY_REQUESTS.BASE}/${requestId}/select-radiologist`, null, {
      params: {
        radiologistId: this.selectedRadId.toString(),
        appointmentTime
      }
    }).subscribe({
      next: () => {
        this.toast.show('Programare realizata cu succes!', 'success');
        this.selectedRadId = null;
        this.selectedDate = '';
        this.selectedSlot = '';
        this.availableSlots.set([]);
        this.loadRequests();
      },
      error: () => {
        this.toast.show('Eroare la realizarea programarii. Incercati din nou.', 'error');
      }
    });
  }
}
