import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Email Analysis', path: '/email' },
  { label: 'URL Analysis', path: '/url' },
  { label: 'File Upload', path: '/upload' },
]

export default function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  const navBg       = isDark ? '#111009' : '#2D7A6E'
  const navBorder   = isDark ? '#252015' : '#236B60'
  const logoBox     = isDark ? '#181510' : '#236B60'
  const logoBoxBorder = isDark ? '#252015' : '#1A5A50'
  const titleColor  = isDark ? '#EEE8D5' : '#F5F0E8'
  const subtitleColor = isDark ? '#7A7260' : 'rgba(245,240,232,0.6)'
  const linkActive  = isDark ? '#D0BC77' : '#F5F0E8'
  const linkInactive = isDark ? '#7A7260' : 'rgba(245,240,232,0.65)'
  const linkHover   = isDark ? '#EDEDCD' : '#FFFFFF'

  return (
    <nav style={{
      height: '64px',
      background: navBg,
      borderBottom: `1px solid ${navBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 120px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: logoBox, border: `1px solid ${logoBoxBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: 'Space Mono', color: '#D0BC77', fontWeight: '700' }}>OP</div>
        <span style={{ fontFamily: 'Space Mono', fontSize: '13px', color: titleColor }}>
          Malicious File Analyzer <span style={{ color: subtitleColor }}>/ Opulence</span>
        </span>
      </div>

      {/* Links + Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {links.map(link => (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              fontFamily: 'DM Sans', fontSize: '13px', cursor: 'pointer',
              color: location.pathname === link.path ? linkActive : linkInactive,
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => { if (location.pathname !== link.path) e.target.style.color = linkHover }}
            onMouseLeave={e => { if (location.pathname !== link.path) e.target.style.color = linkInactive }}
          >
            {link.label}
          </span>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: isDark ? '#252015' : 'rgba(255,255,255,0.15)',
            border: `1px solid ${isDark ? '#4A4535' : 'rgba(255,255,255,0.3)'}`,
            borderRadius: '20px',
            padding: '6px 14px',
            cursor: 'pointer',
            fontFamily: 'DM Sans',
            fontSize: '11px',
            color: isDark ? '#D0BC77' : '#F5F0E8',
          }}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

    </nav>
  )
}