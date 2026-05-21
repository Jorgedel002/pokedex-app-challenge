import styled from 'styled-components'

export const typeColorMap = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  steel: '#B8B8D0',
  normal: '#A8A878',
}

export const TypeBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  text-transform: capitalize;
  color: #fff;
  background-color: ${({ $type }) => typeColorMap[$type] || '#A8A878'};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
`

export const formatPokemonId = (id) => `#${String(id).padStart(3, '0')}`

export const capitalizeName = (name) =>
  name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
