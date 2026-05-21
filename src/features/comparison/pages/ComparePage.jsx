import { useState, useMemo, lazy, Suspense } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components'
import { useGetDetailQuery, useGetListQuery } from '../../../api/pokemonApi'
import { capitalizeName } from '../../../shared/utils/pokemonHelpers'
import Skeleton from '../../../shared/components/Skeleton'

const LazyRadarChart = lazy(() =>
  import('recharts').then((m) => ({
    default: function RadarChartWrapper(props) {
      const { RadarChart, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } = m
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={props.data}>
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#A0A0B0', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 255]} />
            {props.pokemons.map((p) => (
              <Radar
                key={p.name}
                name={p.name}
                dataKey={p.name}
                stroke={p.stroke}
                fill={p.fill}
                fillOpacity={0.3}
              />
            ))}
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      )
    },
  }))
)

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Form = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`

const SelectGroup = styled.div`
  flex: 1;
  min-width: 200px;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const SearchSelect = styled.div`
  position: relative;
`

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : theme.colors.surfaceHover};
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

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadii.md};
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
  list-style: none;
  padding: 0;
  margin-top: 2px;
`

const DropdownItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`

const MiniSprite = styled.img`
  width: 30px;
  height: 30px;
  image-rendering: pixelated;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const CompareButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 140px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Spinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const ChartSkeleton = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const TableSkeleton = styled.div`
  width: 100%;
`

const ChartSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.lg};

  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceHover};
  }

  th {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
    text-transform: capitalize;
  }

  td.highlight {
    color: ${({ theme }) => theme.colors.success};
    font-weight: 700;
  }
`

const Summary = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const validationSchema = Yup.object({
  pokemon1: Yup.string().required('Seleccioná un Pokémon'),
  pokemon2: Yup.string()
    .required('Seleccioná un Pokémon')
    .test(
      'not-same',
      'No podés comparar un Pokémon consigo mismo',
      function (value) {
        return value !== this.parent.pokemon1
      }
    ),
})

