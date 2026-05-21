import styled from 'styled-components'
import Skeleton from '../../../shared/components/Skeleton'

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default function PokemonCardSkeleton() {
  return (
    <Card>
      <Skeleton circle width={120} height={120} />
      <Skeleton width="60%" height={20} style={{ marginTop: 8 }} />
      <Skeleton width="40%" height={16} style={{ marginTop: 4 }} />
      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        <Skeleton width={60} height={20} borderRadius={12} />
        <Skeleton width={60} height={20} borderRadius={12} />
      </div>
    </Card>
  )
}
