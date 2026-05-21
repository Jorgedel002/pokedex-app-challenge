import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOnline: navigator.onLine,
}

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setOnline: (state) => {
      state.isOnline = true
    },
    setOffline: (state) => {
      state.isOnline = false
    },
  },
})

export const { setOnline, setOffline } = connectionSlice.actions
export const selectIsOnline = (state) => state.connection.isOnline

export default connectionSlice.reducer
