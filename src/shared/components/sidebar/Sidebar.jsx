import { useState, useLayoutEffect, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsOnline } from '../../connectionSlice'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import {
  SidebarContainer,
  MobileHeader,
  HamburgerButton,
  MobileLogo,
  Backdrop,
} from './sidebarStyles'
import SidebarHeader from './SidebarHeader'
import SidebarNav from './SidebarNav'

const EXPANDED_WIDTH = '200px'
const COLLAPSED_WIDTH = '70px'

export default function Sidebar() {
  const isOnline = useSelector(selectIsOnline)
  useOnlineStatus()
  const location = useLocation()
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const statusLabel = isOnline ? 'Online' : 'Offline'
  const dotStatus = isOnline ? 'fresh' : 'cached'

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH
    )
  }, [expanded])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <MobileHeader>
        <HamburgerButton onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </HamburgerButton>
        <MobileLogo>Pokédex</MobileLogo>
      </MobileHeader>

      <Backdrop $visible={mobileOpen} onClick={() => setMobileOpen(false)} />

      <SidebarContainer $expanded={expanded} $mobileOpen={mobileOpen}>
        <SidebarHeader
          expanded={expanded}
          onToggle={() => setExpanded((prev) => !prev)}
          dotStatus={dotStatus}
          statusLabel={statusLabel}
          isMobile={mobileOpen}
        />
        <SidebarNav expanded={mobileOpen ? true : expanded} activePath={location.pathname} />
      </SidebarContainer>
    </>
  )
}
