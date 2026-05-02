type Entry<T> = { data: T; cachedAt: number }

const store = new Map<string, Entry<unknown>>()
const pending = new Map<string, Promise<unknown>>()

const TTL_FRESH = 20_000   // 30s — retorna sem revalidar
const TTL_STALE = 300_000  // 5min — retorna stale + revalida em background

export function getCached<T>(key: string): Entry<T> | undefined {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() - entry.cachedAt > TTL_STALE) {
    store.delete(key)
    return undefined
  }
  return entry as Entry<T>
}

export function setCached<T>(key: string, data: T): void {
  store.set(key, { data, cachedAt: Date.now() })
}

export function invalidate(keyPrefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(keyPrefix)) store.delete(key)
  }
  for (const key of pending.keys()) {
    if (key.startsWith(keyPrefix)) pending.delete(key)
  }
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  onRevalidate?: (fresh: T) => void
): Promise<T> {
  const entry = getCached<T>(key)

  if (entry) {
    const age = Date.now() - entry.cachedAt

    if (age < TTL_FRESH) return entry.data

    // stale — serve imediatamente, revalida em background
    if (!pending.has(key)) {
      const p = fetcher().then(fresh => {
        setCached(key, fresh)
        pending.delete(key)
        onRevalidate?.(fresh)
        return fresh
      }).catch(() => { pending.delete(key) })
      pending.set(key, p as Promise<unknown>)
    }
    return entry.data
  }

  // deduplication: múltiplos componentes pedindo a mesma key ao mesmo tempo
  if (pending.has(key)) {
    return pending.get(key) as Promise<T>
  }

  const p = fetcher().then(data => {
    setCached(key, data)
    pending.delete(key)
    return data
  }).catch(err => {
    pending.delete(key)
    throw err
  })

  pending.set(key, p as Promise<unknown>)
  return p
}
