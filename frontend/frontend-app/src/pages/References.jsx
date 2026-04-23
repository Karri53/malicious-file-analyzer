import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'
import Footer from '../components/Footer'

const team = [
  { name: 'Karrington Hall', role: 'Project Lead · Backend · AWS/Deployment', github: 'Karri53' },
  { name: 'Kendall Brown', role: 'Frontend · UI/UX Development', github: 'kbrownpv' },
  { name: 'LeMikkos Starks', role: 'QA/Testing · Regex Pattern Matching', github: 'lstarks1513' },
  { name: 'Brandon Nobles', role: 'Backend · Security Validation', github: 'BRegardQ' },
]

const advisors = [
  { name: 'Dr. Nourshin Ghaffari', role: 'Faculty Advisor', org: 'Prairie View A&M University' },
  { name: 'Dr. Gregory Stevenson', role: 'NSA Mentor', org: 'National Security Agency' },
  { name: 'Mr. Andrew Hutton', role: 'NSA Mentor', org: 'National Security Agency' },
  { name: 'Mr. Jonathan Martindale', role: 'Snowflake Liaison', org: 'Snowflake Inc.' },
  { name: 'Ms. Tanya Hollins', role: 'Amazon Liaison', org: 'Amazon Web Services' },
]

export default function References() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const bg       = isDark ? '#1A2520' : '#F5F5F0'
  const surface  = isDark ? '#243530' : '#FFFFFF'
  const surface2 = isDark ? '#2C3E38' : '#FAFAF8'
  const border   = isDark ? '#3A4A42' : '#D4D9CE'
  const borderDim = isDark ? '#323E39' : '#E8E4DC'
  const text     = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const textFaint = isDark ? '#6B7B70' : '#8B9C8D'
  const primary  = isDark ? '#6FBF88' : '#5C9A73'
  const gold     = isDark ? '#E0C58F' : '#B8935F'

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '56px 120px 0', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
          <span style={{ color: textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span style={{ color: textFaint }}>/</span>
          <span style={{ color: gold }}>References</span>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${gold}20`, border: `1px solid ${gold}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📚</div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: gold, letterSpacing: '0.12em', fontWeight: '600' }}>REFERENCES & ACKNOWLEDGMENTS</span>
          </div>
          <h1 style={{ fontFamily: 'Space Mono', fontSize: '36px', fontWeight: '700', color: text, lineHeight: '1.1', marginBottom: '12px' }}>
            About NEXUS
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '16px', color: textMuted, maxWidth: '640px', lineHeight: '1.7' }}>
            NEXUS is a senior design capstone project developed at Prairie View A&M University in partnership with the National Security Agency. It provides automated malware analysis for educational and research purposes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

          {/* Team */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>TEAM OPULENCE</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', overflow: 'hidden' }}>
              {team.map((member, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i < team.length - 1 ? `1px solid ${borderDim}` : 'none' }}>
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: '600', color: text, marginBottom: '3px' }}>{member.name}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted }}>{member.role}</div>
                  </div>
                  {member.github && (
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontFamily: 'Space Mono', fontSize: '11px', color: primary, textDecoration: 'none', background: `${primary}15`, border: `1px solid ${primary}30`, borderRadius: '6px', padding: '4px 12px' }}
                    >
                      @{member.github}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advisors */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>SPECIAL ACKNOWLEDGMENTS</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
              {advisors.map((advisor, i) => (
                <div key={i} style={{ padding: '16px 24px', borderBottom: i < advisors.length - 1 ? `1px solid ${borderDim}` : 'none' }}>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: '600', color: text, marginBottom: '3px' }}>{advisor.name}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted }}>{advisor.role} · {advisor.org}</div>
                </div>
              ))}
            </div>

            {/* Institutions */}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>INSTITUTIONAL PARTNERS</span>
              </div>
              {[
                { name: 'Prairie View A&M University', detail: 'COMP 4208 P02 · Senior Design II · Spring 2026' },
                { name: 'National Security Agency', detail: 'NSA Partnership Program' },
              ].map((inst, i, arr) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${borderDim}` : 'none' }}>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: '600', color: text, marginBottom: '2px' }}>{inst.name}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted }}>{inst.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub repo */}
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '28px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🐙</span>
                <span style={{ fontFamily: 'Space Mono', fontSize: '13px', fontWeight: '700', color: text }}>Source Code Repository</span>
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '14px', color: textMuted, maxWidth: '500px', lineHeight: '1.6' }}>
                The full source code for NEXUS is publicly available on GitHub. This includes the React frontend, Flask backend, and all analysis modules.
              </div>
            </div>
            <a
              href="https://github.com/Karri53/malicious-file-analyzer"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: 'DM Sans', fontSize: '14px', fontWeight: '700',
                color: '#FFFFFF',
                background: isDark ? '#2C3E38' : '#2C3E35',
                border: `1px solid ${border}`,
                borderRadius: '10px', padding: '12px 24px',
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              View on GitHub →
            </a>
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>BUILT WITH</span>
            <div style={{ flex: 1, height: '1px', background: border }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['React', 'Flask', 'Python', 'AWS', 'Snowflake', 'YARA Rules', 'Tesseract OCR', 'VirusTotal API', 'Regex Pattern Matching'].map(tech => (
              <span key={tech} style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: '500', color: textMuted, background: surface2, border: `1px solid ${border}`, borderRadius: '6px', padding: '6px 14px' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}