import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import GameCard from '../components/GameCard'
import './css/Main.css'
import { buildApiUrl, API_ENDPOINTS } from '../config/api'

export default function Main() {
  const [favoriteTeams, setFavoriteTeams] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const doFetchJson = async (url, options = {}) => {
    const res = await fetch(url, options)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`${res.status} ${res.statusText} ${text}`)
    }
    const data = await res.json().catch(() => null)
    return data
  }

  const fetchGames = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = buildApiUrl(API_ENDPOINTS.GAMES)
      const data = await doFetchJson(url)
      const gamesList = data.games || []
      
      setGames(gamesList)
    } catch (e) {
      setError(e.message || String(e))
      setGames([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    fetchGames()
  }, [fetchGames])

  // Load user's favorite teams from Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            const data = userDoc.data()
            setFavoriteTeams(data.favoriteTeams || [])
          } else {
            setFavoriteTeams([])
          }
        } catch (error) {
          console.error('Error loading favorites:', error)
          setFavoriteTeams([])
        }
      } else {
        setFavoriteTeams([])
      }
    })
    
    return () => unsub()
  }, [])

  useEffect(() => {
    fetchGames()
    intervalRef.current = setInterval(() => {
      fetchGames()
    }, 30000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchGames])

  const sortedGames = [...games].sort((a, b) => {
    const aHasFavorite = favoriteTeams.some(team =>
      (a.home_team?.name || '').includes(team) || (a.away_team?.name || '').includes(team)
    )
    const bHasFavorite = favoriteTeams.some(team =>
      (b.home_team?.name || '').includes(team) || (b.away_team?.name || '').includes(team)
    )

    if (aHasFavorite && !bHasFavorite) return -1
    if (!aHasFavorite && bHasFavorite) return 1
    return 0
  })

  const handleGameClick = (game) => {
    navigate(`/game/${game.id}`)
  }

  const isGameFavorite = (game) => {
    return favoriteTeams.some(team => 
      (game.home_team?.name || '').includes(team) || (game.away_team?.name || '').includes(team)
    )
  }

  return (
    <div className="main-container">
      <header className="main-header">
        <h1>RookiePlay</h1>
        <p>Select a game to follow and learn about American football in real-time</p>
      </header>
      
      {error && (
        <div className="error-message">
          <p>Error loading games: {error}</p>
          <button onClick={refresh} className="retry-button">Retry</button>
        </div>
      )}
      
      {loading && !error && (
        <div className="loading-message">
          <p>Loading games...</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="games-section">
            <h2>Live Games</h2>
            <div className="games-list">
              {sortedGames.length === 0 ? (
                <p className="no-games">No games available at this time.</p>
              ) : (
                sortedGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={isGameFavorite(game)}
                    onGameClick={handleGameClick}
                  />
                ))
              )}
            </div>
          </div>
          
          {user && (
            <div className="favorite-teams">
              <h3>Your Favorite Teams</h3>
              {favoriteTeams.length > 0 ? (
                <div className="favorite-list">
                  {favoriteTeams.map(team => (
                    <span key={team} className="favorite-team-tag">
                      {team}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="no-favorites">
                  <p>You haven't selected any favorite teams yet.</p>
                  <button onClick={() => navigate('/favorites')} className="manage-favorites-button">
                    Manage Favorites
                  </button>
                </div>
              )}
              {favoriteTeams.length > 0 && (
                <div className="manage-favorites-link">
                  <button onClick={() => navigate('/favorites')} className="manage-favorites-button">
                    Manage Favorites
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}