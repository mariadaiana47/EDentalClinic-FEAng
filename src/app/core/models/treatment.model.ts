export type ProtheticType =
  | 'CROWN'
  | 'BRIDGE'
  | 'DENTURE'
  | 'INLAY'
  | 'ONLAY'
  | 'VENEER'
  | 'IMPLANT';

export const PROTHETIC_TYPE_LABELS: Record<ProtheticType, string> = {
  CROWN: 'Coroană',
  BRIDGE: 'Punte',
  DENTURE: 'Proteză',
  INLAY: 'Inlay',
  ONLAY: 'Onlay',
  VENEER: 'Fatetă',
  IMPLANT: 'Implant',
};

export interface TreatmentPhase {
  id?: number;
  date: string;
  description: string;
  substances?: string;
  costs?: number;
  createdAt?: string;
}

export interface ProtheticWork {
  id?: number;
  type: ProtheticType;
  teethNumbers: string;
  material?: string;
  performedBy?: string;
  datePerformed?: string;
  cost?: number;
  createdAt?: string;
}

export interface TreatmentPlan {
  id?: number;
  description: string;
  diagnosis?: string;
  totalCosts?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Treatment {
  id?: number;
  description: string;
  diagnosis?: string;
  teethInvolved?: string;
  cost?: number;
  phases?: TreatmentPhase[];
  protheticWorks?: ProtheticWork[];
  createdAt?: string;
  updatedAt?: string;
}
