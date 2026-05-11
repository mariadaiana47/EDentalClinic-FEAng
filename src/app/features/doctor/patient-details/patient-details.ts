import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { ClinicalExamService } from '../../../core/services/clinical-exam.service';
import { TreatmentService, Treatment } from '../../../core/services/treatment.service';
import { XRayService, XRayRequest } from '../../../core/services/xray.service';
import { Patient } from '../../../core/models/patient.model';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './patient-details.html',
  styleUrls: ['./patient-details.css']
})
export class PatientDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private examService = inject(ClinicalExamService);
  private treatmentService = inject(TreatmentService);
  private xrayService = inject(XRayService);
  private http = inject(HttpClient);
  private auth = inject(Auth);

  patient = signal<Patient | null>(null);
  dentalRecord = signal<any>(null);
  clinicalExam = signal<any>(null);
  treatments = signal<Treatment[]>([]);
  xrayRequests = signal<any[]>([]);

  newTreatment: Treatment = { description: '', cost: 0, teethInvolved: '' };
  showAddTreatment = signal(false);

  newXray: XRayRequest = { teethInvolved: '', type: '3D', details: '' };
  showXrayForm = signal(false);
  
  expandedXray = signal<number | null>(null);
  isAssigned = signal<boolean>(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: number) {
    this.patientService.byId(id).subscribe(p => {
      this.patient.set(p);
      const email = this.auth.currentEmail();
      const assigned = p.assignedDoctors?.some((d: any) => d.email === email);
      this.isAssigned.set(!!assigned);
    });
    this.patientService.getDentalRecord(id).subscribe(r => this.dentalRecord.set(r));
    this.examService.getByPatientId(id).subscribe(e => this.clinicalExam.set(e));
    this.treatmentService.getByPatient(id).subscribe(t => this.treatments.set(t));
    this.xrayService.getByPatient(id).subscribe(x => this.xrayRequests.set(x));
  }

  assignPatient() {
    const id = this.patient()?.id;
    if (!id) return;
    this.http.post(`${environment.apiUrl}/patients/${id}/assign`, null, { responseType: 'text' }).subscribe(() => {
      this.isAssigned.set(true);
      alert('Pacient preluat cu succes!');
    });
  }

  saveXrayRequest() {
    const id = this.patient()?.id;
    if (!id || !this.newXray.teethInvolved) return;
    this.xrayService.create(id, this.newXray).subscribe(() => {
      this.loadData(id);
      this.showXrayForm.set(false);
      this.newXray = { teethInvolved: '', type: '3D', details: '' };
    });
  }

  saveTreatment() {
    const id = this.patient()?.id;
    if (!id || !this.newTreatment.description) {
      alert('Vă rugăm să introduceți o descriere pentru tratament.');
      return;
    }
    
    this.treatmentService.add(id, this.newTreatment).subscribe({
      next: () => {
        this.loadData(id);
        this.showAddTreatment.set(false);
        this.newTreatment = { description: '', cost: 0, teethInvolved: '' };
      },
      error: (err) => {
        alert('Eroare la salvarea tratamentului: ' + (err.error?.message || err.message));
      }
    });
  }

  toggleImage(requestId: number) {
    this.expandedXray.set(this.expandedXray() === requestId ? null : requestId);
  }

  getImageUrl(xrayId: number | undefined): string {
    return xrayId ? this.xrayService.getImageUrl(xrayId) : '';
  }
}
