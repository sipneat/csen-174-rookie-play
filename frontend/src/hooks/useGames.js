/**
 * Custom React Hook for Games Data
 * 
 * This hook fetches games data from the API (or uses mock data) and provides
 * loading and error states. It also supports auto-refresh for live game updates.
 */

import { useState, useEffect, useCallback } from 'react'
import { fetchGames } from '../api/gameApi'

/**
 * Custom hook for fetching and managing games data
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoRefresh - Enable automatic refresh (default: false)
 * @param {number} options.refreshInterval - Refresh interval in milliseconds (default: 30000)
 * @returns {Object} { games, loading, error, refresh }
 */
export const useGames = (options = {}) => {
  const { autoRefresh = false, refreshInterval = 30000 } = options

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadGames = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchGames()
      setGames(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch games')
      console.error('Error fetching games:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial load
    loadGames()

    // Set up auto-refresh if enabled
    let intervalId = null
    if (autoRefresh) {
      intervalId = setInterval(() => {
        loadGames()
      }, refreshInterval)
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [loadGames, autoRefresh, refreshInterval])

  return {
    games,
    loading,
    error,
    refresh: loadGames
  }
}

