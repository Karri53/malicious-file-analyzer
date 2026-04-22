import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Footer from '../components/Footer'

const analysisTypes = [
  {
    icon: '✉️',
    title: 'Email Analysis',
    desc: 'Forward suspicious emails to our scanner. We extract and analyze all attachments in an isolated sandbox.',
    cta: 'Start Email Analysis',
    path: '/email',
    accent: '#D49A4A', // Warm amber
  },
  {
    icon: '🔗',
    title: 'URL Analysis',
    desc: 'Paste a suspicious link. We fetch and analyze the remote file without it touching your machine.',
    cta: 'Analyze URL',
    path: '/url',
    accent: '#4A8B8B', // Teal
  },
  {
    icon: '📁',
    title: 'File Upload',
    desc: 'Upload any file directly for comprehensive static and dynamic malware analysis.',
    cta: 'Upload File',
    path: '/upload',
    accent: '#5C9A73', // Vibrant sage
  },
]

const howItWorksSteps = [
  {
    num: '01',
    title: 'Submit',
    desc: 'Upload a file, paste a URL, or forward an email to our scanner',
  },
  {
    num: '02',
    title: 'Analyze',
    desc: 'Multi-engine scanning, static analysis, and behavioral detection',
  },
  {
    num: '03',
    title: 'Report',
    desc: 'Get detailed threat intelligence with indicators of compromise',
  },
]

function getScoreColor(score, isDark) {
  if (score >= 70) return isDark ? '#E89090' : '#C96B6B'
  if (score >= 31) return isDark ? '#F0B76F' : '#D49A4A'
  return isDark ? '#6FBF88' : '#5C9A73'
}

function getStatus(score) {
  if (score >= 70) return 'MALICIOUS'
  if (score >= 31) return 'WARNING'
  return 'CLEAN'
}

