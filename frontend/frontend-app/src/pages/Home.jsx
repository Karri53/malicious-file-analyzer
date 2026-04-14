import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'

const cards = [
  {
    icon: '✉️',
    title: 'Email Analysis',
    desc: 'Forward a suspicious email directly to our scanner. We extract and analyze all attachments and embedded links.',
    cta: 'START EMAIL ANALYSIS',
    path: '/email',
    accent: '#D0BC77',
    iconBg: 'rgba(208,188,119,0.12)',
  },
  {
    icon: '🔗',
    title: 'URL Analysis',
    desc: 'Paste a link to a remote file or webpage. We fetch and analyze it in a fully isolated sandbox.',
    cta: 'ANALYZE URL',
    path: '/url',
    accent: '#759678',
    iconBg: 'rgba(117,150,120,0.12)',
  },
  {
    icon: '📁',
    title: 'File Upload',
    desc: 'Upload any file directly for sandbox detonation and static + dynamic malware analysis.',
    cta: 'UPLOAD FILE',
    path: '/upload',
    accent: '#77997B',
    iconBg: 'rgba(119,153,123,0.12)',
  },
]

const recentScans = [
  { name: 'invoice_march.pdf', sub: '2.4 MB · Email attachment', type: 'File', score: 87, engine: 'VirusTotal', status: 'MALICIOUS', date: 'Mar 11' },
  { name: 'phishing.eml',      sub: '14 KB · Email attachment',  type: 'Email', score: 64, engine: 'Sandbox',    status: 'WARNING',   date: 'Mar 10' },
  { name: 'malware.exe',       sub: '890 KB · File upload',      type: 'File', score: 92, engine: 'Static',     status: 'MALICIOUS', date: 'Mar 9'  },
]

function getScoreColor(score) {
  if (score >= 70) return '#E05555'
  if (score >= 31) return '#D0BC77'
  return '#77997B'
}

function getBadgeStyle(status) {
  if (status === 'MALICIOUS') return { color: '#E05555', background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.28)' }
  if (status === 'WARNING')   return { color: '#D0BC77', background: 'rgba(208,188,119,0.1)', border: '1px solid rgba(208,188,119,0.28)' }
  return { color: '#77997B', background: 'rgba(119,153,123,0.12)', border: '1px solid rgba(119,153,123,0.3)' }
}

export default function Home() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const bg        = isDark ? '#0A0906'  : '#F5F0E8'
  const surface   = isDark ? '#111009'  : '#FFFFFF'
  const border    = isDark ? '#252015'  : '#E0D5C5'
  const borderDim = isDark ? '#1C1C1C'  : '#EDE5D5'
  const textPrimary = isDark ? '#EDEDCD' : '#1A1508'
  const textMuted   = isDark ? '#B8AA8E' : '#5A4A2A'
  const textDim     = isDark ? '#7A7260' : '#8B7355'
  const textFaint   = isDark ? '#4A4535' : '#A89880'
  const rowHover    = isDark ? '#181510' : '#F0E8D8'

  return (
    <div style={{ padding: '40px 120px 80px', background: bg, minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>

        {/* Left: text content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#77997B' }} />
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#77997B', letterSpacing: '0.12em' }}>
              SYSTEM STATUS: OPERATIONAL
            </span>
          </div>
          <h1 style={{ fontFamily: 'Space Mono', fontSize: '42px', fontWeight: '700', color: textPrimary, lineHeight: '1.1', marginBottom: '16px' }}>
            Analyze <span style={{ color: '#D0BC77' }}>suspicious</span><br />files. Safely.
          </h1>
          <p style={{ fontSize: '18px', color: textMuted, fontWeight: '400', maxWidth: '500px', lineHeight: '1.65', marginBottom: '28px' }}>
            Submit URLs, forwarded emails, or files for deep malware analysis — without ever downloading them to your machine.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {['Avg. scan time <8s', 'Multi-engine detection', 'Zero file retention'].map((item, i) => (
              <span key={i} style={{ fontFamily: 'Space Mono', fontSize: '13px', color: textDim }}>
                {i > 0 && <span style={{ marginRight: '20px', color: border }}>|</span>}
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right: logo */}
        <img src="/OpulenceLogo.png" alt="MFA Logo" style={{ width: '380px', opacity: isDark ? 0.85 : 1 }} />

      </div>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, letterSpacing: '0.14em' }}>CHOOSE AN ANALYSIS TYPE</span>
        <div style={{ flex: 1, height: '1px', background: border }} />
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '14px', marginBottom: '40px' }}>
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: '14px',
              padding: '26px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.3s, transform 0.28s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = card.accent
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = border
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '16px' }}>
              {card.icon}
            </div>
            <div style={{ fontFamily: 'Space Mono', fontSize: '14px', fontWeight: '700', color: textPrimary, marginBottom: '8px' }}>
              {card.title}
            </div>
            <p style={{ fontSize: '13px', color: textDim, fontWeight: '300', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
              {card.desc}
            </p>
            <div style={{ fontFamily: 'Space Mono', fontSize: '11px', color: card.accent, letterSpacing: '0.06em' }}>
              {card.cta} →
            </div>
          </div>
        ))}
      </div>

      {/* Recent Scans label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, letterSpacing: '0.14em' }}>RECENT SCANS</span>
        <div style={{ flex: 1, height: '1px', background: border }} />
      </div>

      {/* Scans table */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 100px 90px 90px', gap: '16px', padding: '10px 22px', borderBottom: `1px solid ${borderDim}` }}>
          {['FILE NAME', 'TYPE', 'SCORE', 'ENGINE', 'STATUS', 'DATE'].map((h, i) => (
            <span key={h} style={{ fontFamily: 'Space Mono', fontSize: '9px', color: textFaint, letterSpacing: '0.12em', textAlign: i >= 2 ? 'center' : 'left' }}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {recentScans.map((row, i) => (
          <div
            key={i}
            style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 100px 90px 90px', gap: '16px', padding: '13px 22px', borderBottom: i < recentScans.length - 1 ? `1px solid ${border}` : 'none', cursor: 'pointer', transition: 'background 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.background = rowHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textPrimary }}>{row.name}</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, marginTop: '2px' }}>{row.sub}</div>
            </div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textDim, alignSelf: 'center' }}>{row.type}</span>
            <span style={{ fontFamily: 'Space Mono', fontSize: '13px', fontWeight: '700', color: getScoreColor(row.score), textAlign: 'center', alignSelf: 'center' }}>{row.score}</span>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textDim, textAlign: 'center', alignSelf: 'center' }}>{row.engine}</span>
            <div style={{ textAlign: 'center', alignSelf: 'center' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '9px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.07em', ...getBadgeStyle(row.status) }}>
                {row.status}
              </span>
            </div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, textAlign: 'right', alignSelf: 'center' }}>{row.date}</span>
          </div>
        ))}
      </div>

    </div>
  )
}