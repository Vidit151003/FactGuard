import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#" className="navbar-logo" aria-label="FactGuard Home">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5b4fff" />
                <stop offset="100%" stopColor="#00c896" />
              </linearGradient>
            </defs>
            <path d="M18 2L4 8v10c0 9 6 14 14 16 8-2 14-7 14-16V8L18 2z" fill="url(#shield-grad)" />
            <path d="M12 18l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="navbar-wordmark">FactGuard</span>
        </a>

        {/* Nav links */}
        <div className="navbar-links">
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#upload" className="nav-link">Try Now</a>
          <a href="#upload" className="btn btn-primary navbar-cta" id="navbar-upload-btn">
            Upload PDF →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="navbar-mobile-toggle" aria-label="Open menu" onClick={() => {
          document.querySelector('.navbar-links').classList.toggle('mobile-open');
        }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
          padding: 0 24px;
        }
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 2px 20px rgba(26, 10, 62, 0.1);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .navbar-wordmark {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--navy);
          letter-spacing: -0.02em;
        }
        .navbar:not(.scrolled) .navbar-wordmark {
          color: #fff;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-link {
          font-size: 0.925rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--teal); }
        .navbar.scrolled .nav-link { color: var(--navy); }
        .navbar.scrolled .nav-link:hover { color: var(--indigo); }
        .navbar-cta {
          font-size: 0.9rem;
          padding: 10px 22px;
        }
        .navbar-mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--white);
        }
        .navbar.scrolled .navbar-mobile-toggle { color: var(--navy); }
        @media (max-width: 768px) {
          .navbar-mobile-toggle { display: flex; }
          .navbar-links {
            display: none;
            position: absolute;
            top: 72px;
            left: 0;
            right: 0;
            flex-direction: column;
            background: rgba(255,255,255,0.97);
            backdrop-filter: blur(20px);
            padding: 20px;
            gap: 16px;
            box-shadow: 0 8px 30px rgba(26,10,62,0.15);
          }
          .navbar-links.mobile-open { display: flex; }
          .nav-link { color: var(--navy) !important; }
        }
      `}</style>
    </nav>
  );
}
