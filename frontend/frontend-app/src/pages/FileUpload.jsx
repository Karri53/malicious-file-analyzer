import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { scanFile } from '../services/api'
import { normalizeScore, formatIndicators } from '../utils/scoreUtils'
import { useTheme } from '../utils/ThemeContext'

const limits = [
  ['Max file size', '256 MB'],
  ['Scan timeout', '120 seconds'],
  ['File retention', 'Never stored'],
  ['Results kept', '30 days'],
  ['Scans per day', 'Unlimited'],
]

const engines = [
  ['VirusTotal', 'ONLINE', '#77997B'],
  ['Sandbox Detonation', 'ONLINE', '#77997B'],
  ['Static Analysis', 'ONLINE', '#77997B'],
  ['YARA Rules Engine', 'ONLINE', '#77997B'],
  ['Behavioral Analysis', 'Beta', '#D0BC77'],
]

const steps = [
  { label: 'File received & validated', state: 'done' },
  { label: 'Static analysis complete', state: 'done' },
  { label: 'Sandbox detonation running...', state: 'active' },
  { label: 'Multi-engine scan', state: 'pending' },
  { label: 'Generating report', state: 'pending' },
]

const stepColor = s => s === 'done' ? '#77997B' : s === 'active' ? '#D0BC77' : '#4A4535'

