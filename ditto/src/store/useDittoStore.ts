import { useState, useCallback } from 'react';
import type {
  BehavioralTrait,
  DataSource,
  ChatMessage,
  IncomingMessage,
  NegotiationThread,
} from '../types';

const DEFAULT_TRAITS: BehavioralTrait[] = [
  {
    id: '1',
    category: 'communication',
    label: 'Blunt & Direct',
    detail: 'Prefers concise, honest communication without unnecessary fluff.',
    confidence: 87,
  },
  {
    id: '2',
    category: 'schedule',
    label: 'Avoids Morning Meetings',
    detail: 'Energy peaks mid-morning; dislikes scheduling before 10 AM.',
    confidence: 92,
  },
  {
    id: '3',
    category: 'habit',
    label: 'Invoice Follow-up Gaps',
    detail: 'Consistently forgets to follow up on outstanding invoices after 14 days.',
    confidence: 78,
  },
  {
    id: '4',
    category: 'preference',
    label: '90s Streetwear Aesthetic',
    detail: 'Strong interest in vintage streetwear, especially 1990s brands and silhouettes.',
    confidence: 95,
  },
];

const DEFAULT_SOURCES: DataSource[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    connected: false,
    description: 'Learn your email style, contacts & priorities',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: '📅',
    connected: false,
    description: 'Understand your schedule and energy patterns',
  },
  {
    id: 'notes',
    name: 'Notes / Notion',
    icon: '📝',
    connected: false,
    description: 'Absorb how you think and organize information',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    icon: '🎓',
    connected: false,
    description: 'Track academic schedule and deadlines',
  },
];

const DEFAULT_MESSAGES: IncomingMessage[] = [
  {
    id: '1',
    sender: 'Jordan M.',
    preview: 'Hey, so I was thinking about the project and wanted to go over...',
    fullText:
      'Hey, so I was thinking about the project and wanted to go over a bunch of stuff with you. Like, first off, the timeline feels off to me, and also I think we need to revisit the budget section because some numbers don\'t quite add up. Oh and also, are you free this week? Let me know what works for you. Also Sarah mentioned something about the presentation but I forgot what it was. Can you follow up with her too?',
    handled: false,
  },
  {
    id: '2',
    sender: 'Alex P.',
    preview: 'Want to hang out Tuesday?',
    fullText: 'Hey! Want to hang out Tuesday? We could grab food or something.',
    handled: false,
  },
];

const DEFAULT_NEGOTIATIONS: NegotiationThread[] = [
  {
    id: '1',
    topic: 'Group dinner coordination',
    participants: ['Sam', 'Riley', 'Morgan', 'You'],
    messages: [
      'Sam: How about Friday 7pm?',
      'Riley: I can\'t do Friday, what about Saturday?',
      'Morgan: Saturday works but not before 7:30.',
    ],
    resolved: false,
    status: 'negotiating',
  },
];

export function useDittoStore() {
  const [traits, setTraits] = useState<BehavioralTrait[]>(DEFAULT_TRAITS);
  const [sources, setSources] = useState<DataSource[]>(DEFAULT_SOURCES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'ditto',
      text: "Hey! I'm Ditto. Talk to me like I'm a trusted friend — tell me about your goals, frustrations, how you like to work, or anything about your life. I'll pick up on your patterns and build a picture of how you think. 🧠",
      timestamp: new Date(),
    },
  ]);
  const [incomingMessages, setIncomingMessages] = useState<IncomingMessage[]>(DEFAULT_MESSAGES);
  const [negotiations, setNegotiations] = useState<NegotiationThread[]>(DEFAULT_NEGOTIATIONS);
  const [onboardingProgress, setOnboardingProgress] = useState(0);

  const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setChatMessages((prev) => [
      ...prev,
      { ...msg, id: String(Date.now()), timestamp: new Date() },
    ]);
  }, []);

  const toggleSource = useCallback((sourceId: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, connected: !s.connected } : s))
    );
  }, []);

  const addTrait = useCallback((trait: Omit<BehavioralTrait, 'id'>) => {
    setTraits((prev) => [...prev, { ...trait, id: String(Date.now()) }]);
  }, []);

  const summarizeMessage = useCallback((msgId: string) => {
    setIncomingMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        // Simulate AI summarization
        const summaries: Record<string, { summary: string; chips: string[] }> = {
          '1': {
            summary:
              'Jordan wants to review project timeline, budget discrepancies, and schedule time this week. Also wants you to follow up with Sarah about the presentation.',
            chips: [
              "Thanks Jordan, let's sync Thursday afternoon — I'll pull up the budget then too.",
              "Got it. I'll sort out the timeline and ping Sarah. How's Thursday for you?",
              "Can you send me the specific budget numbers? Then we can do a quick call to align.",
            ],
          },
          '2': {
            summary: 'Alex is asking if you\'re free Tuesday to hang out.',
            chips: [
              "Tuesday's packed — Wednesday evening work for you?",
              "I'm slammed Tuesday. Let's plan for the weekend!",
              "Can't do Tuesday, but I'm down for Wednesday or Thursday.",
            ],
          },
        };
        const result = summaries[msgId] || {
          summary: 'Message summarized.',
          chips: ['Sounds good!', 'Let me think about it.', 'Can we talk later?'],
        };
        return { ...m, summary: result.summary, responseChips: result.chips };
      })
    );
  }, []);

  const dismissMessage = useCallback((msgId: string) => {
    setIncomingMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, handled: true } : m)));
  }, []);

  const resolveNegotiation = useCallback((threadId: string) => {
    setNegotiations((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              resolved: true,
              status: 'resolved',
              outcome: 'Saturday at 7:30 PM confirmed for everyone.',
            }
          : t
      )
    );
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
    addChatMessage,
    toggleSource,
    addTrait,
    summarizeMessage,
    dismissMessage,
    resolveNegotiation,
    incrementOnboarding,
  };
}
