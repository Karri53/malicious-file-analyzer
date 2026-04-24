import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { scanFile } from '../services/api'
import { normalizeScore, formatIndicators } from '../utils/scoreUtils'
import { useTheme } from '../utils/ThemeContext'
import Footer from '../components/Footer'

const limits = [
  ['Max file size', '256 MB'],
  ['Scan timeout', '120 seconds'],
  ['File retention', 'Never stored'],
  ['Results kept', '30 days'],
  ['Scans per day', 'Unlimited'],
]

const engines = [
  ['Static Analysis', 'ONLINE', '#5C9A73'],
  ['Regex Pattern Matching', 'ONLINE', '#5C9A73'],
  ['Heuristic Analysis', 'ONLINE', '#5C9A73'],
  ['Signature Rules Engine', 'ONLINE', '#5C9A73'],
  ['OCR Text Extraction', 'Beta', '#D49A4A'],
]

const steps = [
  { label: 'File received & validated', state: 'done' },
  { label: 'Static analysis complete', state: 'done' },
  { label: 'Pattern matching running...', state: 'active' },
  { label: 'Multi-engine scan', state: 'pending' },
  { label: 'Generating report', state: 'pending' },
]

const ACCEPTED_TYPES = '.pdf,.docx,.png,.jpg,.jpeg,.txt,.eml'

