import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'
import Footer from '../components/Footer'

const getScoreColor = (s, isDark) => {
  if (s >= 70) return isDark ? '#E89090' : '#C96B6B'
  if (s >= 31) return isDark ? '#F0B76F' : '#D49A4A'
  return isDark ? '#6FBF88' : '#5C9A73'
}

const getLabel = s => s >= 70 ? 'MALICIOUS' : s >= 31 ? 'WARNING' : 'CLEAN'

const getBadge = (s, isDark) => {
  if (s >= 70)
    return { 
      color: isDark ? '#E89090' : '#C96B6B', 
      bg: isDark ? 'rgba(232,144,144,0.2)' : 'rgba(201,107,107,0.15)', 
      border: isDark ? 'rgba(232,144,144,0.4)' : 'rgba(201,107,107,0.3)' 
    }
  if (s >= 31)
    return { 
      color: isDark ? '#F0B76F' : '#D49A4A', 
      bg: isDark ? 'rgba(240,183,111,0.2)' : 'rgba(212,154,74,0.15)', 
      border: isDark ? 'rgba(240,183,111,0.4)' : 'rgba(212,154,74,0.3)' 
    }
  return { 
    color: isDark ? '#6FBF88' : '#5C9A73', 
    bg: isDark ? 'rgba(111,191,136,0.2)' : 'rgba(92,154,115,0.15)', 
    border: isDark ? 'rgba(111,191,136,0.4)' : 'rgba(92,154,115,0.3)' 
  }
}

const sevColor = (sev, isDark) => {
  if (sev === 'H') return isDark ? '#E89090' : '#C96B6B'
  if (sev === 'M') return isDark ? '#F0B76F' : '#D49A4A'
  return isDark ? '#6FBF88' : '#5C9A73'
}

const sevBg = (sev, isDark) => {
  if (sev === 'H') return isDark ? 'rgba(232,144,144,0.2)' : 'rgba(201,107,107,0.15)'
  if (sev === 'M') return isDark ? 'rgba(240,183,111,0.2)' : 'rgba(212,154,74,0.15)'
  return isDark ? 'rgba(111,191,136,0.2)' : 'rgba(92,154,115,0.15)'
}

const demoResult = {
  filename: 'invoice_march_2025.pdf.exe',
  meta: '2.4 MB · PE32 executable · Submitted via Email',
  score: 87,
  fileType: 'PE32 Executable',
  fileSize: '2.4 MB (2,512,384 bytes)',
  md5: 'a3f8c2d1e4b7...',
  sha256: 'e3b0c44298fc1...',
  scanTime: '6.4 seconds',
  scanned: 'Today, 11:34 PM',
  indicators: [
    { sev: 'H', title: 'Suspicious registry modification', desc: 'Attempts to modify HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run for persistence.' },
    { sev: 'H', title: 'Network beacon detected', desc: 'Initiates outbound HTTP connection to 185.234.xx.xx:4444 — known C2 server.' },
    { sev: 'H', title: 'Double extension masking', desc: 'File uses .pdf.exe naming to disguise executable as a document.' },
    { sev: 'M', title: 'Anti-sandbox behavior', desc: 'Detects virtualized environment and delays execution by 120 seconds.' },
    { sev: 'L', title: 'Entropy anomaly in PE sections', desc: 'High entropy in .text section — consistent with packed or encrypted payload.' },
  ]
}

export default function Results() {
  const { state: apiResult } = useLocation()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const result = apiResult || demoResult
  const score = result.score || result.malicious_score * 100 || 0
  const scoreColor = getScoreColor(score, isDark)
  const badge = getBadge(score, isDark)
  const circumference = 2 * Math.PI * 58
  const offset = circumference - (score / 100) * circumference

  const bg = isDark ? '#1A2520' : '#F5F5F0'
  const surface = isDark ? '#243530' : '#FFFFFF'
  const border = isDark ? '#3A4A42' : '#D4D9CE'
  const text = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const textFaint = isDark ? '#6B7B70' : '#8B9C8D'
  const ringTrack = isDark ? '#3A4A42' : '#D4D9CE'
  const accent = isDark ? '#E0C58F' : '#B8935F'

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '56px 120px 0' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
          <span style={{ color: textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span style={{ color: textFaint }}>/</span>
          <span style={{ color: accent }}>Results</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '28px', maxWidth: '1400px', margin: '0 auto 40px' }}>

          {/* Left: threat summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>THREAT SUMMARY</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '28px' }}>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${border}` }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: '14px', color: text, fontWeight: '700', marginBottom: '6px', wordBreak: 'break-all' }}>{result.filename}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: textMuted }}>{result.meta}</div>
              </div>

              {/* Score ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 24px' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '16px' }}>
                  <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="75" cy="75" r="58" fill="none" stroke={ringTrack} strokeWidth="11" />
                    <circle cx="75" cy="75" r="58" fill="none" stroke={scoreColor} strokeWidth="11"
                      strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'Space Mono', fontSize: '40px', fontWeight: '700', color: scoreColor, lineHeight: 1 }}>{Math.round(score)}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '10px', color: textMuted, marginTop: '6px', letterSpacing: '0.05em' }}>THREAT SCORE</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '700', color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: '100px', padding: '6px 20px', letterSpacing: '0.06em' }}>
                  {getLabel(score)}
                </span>
              </div>

              {/* Metadata */}
              {[
                ['FILE TYPE', result.fileType || result.file_type || 'Unknown'],
                ['FILE SIZE', result.fileSize || result.file_size || 'Unknown'],
                ['MD5', result.md5 || '—'],
                ['SHA256', result.sha256 || '—'],
                ['SCAN TIME', result.scanTime || result.scan_time || '—'],
                ['SCANNED', result.scanned || '—'],
              ].map(([k, v], i, arr) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: textFaint, letterSpacing: '0.04em', fontWeight: '600' }}>{k}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: text, textAlign: 'right', wordBreak: 'break-all', maxWidth: '200px' }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: '24px' }}>
                <span onClick={() => navigate('/')} style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '600', color: accent, cursor: 'pointer' }}>
                  Run new scan →
                </span>
              </div>
            </div>
          </div>

          {/* Right: indicators */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>SUSPICIOUS INDICATORS</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '28px' }}>
              {Object.entries(result.indicators || {}).filter(([key]) => key !== 'total_count').flatMap(([type, values]) =>
                (Array.isArray(values) ? values : []).map(value => ({ type, value }))
              ).map((ind, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: sevBg(ind.sev || ind.severity, isDark), border: `1px solid ${sevColor(ind.sev || ind.severity, isDark)}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: '10px', fontWeight: '700', color: sevColor(ind.sev || ind.severity, isDark), flexShrink: 0, marginTop: '2px' }}>
                    {ind.sev || ind.severity || 'M'}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Mono', fontSize: '13px', color: text, fontWeight: '700', marginBottom: '4px' }}>{ind.title || ind.indicator || ind.type}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>{ind.desc || ind.description || ind.value}</div>
                  </div>
                </div>
              ))}
              {(!result.indicators || Object.keys(result.indicators).length === 0 || Object.entries(result.indicators).filter(([key]) => key !== 'total_count').flatMap(([type, values]) => (Array.isArray(values) ? values : [])).length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'DM Sans', fontSize: '13px', color: textMuted }}>No suspicious indicators found</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}