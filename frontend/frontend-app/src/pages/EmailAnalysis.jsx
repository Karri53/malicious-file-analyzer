import { useNavigate } from 'react-router-dom'

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

const card = {
  background: '#111009', border: '1px solid #252015',
  borderRadius: '14px', padding: '26px',
}

export default function EmailAnalysis() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '56px 120px 80px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
        <span style={{ color: '#7A7260', cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color: '#4A4535' }}>/</span>
        <span style={{ color: '#D0BC77' }}>Email Analysis</span>
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(208,188,119,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✉️</div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#D0BC77', letterSpacing: '0.14em' }}>EMAIL ANALYSIS</span>
          </div>
          <h1 style={{ fontFamily: 'Space Mono', fontSize: '36px', fontWeight: '700', color: '#EDEDCD', lineHeight: '1.1', marginBottom: '12px' }}>
            Analyze suspicious<br /><span style={{ color: '#D0BC77' }}>email attachments</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#7A7260', fontWeight: '300', maxWidth: '520px', lineHeight: '1.6' }}>
            Forward any suspicious email to our scanner address. We'll extract every attachment and analyze them in an isolated sandbox.
          </p>
        </div>

        {/* Help box */}
        <div style={{ background: 'rgba(208,188,119,0.05)', border: '1px solid rgba(208,188,119,0.2)', borderRadius: '12px', padding: '18px 20px', minWidth: '220px' }}>
          <div style={{ fontFamily: 'Space Mono', fontSize: '12px', color: '#EDEDCD', marginBottom: '8px' }}>Still haven't received results?</div>
          <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#7A7260', marginBottom: '10px' }}>Common issues:</div>
          {['Invalid forwarding', 'Missing attachment', 'Delayed processing'].map(tag => (
            <div key={tag} style={{ display: 'inline-block', fontFamily: 'Space Mono', fontSize: '10px', color: '#D0BC77', background: 'rgba(208,188,119,0.08)', border: '1px solid rgba(208,188,119,0.2)', borderRadius: '100px', padding: '3px 10px', marginRight: '6px', marginBottom: '6px' }}>{tag}</div>
          ))}
        </div>
      </div>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535', letterSpacing: '0.14em' }}>HOW IT WORKS</span>
        <div style={{ flex: 1, height: '1px', background: '#252015' }} />
      </div>

      {/* Step cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {steps.map(step => (
          <div key={step.num} style={card}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(208,188,119,0.1)', border: '1px solid rgba(208,188,119,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: '11px', color: '#D0BC77', fontWeight: '700', marginBottom: '14px' }}>
              {step.num}
            </div>
            <div style={{ fontFamily: 'Space Mono', fontSize: '13px', fontWeight: '700', color: '#EDEDCD', marginBottom: '8px' }}>{step.title}</div>
            <p style={{ fontSize: '13px', color: '#7A7260', fontWeight: '300', lineHeight: '1.6', marginBottom: step.extra ? '16px' : '0' }}>{step.desc}</p>

            {step.extra === 'address' && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #3A3220', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '12px', color: '#D0BC77', fontWeight: '700' }}>analyze@[domain].com</span>
                <button
                  onClick={() => { navigator.clipboard.writeText('analyze@[domain].com') }}
                  style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#D0BC77', background: 'rgba(208,188,119,0.08)', border: '1px solid rgba(208,188,119,0.25)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                  COPY
                </button>
              </div>
            )}

            {step.extra === 'code' && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #252015', borderRadius: '8px', padding: '12px 14px', fontFamily: 'Space Mono', fontSize: '10px', color: '#7A7260', lineHeight: '1.9' }}>
                To: <span style={{ color: '#D0BC77' }}>analyze@[domain].com</span><br />
                Subject: <span style={{ color: '#D0BC77' }}>Fwd: [original subject]</span><br />
                — forward the entire original message —
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '60px', borderTop: '1px solid #252015', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono', fontSize: '10px', color: '#4A4535' }}>
        <span><span style={{ color: '#D0BC77' }}>Opulence</span> · Senior Design Project · Spring 2026</span>
        <span style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #252015', borderRadius: '6px', padding: '3px 10px', color: '#7A7260' }}>NSA GenCyber Partnership</span>
      </div>
    </div>
  )
}