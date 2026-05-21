import { createSlice } from '@reduxjs/toolkit'

const MAX_TEAM_SIZE = 6

const initialState = {
  team: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: {
      reducer: (state, action) => {
        const exists = state.team.some((p) => p.id === action.payload.id)
        if (exists || state.team.length >= MAX_TEAM_SIZE) return
        state.team.push(action.payload)
      },
      prepare: (pokemon) => ({
        payload: {
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprite,
          types: pokemon.types,
        },
      }),
    },
    removeFavorite: (state, action) => {
      state.team = state.team.filter((p) => p.id !== action.payload)
    },
    reorderTeam: (state, action) => {
      const { activeId, overId } = action.payload
      const activeIndex = state.team.findIndex((p) => p.id === activeId)
      const overIndex = state.team.findIndex((p) => p.id === overId)
      if (activeIndex === -1 || overIndex === -1) return
      const [removed] = state.team.splice(activeIndex, 1)
      state.team.splice(overIndex, 0, removed)
    },
  },
})

export const { addFavorite, removeFavorite, reorderTeam } =
  favoritesSlice.actions

export const selectTeam = (state) => state.favorites.team
export const selectIsInTeam = (state, id) =>
  state.favorites.team.some((p) => p.id === id)
export const selectTeamFull = (state) =>
  state.favorites.team.length >= MAX_TEAM_SIZE

export default favoritesSlice.reducer
