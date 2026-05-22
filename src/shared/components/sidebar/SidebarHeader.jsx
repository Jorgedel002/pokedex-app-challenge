import { useLocation } from 'react-router-dom'
import PokeballIcon from './PokeballIcon'
import {
  SidebarHeaderWrapper,
  HeaderContent,
  PokeballButton,
  PokeballWrapper,
  Logo,
  StatusBadge,
  StatusDot,
} from './sidebarStyles'

export default function SidebarHeader({ expanded, onToggle, dotStatus, statusLabel, isMobile }) {
  const effectiveExpanded = isMobile ? true : expanded

  return (
    <SidebarHeaderWrapper>
      <HeaderContent $expanded={effectiveExpanded}>
        {effectiveExpanded ? (
          <>
            <PokeballButton onClick={isMobile ? undefined : onToggle} aria-label={isMobile ? undefined : "Colapsar sidebar"}>
              <Logo>Pokédex</Logo>
              <PokeballIcon />
            </PokeballButton>
            <StatusBadge>
              <StatusDot $status={dotStatus} />
              <span>{statusLabel}</span>
            </StatusBadge>
          </>
        ) : (
          <PokeballWrapper>
            <PokeballButton onClick={onToggle} aria-label="Expandir sidebar">
              <PokeballIcon />
            </PokeballButton>
            <StatusDot $status={dotStatus} />
          </PokeballWrapper>
        )}
      </HeaderContent>
    </SidebarHeaderWrapper>
  )
}
