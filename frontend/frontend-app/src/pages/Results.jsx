import { useLocation, useNavigate } from 'react-router-dom'

const getScoreColor = s => s >= 70 ? '#E05555' : s >= 31 ? '#D0BC77' : '#77997B'
const getLabel = s => s >= 70 ? 'MALICIOUS' : s >= 31 ? 'WARNING' : 'CLEAN'
const getBadge = s => s >= 70
  ? { color: '#E05555', bg: 'rgba(224,85,85,0.1)', border: 'rgba(224,85,85,0.3)' }
  : s >= 31
  ? { color: '#D0BC77', bg: 'rgba(208,188,119,0.1)', border: 'rgba(208,188,119,0.3)' }
  : { color: '#77997B', bg: 'rgba(119,153,123,0.12)', border: 'rgba(119,153,123,0.3)' }

const sevColor = sev => sev === 'H' ? '#E05555' : sev === 'M' ? '#D0BC77' : '#77997B'
const sevBg = sev => sev === 'H' ? 'rgba(224,85,85,0.15)' : sev === 'M' ? 'rgba(208,188,119,0.12)' : 'rgba(119,153,123,0.12)'

// Demo data — will be replaced by real API data
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
  const result = apiResult || demoResult
  const score = result.score || result.malicious_score * 100 || 0
  const scoreColor = getScoreColor(score)
  const badge = getBadge(score)
  const circumference = 2 * Math.PI * 58
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ padding: '56px 120px 80px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
        <span style={{ color: '#7A7260', cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color: '#4A4535' }}>/</span>
        <span style={{ color: '#D0BC77' }}>Results</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>

        {/* Left: threat summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535', letterSpacing: '0.14em' }}>THREAT SUMMARY</span>
            <div style={{ flex: 1, height: '1px', background: '#252015' }} />
          </div>
          <div style={{ background: '#111009', border: '1px solid #252015', borderRadius: '14px', padding: '26px' }}>
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #252015' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: '13px', color: '#EDEDCD', fontWeight: '700', marginBottom: '4px', wordBreak: 'break-all' }}>{result.filename}</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#7A7260' }}>{result.meta}</div>
            </div>

            {/* Score ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 20px' }}>
              <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '14px' }}>
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="58" fill="none" stroke="#252015" strokeWidth="10" />
                  <circle cx="70" cy="70" r="58" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'Space Mono', fontSize: '36px', fontWeight: '700', color: scoreColor, lineHeight: 1 }}>{Math.round(score)}</div>
                  <div style={{ fontFamily: 'Space Mono', fontSize: '9px', color: '#7A7260', marginTop: '4px' }}>THREAT SCORE</div>
                </div>
              </div>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', fontWeight: '700', color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: '100px', padding: '5px 18px', letterSpacing: '0.08em' }}>
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
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid #252015' : 'none' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535', letterSpacing: '0.06em' }}>{k}</span>
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#EDEDCD', textAlign: 'right', wordBreak: 'break-all', maxWidth: '180px' }}>{v}</span>
              </div>
            ))}

            <div style={{ marginTop: '20px' }}>
              <span onClick={() => navigate('/')} style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#7A7260', cursor: 'pointer' }}>
                Run new scan →
              </span>
            </div>
          </div>
        </div>

        {/* Right: indicators */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535', letterSpacing: '0.14em' }}>SUSPICIOUS INDICATORS</span>
            <div style={{ flex: 1, height: '1px', background: '#252015' }} />
          </div>
          <div style={{ background: '#111009', border: '1px solid #252015', borderRadius: '14px', padding: '26px' }}>
            {Object.entries(result.indicators || {}).filter(([key]) => key !== 'total_count').flatMap(([type, values]) => 
              (values || []).map(value => ({ type, value }))
            ).map((ind, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #252015' : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: sevBg(ind.sev || ind.severity), border: `1px solid ${sevColor(ind.sev || ind.severity)}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: '9px', fontWeight: '700', color: sevColor(ind.sev || ind.severity), flexShrink: 0, marginTop: '1px' }}>
                  {ind.sev || ind.severity || 'M'}
                </div>
                <div>
                  <div style={{ fontFamily: 'Space Mono', fontSize: '12px', color: '#EDEDCD', fontWeight: '700', marginBottom: '3px' }}>{ind.title || ind.indicator || ind.type}</div>
                  <div style={{ fontSize: '12px', color: '#7A7260', fontWeight: '300', lineHeight: '1.5' }}>{ind.desc || ind.description || ind.value}</div>
                </div>
              </div>
            ))}
            {(!result.indicators || result.indicators.length === 0) && (
              <div style={{ textAlign: 'center', padding: '32px', fontFamily: 'Space Mono', fontSize: '12px', color: '#4A4535' }}>No indicators found</div>
            )}
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