import { Patient } from './patient.model';
import { ClinicalExam } from './clinical-exam.model';
import { Treatment } from './treatment.model';
import { Xray } from './xray.model';

export type RecordInfoType = 'OBSERVATION' | 'CLINICAL_NOTE' | 'STATUS_UPDATE';

export interface RecordInfo {
  id: number;
  type: RecordInfoType;
  content: string;
  createdAt: string;
  doctorId: number;
  doctorName?: string;
}

export interface DentalRecord {
  id: number;
  patient: Patient;
  generalHealthStatus?: string;
  previousTreatments?: string;
  clinicalExam?: ClinicalExam;
  treatments?: Treatment[];
  xrays?: Xray[];
  additionalInfo?: RecordInfo[];
  createdAt?: string;
  updatedAt?: string;
}
