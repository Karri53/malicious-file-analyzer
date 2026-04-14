import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'

const steps = [
  {
    num: 1,
    title: 'Copy your scanner address',
    desc: 'Each account has a unique scanner inbox. Copy the address below — this is where you\'ll forward suspicious emails.',
    extra: 'address',
  },
  {
    num: 2,
    title: 'Forward the suspicious email',
    desc: 'In your email client, open the suspicious email and forward it to your scanner address. Include the original headers when possible.',
    extra: 'code',
  },
  {
    num: 3,
    title: 'We extract and analyze attachments',
    desc: 'We automatically extract and analyze all attachments from the forwarded email in a secure sandbox environment.',
    extra: null,
  },
  {
    num: 4,
    title: 'Receive results by email',
    desc: 'Within 2–3 minutes, your scan results will be sent via email. You\'ll get a threat score, indicators of compromise, and a full file report.',
    extra: null,
  },
]

export default function EmailAnalysis() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const bg          = isDark ? '#0A0906'  : '#F5F0E8'
  const surface     = isDark ? '#111009'  : '#FFFFFF'
  const border      = isDark ? '#252015'  : '#E0D5C5'
  const textPrimary = isDark ? '#EDEDCD'  : '#1A1508'
  const textMuted   = isDark ? '#7A7260'  : '#6B5D45'
  const textFaint   = isDark ? '#4A4535'  : '#A89880'
  const codeBg      = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)'
  const codeBorder  = isDark ? '#3A3220'  : '#D5C8B0'

  return (
    <div style={{ padding: '56px 120px 80px', background: bg, minHeight: '100vh', position: 'relative', zIndex: 0 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
        <span style={{ color: textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color: textFaint }}>/</span>
        <span style={{ color: '#D0BC77' }}>Email Analysis</span>
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(208,188,119,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✉️</div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#D0BC77', letterSpacing: '0.14em' }}>EMAIL ANALYSIS</span>
          </div>
          <h1 style={{ fontFamily: 'Space Mono', fontSize: '36px', fontWeight: '700', color: textPrimary, lineHeight: '1.1', marginBottom: '12px' }}>
            Analyze suspicious<br /><span style={{ color: '#D0BC77' }}>email attachments</span>
          </h1>
          <p style={{ fontSize: '15px', color: textMuted, fontWeight: '300', maxWidth: '520px', lineHeight: '1.6' }}>
            Forward any suspicious email to our scanner address. We'll extract every attachment and analyze them in an isolated sandbox.
          </p>
        </div>

        {/* Help box */}
        <div style={{ background: isDark ? 'rgba(208,188,119,0.05)' : 'rgba(45,122,110,0.12)', border: `1px solid ${isDark ? 'rgba(208,188,119,0.18)' : 'rgba(45,122,110,0.4)'}`, borderRadius: '12px', padding: '18px 20px', minWidth: '220px' }}>
          <div style={{ fontFamily: 'Space Mono', fontSize: '12px', color: textPrimary, marginBottom: '8px' }}>Still haven't received results?</div>
          <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textMuted, marginBottom: '10px' }}>Common issues:</div>
          {['Invalid forwarding', 'Missing attachment', 'Delayed processing'].map(tag => (
            <div key={tag} style={{ display: 'inline-block', fontFamily: 'Space Mono', fontSize: '10px', color: isDark ? '#D0BC77' : '#8B6914', background: isDark ? 'rgba(208,188,119,0.08)' : 'rgba(208,188,119,0.25)', border: `1px solid ${isDark ? 'rgba(208,188,119,0.2)' : 'rgba(208,188,119,0.5)'}`, borderRadius: '100px', padding: '3px 10px', marginRight: '6px', marginBottom: '6px', fontWeight: '300' }}>{tag}</div>          ))}
        </div>
      </div>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, letterSpacing: '0.14em' }}>HOW IT WORKS</span>
        <div style={{ flex: 1, height: '1px', background: border }} />
      </div>

      {/* Step cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {steps.map(step => (
          <div key={step.num} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '26px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(208,188,119,0.1)', border: '1px solid rgba(208,188,119,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: '11px', color: '#D0BC77', fontWeight: '700', marginBottom: '14px' }}>
              {step.num}
            </div>
            <div style={{ fontFamily: 'Space Mono', fontSize: '13px', fontWeight: '700', color: textPrimary, marginBottom: '8px' }}>{step.title}</div>
            <p style={{ fontSize: '13px', color: textMuted, fontWeight: '300', lineHeight: '1.6', marginBottom: step.extra ? '16px' : '0' }}>{step.desc}</p>

            {step.extra === 'address' && (
              <div style={{ background: codeBg, border: `1px solid ${codeBorder}`, borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '12px', color: '#D0BC77', fontWeight: '700' }}>analyze@[domain].com</span>
                <button
                  onClick={() => { navigator.clipboard.writeText('analyze@[domain].com') }}
                  style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#D0BC77', background: 'rgba(208,188,119,0.08)', border: '1px solid rgba(208,188,119,0.25)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                  COPY
                </button>
              </div>
            )}

            {step.extra === 'code' && (
              <div style={{ background: codeBg, border: `1px solid ${border}`, borderRadius: '8px', padding: '12px 14px', fontFamily: 'Space Mono', fontSize: '10px', color: textMuted, lineHeight: '1.9' }}>
                To: <span style={{ color: '#D0BC77' }}>analyze@[domain].com</span><br />
                Subject: <span style={{ color: '#D0BC77' }}>Fwd: [original subject]</span><br />
                — forward the entire original message —
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '60px', borderTop: `1px solid ${border}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono', fontSize: '10px', color: textFaint }}>
        <span><span style={{ color: '#D0BC77' }}>Opulence</span> · Senior Design Project · Spring 2026</span>
        <span style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}`, borderRadius: '6px', padding: '3px 10px', color: textMuted }}>NSA GenCyber Partnership</span>
      </div>
    </div>
  )
}