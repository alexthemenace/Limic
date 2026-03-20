import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, DataSource } from '../types';

// Simulated AI responses that reflect the "behavioral learning" concept
const DITTO_RESPONSES = [
  "Got it — noted that you really value directness. I'll make sure your drafts cut straight to the point. 📝",
  "Interesting! The way you described that tells me a lot about your communication style. I'm picking up that you prefer outcomes over process.",
  "I'm filing that under 'Schedule Preferences'. Sounds like your energy peaks mid-morning — I'll avoid early slots for you.",
  "That frustration you mentioned about follow-ups? That's a pattern I'm logging. I'll start flagging things that need a nudge.",
  "Your taste is coming through clearly. I'm updating your preference profile — this will make my research recommendations way more accurate. 🎯",
  "This is gold. The more you share, the more accurately I can represent you. Keep going!",
  "I'm connecting the dots between what you just said and your earlier notes. Your behavioral map is getting more detailed. 🧠",
  "Noted and filed. I now understand a bit more about how you handle conflict — this will shape how I draft your assertive messages.",
];

let responseIndex = 0;
function getNextResponse() {
  const r = DITTO_RESPONSES[responseIndex % DITTO_RESPONSES.length];
  responseIndex++;
  return r;
}

interface OnboardingProps {
  chatMessages: ChatMessage[];
  sources: DataSource[];
  onboardingProgress: number;
  onSendMessage: (text: string) => void;
  onToggleSource: (id: string) => void;
  onAddDittoReply: (text: string) => void;
  onIncrementProgress: () => void;
}

export function Onboarding({
  chatMessages,
  sources,
  onboardingProgress,
  onSendMessage,
  onToggleSource,
  onAddDittoReply,
  onIncrementProgress,
}: OnboardingProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'import'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    onSendMessage(text);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      onAddDittoReply(getNextResponse());
      onIncrementProgress();
    }, 1400);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const connectedCount = sources.filter((s) => s.connected).length;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">The Mirror</h1>
          <p className="page-desc">
            Talk to Ditto. The more you share, the better it knows you.
          </p>
        </div>
        <div className="progress-ring-wrap">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeDasharray={`${(onboardingProgress / 100) * 175.9} 175.9`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <span className="progress-ring-pct">{onboardingProgress}%</span>
        </div>
      </header>

      <div className="tab-bar">
        <button
          className={`tab-btn${activeTab === 'chat' ? ' active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Conversation
        </button>
        <button
          className={`tab-btn${activeTab === 'import' ? ' active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          🔗 Integrations {connectedCount > 0 && <span className="tab-badge">{connectedCount}</span>}
        </button>
      </div>

      {activeTab === 'chat' && (
        <div className="chat-layout">
          <div className="chat-messages">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ditto'}`}
              >
                {msg.role === 'ditto' && (
                  <div className="chat-avatar">◈</div>
                )}
                <div className="chat-text">{msg.text}</div>
                {msg.role === 'user' && (
                  <div className="chat-avatar chat-avatar-user">👤</div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble chat-bubble-ditto">
                <div className="chat-avatar">◈</div>
                <div className="chat-text chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-wrap">
            <textarea
              className="chat-input"
              rows={2}
              placeholder="Tell Ditto about your goals, frustrations, or how you like to work..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-primary chat-send"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>

          <div className="chat-prompts">
            <div className="chat-prompts-label">Try saying:</div>
            {[
              'I hate it when people schedule meetings first thing in the morning.',
              'My biggest frustration is forgetting to follow up on emails.',
              'I like blunt, direct feedback — no sugarcoating.',
            ].map((p) => (
              <button
                key={p}
                className="chat-prompt-chip"
                onClick={() => {
                  setInput(p);
                }}
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="import-grid">
          <div className="import-intro">
            <p>
              Connect your data sources once and Ditto will passively absorb your patterns — no
              manual setup required.
            </p>
          </div>
          {sources.map((source) => (
            <div
              key={source.id}
              className={`import-card${source.connected ? ' connected' : ''}`}
            >
              <div className="import-card-icon">{source.icon}</div>
              <div className="import-card-body">
                <div className="import-card-name">{source.name}</div>
                <div className="import-card-desc">{source.description}</div>
              </div>
              <button
                className={`btn ${source.connected ? 'btn-ghost' : 'btn-primary'} import-btn`}
                onClick={() => {
                  onToggleSource(source.id);
                  if (!source.connected) onIncrementProgress();
                }}
              >
                {source.connected ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
