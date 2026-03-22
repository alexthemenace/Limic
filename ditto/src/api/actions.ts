import { apiRequest } from './client';
import type { DraftRequest, ResearchRequest } from '../types';

export interface DraftResult {
  subject: string;
  body: string;
}

export interface ResearchResult {
  title: string;
  items: Array<{ name: string; why: string; tag: string }>;
}

export function draftEmail(request: DraftRequest): Promise<DraftResult> {
  return apiRequest<DraftResult>('/actions/draft', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function researchTopic(request: ResearchRequest): Promise<ResearchResult> {
  return apiRequest<ResearchResult>('/actions/research', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