function SearchablePokemonSelect({ name, value, onChange, onBlur, error, allPokemon }) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search) return allPokemon.slice(0, 20)
    return allPokemon.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 20)
  }, [search, allPokemon])

  const selectedPokemon = value ? allPokemon.find((p) => p.name === value) : null

  return (
    <SelectGroup>
      <Label>{name === 'pokemon1' ? 'Pokémon 1' : 'Pokémon 2'}</Label>
      <SearchSelect>
        <SearchInput
          $hasError={!!error}
          type="text"
          placeholder={selectedPokemon ? capitalizeName(selectedPokemon.name) : 'Buscar Pokémon...'}
          value={selectedPokemon ? capitalizeName(selectedPokemon.name) : search}
          onChange={(e) => {
            setSearch(e.target.value)
            onChange(name, '')
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            onBlur(name, true)
            setTimeout(() => setIsOpen(false), 200)
          }}
        />
        {isOpen && filtered.length > 0 && (
          <Dropdown>
            {filtered.map((p) => (
              <DropdownItem
                key={p.name}
                onMouseDown={() => {
                  onChange(name, p.name)
                  setSearch('')
                  setIsOpen(false)
                }}
              >
                <MiniSprite
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.url.split('/').filter(Boolean).pop()}.png`}
                  alt={p.name}
                />
                {capitalizeName(p.name)}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </SearchSelect>
      {error && <ErrorText>{error}</ErrorText>}
    </SelectGroup>
  )
}

export default function ComparePage() {
  const [comparison, setComparison] = useState(null)

  const { data: listData } = useGetListQuery({ limit: 1302, offset: 0 })
  const allPokemon = listData?.results || []

  const { data: pokemon1Data, isFetching: isFetching1 } = useGetDetailQuery(comparison?.pokemon1, {
    skip: !comparison,
  })
  const { data: pokemon2Data, isFetching: isFetching2 } = useGetDetailQuery(comparison?.pokemon2, {
    skip: !comparison,
  })

  const isComparing = comparison && (isFetching1 || isFetching2)

  const formik = useFormik({
    initialValues: { pokemon1: '', pokemon2: '' },
    validationSchema,
    onSubmit: (values) => {
      setComparison(values)
    },
  })

  const chartData = useMemo(() => {
    if (!pokemon1Data || !pokemon2Data) return []
    const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
    return statNames.map((stat) => {
      const s1 = pokemon1Data.stats.find((s) => s.stat.name === stat)
      const s2 = pokemon2Data.stats.find((s) => s.stat.name === stat)
      return {
        stat: stat.replace('-', ' '),
        [capitalizeName(pokemon1Data.name)]: s1?.base_stat || 0,
        [capitalizeName(pokemon2Data.name)]: s2?.base_stat || 0,
      }
    })
  }, [pokemon1Data, pokemon2Data])

  const { wins1, wins2, p1Name, p2Name } = useMemo(() => {
    const p1 = capitalizeName(pokemon1Data?.name || '')
    const p2 = capitalizeName(pokemon2Data?.name || '')
    const w1 = chartData.reduce((acc, d) => acc + (d[p1] > d[p2] ? 1 : 0), 0)
    const w2 = chartData.reduce((acc, d) => acc + (d[p2] > d[p1] ? 1 : 0), 0)
    return { wins1: w1, wins2: w2, p1Name: p1, p2Name: p2 }
  }, [chartData, pokemon1Data, pokemon2Data])

  return (
    <Container>
      <Title>Comparar Pokémon</Title>
      <Form onSubmit={formik.handleSubmit}>
        <SearchablePokemonSelect
          name="pokemon1"
          value={formik.values.pokemon1}
          onChange={formik.setFieldValue}
          onBlur={formik.setFieldTouched}
          error={formik.touched.pokemon1 && formik.errors.pokemon1}
          allPokemon={allPokemon}
        />
        <SearchablePokemonSelect
          name="pokemon2"
          value={formik.values.pokemon2}
          onChange={formik.setFieldValue}
          onBlur={formik.setFieldTouched}
          error={formik.touched.pokemon2 && formik.errors.pokemon2}
          allPokemon={allPokemon}
        />
        <CompareButton
          type="submit"
          disabled={!formik.values.pokemon1 || !formik.values.pokemon2 || isComparing}
        >
          {isComparing ? <><Spinner /> Cargando…</> : 'Comparar'}
        </CompareButton>
      </Form>

      {comparison && (
        <>
          {isComparing ? (
            <>
              <ChartSkeleton>
                <Skeleton width={200} height={24} />
                <Skeleton width="100%" height={400} />
              </ChartSkeleton>
              <TableSkeleton>
                <Skeleton count={7} height={40} />
              </TableSkeleton>
            </>
          ) : (
            pokemon1Data && pokemon2Data && (
              <Suspense fallback={<ChartSkeleton><Skeleton width="100%" height={400} /></ChartSkeleton>}>
                <ChartSection>
                  <h3 style={{ textAlign: 'center', marginBottom: 16 }}>Radar de Stats</h3>
                  <LazyRadarChart
                    data={chartData}
                    pokemons={[
                      { name: p1Name, stroke: '#E94560', fill: '#E94560' },
                      { name: p2Name, stroke: '#6890F0', fill: '#6890F0' },
                    ]}
                  />
                </ChartSection>

                <ComparisonTable>
                  <thead>
                    <tr>
                      <th>Stat</th>
                      <th>{p1Name}</th>
                      <th>{p2Name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row) => (
                      <tr key={row.stat}>
                        <td>{row.stat}</td>
                        <td className={row[p1Name] > row[p2Name] ? 'highlight' : ''}>
                          {row[p1Name]}
                        </td>
                        <td className={row[p2Name] > row[p1Name] ? 'highlight' : ''}>
                          {row[p2Name]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ComparisonTable>

                <Summary>
                  {wins1 > wins2
                    ? `${p1Name} supera a ${p2Name} en ${wins1} de 6 stats`
                    : wins2 > wins1
                    ? `${p2Name} supera a ${p1Name} en ${wins2} de 6 stats`
                    : '¡Empate! Ambos ganan en 3 stats'}
                </Summary>
              </Suspense>
            )
          )}
        </>
      )}
    </Container>
  )
}
