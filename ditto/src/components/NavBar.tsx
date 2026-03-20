import type { Page } from '../types';

interface NavItem {
  id: Page;
  label: string;
  icon: string;
  tagline: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', tagline: 'Your overview' },
  { id: 'onboarding', label: 'The Mirror', icon: '🪞', tagline: 'Train Ditto' },
  { id: 'action', label: 'The Delegate', icon: '⚡', tagline: 'Act for you' },
  { id: 'social', label: 'The Buffer', icon: '🛡️', tagline: 'Guard your time' },
];

interface NavBarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  onboardingProgress: number;
}

export function NavBar({ current, onNavigate, onboardingProgress }: NavBarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">◈</span>
        <div>
          <div className="navbar-title">Ditto</div>
          <div className="navbar-subtitle">Your Digital Twin</div>
        </div>
      </div>

      <div className="navbar-progress-wrap">
        <div className="navbar-progress-label">
          <span>Clone Accuracy</span>
          <span className="navbar-progress-pct">{onboardingProgress}%</span>
        </div>
        <div className="navbar-progress-track">
          <div
            className="navbar-progress-bar"
            style={{ width: `${onboardingProgress}%` }}
          />
        </div>
      </div>

      <ul className="navbar-links">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              className={`navbar-link${current === item.id ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="navbar-link-icon">{item.icon}</span>
              <div className="navbar-link-text">
                <span className="navbar-link-label">{item.label}</span>
                <span className="navbar-link-tagline">{item.tagline}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="navbar-footer">
        <div className="navbar-avatar">
          <span>👤</span>
        </div>
        <div className="navbar-user">
          <div className="navbar-user-name">You</div>
          <div className="navbar-user-sub">The Original</div>
        </div>
      </div>
    </nav>
  );
}
