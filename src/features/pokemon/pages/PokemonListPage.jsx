import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'
import { useGetListQuery, useGetDetailQuery, useGetTypeDetailQuery, useGetGenerationDetailQuery } from '../../../api/pokemonApi'
import PokemonCard from '../components/PokemonCard'
import PokemonCardSkeleton from '../components/PokemonCardSkeleton'
import SearchBar from '../../search/components/SearchBar'
import { useInView } from 'react-intersection-observer'
import CacheBanner from '../../../shared/components/CacheBanner'
import { useCacheStatus } from '../../../shared/hooks/useCacheStatus'
import EmptyState from '../../../shared/components/EmptyState'


const PAGE_SIZE = 20

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`

const Sentinel = styled.div`
  height: 1px;
  width: 100%;
`

const ErrorBox = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
`

const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }
`

export default function PokemonListPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const type = searchParams.get('type') || ''
  const gen = searchParams.get('gen') || ''

  const isFiltering = q || type || gen

  return (
    <>
      <SearchBar />
      {isFiltering ? (
        <FilteredResults q={q} type={type} gen={gen} />
      ) : (
        <InfiniteScrollList />
      )}
    </>
  )
}

// ─── Infinite scroll list (no filters) ─────────────────────────
// Uses "adjust state during render" pattern from React docs:
// https://react.dev/learn/you-might-not-need-an-effect#adjusting-state-when-a-prop-changes
function InfiniteScrollList() {
  const [page, setPage] = useState(0)
  const [allPokemon, setAllPokemon] = useState([])
  const [prevPage, setPrevPage] = useState(-1)

  const listQuery = useGetListQuery({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  })
  const { data: listData, error, isLoading, isFetching } = listQuery
  const cacheStatus = useCacheStatus(listQuery)

  // ✅ Adjust state during render (React-recommended pattern)
  // When listData changes for a new page, accumulate it
  if (listData?.results && page !== prevPage) {
    setPrevPage(page)
    setAllPokemon((prev) => {
      const existingIds = new Set(prev.map((p) => p.name))
      const newItems = listData.results.filter((p) => !existingIds.has(p.name))
      return [...prev, ...newItems]
    })
  }

  const totalPokemon = listData?.count || 0
  const hasMore = allPokemon.length < totalPokemon && !isFetching

  const { ref: sentinelRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasMore && !isFetching) {
        setPage((prev) => prev + 1)
      }
    },
  })

  if (error) {
    return (
      <ErrorBox>
        <h2>Error de conexión</h2>
        <p>No se pudieron cargar los Pokémon</p>
        <RetryButton onClick={() => { setPage(0); setAllPokemon([]); setPrevPage(-1) }}>Reintentar</RetryButton>
      </ErrorBox>
    )
  }

  return (
    <>
      <CacheBanner status={cacheStatus} />
      <Grid>
        {allPokemon.map((pokemon) => (
          <PokemonCardWithDetail key={pokemon.name} url={pokemon.url} />
        ))}
        {(isLoading || isFetching) &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <PokemonCardSkeleton key={`skeleton-${i}`} />
          ))}
      </Grid>
      {hasMore && <Sentinel ref={sentinelRef} />}
    </>
  )
}

// ─── Filtered results (search + type + gen) ─────────────────────
function FilteredResults({ q, type, gen }) {
  // Fetch type detail if type filter is active
  const { data: typeData, isLoading: typeLoading } = useGetTypeDetailQuery(type, {
    skip: !type,
  })

  // Fetch generation detail if gen filter is active
  const { data: genData, isLoading: genLoading } = useGetGenerationDetailQuery(gen, {
    skip: !gen,
  })

  // Fetch ALL pokemon names for name-only search (no type/gen)
  const needsNameSearch = q && !type && !gen
  const { data: allListData, isLoading: allListLoading } = useGetListQuery(
    { limit: 1302, offset: 0 },
    { skip: !needsNameSearch }
  )

  const isFilterLoading = typeLoading || genLoading || allListLoading

  // Build filtered pokemon as { name, url } pairs — filter by NAME not URL
  const filteredPokemon = useMemo(() => {
    let items = [] // { name, url }[]

    // Start from type data if available
    if (type && typeData?.pokemon) {
      items = typeData.pokemon.map((p) => ({
        name: p.pokemon.name,
        url: p.pokemon.url,
      }))
    }

    // Intersect or add generation data
    if (gen && genData?.pokemon_species) {
      const genItems = genData.pokemon_species.map((ps) => ({
        name: ps.name,
        url: `https://pokeapi.co/api/v2/pokemon/${ps.name}`,
      }))
      if (items.length > 0) {
        const genNameSet = new Set(genItems.map((g) => g.name))
        items = items.filter((item) => genNameSet.has(item.name))
      } else {
        items = genItems
      }
    }

    // Name-only search: use the full list as base
    if (needsNameSearch && allListData?.results) {
      items = allListData.results.map((p) => ({
        name: p.name,
        url: p.url,
      }))
    }

    // Apply name search filter — filter by item.name, NOT by URL
    if (q) {
      const qLower = q.toLowerCase()
      items = items.filter((item) => item.name.includes(qLower))
    }

    return items
  }, [type, typeData, gen, genData, q, needsNameSearch, allListData])

  const showEmpty = filteredPokemon.length === 0 && !isFilterLoading

  return (
    <>
      {showEmpty && (
        <EmptyState
          title="No se encontraron Pokémon"
          description="Probá con otros filtros o buscá otro nombre"
        />
      )}
      <Grid>
        {filteredPokemon.map((item) => (
          <PokemonCardWithDetail key={item.url} url={item.url} />
        ))}
        {isFilterLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <PokemonCardSkeleton key={`skeleton-${i}`} />
          ))}
      </Grid>
    </>
  )
}

// ─── Card with detail fetch ─────────────────────────────────────
function PokemonCardWithDetail({ url }) {
  const id = url.split('/').filter(Boolean).pop()
  const { data: pokemon, isLoading } = useGetDetailQuery(id, {
    skip: !id,
  })

  if (isLoading || !pokemon) {
    return <PokemonCardSkeleton />
  }

  return <PokemonCard pokemon={pokemon} />
}
