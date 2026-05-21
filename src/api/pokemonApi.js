import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { REHYDRATE } from 'redux-persist'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ['Pokemon', 'PokemonList', 'Type', 'Generation'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE && action.key === 'root') {
      return action.payload?.[reducerPath]
    }
  },
  endpoints: (builder) => ({
    getList: builder.query({
      query: ({ limit = 20, offset = 0 }) =>
        `pokemon?limit=${limit}&offset=${offset}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ name }) => ({
                type: 'Pokemon',
                id: name,
              })),
              { type: 'PokemonList', id: 'LIST' },
            ]
          : [{ type: 'PokemonList', id: 'LIST' }],
      keepUnusedDataFor: 120,
    }),

    getDetail: builder.query({
      query: (idOrName) => `pokemon/${idOrName}`,
      providesTags: (result, error, idOrName) => [
        { type: 'Pokemon', id: idOrName },
      ],
      keepUnusedDataFor: 300,
    }),

    getSpecies: builder.query({
      query: (idOrName) => `pokemon-species/${idOrName}`,
      providesTags: (result, error, idOrName) => [
        { type: 'Pokemon', id: `${idOrName}-species` },
      ],
      keepUnusedDataFor: 300,
    }),

    getTypes: builder.query({
      query: () => 'type',
      providesTags: ['Type'],
      keepUnusedDataFor: 1800,
    }),

    getTypeDetail: builder.query({
      query: (idOrName) => `type/${idOrName}`,
      providesTags: (result, error, idOrName) => [
        { type: 'Type', id: idOrName },
      ],
      keepUnusedDataFor: 300,
    }),

    getGenerations: builder.query({
      query: () => 'generation',
      providesTags: ['Generation'],
      keepUnusedDataFor: 1800,
    }),

    getGenerationDetail: builder.query({
      query: (idOrName) => `generation/${idOrName}`,
      providesTags: (result, error, idOrName) => [
        { type: 'Generation', id: idOrName },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
})

export const {
  useGetListQuery,
  useGetDetailQuery,
  useGetSpeciesQuery,
  useGetTypesQuery,
  useGetTypeDetailQuery,
  useGetGenerationsQuery,
  useGetGenerationDetailQuery,
} = pokemonApi
