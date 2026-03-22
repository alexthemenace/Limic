import { apiRequest } from './client';
import type { DataSource } from '../types';

export function getSources(): Promise<DataSource[]> {
  return apiRequest<DataSource[]>('/sources');
}

export function toggleSource(sourceId: string): Promise<DataSource> {
  return apiRequest<DataSource>(`/sources/${sourceId}/toggle`, { method: 'PATCH' });
}
