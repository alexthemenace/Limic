import { useState } from 'react';
import { draftEmail, researchTopic, type DraftResult, type ResearchResult } from '../api/actions';
import { ApiError } from '../api/client';

type ActionMode = 'draft' | 'research' | null;

export function ActionLayer() {
  const [mode, setMode] = useState<ActionMode>(null);

  // Draft state
  const [draftContext, setDraftContext] = useState('');
  const [draftRecipient, setDraftRecipient] = useState('');
  const [draftTone, setDraftTone] = useState<'professional' | 'casual' | 'assertive'>(
    'professional'
  );
  const [draftResult, setDraftResult] = useState<DraftResult | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState('');
  const [copied, setCopied] = useState(false);

  // Research state
  const [researchTopicInput, setResearchTopicInput] = useState('');
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState('');

  async function handleDraft() {
    setDraftError('');
    setDraftLoading(true);
    try {
      const result = await draftEmail({ context: draftContext, recipient: draftRecipient, tone: draftTone });
      setDraftResult(result);
      setCopied(false);
    } catch (err) {
      setDraftError(err instanceof ApiError ? err.message : 'Failed to generate draft. Please try again.');
    } finally {
      setDraftLoading(false);
    }
  }

  function handleCopy() {
    if (!draftResult) return;
    const text = `Subject: ${draftResult.subject}\n\n${draftResult.body}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleResearch() {
    setResearchError('');
    setResearchLoading(true);
    try {
      const result = await researchTopic({ topic: researchTopicInput });
      setResearchResult(result);
    } catch (err) {
      setResearchError(err instanceof ApiError ? err.message : 'Failed to fetch research. Please try again.');
    } finally {
      setResearchLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">The Delegate</h1>
          <p className="page-desc">
            Ditto acts on your behalf — in your exact voice and with your exact taste.
          </p>
        </div>
      </header>

      {mode === null && (
        <div className="action-cards">
          <button className="action-hero-card" onClick={() => setMode('draft')}>
            <div className="action-hero-icon">✍️</div>
            <div className="action-hero-label">Draft as Me</div>
            <div className="action-hero-sub">
              Write emails, messages, or proposals that sound exactly like you — on your best day.
            </div>
            <div className="btn btn-primary action-hero-btn">Start drafting →</div>
          </button>

          <button className="action-hero-card" onClick={() => setMode('research')}>
            <div className="action-hero-icon">🔍</div>
            <div className="action-hero-label">Research for Me</div>
            <div className="action-hero-sub">
              Tell Ditto what you're looking for and it filters the internet through your specific
              taste — not generic "Top 10" lists.
            </div>
            <div className="btn btn-primary action-hero-btn">Start researching →</div>
          </button>
        </div>
      )}

      {mode === 'draft' && (
        <div className="action-panel">
          <button className="back-btn" onClick={() => { setMode(null); setDraftResult(null); }}>
            ← Back
          </button>
          <h2 className="section-title">Draft as Me</h2>
          <p className="section-sub">
            Using your vocabulary, tone history, and past communication patterns.
          </p>

          <div className="form-group">
            <label className="form-label">What do you need to say?</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Dispute with my landlord about the broken heater. I've asked 3 times and it's been 2 weeks."
              value={draftContext}
              onChange={(e) => setDraftContext(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Recipient name (optional)</label>
              <input
                className="form-input"
                placeholder="e.g. Mr. Johnson"
                value={draftRecipient}
                onChange={(e) => setDraftRecipient(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tone</label>
              <div className="tone-buttons">
                {(['professional', 'casual', 'assertive'] as const).map((t) => (
                  <button
                    key={t}
                    className={`tone-btn${draftTone === t ? ' active' : ''}`}
                    onClick={() => setDraftTone(t)}
                  >
                    {t === 'professional' ? '💼' : t === 'casual' ? '👋' : '💪'}{' '}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleDraft} disabled={draftLoading}>
            {draftLoading ? '⏳ Generating…' : '✍️ Draft as Me'}
          </button>

          {draftError && <div className="auth-error">{draftError}</div>}

          {draftResult && (
            <div className="draft-result">
              <div className="draft-result-header">
                <span className="draft-result-label">✅ Your draft is ready</span>
                <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="draft-subject">Subject: {draftResult.subject}</div>
              <pre className="draft-body">{draftResult.body}</pre>
            </div>
          )}
        </div>
      )}

      {mode === 'research' && (
        <div className="action-panel">
          <button className="back-btn" onClick={() => { setMode(null); setResearchResult(null); }}>
            ← Back
          </button>
          <h2 className="section-title">Research for Me</h2>
          <p className="section-sub">
            Ditto filters recommendations through your behavioral map — your taste, not the
            algorithm's.
          </p>

          <div className="form-group">
            <label className="form-label">What do you want to find?</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="e.g. I want to plan a trip to Japan, but I hate tourist traps and love hidden record stores and vintage streetwear."
              value={researchTopicInput}
              onChange={(e) => setResearchTopicInput(e.target.value)}
            />
          </div>

          <div className="research-context-box">
            <div className="research-context-title">📋 Using your profile</div>
            <div className="research-context-chips">
              <span className="context-chip">90s streetwear lover</span>
              <span className="context-chip">Hates tourist traps</span>
              <span className="context-chip">Prefers hidden gems</span>
              <span className="context-chip">Direct recommendations</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleResearch} disabled={researchLoading}>
            {researchLoading ? '⏳ Researching…' : '🔍 Research as Me'}
          </button>

          {researchError && <div className="auth-error">{researchError}</div>}

          {researchResult && (
            <div className="research-result">
              <div className="research-result-title">{researchResult.title}</div>
              <div className="research-items">
                {researchResult.items.map((item, i) => (
                  <div key={i} className="research-item">
                    <div className="research-item-top">
                      <span className="research-item-name">{item.name}</span>
                      <span className="research-item-tag">{item.tag}</span>
                    </div>
                    <div className="research-item-why">
                      <span className="research-why-icon">✓</span> {item.why}
                    </div>
                  </div>
                ))}
              </div>
              <div className="research-disclaimer">
                Filtered through your behavioral map — 0 generic tourist traps included.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
