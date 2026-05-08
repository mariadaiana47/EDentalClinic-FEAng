export type Gender = 'M' | 'F' | 'OTHER';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
