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

export default function SidebarHeader({ expanded, onToggle, dotStatus, statusLabel }) {
  return (
    <SidebarHeaderWrapper>
      <HeaderContent $expanded={expanded}>
        {expanded ? (
          <>
            <PokeballButton onClick={onToggle} aria-label="Colapsar sidebar">
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
