export type ToothCondition =
  | 'HEALTHY'
  | 'CARIES'
  | 'FILLING'
  | 'CROWN'
  | 'BRIDGE'
  | 'IMPLANT'
  | 'EXTRACTED'
  | 'ROOT_CANAL';

export interface ToothEntry {
  toothNumber: string;
  condition: ToothCondition;
  notes?: string;
}

export interface ToothChart {
  teeth: ToothEntry[];
}
