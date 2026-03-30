import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const exampleHistory = [
  { url: 'cdn.shortlink.ru/setup.exe', status: 'Malicious', color: '#E05555', bg: 'rgba(224,85,85,0.1)', border: 'rgba(224,85,85,0.28)' },
  { url: 'updates.microsoft.com/pat...', status: 'Clean', color: '#77997B', bg: 'rgba(119,153,123,0.12)', border: 'rgba(119,153,123,0.3)' },
  { url: 'bit.ly/3xR7pQ2', status: 'Suspicious', color: '#D0BC77', bg: 'rgba(208,188,119,0.1)', border: 'rgba(208,188,119,0.28)' },
  { url: 'free-antivirus-download.net..', status: 'Malicious', color: '#E05555', bg: 'rgba(224,85,85,0.1)', border: 'rgba(224,85,85,0.28)' },
]

const processingSteps = [
  { label: 'Fetching URL in sandbox', state: 'done' },
  { label: 'Domain reputation check', state: 'done' },
  { label: 'Running multi-engine scan...', state: 'active' },
  { label: 'Generating report', state: 'pending' },
]

export default function URLAnalyzer() {
  const [pageState, setPageState] = useState('default')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleScan = () => {
    if (!url.trim()) return
    if (!url.startsWith('http')) {
      setPageState('error')
      return
    }
    setPageState('processing')
  }

  const stepColor = (state) => {
    if (state === 'done') return '#77997B'
    if (state === 'active') return '#D0BC77'
    return '#4A4535'
  }

  return (
    <div style={{ padding: '56px 120px 80px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
        <span style={{ color: '#7A7260', cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color: '#4A4535' }}>/</span>
        <span style={{ color: '#D0BC77' }}>URL Analysis</span>
      </div>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(117,150,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🔗</div>
        <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#759678', letterSpacing: '0.14em' }}>URL ANALYSIS</span>
      </div>
      <h1 style={{ fontFamily: 'Space Mono', fontSize: '36px', fontWeight: '700', color: '#EDEDCD', lineHeight: '1.1', marginBottom: '12px' }}>
        Analyze any <span style={{ color: '#D0BC77' }}>suspicious</span><br />
        <span style={{ color: '#759678' }}>URL</span>
      </h1>
      <p style={{ fontSize: '15px', color: '#7A7260', fontWeight: '300', maxWidth: '520px', lineHeight: '1.6', marginBottom: '40px' }}>
        Paste a link to a remote file or webpage. We fetch and analyze it inside a fully isolated sandbox — nothing ever touches your machine.
      </p>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Left: input panel */}
        <div style={{ background: '#111009', border: `1px solid ${pageState === 'error' ? 'rgba(224,85,85,0.3)' : '#252015'}`, borderRadius: '14px', padding: '28px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535', letterSpacing: '0.14em' }}>
              {pageState === 'processing' ? 'ANALYZING URL' : 'ENTER URL TO ANALYZE'}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#252015' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setPageState('default') }}
              placeholder="https://example.com/suspicious-file.exe"
              disabled={pageState === 'processing'}
              style={{
                flex: 1, background: '#181510',
                border: `1px solid ${pageState === 'error' ? 'rgba(224,85,85,0.5)' : '#252015'}`,
                borderRadius: '8px', padding: '12px 16px',
                fontFamily: 'Space Mono', fontSize: '12px',
                color: pageState === 'error' ? '#E05555' : '#EEE8D5',
                outline: 'none',
              }}
            />
            <button
              onClick={pageState === 'error' ? () => { setPageState('default'); setUrl('') } : handleScan}
              style={{
                fontFamily: 'Space Mono', fontSize: '11px', fontWeight: '700',
                padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                letterSpacing: '0.06em',
                background: pageState === 'error' ? 'rgba(224,85,85,0.12)' : pageState === 'processing' ? '#252015' : '#D0BC77',
                color: pageState === 'error' ? '#E05555' : pageState === 'processing' ? '#4A4535' : '#0A0906',
              }}
            >
              {pageState === 'error' ? 'TRY AGAIN' : pageState === 'processing' ? 'SCANNING...' : 'SCAN URL'}
            </button>
          </div>

          {/* Processing steps */}
          {pageState === 'processing' && (
            <div>
              <div style={{ height: '3px', background: '#252015', borderRadius: '2px', marginBottom: '14px', overflow: 'hidden' }}>
                <div style={{ height: '3px', background: '#D0BC77', borderRadius: '2px', width: '60%' }} />
              </div>
              {processingSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < processingSteps.length - 1 ? '1px solid #1C1C1C' : 'none' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: stepColor(step.state), flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: stepColor(step.state) }}>{step.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {pageState === 'error' && (
            <div>
              <div style={{ background: 'rgba(224,85,85,0.06)', border: '1px solid rgba(224,85,85,0.2)', borderRadius: '8px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#E05555', fontWeight: '700', marginBottom: '5px' }}>Scan failed — URL unreachable</div>
                <div style={{ fontSize: '12px', color: '#7A7260', fontWeight: '300', lineHeight: '1.55' }}>We couldn't fetch this URL in our sandbox. The server may be down, the URL is malformed, or access is restricted.</div>
              </div>
              {[
                ['Check the URL format.', ' Make sure it starts with http:// or https://'],
                ['Try File Upload instead.', ' If you have the file locally, upload it directly.'],
                ['The site may be down.', ' Try again in a few minutes.'],
              ].map(([bold, rest], i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#7A7260', marginBottom: '6px', fontWeight: '300' }}>
                  <span style={{ color: '#E05555' }}>→</span>
                  <span><span style={{ color: '#EDEDCD', fontWeight: '500' }}>{bold}</span>{rest}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: example history */}
        <div style={{ background: '#111009', border: '1px solid #252015', borderRadius: '14px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535', letterSpacing: '0.14em' }}>EXAMPLE SCAN HISTORY</span>
            <div style={{ flex: 1, height: '1px', background: '#252015' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exampleHistory.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#181510', borderRadius: '8px', padding: '12px 16px' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#7A7260' }}>{item.url}</span>
                <span style={{ fontFamily: 'Space Mono', fontSize: '10px', fontWeight: '700', color: item.color, background: item.bg, border: `1px solid ${item.border}`, borderRadius: '100px', padding: '3px 14px' }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '60px', borderTop: '1px solid #252015', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535' }}>
        <span><span style={{ color: '#D0BC77' }}>Opulence</span> · Senior Design Project · Spring 2026</span>
        <span style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #252015', borderRadius: '6px', padding: '3px 10px', color: '#7A7260' }}>NSA GenCyber Partnership</span>
      </div>
    </div>
  )
}