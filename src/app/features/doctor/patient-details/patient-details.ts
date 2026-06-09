import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { ClinicalExamService } from '../../../core/services/clinical-exam.service';
import { TreatmentService } from '../../../core/services/treatment.service';
import { XRayService, XRayRequest } from '../../../core/services/xray.service';
import { Treatment, TreatmentPhase, TreatmentPlan, ProtheticWork, ProtheticType, PROTHETIC_TYPE_LABELS } from '../../../core/models/treatment.model';
import { Patient } from '../../../core/models/patient.model';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/auth';
import { environment } from '../../../../environments/environment';
import { DentalChart } from '../../../shared/components/dental-chart/dental-chart';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DentalChart],
  templateUrl: './patient-details.html',
  styleUrls: ['./patient-details.css']
})
export class PatientDetails implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private examService: ClinicalExamService,
    private treatmentService: TreatmentService,
    private xrayService: XRayService,
    private http: HttpClient,
    private auth: Auth
  ) {}

  patient = signal<Patient | null>(null);
  dentalRecord = signal<any>(null);
  clinicalExam = signal<any>(null);
  treatments = signal<Treatment[]>([]);
  xrayRequests = signal<any[]>([]);
  treatmentPlan = signal<TreatmentPlan | null>(null);

  // ── Treatment state ───────────────────────────────────────────────────────
  showAddTreatment = signal(false);
  newTreatment: Partial<Treatment> = { description: '', diagnosis: '', teethInvolved: '' };

  expandedTreatmentId = signal<number | null>(null);
  treatmentPhases = signal<Record<number, TreatmentPhase[]>>({});
  treatmentWorks = signal<Record<number, ProtheticWork[]>>({});

  showAddPhase = signal<number | null>(null); // treatmentId
  newPhase: Partial<TreatmentPhase> = { date: '', description: '', substances: '', costs: undefined };

  showAddWork = signal<number | null>(null); // treatmentId
  newWork: Partial<ProtheticWork> = { type: 'CROWN', teethNumbers: '', material: '', performedBy: '', cost: undefined };

  showPlanForm = signal(false);
  newPlan: Partial<TreatmentPlan> = { description: '', diagnosis: '' };

  protheticTypes: ProtheticType[] = ['CROWN', 'BRIDGE', 'DENTURE', 'INLAY', 'ONLAY', 'VENEER', 'IMPLANT'];
  protheticLabels = PROTHETIC_TYPE_LABELS;

  // ── X-Ray state ───────────────────────────────────────────────────────────
  newXray: XRayRequest = { teethInvolved: '', type: '3D', details: '' };
  showXrayForm = signal(false);
  expandedXray = signal<number | null>(null);
  isAssigned = signal<boolean>(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadData(id);
  }

  loadData(id: number) {
    this.patientService.byId(id).subscribe(p => {
      this.patient.set(p);
      this.isAssigned.set(!!p.assignedDoctors?.some((d: any) => d.email === this.auth.currentEmail()));
    });
    this.patientService.getDentalRecord(id).subscribe(r => this.dentalRecord.set(r));
    this.examService.getByPatientId(id).subscribe(e => this.clinicalExam.set(e));
    this.treatmentService.getByPatient(id).subscribe(t => this.treatments.set(t));
    this.xrayService.getByPatient(id).subscribe(x => this.xrayRequests.set(x));
    this.treatmentService.getPlan(id).subscribe({ next: p => this.treatmentPlan.set(p), error: () => this.treatmentPlan.set(null) });
  }

  // ── Patient ───────────────────────────────────────────────────────────────

  assignPatient() {
    const id = this.patient()?.id;
    if (!id) return;
    this.http.post(`${environment.apiUrl}/patients/${id}/assign`, null, { responseType: 'text' }).subscribe(() => {
      this.isAssigned.set(true);
    });
  }

  // ── Treatment ─────────────────────────────────────────────────────────────

  saveTreatment() {
    const id = this.patient()?.id;
    if (!id || !this.newTreatment.description) return;
    this.treatmentService.add(id, this.newTreatment).subscribe(() => {
      this.loadData(id);
      this.showAddTreatment.set(false);
      this.newTreatment = { description: '', diagnosis: '', teethInvolved: '' };
    });
  }

  toggleTreatment(treatmentId: number) {
    if (this.expandedTreatmentId() === treatmentId) {
      this.expandedTreatmentId.set(null);
      return;
    }
    this.expandedTreatmentId.set(treatmentId);
    // load phases and works if not cached
    if (!this.treatmentPhases()[treatmentId]) {
      this.treatmentService.getPhases(treatmentId).subscribe(phases => {
        this.treatmentPhases.update(m => ({ ...m, [treatmentId]: phases }));
      });
    }
    if (!this.treatmentWorks()[treatmentId]) {
      this.treatmentService.getProtheticWorks(treatmentId).subscribe(works => {
        this.treatmentWorks.update(m => ({ ...m, [treatmentId]: works }));
      });
    }
  }

  // ── Treatment Plan ────────────────────────────────────────────────────────

  savePlan() {
    const id = this.patient()?.id;
    if (!id || !this.newPlan.description) return;
    this.treatmentService.savePlan(id, this.newPlan).subscribe(p => {
      this.treatmentPlan.set(p);
      this.showPlanForm.set(false);
      this.newPlan = { description: '', diagnosis: '' };
    });
  }

  editPlan() {
    const plan = this.treatmentPlan();
    if (plan) {
      this.newPlan = { description: plan.description, diagnosis: plan.diagnosis };
    }
    this.showPlanForm.set(true);
  }

  // ── Phases ────────────────────────────────────────────────────────────────

  savePhase(treatmentId: number) {
    if (!this.newPhase.description || !this.newPhase.date) return;
    this.treatmentService.addPhase(treatmentId, this.newPhase).subscribe(phase => {
      this.treatmentPhases.update(m => ({ ...m, [treatmentId]: [...(m[treatmentId] || []), phase] }));
      this.showAddPhase.set(null);
      this.newPhase = { date: '', description: '', substances: '', costs: undefined };
    });
  }

  deletePhase(treatmentId: number, phaseId: number) {
    this.treatmentService.deletePhase(phaseId).subscribe(() => {
      this.treatmentPhases.update(m => ({ ...m, [treatmentId]: m[treatmentId].filter(p => p.id !== phaseId) }));
    });
  }

  // ── Prothetic Works ───────────────────────────────────────────────────────

  saveWork(treatmentId: number) {
    if (!this.newWork.teethNumbers || !this.newWork.type) return;
    this.treatmentService.addProtheticWork(treatmentId, this.newWork).subscribe(work => {
      this.treatmentWorks.update(m => ({ ...m, [treatmentId]: [...(m[treatmentId] || []), work] }));
      this.showAddWork.set(null);
      this.newWork = { type: 'CROWN', teethNumbers: '', material: '', performedBy: '', cost: undefined };
    });
  }

  deleteWork(treatmentId: number, workId: number) {
    this.treatmentService.deleteProtheticWork(workId).subscribe(() => {
      this.treatmentWorks.update(m => ({ ...m, [treatmentId]: m[treatmentId].filter(w => w.id !== workId) }));
    });
  }

  // ── X-Ray ─────────────────────────────────────────────────────────────────

  onTeethChange(teeth: number[]) {
    this.newXray.teethInvolved = teeth.join(', ');
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

  toggleImage(requestId: number) {
    this.expandedXray.set(this.expandedXray() === requestId ? null : requestId);
  }

  getImageUrl(xrayId: number | undefined): string {
    return xrayId ? this.xrayService.getImageUrl(xrayId) : '';
  }
}
