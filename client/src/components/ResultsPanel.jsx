import { useState, useEffect, useRef } from 'react';
import ClaimCard from './ClaimCard';

const FILTERS = ['all', 'verified', 'inaccurate', 'false'];

export default function ResultsPanel({ results = [], claims = [], stage }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const counts = {
    verified: results.filter(r => r.status === 'verified').length,
    inaccurate: results.filter(r => r.status === 'inaccurate').length,
    false: results.filter(r => r.status === 'false').length,
  };

  const total = results.length;
  const trustScore = total > 0 ? Math.round((counts.verified / total) * 100) : 0;

  const filtered = activeFilter === 'all' ? results : results.filter(r => r.status === activeFilter);

  const handleDownload = () => {
    const report = {
      generated: new Date().toISOString(),
      summary: { total, ...counts, trustScore },
      results,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factguard-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Trust score ring
  const R = 36;
  const circumference = 2 * Math.PI * R;
  const dash = (trustScore / 100) * circumference;

  const trustColor = trustScore >= 70 ? 'var(--teal)' : trustScore >= 40 ? 'var(--amber)' : 'var(--false-border)';

  return (
    <section className="results-section" aria-labelledby="results-heading" ref={headerRef}>
      <div className="results-inner">
        {/* Summary bar */}
        <div className="results-summary fade-up visible">
          <div className="summary-metrics">
            <div className="metric-card metric-verified">
              <span className="metric-icon">✅</span>
              <span className="metric-count">{counts.verified}</span>
              <span className="metric-label">Verified</span>
            </div>
            <div className="metric-card metric-inaccurate">
              <span className="metric-icon">⚠️</span>
              <span className="metric-count">{counts.inaccurate}</span>
              <span className="metric-label">Inaccurate</span>
            </div>
            <div className="metric-card metric-false">
              <span className="metric-icon">❌</span>
              <span className="metric-count">{counts.false}</span>
              <span className="metric-label">False</span>
            </div>
          </div>

          {/* Trust score ring */}
          <div className="trust-ring-wrap">
            <svg width="100" height="100" viewBox="0 0 100 100" aria-label={`Trust score: ${trustScore}%`}>
              <circle cx="50" cy="50" r={R} fill="none" stroke="var(--gray-100)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r={R}
                fill="none"
                stroke={trustColor}
                strokeWidth="8"
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
              <text x="50" y="46" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="18" fill="var(--navy)">{trustScore}%</text>
              <text x="50" y="60" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" fill="var(--gray-600)">Trust Score</text>
            </svg>
          </div>

          <button
            className="btn btn-primary download-btn"
            onClick={handleDownload}
            id="download-report-btn"
            disabled={stage !== 'done'}
            aria-label="Download full fact-check report as JSON"
            style={{
              opacity: stage !== 'done' ? 0.4 : 1,
              cursor: stage !== 'done' ? 'not-allowed' : 'pointer',
              pointerEvents: stage !== 'done' ? 'none' : 'auto',
              transition: 'opacity 0.3s ease',
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {stage !== 'done' ? 'Preparing Report...' : 'Download Report'}
          </button>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs" role="tablist" aria-label="Filter claims by status">
          {FILTERS.map(f => (
            <button
              key={f}
              role="tab"
              aria-selected={activeFilter === f}
              className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
              id={`filter-tab-${f}`}
            >
              {f === 'all' && `All Claims (${total})`}
              {f === 'verified' && `✅ Verified (${counts.verified})`}
              {f === 'inaccurate' && `⚠️ Inaccurate (${counts.inaccurate})`}
              {f === 'false' && `❌ False (${counts.false})`}
            </button>
          ))}
        </div>

        {/* Claims list */}
        <div className="claims-list" role="list" aria-label="Fact-checked claims">
          {filtered.length === 0 ? (
            <div className="empty-filter" role="listitem">
              <p>No claims match this filter.</p>
            </div>
          ) : (
            filtered.map((result, i) => (
              <div role="listitem" key={result.id ?? i}>
                <ClaimCard result={result} index={i} />
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .results-section {
          background: var(--gray-50);
          padding: 80px 24px 100px;
        }
        .results-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .results-summary {
          display: flex;
          align-items: center;
          gap: 24px;
          background: var(--white);
          border-radius: var(--card-radius);
          padding: 28px 32px;
          box-shadow: var(--shadow);
          flex-wrap: wrap;
        }
        .summary-metrics {
          display: flex;
          gap: 16px;
          flex: 1;
          flex-wrap: wrap;
        }
        .metric-card {
          flex: 1;
          min-width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px;
          border-radius: 16px;
        }
        .metric-verified { background: var(--verified-bg); }
        .metric-inaccurate { background: var(--inaccurate-bg); }
        .metric-false { background: var(--false-bg); }
        .metric-icon { font-size: 1.4rem; }
        .metric-count {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          font-weight: 900;
          color: var(--navy);
          line-height: 1;
        }
        .metric-label { font-size: 0.75rem; font-weight: 600; color: var(--gray-600); }
        .trust-ring-wrap { flex-shrink: 0; }
        .download-btn { flex-shrink: 0; white-space: nowrap; }
        .filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-tab {
          padding: 10px 20px;
          border-radius: 100px;
          border: 1.5px solid var(--gray-200);
          background: var(--white);
          color: var(--gray-600);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .filter-tab:hover { border-color: var(--indigo); color: var(--indigo); }
        .filter-tab.active {
          background: var(--indigo);
          border-color: var(--indigo);
          color: var(--white);
        }
        .claims-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .empty-filter {
          text-align: center;
          padding: 48px;
          color: var(--gray-400);
          font-size: 0.95rem;
        }
        @media (max-width: 600px) {
          .results-summary { flex-direction: column; }
          .summary-metrics { width: 100%; }
          .trust-ring-wrap { display: none; }
        }
      `}</style>
    </section>
  );
}
