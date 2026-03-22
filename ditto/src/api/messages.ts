import { apiRequest } from './client';
import type { IncomingMessage } from '../types';

export function getMessages(): Promise<IncomingMessage[]> {
  return apiRequest<IncomingMessage[]>('/messages');
}

export function summarizeMessage(id: string): Promise<IncomingMessage> {
  return apiRequest<IncomingMessage>(`/messages/${id}/summarize`, { method: 'POST' });
}

export function dismissMessage(id: string): Promise<IncomingMessage> {
  return apiRequest<IncomingMessage>(`/messages/${id}/dismiss`, { method: 'PATCH' });
}
