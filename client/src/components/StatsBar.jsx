export default function StatsBar({ results = [] }) {
  const total = results.length;
  const verified = results.filter(r => r.status === 'verified').length;
  const inaccurate = results.filter(r => r.status === 'inaccurate').length;
  const falseClaims = results.filter(r => r.status === 'false').length;
  const trustScore = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <div className="stats-bar" role="region" aria-label="Analysis summary statistics">
      <div className="stat-item">
        <span className="stat-value" style={{ color: 'var(--teal)' }}>{verified}</span>
        <span className="stat-label">Verified</span>
      </div>
      <div className="stat-divider" aria-hidden="true" />
      <div className="stat-item">
        <span className="stat-value" style={{ color: 'var(--amber)' }}>{inaccurate}</span>
        <span className="stat-label">Inaccurate</span>
      </div>
      <div className="stat-divider" aria-hidden="true" />
      <div className="stat-item">
        <span className="stat-value" style={{ color: 'var(--false-border)' }}>{falseClaims}</span>
        <span className="stat-label">False</span>
      </div>
      <div className="stat-divider" aria-hidden="true" />
      <div className="stat-item">
        <span className="stat-value" style={{ color: 'var(--indigo)' }}>{trustScore}%</span>
        <span className="stat-label">Trust Score</span>
      </div>
      <style>{`
        .stats-bar {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--white);
          border-radius: 16px;
          padding: 20px 32px;
          box-shadow: var(--shadow);
        }
        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .stat-value {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
          font-weight: 900;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--gray-600);
          font-weight: 500;
        }
        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--gray-200);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
