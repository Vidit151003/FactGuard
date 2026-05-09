export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Decorative dot pattern SVG */}
      <div className="footer-dots" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 80 }, (_, i) => (
            <circle
              key={i}
              cx={(i % 16) * 28 + 8}
              cy={Math.floor(i / 16) * 40 + 10}
              r="2"
              fill={i % 3 === 0 ? '#00c896' : '#5b4fff'}
              opacity={0.08 + (i % 5) * 0.04}
            />
          ))}
        </svg>
      </div>

      <div className="footer-inner">
        {/* Top: logo + tagline */}
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="footer-shield-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5b4fff" />
                  <stop offset="100%" stopColor="#00c896" />
                </linearGradient>
              </defs>
              <path d="M18 2L4 8v10c0 9 6 14 14 16 8-2 14-7 14-16V8L18 2z" fill="url(#footer-shield-grad)" />
              <path d="M12 18l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="footer-wordmark">FactGuard</span>
          </div>
          <p className="footer-tagline">Truth, one PDF at a time.</p>
        </div>

        {/* Links grid */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <h3 className="footer-col-title">Product</h3>
            <nav aria-label="Product links">
              <a href="#how-it-works" className="footer-link">How it Works</a>
              <a href="#features" className="footer-link">Features</a>
              <a href="#upload" className="footer-link">Try Now</a>
            </nav>
          </div>
          <div className="footer-col">
            <h3 className="footer-col-title">Technology</h3>
            <nav aria-label="Technology links">
              <a href="https://anthropic.com" className="footer-link" target="_blank" rel="noopener noreferrer">Built with Claude AI</a>
              <a href="#how-it-works" className="footer-link">Live Web Search</a>
              <a href="#how-it-works" className="footer-link">PDF Parsing</a>
            </nav>
          </div>
          <div className="footer-col">
            <h3 className="footer-col-title">Legal</h3>
            <nav aria-label="Legal links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Cookie Policy</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">© 2025 FactGuard. Powered by Anthropic Claude.</p>
        <a
          href="https://anthropic.com"
          className="anthropic-badge"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Built with Anthropic Claude AI"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00c896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Built with Anthropic
        </a>
      </div>

      <style>{`
        .footer {
          background: var(--navy-deep);
          padding: 72px 24px 0;
          position: relative;
          overflow: hidden;
        }
        .footer-dots {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          gap: 64px;
          padding-bottom: 56px;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
        }
        .footer-brand {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-wordmark {
          font-family: 'Fraunces', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--white);
        }
        .footer-tagline {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
          max-width: 200px;
        }
        .footer-links-grid {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-col-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .footer-col nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-link {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--teal); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 20px 0;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy { font-size: 0.82rem; color: rgba(255,255,255,0.3); }
        .anthropic-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,200,150,0.1);
          border: 1px solid rgba(0,200,150,0.2);
          color: var(--teal);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .anthropic-badge:hover { background: rgba(0,200,150,0.18); }
      `}</style>
    </footer>
  );
}
