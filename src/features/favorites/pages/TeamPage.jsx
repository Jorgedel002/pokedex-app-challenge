import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { selectTeam, removeFavorite, reorderTeam } from '../favoritesSlice'
import { TypeBadge, formatPokemonId, capitalizeName } from '../../../shared/utils/pokemonHelpers'
import { toast } from 'react-toastify'
import EmptyState from '../../../shared/components/EmptyState'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const SlotCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  position: relative;
  transition: box-shadow 0.2s;
  ${({ $isDragging }) =>
    $isDragging &&
    `box-shadow: 0 8px 24px rgba(0,0,0,0.6); opacity: 0.9;`}
`

const EmptySlot = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border: 2px dashed ${({ theme }) => theme.colors.surfaceHover};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
`

const EmptyIcon = styled.span`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const Sprite = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  image-rendering: pixelated;
  margin: 0 auto;
`

const PlaceholderCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #A8A87844, #A8A87822);
  border: 2px dashed #A8A87866;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
`

const Name = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const TypesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const RemoveButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`

const DragHandle = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  cursor: grab;
`

function SortableCard({ pokemon, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pokemon.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <SlotCard $isDragging={isDragging}>
        <DragHandle {...listeners}>⠿</DragHandle>
        <RemoveButton onClick={() => onRemove(pokemon.id)}>✕</RemoveButton>
        {pokemon.sprite ? (
          <Sprite src={pokemon.sprite} alt={pokemon.name} />
        ) : (
          <PlaceholderCircle />
        )}
        <Name>{capitalizeName(pokemon.name)}</Name>
        <TypesRow>
          {pokemon.types?.map((t) => (
            <TypeBadge key={t} $type={t}>{t}</TypeBadge>
          ))}
        </TypesRow>
        <span style={{ color: '#A0A0B0', fontSize: '0.8rem' }}>
          {formatPokemonId(pokemon.id)}
        </span>
      </SlotCard>
    </div>
  )
}

export default function TeamPage() {
  const dispatch = useDispatch()
  const team = useSelector(selectTeam)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      dispatch(reorderTeam({ activeId: active.id, overId: over.id }))
    }
  }

  const handleRemove = (id) => {
    const pokemon = team.find((p) => p.id === id)
    dispatch(removeFavorite(id))
    if (pokemon) {
      toast.info(`${capitalizeName(pokemon.name)} removido del equipo`)
    }
  }

  const emptySlots = 6 - team.length

  if (team.length === 0) {
    return (
      <Container>
        <EmptyState
          title="Tu equipo está vacío"
          description="Agregá Pokémon a tu equipo desde el listado"
          actionLabel="Explorar Pokémon"
          actionTo="/"
        />
      </Container>
    )
  }

  return (
    <Container>
      <Title>Mi Equipo</Title>
      <Subtitle>6 Pokémon máximo · Arrastrá para reordenar</Subtitle>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={team.map((p) => p.id)} strategy={rectSortingStrategy}>
          <TeamGrid>
            {team.map((pokemon) => (
              <SortableCard
                key={pokemon.id}
                pokemon={pokemon}
                onRemove={handleRemove}
              />
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <EmptySlot key={`empty-${i}`}>
                <EmptyIcon>+</EmptyIcon>
                <EmptyText>
                  <Link to="/" style={{ color: 'inherit' }}>Agregar Pokémon</Link>
                </EmptyText>
              </EmptySlot>
            ))}
          </TeamGrid>
        </SortableContext>
      </DndContext>
    </Container>
  )
}
