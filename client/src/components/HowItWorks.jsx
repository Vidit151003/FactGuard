import { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect x="6" y="4" width="20" height="24" rx="3" stroke="#5b4fff" strokeWidth="2"/>
        <path d="M10 12h12M10 16h12M10 20h8" stroke="#5b4fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 4v4l4-4h-4z" fill="#00c896" opacity="0.7"/>
      </svg>
    ),
    title: 'Upload',
    desc: 'Drop your PDF. FactGuard reads the full text instantly — no size limits, no waiting.',
  },
  {
    num: '02',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <circle cx="14" cy="14" r="8" stroke="#5b4fff" strokeWidth="2"/>
        <line x1="20" y1="20" x2="27" y2="27" stroke="#5b4fff" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M10 14h8M14 10v8" stroke="#00c896" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Extract',
    desc: 'Claude AI identifies every verifiable claim: statistics, dates, financial figures, and technical assertions.',
  },
  {
    num: '03',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" stroke="#5b4fff" strokeWidth="2"/>
        <path d="M10 16l4 4 8-8" stroke="#00c896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="8" r="4" fill="#00c896" opacity="0.3"/>
        <line x1="24" y1="6" x2="24" y2="8" stroke="#00c896" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="9" r="0.8" fill="#00c896"/>
      </svg>
    ),
    title: 'Verify',
    desc: 'Each claim is cross-checked against live web data. Verdicts returned in real-time with source citations.',
  },
];

const stats = [
  { value: '50+', label: 'Document types supported' },
  { value: '15+', label: 'Claims per document' },
  { value: '$0', label: 'Cost to try' },
];

export default function HowItWorks() {
  const fadeRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <section id="how-it-works" className="hiw-section" aria-labelledby="hiw-heading">
      <div className="hiw-inner">
        <div className="hiw-header fade-up" ref={addRef}>
          <span className="section-eyebrow">Simple as 1-2-3</span>
          <h2 id="hiw-heading" className="section-title">How FactGuard works</h2>
          <p className="section-sub">From PDF to verified truth in three powerful steps.</p>
        </div>

        <div className="hiw-steps">
          {steps.map((step, i) => (
            <div key={step.num} className="hiw-step-wrapper">
              <div
                className="hiw-card fade-up"
                ref={addRef}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="hiw-step-num" aria-hidden="true">{step.num}</div>
                <div className="hiw-icon-wrap">{step.icon}</div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hiw-connector" aria-hidden="true">
                  <svg width="60" height="20" viewBox="0 0 60 20">
                    <line x1="0" y1="10" x2="60" y2="10" stroke="#c4bfff" strokeWidth="2" strokeDasharray="6 4" />
                    <path d="M52 5l8 5-8 5" stroke="#5b4fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="hiw-stats fade-up" ref={addRef} id="features" aria-label="FactGuard statistics">
          {stats.map((stat, i) => (
            <div key={stat.label} className="hiw-stat">
              <span className="hiw-stat-value">{stat.value}</span>
              <span className="hiw-stat-label">{stat.label}</span>
              {i < stats.length - 1 && <div className="hiw-stat-divider" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hiw-section {
          background: var(--white);
          padding: 100px 24px;
        }
        .hiw-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 64px;
          align-items: center;
        }
        .hiw-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .section-eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--indigo);
          background: rgba(91,79,255,0.08);
          padding: 6px 14px;
          border-radius: 100px;
        }
        .section-title {
          font-size: clamp(2rem, 4vw, 2.6rem);
          font-weight: 800;
          color: var(--navy);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .section-sub {
          font-size: 1.05rem;
          color: var(--gray-600);
          max-width: 480px;
          text-align: center;
        }
        .hiw-steps {
          display: flex;
          align-items: flex-start;
          gap: 0;
          width: 100%;
        }
        .hiw-step-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .hiw-card {
          flex: 1;
          background: var(--gray-50);
          border-radius: var(--card-radius);
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid var(--gray-200);
        }
        .hiw-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow);
        }
        .hiw-step-num {
          font-family: 'Fraunces', serif;
          font-size: 5rem;
          font-weight: 900;
          color: var(--gray-100);
          line-height: 1;
          position: absolute;
          top: 16px;
          right: 24px;
          user-select: none;
        }
        .hiw-icon-wrap {
          width: 56px;
          height: 56px;
          background: rgba(91,79,255,0.08);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hiw-step-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--navy);
          font-family: 'Fraunces', serif;
        }
        .hiw-step-desc {
          font-size: 0.95rem;
          color: var(--gray-600);
          line-height: 1.65;
        }
        .hiw-connector {
          flex-shrink: 0;
          padding: 0 8px;
          margin-top: -40px;
        }
        .hiw-stats {
          width: 100%;
          background: linear-gradient(135deg, #1a0a3e 0%, #2d1065 100%);
          border-radius: var(--card-radius);
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          position: relative;
          overflow: hidden;
        }
        .hiw-stats::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='rgba(91,79,255,0.15)'/%3E%3C/svg%3E");
        }
        .hiw-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .hiw-stat-value {
          font-family: 'Fraunces', serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--teal);
          line-height: 1;
        }
        .hiw-stat-label {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.65);
          font-weight: 400;
          max-width: 120px;
          text-align: center;
        }
        .hiw-stat-divider {
          position: absolute;
          right: -24px;
          top: 10%;
          height: 80%;
          width: 1px;
          background: rgba(255,255,255,0.1);
        }
        @media (max-width: 900px) {
          .hiw-steps { flex-direction: column; align-items: stretch; }
          .hiw-step-wrapper { flex-direction: column; }
          .hiw-connector { transform: rotate(90deg); padding: 0; margin: 4px auto; }
          .hiw-stats { flex-direction: column; gap: 32px; padding: 32px 24px; }
          .hiw-stat-divider { display: none; }
        }
      `}</style>
    </section>
  );
}
