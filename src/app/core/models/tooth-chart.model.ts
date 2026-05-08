/** Notatia FDI: sferturi 1-4 (adult) si 5-8 (lapte), dinti 1-8. */
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
  toothNumber: string; // ex. "11", "32"
  condition: ToothCondition;
  notes?: string;
}

export interface ToothChart {
  teeth: ToothEntry[];
}
