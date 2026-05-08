export type XrayRequestStatus = 'PENDING' | 'ASSIGNED' | 'COMPLETED' | 'CANCELED';
export type XrayType = 'PANORAMIC' | 'INTRAORAL' | 'CT_3D' | 'CEPHALOMETRIC';

export interface XrayRequest {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  affectedTeeth: string[]; // ex. ["11", "12"]
  xrayType: XrayType;
  details?: string;
  status: XrayRequestStatus;
  createdAt: string;
  selectedRadiologistId?: number;
  selectedRadiologistName?: string;
  scheduledAt?: string;
}

export interface CreateXrayRequest {
  patientId: number;
  affectedTeeth: string[];
  xrayType: XrayType;
  details?: string;
}

export interface Xray {
  id: number;
  requestId: number;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  type: XrayType;
  observations?: string;
  viewedByDoctor: boolean;
}
