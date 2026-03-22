import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  BehavioralTrait,
  DataSource,
  ChatMessage,
  IncomingMessage,
  NegotiationThread,
} from '../types';
import * as traitsApi from '../api/traits';
import * as sourcesApi from '../api/sources';
import * as chatApi from '../api/chat';
import * as messagesApi from '../api/messages';
import * as negotiationsApi from '../api/negotiations';

const INITIAL_DITTO_MSG = "Hey! I'm Ditto. Talk to me like I'm a trusted friend — tell me about your goals, frustrations, how you like to work, or anything about your life. I'll pick up on your patterns and build a picture of how you think. 🧠";

export function useDittoStore(enabled: boolean) {
  const [traits, setTraits] = useState<BehavioralTrait[]>([]);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [incomingMessages, setIncomingMessages] = useState<IncomingMessage[]>([]);
  const [negotiations, setNegotiations] = useState<NegotiationThread[]>([]);
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const bootstrapped = useRef(false);

  // Load all data once the user is authenticated
  useEffect(() => {
    if (!enabled || bootstrapped.current) return;
    bootstrapped.current = true;

    Promise.allSettled([
      traitsApi.getTraits(),
      sourcesApi.getSources(),
      chatApi.getChatMessages(),
      messagesApi.getMessages(),
      negotiationsApi.getNegotiations(),
    ]).then(([traitsRes, sourcesRes, chatRes, msgsRes, negsRes]) => {
      if (traitsRes.status === 'fulfilled') setTraits(traitsRes.value);
      if (sourcesRes.status === 'fulfilled') setSources(sourcesRes.value);
      if (chatRes.status === 'fulfilled') {
        const msgs = chatRes.value;
        if (msgs.length === 0) {
          // Seed the welcome message (fire-and-forget, optimistic)
          chatApi
            .postChatMessage('ditto', INITIAL_DITTO_MSG)
            .then((msg) => setChatMessages([msg]))
            .catch(() => {
              setChatMessages([
                {
                  id: '0',
                  role: 'ditto',
                  text: INITIAL_DITTO_MSG,
                  timestamp: new Date(),
                },
              ]);
            });
        } else {
          setChatMessages(msgs);
        }
      }
      if (msgsRes.status === 'fulfilled') setIncomingMessages(msgsRes.value);
      if (negsRes.status === 'fulfilled') setNegotiations(negsRes.value);

      // Derive onboarding progress from connected sources and chat message count
      const connectedSources =
        sourcesRes.status === 'fulfilled'
          ? sourcesRes.value.filter((s) => s.connected).length
          : 0;
      const chatCount =
        chatRes.status === 'fulfilled'
          ? chatRes.value.filter((m) => m.role === 'user').length
          : 0;
      const traitCount =
        traitsRes.status === 'fulfilled' ? traitsRes.value.length : 0;

      const derived = Math.min(
        connectedSources * 10 + chatCount * 5 + traitCount * 8,
        100
      );
      setOnboardingProgress(derived);
    });
  }, [enabled]);

  const sendChatMessage = useCallback(async (text: string) => {
    // Optimistic local add for the user message
    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, optimistic]);

    try {
      const saved = await chatApi.postChatMessage('user', text);
      setChatMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
    } catch {
      // keep optimistic entry if persist fails
    }
  }, []);

  const addDittoReply = useCallback(async (text: string) => {
    const optimistic: ChatMessage = {
      id: `tmp-ditto-${Date.now()}`,
      role: 'ditto',
      text,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, optimistic]);

    try {
      const saved = await chatApi.postChatMessage('ditto', text);
      setChatMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
    } catch {
      // keep optimistic entry if persist fails
    }
  }, []);

  const toggleSource = useCallback(async (sourceId: string) => {
    // Optimistic toggle
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, connected: !s.connected } : s))
    );
    try {
      const updated = await sourcesApi.toggleSource(sourceId);
      setSources((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      // Roll back optimistic change
      setSources((prev) =>
        prev.map((s) => (s.id === sourceId ? { ...s, connected: !s.connected } : s))
      );
    }
  }, []);

  const addTrait = useCallback(async (trait: Omit<BehavioralTrait, 'id'>) => {
    try {
      const created = await traitsApi.createTrait(trait);
      setTraits((prev) => [created, ...prev]);
    } catch {
      // ignore — user stays on page
    }
  }, []);

  const summarizeMessage = useCallback(async (msgId: string) => {
    try {
      const updated = await messagesApi.summarizeMessage(msgId);
      setIncomingMessages((prev) => prev.map((m) => (m.id === msgId ? updated : m)));
    } catch {
      // ignore
    }
  }, []);

  const dismissMessage = useCallback(async (msgId: string) => {
    // Optimistic dismiss
    setIncomingMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, handled: true } : m)));
    try {
      const updated = await messagesApi.dismissMessage(msgId);
      setIncomingMessages((prev) => prev.map((m) => (m.id === msgId ? updated : m)));
    } catch {
      // Roll back
      setIncomingMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, handled: false } : m))
      );
    }
  }, []);

  const resolveNegotiation = useCallback(async (threadId: string) => {
    try {
      const updated = await negotiationsApi.resolveNegotiation(threadId);
      setNegotiations((prev) => prev.map((t) => (t.id === threadId ? updated : t)));
    } catch {
      // ignore
    }
  }, []);

  const incrementOnboarding = useCallback(() => {
    setOnboardingProgress((p) => Math.min(p + 12, 100));
  }, []);

  return {
    traits,
    sources,
    chatMessages,
    incomingMessages,
    negotiations,
    onboardingProgress,
    sendChatMessage,
    addDittoReply,
    toggleSource,
    addTrait,
    summarizeMessage,
    dismissMessage,
    resolveNegotiation,
    incrementOnboarding,
  };
}
