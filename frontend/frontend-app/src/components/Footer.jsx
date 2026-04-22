import { useTheme } from '../utils/ThemeContext'

export default function Footer() {
  const { isDark } = useTheme()

  const bg = isDark ? '#243530' : '#FFFFFF'
  const border = isDark ? '#3A4A42' : '#D4D9CE'
  const text = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const accent = isDark ? '#8FAA96' : '#7BA888'

  return (
    <footer style={{
      background: bg,
      borderTop: `1px solid ${border}`,
      padding: '32px 120px',
      marginTop: '80px',
    }}>
      {/* Top row - branding */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/OpulenceLogo.png" 
            alt="Team Opulence Logo" 
            style={{ 
              width: '36px', 
              height: 'auto',
              objectFit: 'contain',
              flexShrink: 0
            }} 
          />
          <span style={{
            fontFamily: 'Space Mono',
            fontSize: '13px',
            fontWeight: '700',
            color: text,
            letterSpacing: '0.02em'
          }}>TEAM OPULENCE</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted }}>
            National Security Agency (NSA)
          </span>
          <span style={{ color: border }}>·</span>
          <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted }}>
            Prairie View A&M University
          </span>
          <span style={{ color: border }}>·</span>
          <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted }}>
            Fall '25 - Spring '26
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: border, marginBottom: '20px' }} />

      {/* Disclaimer - centered and professional */}
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'DM Sans',
          fontSize: '12px',
          color: textMuted,
          lineHeight: '1.7',
          letterSpacing: '0.01em'
        }}>
          <strong style={{ color: text, fontWeight: '600' }}>Disclaimer:</strong> This project is developed under the guidance of Prairie View A&M University and the National Security Agency. All content and analysis provided by this tool are for educational and research purposes only. Results should not be considered definitive security assessments. For critical security decisions, consult with certified cybersecurity professionals and your organization's IT security team. All rights reserved for academic use.
        </p>
      </div>
    </footer>
  )
}