import { Link } from 'react-router-dom'
import { Nav, NavItem, NavLabel } from './sidebarStyles'

const routes = [
  {
    to: '/',
    label: 'Pokédex',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/team',
    label: 'Teams',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/compare',
    label: 'Compare',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
  },
]

export default function SidebarNav({ expanded, activePath }) {
  return (
    <Nav>
      {routes.map(({ to, label, icon }) => (
        <NavItem
          as={Link}
          to={to}
          key={to}
          className={activePath === to ? 'active' : ''}
        >
          {icon}
          {expanded && <NavLabel>{label}</NavLabel>}
        </NavItem>
      ))}
    </Nav>
  )
}
