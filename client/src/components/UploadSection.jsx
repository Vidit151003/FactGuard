import { useState, useRef, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function UploadSection({ onResults, onClaims, onStageChange, stage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  const addLine = (text, color = '#c9d1d9') => {
    setTerminalLines(prev => [...prev, { text, color }]);
  };

  const handleFileSelect = useCallback((file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = async () => {
    if (!selectedFile) return;
    // Scroll to the upload section so the terminal stays in view
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    onStageChange('loading');
    setTerminalLines([]);
    setProgressPercent(0);
    setErrorMsg('');
    onResults(null);
    onClaims([]);

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await fetch(`${API_BASE}/api/factcheck`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          try {
            const data = JSON.parse(line.replace(/^data:\s*/, ''));

            if (data.stage === 'extracting') {
              addLine('→ Reading PDF and extracting text...', '#8b9cf4');
              setProgressPercent(5);
            }
            if (data.stage === 'identifying') {
              addLine('→ Identifying verifiable claims...', '#8b9cf4');
              setProgressPercent(15);
            }
            if (data.stage === 'claims_found') {
              addLine(`✓ Found ${data.count} claims to verify`, '#00c896');
              onClaims(data.claims);
              setProgressPercent(20);
            }
            if (data.stage === 'verifying') {
              addLine(
                `⟳ [${data.current}/${data.total}] Checking: "${data.claim.slice(0, 60)}${data.claim.length > 60 ? '...' : ''}"`,
                '#febc2e'
              );
              setProgressPercent(20 + Math.round((data.current / data.total) * 75));
            }
            if (data.stage === 'claim_result') {
              const icons = { verified: '✓', inaccurate: '⚠', false: '✗' };
              const colors = { verified: '#00c896', inaccurate: '#febc2e', false: '#ff5f57' };
              const r = data.result;
              addLine(
                `  ${icons[r.status]} ${r.status.toUpperCase()} — ${r.claim.slice(0, 55)}${r.claim.length > 55 ? '...' : ''}`,
                colors[r.status]
              );
              onResults(prev => [...(prev || []), r]);
            }
            if (data.stage === 'complete') {
              addLine('', '#555');
              addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '#2a2a3e');
              addLine('✓ Analysis complete. Report ready.', '#00c896');
              setProgressPercent(100);
              onResults(data.results);
              onStageChange('done');
            }
            if (data.stage === 'error') {
              addLine(`✗ Error: ${data.message}`, '#ff5f57');
              setErrorMsg(data.message);
              onStageChange('error');
            }
          } catch (_) { /* ignore parse errors */ }
        }
      }
    } catch (err) {
      addLine(`✗ Error: ${err.message}`, '#ff5f57');
      setErrorMsg(err.message);
      onStageChange('error');
    }
  };

  const handleNewUpload = () => {
    setSelectedFile(null);
    setTerminalLines([]);
    setProgressPercent(0);
    setErrorMsg('');
    onStageChange('idle');
    onResults(null);
    onClaims([]);
  };

  const isLoading = stage === 'loading';
  const isDone = stage === 'done';
  const isError = stage === 'error';
  const isIdle = stage === 'idle';

  return (
    <section id="upload" className="upload-section" aria-labelledby="upload-heading">
      <div className="upload-inner">
        <div className="upload-header">
          <span className="section-eyebrow">Try It Free</span>
          <h2 id="upload-heading" className="section-title">Upload your document</h2>
          <p className="section-sub">Supports any text-based PDF — reports, articles, press releases, research papers.</p>
        </div>

        {/* Upload card — shown in idle AND loading states; terminal appears below */}
        {(isIdle || isLoading) && (
          <div
            className={`upload-card ${isDragging ? 'dragging' : ''} ${selectedFile ? 'file-selected' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !selectedFile && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload PDF drop zone"
            onKeyDown={e => e.key === 'Enter' && !selectedFile && inputRef.current?.click()}
          >
            <input
              type="file"
              accept=".pdf"
              ref={inputRef}
              onChange={e => handleFileSelect(e.target.files[0])}
              style={{ display: 'none' }}
              id="pdf-file-input"
              aria-label="Select PDF file"
            />
            <div className="upload-illustration" aria-hidden="true">
              <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                <defs>
                  <linearGradient id="doc-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0f1f8" />
                    <stop offset="100%" stopColor="#e2e4f0" />
                  </linearGradient>
                </defs>
                <rect x="25" y="15" width="70" height="75" rx="8" fill="url(#doc-grad)" stroke="#c4bfff" strokeWidth="2"/>
                <rect x="35" y="30" width="50" height="5" rx="2.5" fill="#c4bfff"/>
                <rect x="35" y="42" width="42" height="5" rx="2.5" fill="#c4bfff"/>
                <rect x="35" y="54" width="46" height="5" rx="2.5" fill="#c4bfff"/>
                <circle cx="60" cy="20" r="16" fill="rgba(91,79,255,0.12)" />
                <path d="M60 27v-14M54 19l6-6 6 6" stroke="#5b4fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18" cy="18" r="3" fill="#00c896" opacity="0.6"/>
                <circle cx="102" cy="30" r="2.5" fill="#5b4fff" opacity="0.5"/>
                <circle cx="110" cy="70" r="3.5" fill="#00c896" opacity="0.4"/>
                <circle cx="10" cy="75" r="2" fill="#5b4fff" opacity="0.4"/>
                <path d="M15 50l2-4 2 4-4 0" fill="#f5a623" opacity="0.5"/>
                <path d="M105 50l2-4 2 4-4 0" fill="#00c896" opacity="0.5"/>
              </svg>
            </div>

            {!selectedFile ? (
              <>
                <h3 className="upload-title">Drop your PDF here</h3>
                <p className="upload-hint">or <span className="upload-browse">click to browse</span></p>
                <p className="upload-formats">Supports text-based PDFs up to 50MB</p>
              </>
            ) : (
              <div className="file-info">
                <div className="file-icon" aria-hidden="true">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#5b4fff" strokeWidth="2"/>
                    <path d="M14 2v6h6" stroke="#5b4fff" strokeWidth="2"/>
                    <path d="M9 15l2 2 4-4" stroke="#00c896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button
                  className="file-remove"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  aria-label="Remove file"
                >×</button>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="upload-error-box">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Analysis failed</strong>
              <p>{errorMsg || 'Something went wrong. Please try again.'}</p>
            </div>
            <button className="btn btn-primary" onClick={handleNewUpload} id="error-retry-btn">Try Again</button>
          </div>
        )}

        {/* Submit button — idle: active; loading: replaced with status pill */}
        {isIdle && (
          <button
            className="btn btn-primary btn-lg upload-submit"
            onClick={handleSubmit}
            disabled={!selectedFile}
            id="analyze-btn"
            aria-label="Analyze document for fact-checking"
          >
            {selectedFile ? 'Analyze Document →' : 'Select a PDF to begin'}
          </button>
        )}
        {isLoading && (
          <div className="analysing-pill" aria-label="Fact-checking in progress">
            <span className="analysing-spinner" aria-hidden="true" />
            Fact-checking in progress…
          </div>
        )}

        {/* ── Terminal console — shown while loading ── */}
        {isLoading && (
          <div className="terminal-wrap" aria-live="polite" aria-label="Analysis progress console">
            <div className="terminal-box">
              {/* Mac-style header bar */}
              <div className="terminal-header">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
                <span className="terminal-title">factguard — analysing</span>
                <span className="terminal-live">
                  <span className="terminal-live-dot" />
                  <span>LIVE</span>
                </span>
              </div>

              {/* Log lines */}
              <div className="terminal-body">
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className="terminal-line"
                    style={{
                      opacity: i === terminalLines.length - 1 ? 1 : 0.75,
                      color: line.color || '#c9d1d9',
                      animation: 'termFadeIn 0.3s ease',
                    }}
                  >
                    <span className="terminal-ln">{String(i + 1).padStart(2, '0')}</span>
                    <span>{line.text}</span>
                  </div>
                ))}
                {/* Blinking cursor */}
                <div className="terminal-line" style={{ marginTop: '4px' }}>
                  <span className="terminal-ln">  </span>
                  <span className="terminal-cursor" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="terminal-footer">
                <div className="terminal-progress-label">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="terminal-progress-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
                  <div className="terminal-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Done state — terminal stays visible + completion message ── */}
        {isDone && (
          <div className="terminal-wrap">
            <div className="terminal-box terminal-box-done">
              {/* Mac-style header */}
              <div className="terminal-header">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
                <span className="terminal-title">factguard — complete</span>
              </div>

              {/* Log lines (read-only, full history) */}
              <div className="terminal-body terminal-body-done">
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className="terminal-line"
                    style={{ color: line.color || '#c9d1d9', opacity: 0.8 }}
                  >
                    <span className="terminal-ln">{String(i + 1).padStart(2, '0')}</span>
                    <span>{line.text}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar — full */}
              <div className="terminal-footer">
                <div className="terminal-progress-label">
                  <span>Progress</span>
                  <span style={{ color: '#00c896' }}>100%</span>
                </div>
                <div className="terminal-progress-track">
                  <div className="terminal-progress-fill" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="done-actions">
              <p className="done-msg">🎉 Fact-checking complete! Scroll down to see the full report.</p>
              <button
                className="btn btn-primary"
                onClick={handleNewUpload}
                id="analyze-another-btn"
              >
                Analyse Another PDF
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .upload-section {
          background: #f4f3ff;
          padding: 100px 24px;
        }
        .upload-inner {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
          align-items: center;
        }
        .upload-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .upload-card {
          width: 100%;
          background: var(--white);
          border: 2.5px dashed #c4bfff;
          border-radius: var(--card-radius);
          padding: 48px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: center;
        }
        .upload-card:hover:not(.file-selected) { border-color: var(--teal); background: #f0fff9; }
        .upload-card.dragging {
          border-color: var(--teal); background: #f0fff9;
          transform: scale(1.01); box-shadow: 0 0 0 4px rgba(0,200,150,0.15);
        }
        .upload-card.file-selected { cursor: default; border-color: var(--indigo); }
        .upload-illustration { margin-bottom: 4px; }
        .upload-title { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 700; color: var(--navy); }
        .upload-hint { font-size: 0.95rem; color: var(--gray-600); }
        .upload-browse { color: var(--indigo); font-weight: 600; text-decoration: underline; }
        .upload-formats { font-size: 0.8rem; color: var(--gray-400); }
        .file-info {
          display: flex; align-items: center; gap: 16px; width: 100%;
          background: var(--gray-50); border-radius: 14px; padding: 16px 20px;
        }
        .file-icon { flex-shrink: 0; }
        .file-details { flex: 1; display: flex; flex-direction: column; gap: 2px; text-align: left; }
        .file-name { font-weight: 600; font-size: 0.95rem; color: var(--navy); word-break: break-all; }
        .file-size { font-size: 0.8rem; color: var(--gray-400); }
        .file-remove {
          width: 28px; height: 28px; border-radius: 50%; border: none;
          background: var(--gray-200); color: var(--navy); cursor: pointer;
          font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background 0.2s;
        }
        .file-remove:hover { background: #ffd6d6; }
        .upload-submit {
          width: 100%; justify-content: center;
          font-family: 'Fraunces', serif; font-size: 1.1rem;
          height: 58px; border-radius: 16px;
        }
        .upload-submit:disabled {
          background: var(--gray-200); color: var(--gray-400);
          cursor: not-allowed; transform: none; box-shadow: none;
        }
        .upload-error-box {
          width: 100%; background: #ffeaea; border: 1px solid #ff4d4d;
          border-radius: 16px; padding: 24px;
          display: flex; align-items: center; gap: 16px;
        }
        .error-icon { font-size: 1.5rem; flex-shrink: 0; }
        .upload-error-box strong { display: block; color: #e53030; margin-bottom: 4px; }
        .upload-error-box p { font-size: 0.9rem; color: var(--gray-600); }

        /* ── Terminal ── */
        .terminal-wrap { width: 100%; }
        .terminal-box {
          background: #0f0f1a;
          border-radius: 16px;
          padding: 24px;
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.8;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        }
        .terminal-box-done { opacity: 0.92; }
        .terminal-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #2a2a3e;
        }
        .terminal-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .terminal-title { color: #555; margin-left: 8px; font-size: 12px; flex: 1; }
        .terminal-live {
          display: flex; align-items: center; gap: 6px;
          color: #00c896; font-size: 11px; font-weight: 600;
        }
        .terminal-live-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #00c896;
          animation: termPulse 1.2s ease-in-out infinite;
          display: inline-block;
        }
        .terminal-body {
          color: #c9d1d9;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .terminal-body-done { max-height: 240px; }
        .terminal-line {
          display: flex;
          gap: 12px;
          margin-bottom: 4px;
        }
        .terminal-ln {
          color: #3a3a55;
          user-select: none;
          min-width: 20px;
          flex-shrink: 0;
        }
        .terminal-cursor {
          display: inline-block;
          width: 8px; height: 16px;
          background: #00c896;
          animation: termBlink 1s step-end infinite;
          vertical-align: middle;
        }
        .terminal-footer {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #2a2a3e;
        }
        .terminal-progress-label {
          display: flex; justify-content: space-between;
          color: #555; font-size: 11px; margin-bottom: 8px;
        }
        .terminal-progress-track {
          height: 4px; background: #2a2a3e;
          border-radius: 4px; overflow: hidden;
        }
        .terminal-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #5b4fff, #00c896);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        .done-actions {
          display: flex; flex-direction: column; align-items: center;
          gap: 14px; padding-top: 20px;
        }
        .done-msg { font-size: 0.95rem; color: var(--gray-600); text-align: center; }

        .analysing-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(91,79,255,0.1);
          border: 1.5px solid rgba(91,79,255,0.25);
          color: var(--indigo);
          padding: 10px 22px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .analysing-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(91,79,255,0.3);
          border-top-color: var(--indigo);
          border-radius: 50%;
          animation: termSpin 0.8s linear infinite;
          flex-shrink: 0;
        }
        @keyframes termSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes termPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes termBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes termFadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 0.75; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
