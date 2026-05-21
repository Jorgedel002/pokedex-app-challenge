import { useSelector } from 'react-redux'
import { selectIsOnline } from '../connectionSlice'

export function useCacheStatus(queryResult) {
  const isOnline = useSelector(selectIsOnline)

  const { isSuccess, isFetching, data } = queryResult || {}

  if (!data) return 'loading'
  if (isFetching) return 'fetching'
  if (!isOnline && isSuccess) return 'cached'
  if (isSuccess) return 'fresh'

  return 'unknown'
}
