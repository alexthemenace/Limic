export type Page = 'dashboard' | 'onboarding' | 'action' | 'social';

export interface BehavioralTrait {
  id: string;
  category: 'communication' | 'schedule' | 'preference' | 'habit';
  label: string;
  detail: string;
  confidence: number; // 0–100
}

export interface DataSource {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ditto';
  text: string;
  timestamp: Date;
}

export interface IncomingMessage {
  id: string;
  sender: string;
  preview: string;
  fullText: string;
  summary?: string;
  responseChips?: string[];
  handled: boolean;
}

export interface NegotiationThread {
  id: string;
  topic: string;
  participants: string[];
  messages: string[];
  resolved: boolean;
  outcome?: string;
  status: 'pending' | 'negotiating' | 'resolved';
}

export interface DraftRequest {
  context: string;
  recipient: string;
  tone: 'professional' | 'casual' | 'assertive';
}

export interface ResearchRequest {
  topic: string;
  preferences?: string;
}
