import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, removeFavorite, selectIsInTeam, selectTeamFull } from '../../favorites/favoritesSlice'
import { TypeBadge, formatPokemonId, capitalizeName, typeColorMap } from '../../../shared/utils/pokemonHelpers'
import { toast } from 'react-toastify'

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;
  position: relative;
  border: 2px solid transparent;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ $typeColor, theme }) => $typeColor || theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.elevation};
    transform: translateY(-2px);
  }
`

const SpriteWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Sprite = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
`

const PlaceholderSprite = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ $typeColor }) => $typeColor || '#A8A878'}44, ${({ $typeColor }) => $typeColor || '#A8A878'}22);
  border: 2px dashed ${({ $typeColor }) => $typeColor || '#A8A878'}66;
`

const Name = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const Id = styled.span`
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const TypesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const FavButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  font-size: 1.4rem;
  color: ${({ $isFav, theme }) =>
    $isFav ? theme.colors.accent : theme.colors.textSecondary};
  transition: transform 0.2s, color 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`

export default function PokemonCard({ pokemon }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isInTeam = useSelector((state) => selectIsInTeam(state, pokemon.id))
  const teamFull = useSelector(selectTeamFull)

  const mainType = pokemon.types?.[0]?.type?.name || 'normal'
  const typeColor = typeColorMap[mainType]

  const handleFavToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInTeam) {
      dispatch(removeFavorite(pokemon.id))
      toast.info(`${capitalizeName(pokemon.name)} removido del equipo`)
    } else if (teamFull) {
      toast.warning('¡Equipo lleno! Máximo 6 Pokémon')
    } else {
      dispatch(addFavorite({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites?.front_default,
        types: pokemon.types?.map((t) => t.type.name),
      }))
      toast.success(`¡${capitalizeName(pokemon.name)} agregado al equipo!`)
    }
  }

  const handleCardClick = () => {
    navigate(`/pokemon/${pokemon.id}`)
  }

  return (
    <Card $typeColor={typeColor} onClick={handleCardClick}>
      <FavButton $isFav={isInTeam} onClick={handleFavToggle} aria-label="Toggle favorite">
        {isInTeam ? '❤️' : '🤍'}
      </FavButton>
      <SpriteWrapper>
        {pokemon.sprites?.front_default ? (
          <Sprite
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            loading="lazy"
          />
        ) : (
          <PlaceholderSprite $typeColor={typeColor} />
        )}
      </SpriteWrapper>
      <Name>{capitalizeName(pokemon.name)}</Name>
      <Id>{formatPokemonId(pokemon.id)}</Id>
      <TypesRow>
        {pokemon.types?.map(({ type }) => (
          <TypeBadge key={type.name} $type={type.name}>
            {type.name}
          </TypeBadge>
        ))}
      </TypesRow>
    </Card>
  )
}
