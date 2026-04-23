import { scanURL } from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'
import Footer from '../components/Footer'

const exampleHistory = [
  { url: 'cdn.shortlink.ru/setup.exe', status: 'Malicious', color: '#C96B6B', bg: 'rgba(201,107,107,0.15)', border: 'rgba(201,107,107,0.3)' },
  { url: 'updates.microsoft.com/patch...', status: 'Clean', color: '#5C9A73', bg: 'rgba(92,154,115,0.15)', border: 'rgba(92,154,115,0.3)' },
  { url: 'bit.ly/3xR7pQ2', status: 'Suspicious', color: '#D49A4A', bg: 'rgba(212,154,74,0.15)', border: 'rgba(212,154,74,0.3)' },
  { url: 'free-antivirus-download.net/app', status: 'Malicious', color: '#C96B6B', bg: 'rgba(201,107,107,0.15)', border: 'rgba(201,107,107,0.3)' },
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
  const { isDark } = useTheme()

  const bg = isDark ? '#1A2520' : '#F5F5F0'
  const surface = isDark ? '#243530' : '#FFFFFF'
  const surface2 = isDark ? '#2C3E38' : '#FAFAF8'
  const border = isDark ? '#3A4A42' : '#D4D9CE'
  const borderDim = isDark ? '#323E39' : '#E0DBCE'
  const text = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const textFaint = isDark ? '#6B7B70' : '#8B9C8D'
  const inputBg = isDark ? '#2C3E38' : '#FAFAF8'
  const inputText = isDark ? '#E8EDE9' : '#2C3E35'
  const teal = isDark ? '#5FA5A5' : '#4A8B8B'
  const warning = isDark ? '#F0B76F' : '#D49A4A'
  const danger = isDark ? '#E89090' : '#C96B6B'
  const success = isDark ? '#6FBF88' : '#5C9A73'

  const handleScan = async () => {
    if (!url.trim()) return
    if (!url.startsWith('http')) {
      setPageState('error')
      return
    }
    setPageState('processing')
    try {
      const response = await scanURL(url)
      const data = response.data

      navigate('/results', {
        state: {
          filename: data.filename || 'URL Analysis',
          meta: `${data.indicators?.total_count || 0} indicator${(data.indicators?.total_count || 0) === 1 ? '' : 's'} · Submitted via URL`,
          score: Math.round((data.score || 0) * 100),
          fileType: data.file_type || 'Unknown',
          fileSize: data.file_size || 'Unknown',
          md5: data.md5 || '—',
          sha256: data.sha256 || '—',
          scanTime: `${data.analysis_time_seconds || 0}s`,
          scanned: new Date().toLocaleString(),

          indicators: data.indicators,
          rawIndicators: data.indicators,

          reasons: data.reasons || [],
          suspicious_indicators: data.reasons || [],

          severity: data.severity,
          explanation: data.explanation,
        }
      })
    } catch (err) {
      setPageState('error')
    }
  }

  const stepColor = (state) => {
    if (state === 'done') return success
    if (state === 'active') return warning
    return textFaint
  }

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '56px 120px 0' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
          <span style={{ color: textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span style={{ color: textFaint }}>/</span>
          <span style={{ color: teal }}>URL Analysis</span>
        </div>

        {/* Centered Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${teal}20`, border: `1px solid ${teal}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔗</div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: teal, letterSpacing: '0.12em', fontWeight: '600' }}>URL ANALYSIS</span>
          </div>

          <h1 style={{ fontFamily: 'Space Mono', fontSize: '42px', fontWeight: '700', color: text, lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Analyze Suspicious URLs
          </h1>

          <p style={{ fontFamily: 'DM Sans', fontSize: '16px', color: textMuted, lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
            Paste a link to a remote file or webpage. We fetch and analyze it inside a fully isolated sandbox — nothing ever touches your machine.
          </p>
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1200px', margin: '0 auto 40px' }}>

          {/* Left: input panel */}
          <div style={{ background: surface, border: `1px solid ${pageState === 'error' ? danger : border}`, borderRadius: '14px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>
                {pageState === 'processing' ? 'ANALYZING URL' : 'ENTER URL TO ANALYZE'}
              </span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                value={url}
                onChange={e => { setUrl(e.target.value); setPageState('default') }}
                placeholder="https://example.com/suspicious-file.exe"
                disabled={pageState === 'processing'}
                style={{
                  flex: 1, background: inputBg,
                  border: `1px solid ${pageState === 'error' ? danger : border}`,
                  borderRadius: '8px', padding: '14px 18px',
                  fontFamily: 'DM Sans', fontSize: '13px',
                  color: pageState === 'error' ? danger : inputText,
                  outline: 'none',
                }}
              />
              <button
                onClick={pageState === 'error' ? () => { setPageState('default'); setUrl('') } : handleScan}
                style={{
                  fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '600',
                  padding: '14px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  letterSpacing: '0.03em',
                  background: pageState === 'error' ? `${danger}20` : pageState === 'processing' ? border : teal,
                  color: pageState === 'error' ? danger : pageState === 'processing' ? textFaint : '#FFFFFF',
                }}
              >
                {pageState === 'error' ? 'TRY AGAIN' : pageState === 'processing' ? 'SCANNING...' : 'SCAN URL'}
              </button>
            </div>

            {pageState === 'processing' && (
              <div>
                <div style={{ height: '3px', background: border, borderRadius: '2px', marginBottom: '16px', overflow: 'hidden' }}>
                  <div style={{ height: '3px', background: warning, borderRadius: '2px', width: '60%' }} />
                </div>
                {processingSteps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < processingSteps.length - 1 ? `1px solid ${borderDim}` : 'none' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: stepColor(step.state), flexShrink: 0 }} />
                    <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: stepColor(step.state) }}>{step.label}</span>
                  </div>
                ))}
              </div>
            )}

            {pageState === 'error' && (
              <div>
                <div style={{ background: `${danger}12`, border: `1px solid ${danger}30`, borderRadius: '8px', padding: '16px 18px', marginBottom: '14px' }}>
                  <div style={{ fontFamily: 'Space Mono', fontSize: '12px', color: danger, fontWeight: '700', marginBottom: '6px' }}>Scan failed — URL unreachable</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>We couldn't fetch this URL in our sandbox. The server may be down, the URL is malformed, or access is restricted.</div>
                </div>
                {[
                  ['Check the URL format.', ' Make sure it starts with http:// or https://'],
                  ['Try File Upload instead.', ' If you have the file locally, upload it directly.'],
                  ['The site may be down.', ' Try again in a few minutes.'],
                ].map(([bold, rest], i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontFamily: 'DM Sans', fontSize: '12px', color: textMuted, marginBottom: '7px' }}>
                    <span style={{ color: danger }}>→</span>
                    <span><span style={{ color: text, fontWeight: '500' }}>{bold}</span>{rest}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: example history */}
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>EXAMPLE SCAN HISTORY</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {exampleHistory.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: surface2, borderRadius: '8px', padding: '14px 18px' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted }}>{item.url}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: '700', color: item.color, background: item.bg, border: `1px solid ${item.border}`, borderRadius: '100px', padding: '4px 14px' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}