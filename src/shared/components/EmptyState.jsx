import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  text-align: center;
`

const Illustration = styled.svg`
  width: 120px;
  height: 120px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.4;
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 400px;
`

const ActionLink = styled(Link)`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadii.md};
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
    color: white;
  }
`

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <Wrapper>
      <Illustration viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="5" x2="60" y2="115" stroke="currentColor" strokeWidth="4" />
        <line x1="5" y1="60" x2="115" y2="60" stroke="currentColor" strokeWidth="4" />
        <circle cx="60" cy="60" r="18" stroke="currentColor" strokeWidth="4" />
        <circle cx="60" cy="60" r="8" fill="currentColor" />
        <path d="M5 60 Q 30 40, 60 5" stroke="currentColor" strokeWidth="2" opacity="0.3" />
        <path d="M60 115 Q 90 80, 115 60" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      </Illustration>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {actionLabel && actionTo && (
        <ActionLink to={actionTo}>{actionLabel}</ActionLink>
      )}
    </Wrapper>
  )
}
