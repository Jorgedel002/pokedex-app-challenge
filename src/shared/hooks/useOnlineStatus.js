import { useSyncExternalStore, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setOnline, setOffline } from '../connectionSlice'

function subscribe(callback) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getSnapshot() {
  return navigator.onLine
}

function getServerSnapshot() {
  return true
}

export function useOnlineStatus() {
  const dispatch = useDispatch()

  // ✅ useSyncExternalStore for browser API (React-recommended pattern)
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Sync to Redux store — useEffect is valid here because
  // dispatching to an external store (Redux) IS a side-effect
  const prevOnline = useRef(isOnline)
  useEffect(() => {
    if (prevOnline.current !== isOnline) {
      prevOnline.current = isOnline
      dispatch(isOnline ? setOnline() : setOffline())
    }
  }, [isOnline, dispatch])

  return isOnline
}
