import { ToothChart } from './tooth-chart.model';

export interface ClinicalExam {
  id?: number;
  recordId: number;
  toothChart: ToothChart;
  teethExamination?: string;
  mucousExamination?: string;
  otherFindings?: string;
  examinationDate?: string;
}
