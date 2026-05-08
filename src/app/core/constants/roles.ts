export const ROLES = {
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  ASSISTANT: 'ASSISTANT',
  RADIOLOGIST: 'RADIOLOGIST',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
