import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { PatientRegistrationRequest } from '../../../core/models/patient.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-registration.html',
  styleUrls: ['./patient-registration.css']
})
export class PatientRegistration {
  private patientService = inject(PatientService);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly tempPassword = signal<string | null>(null);

  form: PatientRegistrationRequest = {
    firstName: '',
    lastName: '',
    cnp: '',
    email: '',
    phone: '',
    age: undefined,
    gender: 'M',
    birthDate: '',
    generalHealthStatus: '',
    previousTreatments: ''
  };

  onBirthDateChange() {
    if (!this.form.birthDate) return;
    const today = new Date();
    const birth = new Date(this.form.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    this.form.age = age >= 0 ? age : undefined;
  }

  onSubmit() {
    this.error.set(null);
    this.success.set(null);
    this.tempPassword.set(null);

    if (!this.form.firstName || !this.form.lastName || !this.form.cnp || !this.form.email) {
      this.error.set('Va rugam sa completati toate campurile obligatorii (*).');
      return;
    }

    this.loading.set(true);
    this.patientService.register(this.form).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set('Pacientul a fost inregistrat cu succes!');
        if (res.temporaryPassword) {
          this.tempPassword.set(res.temporaryPassword);
        }
        this.resetForm();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'A aparut o eroare la inregistrare. Verificati datele introduse.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/assistant']);
  }

  private resetForm() {
    this.form = {
      firstName: '',
      lastName: '',
      cnp: '',
      email: '',
      phone: '',
      age: undefined,
      gender: 'M',
      birthDate: '',
      generalHealthStatus: '',
      previousTreatments: ''
    };
  }
}
