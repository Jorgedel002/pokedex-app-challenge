import { useParams } from 'react-router-dom'
import { useGetDetailQuery, useGetSpeciesQuery } from '../../../api/pokemonApi'
import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, removeFavorite, selectIsInTeam, selectTeamFull } from '../../favorites/favoritesSlice'
import { TypeBadge, formatPokemonId, capitalizeName, typeColorMap } from '../../../shared/utils/pokemonHelpers'
import { toast } from 'react-toastify'
import Skeleton from '../../../shared/components/Skeleton'
import CacheBanner from '../../../shared/components/CacheBanner'
import { useCacheStatus } from '../../../shared/hooks/useCacheStatus'
import styled from 'styled-components'

const statColorMap = {
  hp: '#FF5959', attack: '#F5AC78', defense: '#FAE078',
  'special-attack': '#9DB7F5', 'special-defense': '#A7DB8D', speed: '#FA92B2',
}

const Hero = styled.div`
  background: linear-gradient(180deg, ${({ $typeColor }) => $typeColor || '#A8A878'}44 0%, ${({ theme }) => theme.colors.background} 100%);
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const HeroSprite = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  image-rendering: pixelated;
`

const HeroName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`

const HeroId = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const TypesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const FavButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ $isFav, theme }) => $isFav ? theme.colors.accent : theme.colors.surface};
  color: ${({ $isFav }) => $isFav ? '#fff' : 'inherit'};
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }
`

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.accent};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`

const SpritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const SpriteItem = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  padding: ${({ theme }) => theme.spacing.sm};
`

const SpriteImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  image-rendering: pixelated;
`

const SpriteLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const StatRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.md};
`

const StatName = styled.span`
  width: 120px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const StatBar = styled.div`
  flex: 1;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.sm};
  overflow: hidden;
`

const StatFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ $color }) => $color}, ${({ $color }) => $color}aa);
  border-radius: ${({ theme }) => theme.borderRadii.sm};
  transition: width 0.8s ease;
  width: ${({ $width }) => $width}%;
`

const StatValue = styled.span`
  width: 40px;
  text-align: right;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  padding: ${({ theme }) => theme.spacing.lg};
`

const InfoCardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.accent};
`

const InfoItem = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const AbilityList = styled.ul`
  list-style: none;
  padding: 0;
`

const AbilityItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  text-transform: capitalize;

  &:last-child {
    border-bottom: none;
  }
`

export default function PokemonDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const isInTeam = useSelector((state) => selectIsInTeam(state, Number(id)))
  const teamFull = useSelector(selectTeamFull)

  const detailQuery = useGetDetailQuery(id)
  const { data: pokemon, isLoading, error } = detailQuery
  const { data: species } = useGetSpeciesQuery(id, { skip: !id })
  const cacheStatus = useCacheStatus(detailQuery)

  if (error) {
    return (
      <Hero>
        <h2>Error al cargar el Pokémon</h2>
        <p>Intentá de nuevo más tarde</p>
      </Hero>
    )
  }

  if (isLoading || !pokemon) {
    return (
      <Hero>
        <Skeleton circle width={200} height={200} />
        <Skeleton width="50%" height={40} style={{ marginTop: 16 }} />
        <Skeleton width="30%" height={24} />
      </Hero>
    )
  }

  const mainType = pokemon.types?.[0]?.type?.name || 'normal'
  const typeColor = typeColorMap[mainType]

  const handleFavToggle = () => {
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

  const spriteEntries = Object.entries(pokemon.sprites || {}).reduce((acc, [key, val]) => {
    if (typeof val === 'string' && val) acc.push({ key, url: val })
    return acc
  }, [])

  const generation = species?.generation?.name?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <>
      <CacheBanner status={cacheStatus} />
      <Hero $typeColor={typeColor}>
        <HeroSprite src={pokemon.sprites?.front_default} alt={pokemon.name} />
        <HeroName>{capitalizeName(pokemon.name)}</HeroName>
        <HeroId>{formatPokemonId(pokemon.id)}</HeroId>
        <TypesRow>
          {pokemon.types?.map(({ type }) => (
            <TypeBadge key={type.name} $type={type.name}>{type.name}</TypeBadge>
          ))}
        </TypesRow>
        <FavButton $isFav={isInTeam} onClick={handleFavToggle}>
          {isInTeam ? '❤️ En el equipo' : '🤍 Agregar al equipo'}
        </FavButton>
      </Hero>

      <Section>
        <SectionTitle>Sprites</SectionTitle>
        <SpritesGrid>
          {spriteEntries.map(({ key, url }) => (
            <SpriteItem key={key}>
              <SpriteImg src={url} alt={key} />
              <SpriteLabel>{key.replace(/_/g, ' ')}</SpriteLabel>
            </SpriteItem>
          ))}
        </SpritesGrid>
      </Section>

      <Section>
        <SectionTitle>Stats Base</SectionTitle>
        {pokemon.stats?.map(({ stat, base_stat }) => (
          <StatRow key={stat.name}>
            <StatName>{stat.name.replace('-', ' ')}</StatName>
            <StatBar>
              <StatFill
                $color={statColorMap[stat.name] || '#888'}
                $width={(base_stat / 255) * 100}
              />
            </StatBar>
            <StatValue>{base_stat}</StatValue>
          </StatRow>
        ))}
      </Section>

      <InfoGrid>
        <InfoCard>
          <InfoCardTitle>Habilidades</InfoCardTitle>
          <AbilityList>
            {pokemon.abilities?.map(({ ability, is_hidden }) => (
              <AbilityItem key={ability.name}>
                {capitalizeName(ability.name)}
                {is_hidden && ' (oculta)'}
              </AbilityItem>
            ))}
          </AbilityList>
        </InfoCard>
        <InfoCard>
          <InfoCardTitle>Datos Físicos</InfoCardTitle>
          <InfoItem>📏 Altura: {(pokemon.height / 10).toFixed(1)} m</InfoItem>
          <InfoItem>⚖️ Peso: {(pokemon.weight / 10).toFixed(1)} kg</InfoItem>
          {generation && <InfoItem>🧬 Generación: {generation}</InfoItem>}
        </InfoCard>
      </InfoGrid>
    </>
  )
}
