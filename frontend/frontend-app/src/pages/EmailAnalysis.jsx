import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'
import Footer from '../components/Footer'

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

  const bg = isDark ? '#1A2520' : '#F5F5F0'
  const surface = isDark ? '#243530' : '#FFFFFF'
  const border = isDark ? '#3A4A42' : '#D4D9CE'
  const text = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const textFaint = isDark ? '#6B7B70' : '#8B9C8D'
  const accent = isDark ? '#E0C58F' : '#B8935F'
  const warning = isDark ? '#F0B76F' : '#D49A4A'
  const codeBg = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)'
  const codeBorder = isDark ? '#4A5A52' : '#C9B896'

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '56px 120px 0' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
          <span style={{ color: textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span style={{ color: textFaint }}>/</span>
          <span style={{ color: accent }}>Email Analysis</span>
        </div>

        {/* Centered Header Section */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${warning}20`, border: `1px solid ${warning}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>✉️</div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: warning, letterSpacing: '0.12em', fontWeight: '600' }}>EMAIL ANALYSIS</span>
          </div>
          
          <h1 style={{ fontFamily: 'Space Mono', fontSize: '42px', fontWeight: '700', color: text, lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Analyze Suspicious<br />Email Attachments
          </h1>
          
          <p style={{ fontFamily: 'DM Sans', fontSize: '16px', color: textMuted, lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
            Forward any suspicious email to our scanner address. We'll extract every attachment and analyze them in an isolated sandbox environment.
          </p>
        </div>

        {/* Help box - right aligned */}
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: isDark ? `${warning}15` : `${warning}12`, border: `1px solid ${warning}35`, borderRadius: '12px', padding: '20px 24px', width: '320px' }}>
            <div style={{ fontFamily: 'Space Mono', fontSize: '13px', fontWeight: '600', color: text, marginBottom: '10px' }}>Haven't received results?</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted, marginBottom: '12px' }}>Common issues:</div>
            {['Invalid forwarding address', 'Missing file attachment', 'Processing delay (>5 min)'].map(tag => (
              <div key={tag} style={{ display: 'inline-block', fontFamily: 'DM Sans', fontSize: '11px', color: warning, background: isDark ? `${warning}15` : `${warning}18`, border: `1px solid ${warning}35`, borderRadius: '100px', padding: '4px 12px', marginRight: '6px', marginBottom: '6px' }}>{tag}</div>
            ))}
          </div>
        </div>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', maxWidth: '1200px', margin: '0 auto 24px' }}>
          <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>HOW IT WORKS</span>
          <div style={{ flex: 1, height: '1px', background: border }} />
        </div>

        {/* Step cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1200px', margin: '0 auto 40px' }}>
          {steps.map(step => (
            <div key={step.num} style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '28px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${accent}15`, border: `1px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: '13px', color: accent, fontWeight: '700', marginBottom: '16px' }}>
                {step.num}
              </div>
              <div style={{ fontFamily: 'Space Mono', fontSize: '14px', fontWeight: '700', color: text, marginBottom: '10px' }}>{step.title}</div>
              <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6', marginBottom: step.extra ? '18px' : '0' }}>{step.desc}</p>

              {step.extra === 'address' && (
                <div style={{ background: codeBg, border: `1px solid ${codeBorder}`, borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Space Mono', fontSize: '12px', color: accent, fontWeight: '700' }}>scan@nexus.opulence.io</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText('scan@nexus.opulence.io') }}
                    style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: '600', color: accent, background: `${accent}15`, border: `1px solid ${accent}35`, borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}>
                    COPY
                  </button>
                </div>
              )}

              {step.extra === 'code' && (
                <div style={{ background: codeBg, border: `1px solid ${border}`, borderRadius: '8px', padding: '14px 16px', fontFamily: 'Space Mono', fontSize: '11px', color: textMuted, lineHeight: '1.8' }}>
                  To: <span style={{ color: accent }}>scan@nexus.opulence.io</span><br />
                  Subject: <span style={{ color: accent }}>Fwd: [original subject]</span><br />
                  <span style={{ color: textFaint }}>— forward entire message —</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}