export default function FileUpload() {
  const [pageState, setPageState] = useState('default')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef()
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const bg = isDark ? '#0A0906' : '#F5F0E8'
  const surface = isDark ? '#111009' : '#FFFFFF'
  const surface2 = isDark ? '#181510' : '#F0E8D8'
  const border = isDark ? '#252015' : '#E0D5C5'
  const borderDim = isDark ? '#1C1C1C' : '#EDE5D5'
  const textPrimary = isDark ? '#EDEDCD' : '#1A1508'
  const textMuted = isDark ? '#7A7260' : '#6B5D45'
  const textFaint = isDark ? '#4A4535' : '#A89880'

  const handleFile = async (file) => {
    if (!file) return
    setFileName(file.name)
    setPageState('processing')
    try {
      const response = await scanFile(file)
      const data = response.data
      navigate('/results', {
        state: {
          filename: data.filename,
          meta: `${data.indicators?.total_count || 0} indicator${(data.indicators?.total_count || 0) === 1 ? '' : 's'} · Submitted via File Upload`,
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
    <div style={{ padding: '56px 120px 80px', background: bg, minHeight: '100vh', position: 'relative', zIndex: 0 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', fontFamily: 'Space Mono', fontSize: '11px' }}>
        <span style={{ color: textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color: textFaint }}>/</span>
        <span style={{ color: '#D0BC77' }}>File Upload</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(119,153,123,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📁</div>
        <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#77997B', letterSpacing: '0.14em' }}>FILE UPLOAD</span>
      </div>
      <h1 style={{ fontFamily: 'Space Mono', fontSize: '36px', fontWeight: '700', color: textPrimary, lineHeight: '1.1', marginBottom: '12px' }}>
        Upload a file for<br /><span style={{ color: '#77997B' }}>deep analysis</span>
      </h1>
      <p style={{ fontSize: '15px', color: textMuted, fontWeight: '300', maxWidth: '540px', lineHeight: '1.6', marginBottom: '40px' }}>
        Drop any suspicious file directly. We run static analysis, dynamic sandbox detonation, and multi-engine scanning — without it ever touching your machine.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px' }}>

        {/* Drop zone */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, letterSpacing: '0.14em' }}>DROP ZONE</span>
            <div style={{ flex: 1, height: '1px', background: border }} />
          </div>

          {pageState === 'default' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
              onClick={() => fileRef.current.click()}
              style={{
                background: dragOver ? 'rgba(119,153,123,0.04)' : surface,
                border: `2px dashed ${dragOver ? '#77997B' : isDark ? '#3A3220' : '#C8B99A'}`,
                borderRadius: '14px', padding: '48px 24px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(119,153,123,0.1)', border: '1px solid rgba(119,153,123,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>📁</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: '14px', fontWeight: '700', color: textPrimary, marginBottom: '8px' }}>Drag & drop your file here</div>
              <div style={{ fontSize: '13px', color: textMuted, fontWeight: '300', marginBottom: '20px' }}>or click to browse your computer</div>
              <button style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#77997B', background: 'rgba(119,153,123,0.1)', border: '1px solid rgba(119,153,123,0.3)', borderRadius: '8px', padding: '8px 18px', cursor: 'pointer', marginBottom: '16px' }}>
                BROWSE FILES
              </button>
              <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint }}>.pdf .docx .png .jpg .txt · Max 256 MB</div>
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
            </div>
          )}

          {pageState === 'processing' && (
            <div style={{ background: surface, border: `2px solid rgba(208,188,119,0.3)`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: surface2, border: `1px solid ${border}`, borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: 'rgba(208,188,119,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textPrimary }}>{fileName}</div>
                </div>
                <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#D0BC77' }}>Analyzing...</span>
              </div>
              <div style={{ height: '3px', background: border, borderRadius: '2px', marginBottom: '14px', overflow: 'hidden' }}>
                <div style={{ height: '3px', background: '#D0BC77', borderRadius: '2px', width: '50%' }} />
              </div>
              {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < steps.length - 1 ? `1px solid ${borderDim}` : 'none' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: stepColor(step.state), flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: stepColor(step.state) }}>{step.label}</span>
                </div>
              ))}
            </div>
          )}

          {pageState === 'error' && (
            <div style={{ background: surface, border: '2px dashed rgba(224,85,85,0.35)', borderRadius: '14px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#E05555', fontWeight: '700' }}>✕</div>
              <div style={{ fontFamily: 'Space Mono', fontSize: '13px', color: '#E05555', fontWeight: '700' }}>Upload failed</div>
              <div style={{ fontSize: '12px', color: textMuted, fontWeight: '300', lineHeight: '1.55' }}>We couldn't process this file. See the common reasons below and try again.</div>
              <div style={{ background: 'rgba(224,85,85,0.05)', border: '1px solid rgba(224,85,85,0.15)', borderRadius: '8px', padding: '14px 16px', width: '100%', textAlign: 'left' }}>
                {[['File too large.', ' Maximum file size is 256 MB.'], ['Unsupported format.', ' Some archive types require extraction first.'], ['Corrupted file.', ' The file may be incomplete or damaged.']].map(([b, r], i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '11px', color: textMuted, marginBottom: i < 2 ? '8px' : '0', fontWeight: '300' }}>
                    <span style={{ color: '#E05555' }}>→</span>
                    <span><span style={{ color: textPrimary, fontWeight: '500' }}>{b}</span>{r}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPageState('default')} style={{ fontFamily: 'Space Mono', fontSize: '11px', fontWeight: '700', color: '#0A0906', background: '#D0BC77', border: 'none', borderRadius: '8px', padding: '11px 0', width: '100%', cursor: 'pointer' }}>
                TRY AGAIN →
              </button>
            </div>
          )}
        </div>

        {/* Scan limits */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, letterSpacing: '0.14em' }}>SCAN LIMITS</span>
            <div style={{ flex: 1, height: '1px', background: border }} />
          </div>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '22px', marginBottom: '16px' }}>
            {limits.map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < limits.length - 1 ? `1px solid ${border}` : 'none' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textMuted }}>{k}</span>
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textPrimary }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: isDark ? 'rgba(208,188,119,0.05)' : 'rgba(45,122,110,0.12)', border: `1px solid ${isDark ? 'rgba(208,188,119,0.18)' : 'rgba(45,122,110,0.4)'}`, borderRadius: '12px', padding: '16px', display: 'flex', gap: '10px' }}>            <span style={{ fontSize: '15px', flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: '12px', color: textMuted, fontWeight: '300', lineHeight: '1.55' }}><span style={{ color: '#D0BC77', fontWeight: '500' }}>Files are never stored.</span> Uploaded files are analyzed in memory and immediately discarded. Only the scan result metadata is retained.</p>
          </div>
        </div>

        {/* Active engines */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: textFaint, letterSpacing: '0.14em' }}>ACTIVE ENGINES</span>
            <div style={{ flex: 1, height: '1px', background: border }} />
          </div>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: '14px', padding: '22px' }}>
            {engines.map(([name, status, color], i) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: i < engines.length - 1 ? `1px solid ${border}` : 'none' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: textPrimary, flex: 1 }}>{name}</span>
                <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '60px', borderTop: `1px solid ${border}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono', fontSize: '10px', color: textFaint }}>
        <span><span style={{ color: '#D0BC77' }}>Opulence</span> · Senior Design Project · Spring 2026</span>
        <span style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}`, borderRadius: '6px', padding: '3px 10px', color: textMuted }}>NSA GenCyber Partnership</span>
      </div>
    </div>
  )
}