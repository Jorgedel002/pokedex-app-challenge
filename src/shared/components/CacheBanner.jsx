import styled from 'styled-components'

const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ $status, theme }) => {
    switch ($status) {
      case 'cached':
        return `
          background-color: ${theme.colors.warning}22;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}44;
        `
      case 'fetching':
        return `
          background-color: ${theme.colors.info}22;
          color: ${theme.colors.info};
          border: 1px solid ${theme.colors.info}44;
        `
      default:
        return ''
    }
  }}
`

const Spinner = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

export default function CacheBanner({ status }) {
  if (status === 'fresh' || status === 'loading' || status === 'unknown') return null

  if (status === 'cached') {
    return (
      <Banner $status="cached">
        ⚡ Sin conexión — Mostrando datos cacheados
      </Banner>
    )
  }

  if (status === 'fetching') {
    return (
      <Banner $status="fetching">
        <Spinner /> Actualizando datos…
      </Banner>
    )
  }

  return null
}
