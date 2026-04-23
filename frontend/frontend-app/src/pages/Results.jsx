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

// Brandon's explainReason helper — converts raw backend reasons into user-friendly descriptions
const explainReason = (reason) => {
  const r = reason.toLowerCase()
  if (r.includes('suspicious domain')) {
    return {
      severity: 'M',
      title: 'Suspicious Domain Detected',
      description: 'The URL uses a top-level domain that is commonly abused in phishing or malware campaigns. Attackers often choose cheap or easy-to-register domains to quickly deploy malicious links.'
    }
  }
  if (r.includes('dangerous file extension')) {
    return {
      severity: 'H',
      title: 'Dangerous File Extension in URL',
      description: 'The link appears to point to a potentially dangerous downloadable file such as an executable, script, or macro-enabled document. These file types are often used to deliver malware.'
    }
  }
  if (r.includes('suspicious url path keyword')) {
    return {
      severity: 'M',
      title: 'Suspicious URL Path Keyword',
      description: 'The URL contains words often associated with phishing or social engineering, such as login, verify, update, reset, or payment. These terms are commonly used to trick users into trusting malicious pages.'
    }
  }
  if (r.includes('url(s) with non-standard ports')) {
    return {
      severity: 'H',
      title: 'Non-Standard Network Port',
      description: 'The URL uses a port other than common web ports like 80 or 443. Unusual ports can indicate command-and-control traffic, suspicious hosting, or attempts to evade normal web filtering.'
    }
  }
  if (r.includes('ip-based url')) {
    return {
      severity: 'H',
      title: 'IP-Based URL',
      description: 'The link uses a raw IP address instead of a normal domain name. This is suspicious because attackers often avoid registered domains to reduce traceability or bypass reputation checks.'
    }
  }
  if (r.includes('shortened url')) {
    return {
      severity: 'M',
      title: 'Shortened URL',
      description: 'The link uses a URL-shortening service. Shortened links can hide the true destination, making them a common technique in phishing and malicious redirection campaigns.'
    }
  }
  if (r.includes('url combined with email address')) {
    return {
      severity: 'M',
      title: 'URL and Email Combination',
      description: 'The presence of both a URL and an email address can indicate phishing, credential theft, or malware delivery attempts. Attackers often include contact information or lure targets through email-based themes.'
    }
  }
  if (r.includes('url uses suspicious network port')) {
    return {
      severity: 'H',
      title: 'Suspicious Port Usage',
      description: 'The detected URL not only exists, but also uses a suspicious network port. This increases concern because malicious infrastructure often runs on uncommon ports.'
    }
  }
  if (r.includes('phishing language combined with url')) {
    return {
      severity: 'H',
      title: 'Phishing Language with URL',
      description: 'The content combines a URL with wording commonly seen in phishing messages. This pattern is strongly associated with attempts to lure users into clicking malicious links.'
    }
  }
  if (r.includes('phishing keyword')) {
    return {
      severity: 'M',
      title: 'Phishing Language Detected',
      description: 'The content contains words or phrases commonly used in phishing campaigns, such as urgent, verify, confirm, or reset password. These terms are meant to pressure users into acting quickly.'
    }
  }
  if (r.includes('email address')) {
    return {
      severity: 'L',
      title: 'Email Address Found',
      description: 'An email address was detected in the content. On its own this is not always malicious, but it can support phishing, impersonation, or social engineering when combined with other indicators.'
    }
  }
  if (r.includes('ip address')) {
    return {
      severity: 'M',
      title: 'IP Address Found',
      description: 'An IP address was detected in the content. Direct infrastructure references can be suspicious, especially when combined with malware delivery, unusual ports, or phishing behavior.'
    }
  }
  if (r.includes('cryptocurrency address')) {
    return {
      severity: 'H',
      title: 'Cryptocurrency Address Detected',
      description: 'A cryptocurrency wallet address was found. This is a major warning sign because ransomware and extortion campaigns often demand payment through crypto wallets.'
    }
  }
  if (r.includes('multiple suspicious indicator types detected')) {
    return {
      severity: 'H',
      title: 'Multiple Indicator Types Detected',
      description: 'Several different categories of suspicious behavior were found together. When multiple indicators appear in the same file or URL, overall risk rises significantly.'
    }
  }
  if (r.includes('multiple urls found')) {
    return {
      severity: 'M',
      title: 'Multiple URLs Detected',
      description: 'The content contains multiple URLs. A high concentration of links can be suspicious in phishing documents, redirect chains, or malicious lure files.'
    }
  }
  if (r.includes('url(s) found')) {
    return {
      severity: 'L',
      title: 'URL Detected',
      description: 'A URL was found in the content. A link alone is not always malicious, but it becomes more suspicious when paired with phishing terms, suspicious domains, dangerous extensions, or unusual ports.'
    }
  }
  return {
    severity: 'M',
    title: 'Suspicious Finding',
    description: reason
  }
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

  // Updated suspiciousItems block per Brandon's email
  const suspiciousItems =
    Array.isArray(result.suspicious_indicators) && result.suspicious_indicators.length > 0
      ? result.suspicious_indicators.map((reason) => explainReason(reason))
      : Array.isArray(result.reasons) && result.reasons.length > 0
        ? result.reasons.map((reason) => explainReason(reason))
        : Object.entries(result.indicators || {})
          .filter(([key]) => key !== 'total_count')
          .flatMap(([type, values]) =>
            (Array.isArray(values) ? values : []).map((value) => ({
              severity: 'M',
              title: type,
              description: typeof value === 'object' ? JSON.stringify(value) : String(value),
            }))
          )

  const scoreColor = getScoreColor(score, isDark)
  const badge = getBadge(score, isDark)
  const circumference = 2 * Math.PI * 58
  const offset = circumference - (score / 100) * circumference

  const bg        = isDark ? '#1A2520' : '#F5F5F0'
  const surface   = isDark ? '#243530' : '#FFFFFF'
  const surface2  = isDark ? '#2C3E38' : '#FAFAF8'
  const border    = isDark ? '#3A4A42' : '#D4D9CE'
  const borderDim = isDark ? '#323E39' : '#E8E4DC'
  const text      = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const textFaint = isDark ? '#6B7B70' : '#8B9C8D'
  const ringTrack = isDark ? '#3A4A42' : '#D4D9CE'
  const accent    = isDark ? '#E0C58F' : '#B8935F'

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

            {/* MD5 & SHA256 plain-english definitions */}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '22px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>WHAT DO THESE MEAN?</span>
                <div style={{ flex: 1, height: '1px', background: border }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: '700', color: text, marginBottom: '4px' }}>MD5 Hash</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>
                    A short digital fingerprint of the file. Think of it like a unique ID — if two files have the same MD5, they are identical. It helps quickly check if this file has been seen before.
                  </div>
                </div>
                <div style={{ height: '1px', background: borderDim }} />
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: '700', color: text, marginBottom: '4px' }}>SHA256 Hash</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>
                    A longer, more reliable version of the MD5 fingerprint. It is the gold standard used by security professionals and threat databases worldwide to uniquely identify files.
                  </div>
                </div>
                <div style={{ height: '1px', background: borderDim }} />
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: '700', color: text, marginBottom: '4px' }}>Threat Score</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>
                    A number from 0 to 100 indicating how suspicious the file is. 0–30 is generally safe, 31–69 is worth reviewing, and 70+ is considered malicious.
                  </div>
                </div>
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
              {suspiciousItems.map((ind, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: i < suspiciousItems.length - 1 ? `1px solid ${border}` : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: sevBg(ind.severity, isDark), border: `1px solid ${sevColor(ind.severity, isDark)}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontSize: '10px', fontWeight: '700', color: sevColor(ind.severity, isDark), flexShrink: 0, marginTop: '2px' }}>
                    {ind.severity}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Mono', fontSize: '13px', color: text, fontWeight: '700', marginBottom: '4px' }}>
                      {ind.title}
                    </div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>
                      {ind.description}
                    </div>
                  </div>
                </div>
              ))}

              {suspiciousItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'DM Sans', fontSize: '13px', color: textMuted }}>
                  No suspicious indicators found
                </div>
              )}

              {result.extracted_text && result.extracted_text.trim().length > 0 && (
                <div style={{ marginTop: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>EXTRACTED TEXT / OCR OUTPUT</span>
                    <div style={{ flex: 1, height: '1px', background: border }} />
                  </div>
                  <div style={{ background: surface2, border: `1px solid ${border}`, borderRadius: '14px', padding: '24px', maxHeight: '320px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>
                    {result.extracted_text}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}