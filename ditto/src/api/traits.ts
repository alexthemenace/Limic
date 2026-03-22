import { apiRequest } from './client';
import type { BehavioralTrait } from '../types';

export function getTraits(): Promise<BehavioralTrait[]> {
  return apiRequest<BehavioralTrait[]>('/traits');
}

export function createTrait(
  trait: Omit<BehavioralTrait, 'id'>
): Promise<BehavioralTrait> {
  return apiRequest<BehavioralTrait>('/traits', {
    method: 'POST',
    body: JSON.stringify(trait),
  });
}

export function deleteTrait(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/traits/${id}`, { method: 'DELETE' });
}
