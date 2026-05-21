import styled, { css } from 'styled-components'

export const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 2px solid ${({ theme }) => theme.colors.surfaceHover};
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, transform 0.3s ease;
  width: ${({ $expanded }) => ($expanded ? '200px' : '70px')};
  z-index: 100;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 240px;
    transform: translateX(-100%);
    ${({ $mobileOpen }) => $mobileOpen && 'transform: translateX(0);'}
  }
`

export const MobileHeader = styled.header`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 2px solid ${({ theme }) => theme.colors.surfaceHover};
  z-index: 90;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`

export const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadii.sm};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

export const MobileLogo = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
`

export const Backdrop = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ $visible }) => $visible && 'display: block;'}
  }
`

export const SidebarHeaderWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: ${({ $expanded }) => ($expanded ? 'flex-start' : 'center')};
`

export const PokeballButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s;

  svg {
    width: 40px;
    height: 40px;
    transition: fill 0.2s;
  }

  &:hover svg {
    fill: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const PokeballWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Logo = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case 'fresh': return theme.colors.success
      case 'cached': return theme.colors.warning
      case 'fetching': return theme.colors.info
      default: return theme.colors.error
    }
  }};
  ${({ $status }) =>
    $status === 'fresh' &&
    css`
      animation: pulse 2s infinite;
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}
`

export const Nav = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const NavItem = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  border-left: 3px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.accent}22;
    color: ${({ theme }) => theme.colors.textPrimary};
    border-left-color: ${({ theme }) => theme.colors.accent};
  }

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`

export const NavLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`
