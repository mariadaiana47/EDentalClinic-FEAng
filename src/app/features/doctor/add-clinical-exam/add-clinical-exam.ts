import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientSearch } from '../../../shared/components/patient-search/patient-search';
import { DentalChart } from '../../../shared/components/dental-chart/dental-chart';
import { Patient } from '../../../core/models/patient.model';
import { ClinicalExamService } from '../../../core/services/clinical-exam.service';
import { PatientService } from '../../../core/services/patient.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-clinical-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientSearch, DentalChart],
  templateUrl: './add-clinical-exam.html',
  styleUrls: ['./add-clinical-exam.css']
})
export class AddClinicalExam implements OnInit {
  constructor(
    private examService: ClinicalExamService,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  selectedPatient = signal<Patient | null>(null);
  loading = signal(false);
  success = signal(false);
  routeId: number | null = null;

  form = {
    teethExamination: '',
    mucosaExamination: '',
    ridges: '',
    tuberosities: '',
    palatalVault: '',
    otherElements: '',
    diseaseHistory: '',
    selectedTeeth: [] as number[]
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.routeId = id;
      this.patientService.byId(id).subscribe(p => this.selectedPatient.set(p));
    }
  }

  onPatientSelected(p: Patient) {
    this.selectedPatient.set(p);
  }

  onTeethChange(teeth: number[]) {
    this.form.selectedTeeth = teeth;
  }

  onSubmit() {
    const patient = this.selectedPatient();
    if (!patient) return;

    this.loading.set(true);
    
    const request = {
      dentalChart: JSON.stringify(this.form.selectedTeeth),
      teethExamination: this.form.teethExamination,
      mucosaExamination: this.form.mucosaExamination,
      ridges: this.form.ridges,
      tuberosities: this.form.tuberosities,
      palatalVault: this.form.palatalVault,
      otherElements: this.form.otherElements,
      diseaseHistory: this.form.diseaseHistory
    };

    this.examService.save(patient.id, request).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.goBack(), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        alert('Eroare la salvare: ' + (err.error?.message || 'Eroare necunoscuta'));
      }
    });
  }

  goBack() {
    if (this.routeId) {
      this.router.navigate(['/doctor/patient', this.routeId]);
    } else {
      this.router.navigate(['/doctor/patients']);
    }
  }

  cancel() {
    this.selectedPatient.set(null);
  }
}
