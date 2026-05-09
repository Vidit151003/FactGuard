import { useEffect, useRef } from 'react';

export default function ClaimCard({ result, index }) {
  const { claim, category, status, explanation, corrected_fact, source, confidence } = result;
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const statusConfig = {
    verified: { label: 'VERIFIED', icon: '✅', color: 'var(--verified-badge)', bg: 'var(--verified-bg)', border: 'var(--verified-border)' },
    inaccurate: { label: 'INACCURATE', icon: '⚠️', color: 'var(--inaccurate-badge)', bg: 'var(--inaccurate-bg)', border: 'var(--inaccurate-border)' },
    false: { label: 'FALSE', icon: '❌', color: 'var(--false-badge)', bg: 'var(--false-bg)', border: 'var(--false-border)' },
  };

  const cfg = statusConfig[status] || statusConfig.false;

  const confidenceDots = [
    { id: 'dot-1', active: true },
    { id: 'dot-2', active: confidence === 'medium' || confidence === 'high' },
    { id: 'dot-3', active: confidence === 'high' },
  ];

  const confColor = confidence === 'high' ? 'var(--teal)' : confidence === 'medium' ? 'var(--amber)' : 'var(--false-border)';

  const categoryLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'General';

  const handleSourceClick = () => {
    if (source && source !== 'N/A' && source.startsWith('http')) {
      window.open(source, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      ref={cardRef}
      className="claim-card fade-up"
      style={{
        transitionDelay: `${(index % 5) * 0.08}s`,
        background: cfg.bg,
        borderLeft: `5px solid ${cfg.border}`,
      }}
      aria-label={`Claim ${index + 1}: ${status}`}
    >
      {/* Top row */}
      <div className="claim-card-top">
        <span
          className="claim-badge"
          style={{ background: cfg.color }}
          aria-label={`Status: ${status}`}
        >
          {cfg.icon} {cfg.label}
        </span>
        <span className="claim-category-tag">{categoryLabel}</span>
        <div className="confidence-dots" title={`Confidence: ${confidence || 'low'}`} aria-label={`Confidence: ${confidence}`}>
          {confidenceDots.map(dot => (
            <span
              key={dot.id}
              className="conf-dot"
              style={{ background: dot.active ? confColor : 'var(--gray-200)' }}
            />
          ))}
        </div>
      </div>

      {/* Claim text */}
      <blockquote className="claim-text">
        "{claim}"
      </blockquote>

      {/* Corrected fact */}
      {(status === 'inaccurate' || status === 'false') && corrected_fact && (
        <div className="corrected-fact-box">
          <div className="corrected-fact-header">
            <span className="corrected-fact-icon" aria-hidden="true">✏️</span>
            <strong>Corrected Fact</strong>
          </div>
          <p className="corrected-fact-text">{corrected_fact}</p>
        </div>
      )}

      {/* Explanation */}
      <p className="claim-explanation">{explanation}</p>

      {/* Source */}
      {source && source !== 'N/A' && (
        <button
          className="claim-source"
          onClick={handleSourceClick}
          aria-label={`Source: ${source}`}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
          {source.length > 60 ? source.slice(0, 60) + '…' : source}
        </button>
      )}

      <style>{`
        .claim-card {
          border-radius: var(--card-radius);
          padding: 28px 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 2px 16px rgba(26,10,62,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.5s ease, translateY 0.5s ease;
        }
        .claim-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(26,10,62,0.12);
        }
        .claim-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .claim-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .claim-category-tag {
          background: rgba(91,79,255,0.1);
          color: var(--indigo);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .confidence-dots {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
        }
        .conf-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .claim-text {
          font-style: italic;
          color: var(--navy);
          font-size: 1rem;
          line-height: 1.65;
          font-weight: 400;
          border: none;
          padding: 0;
          margin: 0;
        }
        .corrected-fact-box {
          background: rgba(255,255,255,0.7);
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid rgba(26,10,62,0.08);
        }
        .corrected-fact-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .corrected-fact-icon { font-size: 1rem; }
        .corrected-fact-header strong { font-size: 0.85rem; color: var(--navy); font-weight: 700; }
        .corrected-fact-text {
          font-size: 0.9rem;
          color: var(--navy);
          line-height: 1.6;
          font-weight: 500;
        }
        .claim-explanation {
          font-size: 0.88rem;
          color: var(--gray-600);
          line-height: 1.6;
        }
        .claim-source {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--indigo);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
          text-align: left;
          word-break: break-all;
        }
        .claim-source:hover { color: var(--teal-dark); }
      `}</style>
    </article>
  );
}
