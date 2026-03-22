import { apiRequest } from './client';
import type { NegotiationThread } from '../types';

export function getNegotiations(): Promise<NegotiationThread[]> {
  return apiRequest<NegotiationThread[]>('/negotiations');
}

export function resolveNegotiation(id: string, outcome?: string): Promise<NegotiationThread> {
  return apiRequest<NegotiationThread>(`/negotiations/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify(outcome !== undefined ? { outcome } : {}),
  });
}
