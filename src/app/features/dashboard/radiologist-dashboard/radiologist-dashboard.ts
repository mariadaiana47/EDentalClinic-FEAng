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
    <div class="radiologist-container">
      <div class="header">
        <h1>Dashboard Radiolog</h1>
        <p>Vizualizați cererile de radiografie primite și încărcați rezultatele.</p>
      </div>

      <div class="requests-grid">
        <div class="card" *ngFor="let req of pendingRequests()">
          <div class="req-header">
            <span class="badge">{{ req.type }}</span>
            <span class="date">{{ req.createdAt | date:'short' }}</span>
          </div>
          
          <div class="patient-info">
            <h3>Dinți vizați: {{ req.teethInvolved }}</h3>
            <p><strong>Detalii:</strong> {{ req.details || 'Fără specificații suplimentare.' }}</p>
          </div>

          <div class="upload-section">
            <label class="file-label">
              <span>{{ selectedFiles[req.id!] ? selectedFiles[req.id!].name : 'Alegeți Fișierul' }}</span>
              <input type="file" (change)="onFileSelected($event, req.id!)" hidden>
            </label>
            <button 
              class="btn-upload" 
              [disabled]="!selectedFiles[req.id!] || uploadingId() === req.id"
              (click)="uploadXRay(req.id!)">
              {{ uploadingId() === req.id ? 'Se încarcă...' : 'Finalizează și Încarcă' }}
            </button>
          </div>
        </div>

        <div *ngIf="pendingRequests().length === 0" class="empty-state">
          <div class="icon">📭</div>
          <p>Nu există cereri de radiografie în așteptare.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .radiologist-container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    .header { margin-bottom: 2rem; }
    .header h1 { color: #1e293b; margin-bottom: 0.5rem; }
    
    .requests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-left: 5px solid #ec4899; }
    
    .req-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .badge { background: #fdf2f8; color: #db2777; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: bold; }
    .date { font-size: 0.8125rem; color: #64748b; }
    
    .patient-info h3 { margin: 0 0 0.5rem 0; color: #334155; }
    .patient-info p { font-size: 0.9375rem; color: #64748b; line-height: 1.4; }

    .upload-section { margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
    .file-label { flex: 1; padding: 0.5rem; border: 2px dashed #e2e8f0; border-radius: 0.5rem; text-align: center; cursor: pointer; font-size: 0.875rem; color: #64748b; }
    .file-label:hover { border-color: #ec4899; background: #fdf2f8; }
    
    .btn-upload { background: #ec4899; color: white; border: none; padding: 0.6rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .btn-upload:disabled { background: #f472b6; opacity: 0.6; cursor: not-allowed; }
    
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 5rem; background: #f8fafc; border-radius: 1rem; color: #94a3b8; }
    .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; }
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
