import type { BehavioralTrait, Page } from '../types';
import { BehavioralMap } from '../components/BehavioralMap';

const STAT_CARDS = [
  {
    icon: '🪞',
    label: 'Mirror Sessions',
    value: '8',
    sub: 'conversations logged',
    color: '#aa3bff',
  },
  {
    icon: '⚡',
    label: 'Actions Taken',
    value: '12',
    sub: 'tasks handled by Ditto',
    color: '#3b82f6',
  },
  {
    icon: '🛡️',
    label: 'Messages Buffered',
    value: '31',
    sub: 'interruptions blocked',
    color: '#10b981',
  },
  {
    icon: '⏱️',
    label: 'Hours Saved',
    value: '4.5',
    sub: 'this week',
    color: '#f59e0b',
  },
];

interface DashboardProps {
  traits: BehavioralTrait[];
  onboardingProgress: number;
  onNavigate: (page: Page) => void;
}

export function Dashboard({ traits, onboardingProgress, onNavigate }: DashboardProps) {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Good morning, You.</h1>
          <p className="page-desc">
            Ditto is online and actively learning. Here's what's happening.
          </p>
        </div>
        <div className="onboarding-cta">
          <div className="onboarding-cta-label">Clone accuracy</div>
          <div className="onboarding-cta-pct">{onboardingProgress}%</div>
          <button className="btn btn-primary" onClick={() => onNavigate('onboarding')}>
            Keep training →
          </button>
        </div>
      </header>

      <div className="stat-grid">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <BehavioralMap traits={traits} />

        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-sub">Jump into what Ditto can do for you</p>
          <div className="qa-list">
            <button className="qa-item" onClick={() => onNavigate('action')}>
              <span className="qa-icon">✍️</span>
              <div>
                <div className="qa-label">Draft as Me</div>
                <div className="qa-sub">Write an email in your exact voice</div>
              </div>
              <span className="qa-arrow">→</span>
            </button>
            <button className="qa-item" onClick={() => onNavigate('action')}>
              <span className="qa-icon">🔍</span>
              <div>
                <div className="qa-label">Research for Me</div>
                <div className="qa-sub">Filter the internet through your taste</div>
              </div>
              <span className="qa-arrow">→</span>
            </button>
            <button className="qa-item" onClick={() => onNavigate('social')}>
              <span className="qa-icon">📬</span>
              <div>
                <div className="qa-label">Check My Buffer</div>
                <div className="qa-sub">2 messages waiting for your attention</div>
              </div>
              <span className="qa-arrow">→</span>
            </button>
            <button className="qa-item" onClick={() => onNavigate('onboarding')}>
              <span className="qa-icon">🪞</span>
              <div>
                <div className="qa-label">Talk to Ditto</div>
                <div className="qa-sub">Keep training your clone</div>
              </div>
              <span className="qa-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="insight-banner">
        <span className="insight-icon">💡</span>
        <div>
          <div className="insight-title">Ditto Insight</div>
          <div className="insight-text">
            Your friend Alex asked about Tuesday. Based on your lab schedule, Ditto
            knows you're usually burnt out after your Tuesday sessions — it's already
            drafted a response suggesting Wednesday instead.
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => onNavigate('social')}>
          Review →
        </button>
      </div>
    </div>
  );
}
