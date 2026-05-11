import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { XRayService, XRayRequest } from '../../../core/services/xray.service';
import { API_ROUTES } from '../../../core/constants/api-routes';
import { Auth } from '../../../core/auth';

@Component({
  selector: 'app-radiologist-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="welcome-banner">
      <h2 class="wb-name">{{ greeting() }}, Radiolog!</h2>
      <p class="wb-sub">Gestionati cererile de investigatii si incarcati rezultatele radiografice catre medici.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><i class="bi bi-inbox-fill"></i></div>
        <div class="stat-info">
          <span class="stat-label">Cereri in Asteptare</span>
          <span class="stat-val">{{ pendingRequests().length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="bi bi-check-circle-fill"></i></div>
        <div class="stat-info">
          <span class="stat-label">Cereri Finalizate</span>
          <span class="stat-val">{{ completedCount() }}</span>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-head">
        <i class="bi bi-journal-text"></i> Cereri de Investigat
      </div>
      <div class="section-body">
        <div *ngFor="let req of pendingRequests()" class="req-item">
          <div class="req-main">
            <div class="req-user">
              <div class="user-avatar">{{ req.patient?.lastName?.[0] }}{{ req.patient?.firstName?.[0] }}</div>
              <div>
                <div class="user-name">{{ req.patient?.lastName }} {{ req.patient?.firstName }}</div>
                <div class="user-sub">CNP: {{ req.patient?.cnp }}</div>
              </div>
            </div>

            <div class="req-details">
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge-type">{{ req.type }}</span>
                <span class="teeth-info">Dinti: {{ req.teethInvolved }}</span>
              </div>
              <div class="doctor-info">
                Trimitere: Dr. {{ req.doctor?.lastName || 'Medic' }} {{ req.doctor?.firstName || '' }}
              </div>
            </div>

            <div class="req-date">
              <i class="bi bi-calendar3"></i>
              {{ req.createdAt | date:'dd/MM/yyyy' }}
            </div>
          </div>

          <div class="upload-section">
            <div class="upload-container">
              <label class="file-drop">
                <i class="bi bi-cloud-upload"></i>
                <span>{{ selectedFiles[req.id!] ? selectedFiles[req.id!].name : 'Selectati imaginea radiografiei...' }}</span>
                <input type="file" (change)="onFileSelected($event, req.id!)" hidden accept="image/*">
              </label>
              <button class="btn-confirm" 
                      [disabled]="!selectedFiles[req.id!] || uploadingId() === req.id"
                      (click)="uploadXRay(req.id!)">
                <span *ngIf="uploadingId() !== req.id"><i class="bi bi-check-lg"></i> Finalizeaza</span>
                <span *ngIf="uploadingId() === req.id" class="spinner-border spinner-border-sm"></span>
              </button>
            </div>
            <div *ngIf="req.details" class="req-note">
              <i class="bi bi-info-circle"></i> Observatii medic: {{ req.details }}
            </div>
          </div>
        </div>

        <div *ngIf="pendingRequests().length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>Nu exista cereri de radiografie in asteptare.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-banner { background: linear-gradient(135deg, #0d3d56 0%, #3cbdd4 100%); color: #fff; padding: 1.75rem 2rem; border-radius: 0.75rem; margin-bottom: 1.5rem; }
    .wb-name { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; color: #fff; }
    .wb-sub { margin: 0; opacity: 0.85; font-size: 0.9rem; color: #fff; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
    .stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; }
    .stat-icon { width: 42px; height: 42px; border-radius: 0.5rem; background: #f0fbfd; color: #3cbdd4; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.75rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-val { font-size: 1.25rem; font-weight: 700; color: #1a202c; }

    .section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; }
    .section-head { background: #f7fdfe; border-bottom: 1px solid #d9f2f7; padding: 0.875rem 1.25rem; font-weight: 600; color: #1a202c; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
    .section-head i { color: #3cbdd4; }
    .section-body { padding: 1.25rem; }

    .req-item { border-bottom: 1px solid #f3f4f6; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
    .req-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

    .req-main { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem; }
    
    .req-user { display: flex; align-items: center; gap: 0.75rem; }
    .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3cbdd4, #2891a8); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; }
    .user-name { font-weight: 600; color: #1a202c; font-size: 0.95rem; }
    .user-sub { font-size: 0.8rem; color: #6b7280; }

    .req-details { flex: 1; min-width: 200px; }
    .badge-type { background: #f0fbfd; color: #3cbdd4; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 0.375rem; text-transform: uppercase; }
    .teeth-info { font-size: 0.85rem; font-weight: 600; color: #374151; }
    .doctor-info { font-size: 0.8rem; color: #6b7280; margin-top: 0.2rem; }

    .req-date { font-size: 0.8rem; color: #9ca3af; display: flex; align-items: center; gap: 0.4rem; }

    .upload-section { background: #f9fafb; border-radius: 0.6rem; padding: 1rem; border: 1px solid #f1f5f9; }
    .upload-container { display: flex; gap: 0.75rem; align-items: center; }
    
    .file-drop { flex: 1; display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem; background: #fff; border: 1px dashed #d1d5db; border-radius: 0.5rem; cursor: pointer; transition: all 0.15s; }
    .file-drop:hover { border-color: #3cbdd4; background: #f0fbfd; }
    .file-drop i { color: #3cbdd4; font-size: 1.1rem; }
    .file-drop span { font-size: 0.85rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .btn-confirm { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.25rem; background: #3cbdd4; color: #fff; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: background 0.15s; }
    .btn-confirm:hover:not(:disabled) { background: #2aa8bf; }
    .btn-confirm:disabled { background: #a8dfe9; cursor: not-allowed; }

    .req-note { font-size: 0.8rem; color: #6b7280; font-style: italic; margin-top: 0.75rem; display: flex; align-items: center; gap: 0.4rem; }

    .empty-state { text-align: center; padding: 3rem; color: #9ca3af; }
    .empty-state i { font-size: 2.5rem; margin-bottom: 0.75rem; display: block; }
  `]
})
export class RadiologistDashboard implements OnInit {
  private http = inject(HttpClient);
  private xrayService = inject(XRayService);
  auth = inject(Auth);

  pendingRequests = signal<any[]>([]);
  completedCount = signal<number>(0);
  uploadingId = signal<number | null>(null);
  selectedFiles: { [key: number]: File } = {};

  readonly greeting = signal(new Date().getHours() >= 18 || new Date().getHours() < 5 ? 'Buna seara' : 'Buna ziua');

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.http.get<any[]>(`${API_ROUTES.XRAY_REQUESTS.BASE}/all-pending`).subscribe({
      next: data => this.pendingRequests.set(data),
      error: err => console.error('Error fetching pending requests:', err)
    });

    this.http.get<any[]>(`${API_ROUTES.XRAY_REQUESTS.BASE}/all-completed`).subscribe({
      next: data => this.completedCount.set(data.length),
      error: err => console.error('Error fetching completed requests:', err)
    });
  }

  onFileSelected(event: any, requestId: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[requestId] = file;
    }
  }

  uploadXRay(requestId: number) {
    const file = this.selectedFiles[requestId];
    if (!file) return;

    this.uploadingId.set(requestId);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`${API_ROUTES.XRAYS.BASE}/upload/${requestId}`, formData).subscribe({
      next: () => {
        this.uploadingId.set(null);
        delete this.selectedFiles[requestId];
        this.loadRequests();
        alert('Radiografia a fost incarcata cu succes!');
      },
      error: () => {
        this.uploadingId.set(null);
        alert('Eroare la incarcare.');
      }
    });
  }
}