function getBadgeStyle(status, isDark) {
  if (status === 'MALICIOUS')
    return {
      color: isDark ? '#E89090' : '#C96B6B',
      background: isDark ? 'rgba(232,144,144,0.2)' : 'rgba(201,107,107,0.15)',
      border: isDark ? '1px solid rgba(232,144,144,0.4)' : '1px solid rgba(201,107,107,0.3)'
    }
  if (status === 'WARNING')
    return {
      color: isDark ? '#F0B76F' : '#D49A4A',
      background: isDark ? 'rgba(240,183,111,0.2)' : 'rgba(212,154,74,0.15)',
      border: isDark ? '1px solid rgba(240,183,111,0.4)' : '1px solid rgba(212,154,74,0.3)'
    }
  return {
    color: isDark ? '#6FBF88' : '#5C9A73',
    background: isDark ? 'rgba(111,191,136,0.2)' : 'rgba(92,154,115,0.15)',
    border: isDark ? '1px solid rgba(111,191,136,0.4)' : '1px solid rgba(92,154,115,0.3)'
  }
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Home() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [recentScans, setRecentScans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/results/recent')
        setRecentScans(res.data.scans || [])
      } catch (err) {
        console.error('Failed to fetch recent scans:', err)
        setRecentScans([])
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [])

  const bg = isDark ? '#1A2520' : '#F5F5F0'
  const surface = isDark ? '#243530' : '#FFFFFF'
  const border = isDark ? '#3A4A42' : '#D4D9CE'
  const text = isDark ? '#E8EDE9' : '#2C3E35'
  const textMuted = isDark ? '#9FACA3' : '#5A6B5C'
  const textFaint = isDark ? '#6B7B70' : '#8B9C8D'
  const primary = isDark ? '#6FBF88' : '#5C9A73'
  const accent = isDark ? '#E0C58F' : '#B8935F'
  const rowHover = isDark ? '#2C3E38' : '#FAFAF8'

  const handleRowClick = (scan) => {
    const score = Math.round((scan.malicious_score || 0) * 100)
    navigate('/results', {
      state: {
        filename: scan.filename,
        meta: `${formatBytes(scan.file_size_bytes)} · ${scan.file_type || 'Unknown'} · ${scan.source_method || 'Upload'}`,
        score,
        file_type: scan.file_type,
        file_size: formatBytes(scan.file_size_bytes),
        scan_time: scan.analysis_duration_seconds
          ? `${scan.analysis_duration_seconds.toFixed(2)}s`
          : '—',
        scanned:
          scan.upload_timestamp && scan.upload_timestamp !== 'mock_timestamp'
            ? new Date(scan.upload_timestamp).toLocaleString()
            : '—',
        indicators: {},
      },
    })
  }

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <div style={{ padding: '60px 120px 0' }}>
        
        {/* Hero Section - Compact */}
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 60px'
        }}>
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isDark ? 'rgba(111,191,136,0.2)' : 'rgba(92,154,115,0.15)',
            border: isDark ? '1px solid rgba(111,191,136,0.4)' : '1px solid rgba(92,154,115,0.3)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: primary,
              boxShadow: `0 0 8px ${primary}`
            }} />
            <span style={{
              fontFamily: 'DM Sans',
              fontSize: '12px',
              fontWeight: '600',
              color: primary,
              letterSpacing: '0.05em'
            }}>SYSTEM OPERATIONAL</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontFamily: 'Space Mono',
            fontSize: '48px',
            fontWeight: '700',
            color: text,
            lineHeight: '1.1',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            NEXUS
          </h1>
          
          {/* Subtitle */}
          <p style={{
            fontFamily: 'DM Sans',
            fontSize: '18px',
            fontWeight: '600',
            color: primary,
            marginBottom: '12px',
            letterSpacing: '0.01em'
          }}>
            Advanced Static Analysis & Threat Intelligence
          </p>

          {/* Description */}
          <p style={{
            fontFamily: 'DM Sans',
            fontSize: '15px',
            color: textMuted,
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Enterprise-grade malware detection powered by multi-engine scanning, 
            static analysis, and behavioral threat intelligence.
          </p>
        </div>

        {/* How It Works Section - FIRST */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontFamily: 'Space Mono',
            fontSize: '14px',
            fontWeight: '700',
            color: textFaint,
            letterSpacing: '0.1em',
            textAlign: 'center',
            marginBottom: '32px'
          }}>HOW IT WORKS</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {howItWorksSteps.map((step, i) => (
              <div key={i} style={{
                textAlign: 'center',
                position: 'relative'
              }}>
                {/* Connector Line */}
                {i < howItWorksSteps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '28px',
                    left: '50%',
                    width: 'calc(100% + 32px)',
                    height: '2px',
                    background: border,
                    zIndex: 0
                  }} />
                )}

                {/* Step Number */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: surface,
                  border: `2px solid ${primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Space Mono',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: primary,
                  margin: '0 auto 16px',
                  position: 'relative',
                  zIndex: 1
                }}>{step.num}</div>

                {/* Step Title */}
                <div style={{
                  fontFamily: 'Space Mono',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: text,
                  marginBottom: '8px'
                }}>{step.title}</div>

                {/* Step Description */}
                <p style={{
                  fontFamily: 'DM Sans',
                  fontSize: '14px',
                  color: textMuted,
                  lineHeight: '1.6'
                }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Choose Analysis Type Section - SECOND */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontFamily: 'Space Mono',
            fontSize: '14px',
            fontWeight: '700',
            color: textFaint,
            letterSpacing: '0.1em',
            textAlign: 'center',
            marginBottom: '32px'
          }}>CHOOSE ANALYSIS TYPE</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {analysisTypes.map((type, i) => (
              <div
                key={i}
                onClick={() => navigate(type.path)}
                role="button"
                tabIndex={0}
                aria-label={`Start ${type.title}`}
                style={{
                  background: surface,
                  border: `2px solid ${border}`,
                  borderRadius: '16px',
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.borderColor = type.accent
                  e.currentTarget.style.boxShadow = isDark
                    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${type.accent}`
                    : `0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px ${type.accent}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = border
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(type.path)
                  }
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  background: isDark ? `${type.accent}25` : `${type.accent}18`,
                  border: `1px solid ${type.accent}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '20px'
                }}>{type.icon}</div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Space Mono',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: text,
                  marginBottom: '12px'
                }}>{type.title}</h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'DM Sans',
                  fontSize: '14px',
                  color: textMuted,
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  flex: 1
                }}>{type.desc}</p>

                {/* CTA */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'DM Sans',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: type.accent,
                  letterSpacing: '0.02em'
                }}>
                  {type.cta}
                  <span style={{ fontSize: '18px' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scans Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: 'Space Mono',
            fontSize: '14px',
            fontWeight: '700',
            color: textFaint,
            letterSpacing: '0.1em',
            marginBottom: '24px'
          }}>RECENT SCANS</h2>

          <div style={{
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 80px 100px 120px 90px 90px',
              gap: '16px',
              padding: '16px 24px',
              background: isDark ? '#2C3E38' : '#FAFAF8',
              borderBottom: `1px solid ${border}`
            }}>
              {['FILE NAME', 'TYPE', 'SCORE', 'SEVERITY', 'STATUS', 'SIZE'].map((h, i) => (
                <span
                  key={h}
                  style={{
                    fontFamily: 'DM Sans',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: textFaint,
                    letterSpacing: '0.08em',
                    textAlign: i >= 2 ? 'center' : 'left'
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div style={{
                padding: '48px',
                textAlign: 'center',
                fontFamily: 'DM Sans',
                fontSize: '14px',
                color: textMuted
              }}>
                Loading recent scans...
              </div>
            )}

            {/* Empty State */}
            {!loading && recentScans.length === 0 && (
              <div style={{
                padding: '48px',
                textAlign: 'center',
                fontFamily: 'DM Sans',
                fontSize: '14px',
                color: textMuted
              }}>
                No recent scans found
              </div>
            )}

            {/* Rows */}
            {!loading &&
              recentScans.map((scan, i) => {
                const score = Math.round((scan.malicious_score || 0) * 100)
                const status = getStatus(score)
                const badgeStyle = getBadgeStyle(status, isDark)

                return (
                  <div
                    key={scan.scan_id || i}
                    onClick={() => handleRowClick(scan)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View scan results for ${scan.filename}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 80px 100px 120px 90px 90px',
                      gap: '16px',
                      padding: '16px 24px',
                      borderBottom:
                        i < recentScans.length - 1 ? `1px solid ${border}` : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleRowClick(scan)
                      }
                    }}
                  >
                    <div>
                      <div style={{
                        fontFamily: 'DM Sans',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: text
                      }}>
                        {scan.filename}
                      </div>
                      <div style={{
                        fontFamily: 'DM Sans',
                        fontSize: '11px',
                        color: textFaint,
                        marginTop: '2px'
                      }}>
                        {scan.source_method || 'upload'}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'DM Sans',
                      fontSize: '12px',
                      color: textMuted,
                      alignSelf: 'center'
                    }}>
                      {scan.file_type || '—'}
                    </span>
                    <span style={{
                      fontFamily: 'Space Mono',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: getScoreColor(score, isDark),
                      textAlign: 'center',
                      alignSelf: 'center'
                    }}>
                      {score}
                    </span>
                    <span style={{
                      fontFamily: 'DM Sans',
                      fontSize: '11px',
                      color: textMuted,
                      textAlign: 'center',
                      alignSelf: 'center'
                    }}>
                      {scan.severity || '—'}
                    </span>
                    <div style={{ textAlign: 'center', alignSelf: 'center' }}>
                      <span style={{
                        fontFamily: 'DM Sans',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        letterSpacing: '0.05em',
                        ...badgeStyle
                      }}>
                        {status}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'DM Sans',
                      fontSize: '12px',
                      color: textFaint,
                      textAlign: 'right',
                      alignSelf: 'center'
                    }}>
                      {formatBytes(scan.file_size_bytes)}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}