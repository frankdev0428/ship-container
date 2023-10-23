import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

const usePageTracking = (ga: typeof ReactGA) => () => {
  const location = useLocation()

  useEffect(() => {
    ga.set({ page: location.pathname + location.search })

    ga.send('pageview')
  }, [location])
}

export default usePageTracking
