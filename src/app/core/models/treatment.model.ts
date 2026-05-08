export type ProstheticType =
  | 'CROWN'
  | 'BRIDGE'
  | 'DENTURE'
  | 'INLAY'
  | 'ONLAY'
  | 'VENEER'
  | 'IMPLANT';

export interface ProstheticWork {
  id?: number;
  type: ProstheticType;
  teeth: string[];
  material?: string;
  performedBy?: string; // medic / tehnician
  performedDate?: string;
  cost?: number;
}

export interface TreatmentPhase {
  id?: number;
  date: string;
  description: string;
  substances?: string;
  cost?: number;
}

export interface Treatment {
  id: number;
  recordId: number;
  diagnosis: string;
  initialPlan?: string;
  phases?: TreatmentPhase[];
  prostheticWorks?: ProstheticWork[];
  preopXrayIds?: number[];
  preopImageIds?: number[];
  consentFormUrl?: string;
  doctorId: number;
  createdAt?: string;
  updatedAt?: string;
}
