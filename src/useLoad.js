import { useEffect, useRef, useState } from 'react'

export function useLoad(loader, deps = []) {
  const [tick, setTick] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const loaderRef = useRef(loader)
  const key = `${JSON.stringify(deps)}:${tick}`

  useEffect(() => {
    loaderRef.current = loader
  })

  useEffect(() => {
    let cancelled = false
    loaderRef
      .current()
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: null })
      })
      .catch((error) => {
        if (!cancelled) setResult((previous) => ({ key, data: previous.data, error }))
      })
    return () => {
      cancelled = true
    }
  }, [key])

  return {
    data: result.data,
    error: result.key === key ? result.error : null,
    loading: result.key !== key,
    reload: () => setTick((value) => value + 1),
  }
}
