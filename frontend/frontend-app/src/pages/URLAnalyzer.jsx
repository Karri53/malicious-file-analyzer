import { scanURL } from '../services/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'
import axios from 'axios'
import Footer from '../components/Footer'

const processingSteps = [
  { label: 'Fetching URL in sandbox', state: 'done' },
  { label: 'Domain reputation check', state: 'done' },
  { label: 'Running multi-engine scan...', state: 'active' },
  { label: 'Generating report', state: 'pending' },
]

function getScoreColor(score, isDark) {
  if (score >= 70) return isDark ? '#E89090' : '#C96B6B'
  if (score >= 31) return isDark ? '#F0B76F' : '#D49A4A'
  return isDark ? '#6FBF88' : '#5C9A73'
}

function getStatus(score) {
  if (score >= 70) return 'MALICIOUS'
  if (score >= 31) return 'WARNING'
  return 'CLEAN'
}

function getBadgeStyle(status, isDark) {
  if (status === 'MALICIOUS') return { color: isDark ? '#E89090' : '#C96B6B', background: isDark ? 'rgba(232,144,144,0.2)' : 'rgba(201,107,107,0.12)', border: '1px solid rgba(201,107,107,0.35)' }
  if (status === 'WARNING') return { color: isDark ? '#F0B76F' : '#D49A4A', background: isDark ? 'rgba(240,183,111,0.2)' : 'rgba(212,154,74,0.12)', border: '1px solid rgba(212,154,74,0.35)' }
  return { color: isDark ? '#6FBF88' : '#5C9A73', background: isDark ? 'rgba(111,191,136,0.2)' : 'rgba(92,154,115,0.12)', border: '1px solid rgba(92,154,115,0.35)' }
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function URLAnalyzer() {
  const [pageState, setPageState] = useState('default')
  const [url, setUrl] = useState('')
  const [recentScans, setRecentScans] = useState([])
  const [loadingScans, setLoadingScans] = useState(true)
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
  const primary = isDark ? '#6FBF88' : '#5C9A73'
  const warning = isDark ? '#F0B76F' : '#D49A4A'
  const danger = isDark ? '#E89090' : '#C96B6B'
  const success = isDark ? '#6FBF88' : '#5C9A73'
  const rowHover = isDark ? '#2C3E38' : '#F0EDE6'

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/results/recent?limit=20')
        const urlScans = (res.data.scans || []).filter(s => s.source_method === 'url')
        setRecentScans(urlScans)
      } catch (err) {
        setRecentScans([])
      } finally {
        setLoadingScans(false)
      }
    }
    fetchRecent()
  }, [])

  const handleScan = async () => {
    if (!url.trim()) return
    let submittedUrl = url.trim()

    if (!submittedUrl.startsWith('http://') && !submittedUrl.startsWith('https://')) {
      submittedUrl = `https://${submittedUrl}`
    }
    setPageState('processing')
    try {
      const response = await scanURL(submittedUrl)
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

  const handleRowClick = async (scan) => {
    const score = Math.round((scan.malicious_score || 0) * 100)
    if (scan.scan_id) {
      try {
        const res = await axios.get(`http://localhost:5000/api/results/${scan.scan_id}`)
        const data = res.data
        const fullScan = data.scan || {}
        const indicatorList = data.indicators || []
        const reasons = data.reasons || []
        const indicators = {}
        indicatorList.forEach(ind => {
          const type = ind.indicator_type
          if (!indicators[type]) indicators[type] = []
          const val = ind.indicator_value
          indicators[type].push(typeof val === 'object' ? val.value || JSON.stringify(val) : val)
        })
        navigate('/results', {
          state: {
            filename: fullScan.filename || scan.filename,
            meta: `${formatBytes(fullScan.file_size_bytes || scan.file_size_bytes)} · ${fullScan.file_type || scan.file_type || 'Unknown'} · URL`,
            score: Math.round((fullScan.malicious_score || 0) * 100),
            file_type: fullScan.file_type || scan.file_type,
            file_size: formatBytes(fullScan.file_size_bytes || scan.file_size_bytes),
            md5: fullScan.md5 || '—',
            sha256: fullScan.sha256 || '—',
            scan_time: fullScan.analysis_duration_seconds ? `${fullScan.analysis_duration_seconds.toFixed(2)}s` : '—',
            scanned: scan.upload_timestamp && scan.upload_timestamp !== 'mock_timestamp'
              ? new Date(scan.upload_timestamp).toLocaleString() : '—',
            indicators,
            reasons,
            suspicious_indicators: reasons,
          },
        })
        return
      } catch (err) {
        console.error('Failed to fetch full scan:', err)
      }
    }
    navigate('/results', {
      state: {
        filename: scan.filename,
        meta: `${formatBytes(scan.file_size_bytes)} · URL`,
        score,
        file_type: scan.file_type,
        file_size: formatBytes(scan.file_size_bytes),
        indicators: {},
        reasons: [],
        suspicious_indicators: [],
      },
    })
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
          <span style={{ color: primary }}>URL Analysis</span>
        </div>

        {/* Centered Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${primary}20`, border: `1px solid ${primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔗</div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: primary, letterSpacing: '0.12em', fontWeight: '600' }}>URL ANALYSIS</span>
          </div>
          <h1 style={{ fontFamily: 'Space Mono', fontSize: '42px', fontWeight: '700', color: text, lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Analyze Suspicious URLs
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '16px', color: textMuted, lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
            Paste a link to a remote file or webpage. We securely fetch and analyze reachable content on the server side — nothing is downloaded to your device.
          </p>
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1200px', margin: '0 auto 48px' }}>

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
                  background: pageState === 'error' ? `${danger}20` : pageState === 'processing' ? border : primary,
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
                  ['Check the URL.', ' Make sure the site is reachable.'],
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

          {/* Right: example history — replaced with live recent URL scans */}
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>RECENT URL SCANS</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>

            {loadingScans && (
              <div style={{ textAlign: 'center', padding: '24px', fontFamily: 'DM Sans', fontSize: '13px', color: textFaint }}>
                Loading...
              </div>
            )}

            {!loadingScans && recentScans.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', fontFamily: 'DM Sans', fontSize: '13px', color: textFaint }}>
                No recent URL scans found
              </div>
            )}

            {!loadingScans && recentScans.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentScans.map((scan, i) => {
                  const score = Math.round((scan.malicious_score || 0) * 100)
                  const status = getStatus(score)
                  return (
                    <div
                      key={scan.scan_id || i}
                      onClick={() => handleRowClick(scan)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: surface2, borderRadius: '8px', padding: '12px 16px',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = rowHover}
                      onMouseLeave={e => e.currentTarget.style.background = surface2}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '500', color: text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {scan.filename}
                        </div>
                        <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: getScoreColor(score, isDark), marginTop: '2px' }}>
                          Score: {score}
                        </div>
                      </div>
                      <span style={{
                        fontFamily: 'DM Sans', fontSize: '10px', fontWeight: '700',
                        padding: '3px 12px', borderRadius: '100px', marginLeft: '12px', flexShrink: 0,
                        ...getBadgeStyle(status, isDark)
                      }}>
                        {status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}