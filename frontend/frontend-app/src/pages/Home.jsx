import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Footer from '../components/Footer'

// Email Analysis removed — .eml files handled under File Upload
const analysisTypes = [
  {
    icon: '🔗',
    title: 'URL Analysis',
    desc: 'Submit any URL for behavioral analysis and threat intelligence lookup in an isolated sandbox.',
    cta: 'Analyze URL',
    path: '/url',
    accent: '#4A8B8B',
    accentLight: 'rgba(74,139,139,0.12)',
  },
  {
    icon: '📁',
    title: 'File Upload',
    desc: 'Upload files or .eml email files for static analysis, sandbox detonation, and multi-engine scanning.',
    cta: 'Upload File',
    path: '/upload',
    accent: '#5C8A5C',
    accentLight: 'rgba(92,138,92,0.12)',
  },
]

const howItWorksSteps = [
  { num: '01', title: 'Submit', desc: 'Upload a file or .eml email, or paste a URL to our scanner.' },
  { num: '02', title: 'Analyze', desc: 'Multi-engine scanning, static analysis, and behavioral detection.' },
  { num: '03', title: 'Report', desc: 'Receive a full threat report with indicators of compromise.' },
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
  if (status === 'WARNING')   return { color: isDark ? '#F0B76F' : '#D49A4A', background: isDark ? 'rgba(240,183,111,0.2)' : 'rgba(212,154,74,0.12)',  border: '1px solid rgba(212,154,74,0.35)'  }
  return                             { color: isDark ? '#6FBF88' : '#5C9A73', background: isDark ? 'rgba(111,191,136,0.2)' : 'rgba(92,154,115,0.12)',  border: '1px solid rgba(92,154,115,0.35)'  }
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Home() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [recentScans, setRecentScans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/results/recent')
        setRecentScans(res.data.scans || [])
      } catch (err) {
        setRecentScans([])
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [])

  const bg        = isDark ? '#161E1A' : '#F7F5F0'
  const surface   = isDark ? '#1E2A24' : '#FFFFFF'
  const surface2  = isDark ? '#243028' : '#F4F2EC'
  const border    = isDark ? '#2E3D38' : '#DDE3DC'
  const borderDim = isDark ? '#263028' : '#EAE8E0'
  const text      = isDark ? '#F0EDE4' : '#1C2B26'
  const textBody  = isDark ? '#C8D4CC' : '#2E3D35'
  const textMuted = isDark ? '#8A9E94' : '#5A6B60'
  const textFaint = isDark ? '#5A6E64' : '#8B9E94'
  const gold      = isDark ? '#C9A84C' : '#8B6914'
  const goldLight = isDark ? '#E0C87A' : '#B89840'
  const sage      = isDark ? '#6FBF88' : '#4A7A5C'
  const rowHover  = isDark ? '#243028' : '#F4F2EC'

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

        // Build reason strings that match what explainReason understands
        const reasonMap = {
          'urls': '1 URL(s) found',
          'emails': '1 email address found',
          'ip_addresses': '1 IP address found',
          'crypto_addresses': '1 cryptocurrency address found',
          'suspicious_domains': '1 suspicious domain(s) (.tk, .ml, etc.)',
          'phishing_keywords': '1 phishing keyword found',
          'shortened_urls': '1 shortened URL found',
          'dangerous_extensions': '1 dangerous file extension URL(s) found',
          'non_standard_ports': '1 URL(s) with non-standard ports found',
          'ip_based_urls': '1 IP-based URL found',
        }

        const mappedReasons = indicatorList
          .map(ind => reasonMap[ind.indicator_type] || null)
          .filter(Boolean)

        // Deduplicate reasons
        const uniqueReasons = [...new Set(mappedReasons)]
        const finalReasons = reasons.length > 0 ? reasons : uniqueReasons

        navigate('/results', {
          state: {
            filename: fullScan.filename || scan.filename,
            meta: `${formatBytes(fullScan.file_size_bytes || scan.file_size_bytes)} · ${fullScan.file_type || scan.file_type || 'Unknown'} · ${scan.source_method || 'Upload'}`,
            score: Math.round((fullScan.malicious_score || 0) * 100),
            file_type: fullScan.file_type || scan.file_type,
            file_size: formatBytes(fullScan.file_size_bytes || scan.file_size_bytes),
            md5: fullScan.md5 || '—',
            sha256: fullScan.sha256 || '—',
            scan_time: fullScan.analysis_duration_seconds ? `${fullScan.analysis_duration_seconds.toFixed(2)}s` : '—',
            scanned: scan.upload_timestamp && scan.upload_timestamp !== 'mock_timestamp'
              ? new Date(scan.upload_timestamp).toLocaleString() : '—',
            indicators,
            reasons: finalReasons,
            suspicious_indicators: finalReasons, // For backward compatibility with explainReason function
          },
        })
        return
      } catch (err) {
        console.error('Failed to fetch full scan:', err)
      }
    }

    // Fallback
    navigate('/results', {
      state: {
        filename: scan.filename,
        meta: `${formatBytes(scan.file_size_bytes)} · ${scan.file_type || 'Unknown'} · ${scan.source_method || 'Upload'}`,
        score,
        file_type: scan.file_type,
        file_size: formatBytes(scan.file_size_bytes),
        scan_time: scan.analysis_duration_seconds ? `${scan.analysis_duration_seconds.toFixed(2)}s` : '—',
        scanned: scan.upload_timestamp && scan.upload_timestamp !== 'mock_timestamp'
          ? new Date(scan.upload_timestamp).toLocaleString() : '—',
        indicators: {},
        reasons: [],
        suspicious_indicators: [],
      },
    })
  }

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '64px 80px 0', maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── HERO ── */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 72px' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: isDark ? 'rgba(111,191,136,0.12)' : 'rgba(74,122,92,0.1)', border: `1px solid ${sage}50`, borderRadius: '100px', padding: '6px 18px', marginBottom: '28px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: sage, boxShadow: `0 0 8px ${sage}` }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: '600', color: sage, letterSpacing: '0.04em' }}>SYSTEM OPERATIONAL</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src="/NexusLogo.png" alt="NEXUS" style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontFamily: 'Space Mono', fontSize: '52px', fontWeight: '700', color: text, lineHeight: '1.0', marginBottom: '12px', letterSpacing: '0.04em' }}>
            NEXUS
          </h1>

          <p style={{ fontFamily: 'DM Sans', fontSize: '18px', fontWeight: '600', color: gold, marginBottom: '16px', letterSpacing: '0.02em' }}>
            Advanced Static Analysis & Threat Intelligence
          </p>

          <p style={{ fontFamily: 'DM Sans', fontSize: '16px', color: textBody, lineHeight: '1.75', maxWidth: '580px', margin: '0 auto 36px' }}>
            Enterprise-grade malware detection powered by multi-engine scanning, static analysis, and behavioral threat intelligence.
          </p>

          <button
            onClick={() => navigate('/upload')}
            aria-label="Start file analysis"
            style={{
              fontFamily: 'DM Sans', fontSize: '16px', fontWeight: '700',
              color: '#FFFFFF',
              background: `linear-gradient(135deg, ${sage} 0%, #3A6B4A 100%)`,
              border: 'none', borderRadius: '10px',
              padding: '14px 36px', cursor: 'pointer',
              boxShadow: `0 4px 16px ${sage}40`,
              transition: 'all 0.2s', letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${sage}50` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${sage}40` }}
          >
            Start Analysis →
          </button>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: 'Space Mono', fontSize: '12px', fontWeight: '700', color: textFaint, letterSpacing: '0.14em', textAlign: 'center', marginBottom: '40px' }}>
            HOW IT WORKS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
            {howItWorksSteps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                {i < howItWorksSteps.length - 1 && (
                  <div style={{ position: 'absolute', top: '28px', left: '50%', width: 'calc(100% + 32px)', height: '1px', background: border, zIndex: 0 }} />
                )}
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: surface, border: `2px solid ${gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: '16px', fontWeight: '700', color: gold, margin: '0 auto 18px', position: 'relative', zIndex: 1 }}>
                  {step.num}
                </div>
                <div style={{ fontFamily: 'Space Mono', fontSize: '16px', fontWeight: '700', color: text, marginBottom: '10px' }}>{step.title}</div>
                <p style={{ fontFamily: 'DM Sans', fontSize: '15px', color: textBody, lineHeight: '1.65' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── ANALYSIS TYPE CARDS ── */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: 'Space Mono', fontSize: '12px', fontWeight: '700', color: textFaint, letterSpacing: '0.14em', textAlign: 'center', marginBottom: '32px' }}>
            CHOOSE ANALYSIS TYPE
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {analysisTypes.map((type, i) => (
              <div
                key={i}
                onClick={() => navigate(type.path)}
                role="button"
                tabIndex={0}
                aria-label={`Start ${type.title}`}
                style={{
                  background: surface, border: `2px solid ${border}`,
                  borderRadius: '16px', padding: '36px',
                  cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = type.accent
                  e.currentTarget.style.boxShadow = `0 16px 40px ${type.accent}25`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = border
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(type.path) }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: type.accentLight, border: `1px solid ${type.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' }}>
                  {type.icon}
                </div>
                <h3 style={{ fontFamily: 'Space Mono', fontSize: '18px', fontWeight: '700', color: text, marginBottom: '12px' }}>{type.title}</h3>
                <p style={{ fontFamily: 'DM Sans', fontSize: '15px', color: textBody, lineHeight: '1.65', marginBottom: '24px', flex: 1 }}>{type.desc}</p>
                <div style={{ fontFamily: 'DM Sans', fontSize: '15px', fontWeight: '600', color: type.accent }}>{type.cta} →</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RECENT SCANS ── */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Space Mono', fontSize: '12px', fontWeight: '700', color: textFaint, letterSpacing: '0.14em', marginBottom: '20px' }}>
            RECENT SCANS
          </h2>

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 1.5fr 110px 80px', gap: '16px', padding: '14px 24px', background: surface2, borderBottom: `1px solid ${border}` }}>
              {['FILE NAME', 'TYPE', 'SCORE', 'SEVERITY', 'STATUS', 'SIZE'].map((h, i) => (
                <span key={h} style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '700', color: textFaint, letterSpacing: '0.08em', textAlign: i >= 2 ? 'center' : 'left' }}>{h}</span>
              ))}
            </div>

            {loading && (
              <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'DM Sans', fontSize: '15px', color: textMuted }}>
                Loading recent scans...
              </div>
            )}

            {!loading && recentScans.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'DM Sans', fontSize: '15px', color: textMuted }}>
                No recent scans found
              </div>
            )}

            {!loading && recentScans.map((scan, i) => {
              const score = Math.round((scan.malicious_score || 0) * 100)
              const status = getStatus(score)
              return (
                <div
                  key={scan.scan_id || i}
                  onClick={() => handleRowClick(scan)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View results for ${scan.filename}`}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 80px 100px 1.5fr 110px 80px',
                    gap: '16px', padding: '16px 24px',
                    borderBottom: i < recentScans.length - 1 ? `1px solid ${borderDim}` : 'none',
                    cursor: 'pointer', transition: 'background 0.15s', alignItems: 'center', outline: 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onKeyDown={e => { if (e.key === 'Enter') handleRowClick(scan) }}
                >
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: '500', color: goldLight }}>{scan.filename}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textFaint, marginTop: '2px' }}>{scan.source_method || 'upload'}</div>
                  </div>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, textAlign: 'center' }}>{scan.file_type || '—'}</span>
                  <span style={{ fontFamily: 'Space Mono', fontSize: '16px', fontWeight: '700', color: getScoreColor(score, isDark), textAlign: 'center' }}>{score}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textBody, textAlign: 'center' }}>{scan.severity || '—'}</span>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.05em', ...getBadgeStyle(status, isDark) }}>
                      {status}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textFaint, textAlign: 'right' }}>{formatBytes(scan.file_size_bytes)}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}