import { useState, useEffect } from 'react'
import { fetchWithCache, getCached } from '../lib/cache'

type Result<T> = { data: T | null; loading: boolean; error: string | null }

type State<T> = {
  data: T | null
  loading: boolean
  error: string | null
  forKey: string | null
}

export function useQuery<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): Result<T> {
  const initialEntry = key ? getCached<T>(key) : undefined
  const [state, setState] = useState<State<T>>({
    data: initialEntry?.data ?? null,
    loading: !initialEntry,
    error: null,
    forKey: key,
  })

  useEffect(() => {
    if (!key) return
    const k = key

    fetchWithCache<T>(
      k,
      fetcher,
      (fresh) => setState(s => s.forKey === k ? { ...s, data: fresh } : s)
    )
      .then(data => setState({ data, loading: false, error: null, forKey: k }))
      .catch(err => {
        console.error(err)
        setState({ data: null, loading: false, error: 'Erro ao carregar.', forKey: k })
      })
  // fetcher é omitido intencionalmente — deps controla re-execução
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps])

  // key mudou mas effect ainda não executou — derivar estado do cache
  if (state.forKey !== key) {
    const cached = key ? getCached<T>(key) : undefined
    return { data: cached?.data ?? null, loading: !cached, error: null }
  }

  return { data: state.data, loading: state.loading, error: state.error }
}
