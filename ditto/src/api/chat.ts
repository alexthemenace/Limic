import { apiRequest } from './client';
import type { ChatMessage } from '../types';

interface ApiChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'ditto';
  text: string;
  createdAt: string;
}

function toFrontend(msg: ApiChatMessage): ChatMessage {
  return {
    id: msg.id,
    role: msg.role,
    text: msg.text,
    timestamp: new Date(msg.createdAt),
  };
}

export async function getChatMessages(): Promise<ChatMessage[]> {
  const msgs = await apiRequest<ApiChatMessage[]>('/chat');
  return msgs.map(toFrontend);
}

export async function postChatMessage(role: 'user' | 'ditto', text: string): Promise<ChatMessage> {
  const msg = await apiRequest<ApiChatMessage>('/chat', {
    method: 'POST',
    body: JSON.stringify({ role, text }),
  });
  return toFrontend(msg);
}
