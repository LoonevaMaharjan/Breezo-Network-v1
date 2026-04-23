import { useState, useEffect, useCallback } from 'react'
import { buildDeviceAirSnapshot } from '../lib/deviceDemo'

const cache = {}
const CACHE_TTL = 5 * 60 * 1000

async function fetchCityRaw(cityKey) {
  const cached = cache[cityKey]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const data = buildDeviceAirSnapshot(cityKey)
  cache[cityKey] = { data, timestamp: Date.now() }
  return data
}

export function useAirQuality(cityKey) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  const fetch_ = useCallback(async (key) => {
    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const raw = await fetchCityRaw(key)
      setState({ data: raw, loading: false, error: null })
    } catch (error) {
      setState((current) => ({
        data: current.data,
        loading: false,
        error: error.message || 'Unable to load device data',
      }))
    }
  }, [])

  useEffect(() => {
    fetch_(cityKey)
    const interval = setInterval(() => {
      delete cache[cityKey]
      fetch_(cityKey)
    }, CACHE_TTL)

    return () => clearInterval(interval)
  }, [cityKey, fetch_])

  return {
    ...state,
    refetch: () => {
      delete cache[cityKey]
      fetch_(cityKey)
    },
  }
}

export function useMultiCityAQI(cityKeys) {
  const [results, setResults] = useState({})

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      const entries = await Promise.allSettled(
        cityKeys.map(async (key) => [key, await fetchCityRaw(key)])
      )

      if (cancelled) return

      const next = {}
      entries.forEach((entry) => {
        if (entry.status === 'fulfilled') {
          const [key, value] = entry.value
          next[key] = value
        }
      })
      setResults(next)
    }

    fetchAll()
    const interval = setInterval(fetchAll, CACHE_TTL)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [cityKeys.join(',')])

  return results
}
