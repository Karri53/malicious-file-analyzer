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

  const navBg = isDark ? '#243530' : '#FFFFFF'
  const navBorder = isDark ? '#3A4A42' : '#D4D9CE'
  const logoBox = isDark ? '#3A4A42' : '#F5F5F0'
  const logoBoxBorder = isDark ? '#4A5A52' : '#C9B896'
  const titleColor = isDark ? '#E8EDE9' : '#2C3E35'
  const subtitleColor = isDark ? '#9FACA3' : '#5A6B5C'
  const linkActive = isDark ? '#8FAA96' : '#7BA888'
  const linkInactive = isDark ? '#9FACA3' : '#5A6B5C'
  const linkHover = isDark ? '#A4BCA9' : '#6A9777'

  return (
    <nav style={{
      height: '72px',
      background: navBg,
      borderBottom: `1px solid ${navBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 120px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>

        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img 
            src="/OpulenceLogo.png" 
            alt="Team Opulence Logo" 
            style={{ 
              width: '40px', 
              height: 'auto',
              objectFit: 'contain',
              flexShrink: 0
            }} 
          />
          <div>
            <div style={{
              fontFamily: 'Space Mono',
              fontSize: '14px',
              fontWeight: '700',
              color: titleColor,
              letterSpacing: '0.02em'
            }}>NEXUS</div>
            <div style={{
              fontFamily: 'DM Sans',
              fontSize: '10px',
              color: subtitleColor,
              marginTop: '-2px'
            }}>Malicious File Analyzer</div>
          </div>
        </div>

        {/* Centered Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          {links.map(link => (
            <span
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                fontFamily: 'DM Sans',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: location.pathname === link.path ? linkActive : linkInactive,
                transition: 'color 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => {
                if (location.pathname !== link.path) e.target.style.color = linkHover
              }}
              onMouseLeave={e => {
                if (location.pathname !== link.path) e.target.style.color = linkInactive
              }}
            >
              {link.label}
            </span>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: isDark ? '#3A4A42' : '#F5F5F0',
            border: `1px solid ${navBorder}`,
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: 'DM Sans',
            fontSize: '13px',
            fontWeight: '500',
            color: isDark ? '#E8EDE9' : '#2C3E35',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = isDark ? '#4A5A52' : '#E8EDE9'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = isDark ? '#3A4A42' : '#F5F5F0'
          }}
        >
          {isDark ? '☀️' : '🌙'}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  )
}