export default function FileUpload() {
  const [pageState, setPageState] = useState('default')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [isEmailFile, setIsEmailFile] = useState(false)
  const fileRef = useRef()
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const bg = isDark ? '#1A2520' : '#F5F5F0'
  const surface = isDark ? '#243530' : '#FFFFFF'
  const surface2 = isDark ? '#2C3E38' : '#FAFAF8'
  const border = isDark ? '#3A4A42' : '#D4D9CE'
  const borderDim = isDark ? '#323E39' : '#E0DBCE'
  const text = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const textFaint = isDark ? '#6B7B70' : '#8B9C8D'
  const primary = isDark ? '#6FBF88' : '#5C9A73'
  const warning = isDark ? '#F0B76F' : '#D49A4A'
  const danger = isDark ? '#E89090' : '#C96B6B'

  const stepColor = s => {
    if (s === 'done') return primary
    if (s === 'active') return warning
    return textFaint
  }

  const handleFile = async (file) => {
    if (!file) return
    setFileName(file.name)
    setIsEmailFile(file.name.toLowerCase().endsWith('.eml'))
    setPageState('processing')
    try {
      const response = await scanFile(file)
      const data = response.data
      navigate('/results', {
        state: {
          filename: data.filename,
          meta: `${data.indicators?.total_count || 0} indicator${(data.indicators?.total_count || 0) === 1 ? '' : 's'} · Submitted via File Upload`,
          extracted_text: data.extracted_text || '',
          score: normalizeScore(data.score),
          fileType: data.file_type || 'Unknown',
          fileSize: data.file_size > 1024 * 1024
            ? `${(data.file_size / 1024 / 1024).toFixed(1)} MB`
            : `${Math.max(1, Math.round(data.file_size / 1024))} KB`,
          md5: data.md5 || '—',
          sha256: data.sha256 || '—',
          scanTime: `${data.analysis_time_seconds}s`,
          scanned: new Date().toLocaleString(),
          indicators: formatIndicators(data.indicators),
          rawIndicators: data.indicators,
          reasons: data.reasons || [],
          suspicious_indicators: data.suspicious_indicators || [],
          severity: data.severity,
          explanation: data.explanation,
        }
      })
    } catch (err) {
      console.error('Scan failed:', err)
      setPageState('error')
    }
  }

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '56px 120px 0' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
          <span style={{ color: textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span style={{ color: textFaint }}>/</span>
          <span style={{ color: primary }}>File Upload</span>
        </div>

        {/* Centered Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${primary}20`, border: `1px solid ${primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📁</div>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: primary, letterSpacing: '0.12em', fontWeight: '600' }}>FILE UPLOAD</span>
          </div>

          <h1 style={{ fontFamily: 'Space Mono', fontSize: '42px', fontWeight: '700', color: text, lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Upload Files for<br />Static Analysis
          </h1>

          <p style={{ fontFamily: 'DM Sans', fontSize: '16px', color: textMuted, lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 20px' }}>
            Drop a suspicious file directly. NEXUS performs static analysis, OCR extraction, metadata review, and indicator-based scoring without executing the file.
          </p>

          {/* Email file notice */}
          <div style={{
            display: 'inline-flex', alignItems: 'flex-start', gap: '10px',
            background: isDark ? `${warning}10` : `${warning}08`,
            border: `1px solid ${warning}30`,
            borderRadius: '10px', padding: '12px 16px',
            textAlign: 'left',
          }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>✉️</span>
            <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.55', margin: 0 }}>
              <span style={{ color: warning, fontWeight: '600' }}>Analyzing a suspicious email?</span> Upload a saved email file (.eml) to scan its headers, body text, and links for phishing and malware indicators.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '24px', maxWidth: '1400px', margin: '0 auto 40px' }}>

          {/* Drop zone */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>DROP ZONE</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>

            {pageState === 'default' && (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                onClick={() => fileRef.current.click()}
                style={{
                  background: dragOver ? `${primary}08` : surface,
                  border: `2px dashed ${dragOver ? primary : border}`,
                  borderRadius: '14px', padding: '48px 24px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.25s',
                }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: `${primary}15`, border: `1px solid ${primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' }}>📁</div>
                <div style={{ fontFamily: 'Space Mono', fontSize: '15px', fontWeight: '700', color: text, marginBottom: '10px' }}>Drag & drop your file here</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, marginBottom: '20px' }}>or click to browse your computer</div>
                <button style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '600', color: primary, background: `${primary}15`, border: `1px solid ${primary}35`, borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', marginBottom: '16px' }}>
                  BROWSE FILES
                </button>
                <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: textFaint }}>
                  .pdf .docx .png .jpg .txt <span style={{ color: warning, fontWeight: '600' }}>.eml</span> · Max 256 MB
                </div>
                <input ref={fileRef} type="file" accept={ACCEPTED_TYPES} style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </div>
            )}

            {pageState === 'processing' && (
              <div style={{ background: surface, border: `2px solid ${warning}40`, borderRadius: '14px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: surface2, border: `1px solid ${border}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${warning}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {isEmailFile ? '✉️' : '📄'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '500', color: text }}>{fileName}</div>
                    {isEmailFile && (
                      <div style={{ fontFamily: 'DM Sans', fontSize: '10px', color: warning, marginTop: '2px' }}>
                        Scanning headers, body & attachments
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: '600', color: warning }}>Analyzing...</span>
                </div>
                <div style={{ height: '3px', background: border, borderRadius: '2px', marginBottom: '16px', overflow: 'hidden' }}>
                  <div style={{ height: '3px', background: warning, borderRadius: '2px', width: '60%' }} />
                </div>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < steps.length - 1 ? `1px solid ${borderDim}` : 'none' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: stepColor(step.state), flexShrink: 0 }} />
                    <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: stepColor(step.state) }}>{step.label}</span>
                  </div>
                ))}
              </div>
            )}

            {pageState === 'error' && (
              <div style={{ background: surface, border: `2px dashed ${danger}40`, borderRadius: '14px', padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: `${danger}15`, border: `1px solid ${danger}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: danger, fontWeight: '700' }}>✕</div>
                <div style={{ fontFamily: 'Space Mono', fontSize: '14px', color: danger, fontWeight: '700' }}>Upload failed</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: textMuted, lineHeight: '1.6' }}>We couldn't process this file. See the common reasons below and try again.</div>
                <div style={{ background: `${danger}08`, border: `1px solid ${danger}20`, borderRadius: '8px', padding: '16px 18px', width: '100%', textAlign: 'left' }}>
                  {[
                    ['File too large.', ' Maximum file size is 256 MB.'],
                    ['Unsupported format.', ' Some archive types require extraction first.'],
                    ['Corrupted file.', ' The file may be incomplete or damaged.'],
                    ['Invalid .eml file.', ' Make sure the file is a properly exported email.'],
                  ].map(([b, r], i, arr) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontFamily: 'DM Sans', fontSize: '12px', color: textMuted, marginBottom: i < arr.length - 1 ? '8px' : '0' }}>
                      <span style={{ color: danger }}>→</span>
                      <span><span style={{ color: text, fontWeight: '500' }}>{b}</span>{r}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPageState('default')} style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '700', color: '#FFFFFF', background: warning, border: 'none', borderRadius: '8px', padding: '12px 0', width: '100%', cursor: 'pointer' }}>
                  TRY AGAIN →
                </button>
              </div>
            )}
          </div>

          {/* Scan limits */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>SCAN LIMITS</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
              {limits.map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < limits.length - 1 ? `1px solid ${border}` : 'none' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted }}>{k}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '600', color: text }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Email file capabilities box */}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '14px' }}>✉️</span>
                <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: warning, letterSpacing: '0.1em', fontWeight: '600' }}>EMAIL FILE (.eml) ANALYSIS</span>
              </div>
              {[
                'Sender & subject extraction',
                'Body text analysis',
                'Attachment scanning',
                'Phishing & malicious link detection',
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: i < arr.length - 1 ? `1px solid ${borderDim}` : 'none' }}>
                  <span style={{ color: primary, fontSize: '11px', fontWeight: '700' }}>✓</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ background: isDark ? `${warning}12` : `${warning}10`, border: `1px solid ${warning}35`, borderRadius: '12px', padding: '18px', display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
              <p style={{ fontFamily: 'DM Sans', fontSize: '12px', color: textMuted, lineHeight: '1.6', margin: 0 }}>
                <span style={{ color: warning, fontWeight: '600' }}>Files are never stored.</span> Uploaded files are analyzed in memory and immediately discarded. Only the scan result metadata is retained.
              </p>
            </div>
          </div>

          {/* Active engines */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textFaint, letterSpacing: '0.12em', fontWeight: '600' }}>ACTIVE ENGINES</span>
              <div style={{ flex: 1, height: '1px', background: border }} />
            </div>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '24px' }}>
              {engines.map(([name, status, color], i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: i < engines.length - 1 ? `1px solid ${border}` : 'none' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '500', color: text, flex: 1 }}>{name}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: '700', color }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}