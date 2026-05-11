import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { XRayService, XRayRequest } from '../../../core/services/xray.service';
import { API_ROUTES } from '../../../core/constants/api-routes';

@Component({
  selector: 'app-radiologist-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="mb-4">
        <h2 class="fw-bold text-dark">Cereri de Radiografie</h2>
        <p class="text-muted">Vizualizați cererile primite și încărcați rezultatele radiografiilor.</p>
      </div>

      <div class="row g-3">
        <div class="col-md-6" *ngFor="let req of pendingRequests()">
          <div class="card req-card">
            <div class="card-header d-flex justify-content-between align-items-center req-header">
              <span class="badge-type">{{ req.type }}</span>
              <span class="text-muted small">{{ req.createdAt | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="card-body">
              <h6 class="fw-bold mb-1">Dinți vizați: {{ req.teethInvolved }}</h6>
              <p class="text-muted small mb-3">{{ req.details || 'Fără specificații suplimentare.' }}</p>

              <div class="upload-area">
                <label class="file-label w-100 mb-2">
                  <i class="bi bi-cloud-upload me-2"></i>
                  {{ selectedFiles[req.id!] ? selectedFiles[req.id!].name : 'Alegeți fișierul radiografiei' }}
                  <input type="file" (change)="onFileSelected($event, req.id!)" hidden accept="image/*">
                </label>
                <button class="btn btn-clinic w-100"
                  [disabled]="!selectedFiles[req.id!] || uploadingId() === req.id"
                  (click)="uploadXRay(req.id!)">
                  <span *ngIf="uploadingId() !== req.id">
                    <i class="bi bi-check-circle me-1"></i>Finalizează și Încarcă
                  </span>
                  <span *ngIf="uploadingId() === req.id">
                    <span class="spinner-border spinner-border-sm me-2"></span>Se încarcă...
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="pendingRequests().length === 0" class="col-12">
          <div class="empty-state text-center py-5">
            <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
            <p class="text-muted">Nu există cereri de radiografie în așteptare.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .req-card { border-left: 4px solid #3cbdd4; }
    .req-header { background: #f7fdfe; border-bottom: 1px solid #d9f2f7; padding: 0.75rem 1.25rem; }
    .badge-type { background: #e0f6fa; color: #0e7490; font-size: 0.78rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 0.375rem; }
    .file-label {
      display: block; padding: 0.6rem 1rem; border: 2px dashed #d9f2f7;
      border-radius: 0.5rem; text-align: center; cursor: pointer;
      font-size: 0.875rem; color: #6b7280; transition: all 0.15s;
    }
    .file-label:hover { border-color: #3cbdd4; background: #f0fbfd; color: #3cbdd4; }
    .btn-clinic { background: #3cbdd4; border: none; color: #fff; font-weight: 600; }
    .btn-clinic:hover:not(:disabled) { background: #2aa8bf; color: #fff; }
    .btn-clinic:disabled { background: #a8dfe9; }
    .empty-state { background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 0.5rem; }
  `]
})
export class RadiologistDashboard implements OnInit {
  private http = inject(HttpClient);
  private xrayService = inject(XRayService);

  pendingRequests = signal<XRayRequest[]>([]);
  uploadingId = signal<number | null>(null);
  selectedFiles: { [key: number]: File } = {};

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.http.get<XRayRequest[]>(`${API_ROUTES.XRAY_REQUESTS.BASE}/all-pending`).subscribe({
      next: data => this.pendingRequests.set(data),
      error: err => console.error('Error fetching pending requests:', err)
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
    formData.append('observations', 'Încărcat din dashboard radiolog');

    this.http.post(`${API_ROUTES.XRAYS.BASE}/upload/${requestId}`, formData).subscribe({
      next: () => {
        this.uploadingId.set(null);
        delete this.selectedFiles[requestId];
        this.loadRequests();
        alert('Radiografia a fost încărcată cu succes!');
      },
      error: () => {
        this.uploadingId.set(null);
        alert('Eroare la încărcare.');
      }
    });
  }
}
