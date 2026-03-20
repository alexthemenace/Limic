import type { IncomingMessage, NegotiationThread } from '../types';

interface SocialLayerProps {
  incomingMessages: IncomingMessage[];
  negotiations: NegotiationThread[];
  onSummarize: (id: string) => void;
  onDismiss: (id: string) => void;
  onResolveNegotiation: (id: string) => void;
}

export function SocialLayer({
  incomingMessages,
  negotiations,
  onSummarize,
  onDismiss,
  onResolveNegotiation,
}: SocialLayerProps) {
  const activeMessages = incomingMessages.filter((m) => !m.handled);
  const handledMessages = incomingMessages.filter((m) => m.handled);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">The Buffer</h1>
          <p className="page-desc">
            Ditto reads the room for you — summarizing noise and handling logistics so you only
            deal with what matters.
          </p>
        </div>
        <div className="buffer-badge-wrap">
          {activeMessages.length > 0 && (
            <div className="buffer-badge">
              <span className="buffer-badge-count">{activeMessages.length}</span>
              <span>messages waiting</span>
            </div>
          )}
        </div>
      </header>

      {/* Gatekeeper section */}
      <section className="social-section">
        <div className="social-section-header">
          <div className="social-section-icon">🚪</div>
          <div>
            <h2 className="section-title">The Gatekeeper</h2>
            <p className="section-sub">Ditto reads messages first and gives you the essentials.</p>
          </div>
        </div>

        {activeMessages.length === 0 && (
          <div className="empty-state">
            <span>✅</span>
            <div>You're all caught up! No messages waiting.</div>
          </div>
        )}

        <div className="message-list">
          {activeMessages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="message-card-header">
                <div className="message-sender">{msg.sender}</div>
                {!msg.summary && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onSummarize(msg.id)}
                  >
                    ⚡ Summarize for me
                  </button>
                )}
              </div>

              {!msg.summary && (
                <div className="message-preview">{msg.preview}</div>
              )}

              {msg.summary && (
                <>
                  <div className="message-summary">
                    <span className="summary-label">📋 Summary</span>
                    {msg.summary}
                  </div>

                  <div className="response-chips-wrap">
                    <div className="response-chips-label">💬 Response options (in your voice):</div>
                    <div className="response-chips">
                      {msg.responseChips?.map((chip, i) => (
                        <button
                          key={i}
                          className="response-chip"
                          onClick={() => onDismiss(msg.id)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="message-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => onDismiss(msg.id)}>
                      Mark handled
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {handledMessages.length > 0 && (
          <div className="handled-section">
            <div className="handled-label">✓ Handled ({handledMessages.length})</div>
            {handledMessages.map((msg) => (
              <div key={msg.id} className="handled-item">
                <span className="handled-sender">{msg.sender}</span>
                <span className="handled-preview">{msg.preview}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Negotiator section */}
      <section className="social-section">
        <div className="social-section-header">
          <div className="social-section-icon">🤝</div>
          <div>
            <h2 className="section-title">The Negotiator</h2>
            <p className="section-sub">
              Ditto handles the back-and-forth and only pings you when a decision is reached.
            </p>
          </div>
        </div>

        <div className="negotiation-list">
          {negotiations.map((thread) => (
            <div key={thread.id} className="negotiation-card">
              <div className="negotiation-header">
                <div className="negotiation-topic">{thread.topic}</div>
                <span
                  className={`negotiation-status status-${thread.status}`}
                >
                  {thread.status === 'negotiating'
                    ? '🔄 Negotiating'
                    : thread.status === 'resolved'
                    ? '✅ Resolved'
                    : '⏳ Pending'}
                </span>
              </div>

              <div className="negotiation-participants">
                {thread.participants.map((p) => (
                  <span key={p} className={`participant-chip${p === 'You' ? ' you' : ''}`}>
                    {p}
                  </span>
                ))}
              </div>

              <div className="negotiation-thread">
                {thread.messages.map((m, i) => (
                  <div key={i} className="thread-message">
                    {m}
                  </div>
                ))}
                {thread.status === 'negotiating' && (
                  <div className="thread-message ditto-msg">
                    Ditto: Checking availability... proposing Saturday 7:30 PM to all.
                  </div>
                )}
                {thread.outcome && (
                  <div className="thread-outcome">
                    🎉 Outcome: {thread.outcome}
                  </div>
                )}
              </div>

              {thread.status !== 'resolved' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onResolveNegotiation(thread.id)}
                >
                  ✓ Everyone agrees — confirm
                </button>
              )}

              {thread.status === 'resolved' && (
                <div className="negotiation-done">
                  Ditto handled it. You're confirmed for {thread.outcome?.split('confirmed for ')[1] || 'the event'}.
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
