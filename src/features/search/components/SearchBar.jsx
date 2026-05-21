import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { useGetTypesQuery, useGetGenerationsQuery } from '../../../api/pokemonApi'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { typeColorMap } from '../../../shared/utils/pokemonHelpers'

const Bar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`

const SearchInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 48px);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.md};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const FilterToggleButton = styled.button`
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.surface};
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ $active, theme }) =>
      $active ? 'white' : theme.colors.accent};
  }

  svg {
    width: 16px;
    height: 16px;
  }

  .btn-label {
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none;
    }
  }
`

const FilterPanel = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

const FilterLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const ClearButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    color: white;
  }
`

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FilterChip = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  color: #fff;
  background-color: ${({ $color, theme }) => $color || theme.colors.accent};
  border: none;
  cursor: pointer;
  text-transform: capitalize;

  &:hover {
    opacity: 0.8;
  }
`

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const q = searchParams.get('q') || ''
  const type = searchParams.get('type') || ''
  const gen = searchParams.get('gen') || ''

  const { data: typesData } = useGetTypesQuery()
  const { data: gensData } = useGetGenerationsQuery()

  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(updates).forEach(([key, value]) => {
          if (value) {
            next.set(key, value)
          } else {
            next.delete(key)
          }
        })
        return next
      })
    },
    [setSearchParams]
  )

  const [inputValue, setInputValue] = useState(q)
  const debouncedSearch = useDebounce(inputValue, 300)

  useEffect(() => {
    if (debouncedSearch !== q) {
      updateParams({ q: debouncedSearch })
    }
  }, [debouncedSearch, q, updateParams])

  const handleTypeChange = (e) => {
    updateParams({ type: e.target.value })
  }

  const handleGenChange = (e) => {
    updateParams({ gen: e.target.value })
  }

  const handleClear = () => {
    setInputValue('')
    setSearchParams({})
    setFiltersOpen(false)
  }

  const hasFilters = type || gen
  const hasAnyFilters = q || type || gen

  return (
    <>
      <Bar>
        <SearchInputWrapper>
          <SearchInput
            type="text"
            placeholder="Buscar Pokémon por nombre..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <FilterToggleButton
            $active={hasFilters}
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-label="Filtros"
            aria-expanded={filtersOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            <span className="btn-label">Filtros</span>
          </FilterToggleButton>
        </SearchInputWrapper>
      </Bar>

      {filtersOpen && (
        <FilterPanel>
          <FilterGroup>
            <FilterLabel>Tipo:</FilterLabel>
            <Select value={type} onChange={handleTypeChange}>
              <option value="">Todos</option>
              {typesData?.results?.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                </option>
              ))}
            </Select>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Gen:</FilterLabel>
            <Select value={gen} onChange={handleGenChange}>
              <option value="">Todas</option>
              {gensData?.results?.map((g, i) => (
                <option key={g.name} value={String(i + 1)}>
                  Gen {i + 1}
                </option>
              ))}
            </Select>
          </FilterGroup>
          {hasAnyFilters && (
            <ClearButton onClick={handleClear}>Limpiar filtros</ClearButton>
          )}
        </FilterPanel>
      )}

      <ActiveFilters>
        {q && (
          <FilterChip onClick={() => { setInputValue(''); updateParams({ q: '' }) }}>
            🔍 {q} ✕
          </FilterChip>
        )}
        {type && (
          <FilterChip $color={typeColorMap[type]} onClick={() => updateParams({ type: '' })}>
            {type} ✕
          </FilterChip>
        )}
        {gen && (
          <FilterChip onClick={() => updateParams({ gen: '' })}>
            Gen {gen} ✕
          </FilterChip>
        )}
      </ActiveFilters>
    </>
  )
}
