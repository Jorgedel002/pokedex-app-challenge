import { Link } from 'react-router-dom'
import { Nav, NavItem, NavLabel } from './sidebarStyles'

const routes = [
  {
    to: '/',
    label: 'Pokédex',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m33.5,5.5H14.5c-4.9706,0-9,4.0294-9,9v19c0,4.9706,4.0294,9,9,9h19c4.9706,0,9-4.0294,9-9V14.5c0-4.9706-4.0294-9-9-9Z" />
        <circle cx="14.4839" cy="19.3723" r="7.25" />
        <circle cx="14.4839" cy="19.3723" r="4" />
        <path d="m42.4997,22.64h-12.7056s-2.605-.4277-5.5987,3.3826l-2.024,2.642c-2.9938,3.8102-5.5987,3.3826-5.5987,3.3826H5.5" strokeWidth="2" />
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
