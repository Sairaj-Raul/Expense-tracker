import { useLocation } from 'react-router-dom'

/**
 * Hook to get the global search query from URL params
 */
export function useGlobalSearch(): string {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  return params.get('q') || ''
}

