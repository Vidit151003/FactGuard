import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const fadeRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <section className="hero-section" aria-label="Hero — FactGuard AI Fact Checker">
      {/* Noise texture overlay */}
      <svg className="hero-noise" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" opacity="0.04" />
      </svg>

      <div className="hero-inner">
        {/* LEFT COLUMN */}
        <div className="hero-left">
          <div className="hero-eyebrow fade-up" ref={addRef} style={{ transitionDelay: '0.1s' }}>
            <span className="pulse-dot" aria-hidden="true"></span>
            AI-Powered Fact Verification
          </div>

          <h1 className="hero-heading fade-up" ref={addRef} style={{ transitionDelay: '0.2s' }}>
            Catch lies before<br />they spread.
          </h1>

          <p className="hero-sub fade-up" ref={addRef} style={{ transitionDelay: '0.3s' }}>
            Upload any PDF — marketing copy, research reports, press releases — and get a
            line-by-line truth audit powered by Claude AI and live web search.
          </p>

          <div className="hero-pills fade-up" ref={addRef} style={{ transitionDelay: '0.4s' }}>
            <span className="hero-pill">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Extracts claims automatically
            </span>
            <span className="hero-pill">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              Cross-checks live web data
            </span>
          </div>

          <div className="hero-actions fade-up" ref={addRef} style={{ transitionDelay: '0.5s' }}>
            <a href="#upload" className="btn btn-primary btn-lg hero-cta" id="hero-start-btn">
              Start Fact-Checking →
            </a>
            <a href="#how-it-works" className="hero-secondary-link">See how it works ↓</a>
          </div>
        </div>

        {/* RIGHT COLUMN — Isometric SVG Illustration */}
        <div className="hero-right fade-up" ref={addRef} style={{ transitionDelay: '0.15s' }}>
          <svg viewBox="0 0 680 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-illustration" aria-hidden="true" role="img">
            <defs>
              {/* Background gradient */}
              <radialGradient id="hero-bg-grad" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#3d1fa3" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0f0626" stopOpacity="0" />
              </radialGradient>
              {/* Teal glow */}
              <radialGradient id="teal-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00c896" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00c896" stopOpacity="0" />
              </radialGradient>
              {/* Card gradient */}
              <linearGradient id="card-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0f1f8" />
              </linearGradient>
              {/* Indigo gradient */}
              <linearGradient id="indigo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5b4fff" />
                <stop offset="100%" stopColor="#2d1065" />
              </linearGradient>
              {/* Drop shadow filter */}
              <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#1a0a3e" floodOpacity="0.4" />
              </filter>
              <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Background ellipse */}
            <ellipse cx="340" cy="240" rx="290" ry="210" fill="url(#hero-bg-grad)" />

            {/* Scattered geometric decorations */}
            <circle cx="80" cy="80" r="8" fill="#5b4fff" opacity="0.4" />
            <circle cx="600" cy="420" r="12" fill="#00c896" opacity="0.35" />
            <circle cx="620" cy="100" r="6" fill="#5b4fff" opacity="0.5" />
            <circle cx="50" cy="370" r="10" fill="#00c896" opacity="0.3" />
            <circle cx="340" cy="470" r="5" fill="#5b4fff" opacity="0.4" />

            {/* Dashed squares */}
            <rect x="55" y="160" width="30" height="30" rx="4" stroke="#5b4fff" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.5" />
            <rect x="605" y="200" width="24" height="24" rx="3" stroke="#00c896" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.5" />

            {/* Diagonal lines decoration */}
            <line x1="120" y1="420" x2="150" y2="390" stroke="#5b4fff" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3" />
            <line x1="130" y1="430" x2="160" y2="400" stroke="#5b4fff" strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3" />
            <line x1="540" y1="60" x2="570" y2="30" stroke="#00c896" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3" />
            <line x1="550" y1="70" x2="580" y2="40" stroke="#00c896" strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3" />

            {/* ── MAIN DOCUMENT CARD ── */}
            <g filter="url(#card-shadow)" style={{ animation: 'float 4s ease-in-out infinite' }}>
              <rect x="200" y="110" width="280" height="200" rx="16" fill="url(#card-grad)" />
              {/* Document lines */}
              <rect x="228" y="140" width="180" height="8" rx="4" fill="#e2e4f0" />
              <rect x="228" y="158" width="220" height="6" rx="3" fill="#e2e4f0" />
              <rect x="228" y="172" width="200" height="6" rx="3" fill="#e2e4f0" />
              {/* Highlighted claim lines */}
              <rect x="228" y="192" width="220" height="10" rx="5" fill="#ffd6d6" />
              <rect x="228" y="192" width="8" height="10" rx="4" fill="#ff4d4d" />
              <rect x="228" y="212" width="200" height="10" rx="5" fill="#d6f5eb" />
              <rect x="228" y="212" width="8" height="10" rx="4" fill="#00c896" />
              <rect x="228" y="232" width="180" height="10" rx="5" fill="#fff4d6" />
              <rect x="228" y="232" width="8" height="10" rx="4" fill="#f5a623" />
              <rect x="228" y="260" width="160" height="6" rx="3" fill="#e2e4f0" />
              <rect x="228" y="274" width="140" height="6" rx="3" fill="#e2e4f0" />
              {/* Top bar of card */}
              <rect x="200" y="110" width="280" height="20" rx="16" fill="url(#indigo-grad)" opacity="0.9" />
              <circle cx="220" cy="120" r="4" fill="rgba(255,255,255,0.4)" />
              <circle cx="233" cy="120" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="246" cy="120" r="4" fill="rgba(255,255,255,0.2)" />
            </g>

            {/* ── MAGNIFYING GLASS ── */}
            <g style={{ animation: 'float2 3.5s ease-in-out infinite' }} filter="url(#glow-filter)">
              <circle cx="430" cy="180" r="48" fill="none" stroke="#00c896" strokeWidth="5" opacity="0.9" />
              <circle cx="430" cy="180" r="40" fill="rgba(0,200,150,0.08)" />
              <line x1="466" y1="216" x2="490" y2="240" stroke="#00c896" strokeWidth="7" strokeLinecap="round" />
              {/* Inner magnifier lines */}
              <line x1="415" y1="172" x2="445" y2="172" stroke="rgba(0,200,150,0.5)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="415" y1="181" x2="445" y2="181" stroke="rgba(0,200,150,0.35)" strokeWidth="2" strokeLinecap="round" />
              <line x1="415" y1="189" x2="438" y2="189" stroke="rgba(0,200,150,0.2)" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* ── VERDICT BADGE: VERIFIED ✅ ── */}
            <g style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '0.5s' }} filter="url(#card-shadow)">
              <rect x="78" y="215" width="148" height="60" rx="14" fill="#e6fdf6" />
              <rect x="78" y="215" width="5" height="60" rx="2" fill="#00c896" />
              <circle cx="106" cy="245" r="14" fill="#00c896" />
              <path d="M99 245l5 5 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="125" y="239" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="9" fill="#00a87a" letterSpacing="1">VERIFIED</text>
              <text x="125" y="255" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1a0a3e" opacity="0.7">Claim confirmed ✓</text>
            </g>

            {/* ── VERDICT BADGE: INACCURATE ⚠️ ── */}
            <g style={{ animation: 'float3 4.5s ease-in-out infinite', animationDelay: '1s' }} filter="url(#card-shadow)">
              <rect x="458" y="300" width="152" height="60" rx="14" fill="#fff8e6" />
              <rect x="458" y="300" width="5" height="60" rx="2" fill="#f5a623" />
              <circle cx="487" cy="330" r="14" fill="#f5a623" />
              <text x="487" y="335" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="13" fill="#fff" textAnchor="middle">!</text>
              <text x="507" y="324" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="9" fill="#e5941a" letterSpacing="1">INACCURATE</text>
              <text x="507" y="340" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1a0a3e" opacity="0.7">Partially correct</text>
            </g>

            {/* ── VERDICT BADGE: FALSE ❌ ── */}
            <g style={{ animation: 'float2 3.8s ease-in-out infinite', animationDelay: '1.8s' }} filter="url(#card-shadow)">
              <rect x="270" y="355" width="140" height="60" rx="14" fill="#ffeaea" />
              <rect x="270" y="355" width="5" height="60" rx="2" fill="#ff4d4d" />
              <circle cx="298" cy="385" r="14" fill="#e53030" />
              <line x1="292" y1="379" x2="304" y2="391" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="304" y1="379" x2="292" y2="391" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <text x="318" y="379" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="9" fill="#e53030" letterSpacing="1">FALSE</text>
              <text x="318" y="395" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1a0a3e" opacity="0.7">Misleading claim</text>
            </g>

            {/* Teal glow effect under magnifier */}
            <ellipse cx="430" cy="195" rx="50" ry="20" fill="url(#teal-glow)" opacity="0.5" />

            {/* Small sparkle dots */}
            <circle cx="160" cy="310" r="4" fill="#5b4fff" opacity="0.6" />
            <circle cx="550" cy="160" r="3" fill="#00c896" opacity="0.7" />
            <circle cx="500" cy="420" r="5" fill="#5b4fff" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Wave divider to next section */}
      <div className="wave-divider hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #1a0a3e 0%, #2d1065 50%, #1a0a3e 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 72px;
          overflow: hidden;
        }
        .hero-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          position: relative;
          z-index: 1;
        }
        .hero-left { display: flex; flex-direction: column; gap: 28px; }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(0,200,150,0.15);
          border: 1px solid rgba(0,200,150,0.3);
          color: var(--teal);
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          width: fit-content;
          letter-spacing: 0.02em;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--teal);
          animation: pulse-dot 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        .hero-heading {
          font-size: clamp(2.5rem, 5vw, 3.6rem);
          font-weight: 900;
          color: var(--white);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .hero-sub {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.72);
          line-height: 1.7;
          max-width: 480px;
        }
        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.85);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .hero-cta { font-family: 'Fraunces', serif; }
        .hero-secondary-link {
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .hero-secondary-link:hover { color: var(--teal); }
        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-illustration {
          width: 100%;
          max-width: 620px;
          height: auto;
          filter: drop-shadow(0 30px 60px rgba(0,0,0,0.4));
        }
        .hero-wave {
          margin-top: auto;
        }
        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
            padding-top: 60px;
          }
          .hero-eyebrow { margin: 0 auto; }
          .hero-sub { margin: 0 auto; }
          .hero-pills { justify-content: center; }
          .hero-actions { justify-content: center; }
          .hero-right { order: -1; }
          .hero-illustration { max-width: 420px; }
        }
        @media (max-width: 480px) {
          .hero-heading { font-size: 2.2rem; }
          .hero-illustration { max-width: 320px; }
        }
      `}</style>
    </section>
  );
}
