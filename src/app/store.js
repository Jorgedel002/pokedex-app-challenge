import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistStore, persistReducer, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { pokemonApi } from '../api/pokemonApi'
import favoritesReducer from '../features/favorites/favoritesSlice'
import connectionReducer from '../shared/connectionSlice'

const pokemonApiTransform = createTransform(
  (inboundState) => ({ queries: inboundState.queries }),
  (outboundState) => ({ ...outboundState, subscriptions: {}, mutations: {}, provided: {} }),
  { whitelist: ['pokemonApi'] }
)

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['favorites', 'pokemonApi'],
  transforms: [pokemonApiTransform],
}

const persistedFavorites = persistReducer(persistConfig, favoritesReducer)

export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    favorites: persistedFavorites,
    connection: connectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(pokemonApi.middleware),
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)
