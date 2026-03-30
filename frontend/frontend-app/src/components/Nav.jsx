import { useNavigate, useLocation } from 'react-router-dom'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Email Analysis', path: '/email' },
  { label: 'URL Analysis', path: '/url' },
  { label: 'File Upload', path: '/upload' },
]

export default function Nav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      height: '64px', background: '#111009',
      borderBottom: '1px solid #252015',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 120px', position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#181510', border: '1px solid #252015', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: 'Space Mono', color: '#D0BC77', fontWeight: '700' }}>OP</div>
        <span style={{ fontFamily: 'Space Mono', fontSize: '13px', color: '#EEE8D5' }}>
          Malicious File Analyzer <span style={{ color: '#7A7260' }}>/ Opulence</span>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {links.map(link => (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              fontFamily: 'DM Sans', fontSize: '13px', cursor: 'pointer',
              color: location.pathname === link.path ? '#D0BC77' : '#7A7260',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => { if (location.pathname !== link.path) e.target.style.color = '#EDEDCD' }}
            onMouseLeave={e => { if (location.pathname !== link.path) e.target.style.color = '#7A7260' }}
          >
            {link.label}
          </span>
        ))}
      </div>
    </nav>
  )
}