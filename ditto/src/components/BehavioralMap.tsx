import type { BehavioralTrait } from '../types';

const CATEGORY_META: Record<
  BehavioralTrait['category'],
  { color: string; label: string }
> = {
  communication: { color: '#aa3bff', label: 'Communication' },
  schedule: { color: '#3b82f6', label: 'Schedule' },
  preference: { color: '#f59e0b', label: 'Preference' },
  habit: { color: '#10b981', label: 'Habit' },
};

interface BehavioralMapProps {
  traits: BehavioralTrait[];
}

export function BehavioralMap({ traits }: BehavioralMapProps) {
  return (
    <div className="bmap">
      <div className="bmap-header">
        <h2 className="section-title">Behavioral Map</h2>
        <p className="section-sub">Patterns Ditto has learned about you</p>
      </div>
      <div className="bmap-list">
        {traits.map((trait) => {
          const meta = CATEGORY_META[trait.category];
          return (
            <div key={trait.id} className="bmap-item">
              <div className="bmap-item-top">
                <span
                  className="bmap-badge"
                  style={{ background: `${meta.color}22`, color: meta.color }}
                >
                  {meta.label}
                </span>
                <span className="bmap-confidence">{trait.confidence}% confident</span>
              </div>
              <div className="bmap-label">{trait.label}</div>
              <div className="bmap-detail">{trait.detail}</div>
              <div className="bmap-bar-track">
                <div
                  className="bmap-bar-fill"
                  style={{
                    width: `${trait.confidence}%`,
                    background: meta.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
