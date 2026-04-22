import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'

const links = [
  { label: 'Home', path: '/' },
  { label: 'URL Analysis', path: '/url' },
  { label: 'File Upload', path: '/upload' },
]

export default function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  // Colors pulled from new NEXUS logo: sage/mint green + gold on deep charcoal
  const navBg      = isDark ? '#1C2B26' : '#FFFFFF'
  const navBorder  = isDark ? '#2E3D38' : '#DDE3DC'
  const titleColor = isDark ? '#F0EDE4' : '#1C2B26'
  const subColor   = isDark ? '#8A9E94' : '#6B7C72'
  const linkActive = isDark ? '#C9A84C' : '#8B6914'   // Gold from logo
  const linkInactive = isDark ? '#8A9E94' : '#5A6B60'
  const linkHover  = isDark ? '#E0C87A' : '#6B5010'

  return (
    <nav style={{
      height: '72px',
      background: navBg,
      borderBottom: `1px solid ${navBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 60px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img
            src="/NexusLogo.png"
            alt="NEXUS"
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontFamily: 'Space Mono', fontSize: '15px', fontWeight: '700', color: titleColor, letterSpacing: '0.06em' }}>
              NEXUS
            </div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: subColor, marginTop: '-1px' }}>
              Malicious File Analyzer
            </div>
          </div>
        </div>

        {/* Centered nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {links.map(link => {
            const isActive = location.pathname === link.path
            return (
              <span
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  fontFamily: 'DM Sans',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  color: isActive ? linkActive : linkInactive,
                  borderBottom: isActive ? `2px solid ${linkActive}` : '2px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = linkHover }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = linkInactive }}
              >
                {link.label}
              </span>
            )
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle light/dark mode"
          style={{
            background: isDark ? '#2E3D38' : '#F0EDE4',
            border: `1px solid ${navBorder}`,
            borderRadius: '8px',
            padding: '8px 18px',
            cursor: 'pointer',
            fontFamily: 'DM Sans',
            fontSize: '14px',
            fontWeight: '500',
            color: isDark ? '#F0EDE4' : '#1C2B26',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#3A4E46' : '#E0DDD4'}
          onMouseLeave={e => e.currentTarget.style.background = isDark ? '#2E3D38' : '#F0EDE4'}
        >
          {isDark ? '☀️' : '🌙'}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  )
}