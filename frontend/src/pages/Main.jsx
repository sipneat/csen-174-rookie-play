import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GameCard from '../components/GameCard'
import { useGames } from '../hooks/useGames'
import './css/Main.css'

export default function Main() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [favoriteTeams, setFavoriteTeams] = useState(['Chiefs', 'Bills', 'Cowboys'])
  const navigate = useNavigate()

  // Fetch games from API (or mock data if USE_MOCK_DATA is true)
  // Enable auto-refresh for live game updates (every 30 seconds)
  const { games, loading, error, refresh } = useGames({ 
    autoRefresh: true, 
    refreshInterval: 30000 
  })

  // Sort games with favorite teams first
  const sortedGames = [...games].sort((a, b) => {
    const aHasFavorite = favoriteTeams.some(team => 
      a.homeTeam.name.includes(team) || a.awayTeam.name.includes(team)
    )
    const bHasFavorite = favoriteTeams.some(team => 
      b.homeTeam.name.includes(team) || b.awayTeam.name.includes(team)
    )
    
    if (aHasFavorite && !bHasFavorite) return -1
    if (!aHasFavorite && bHasFavorite) return 1
    return 0
  })

  const handleGameClick = (game) => {
    setSelectedGame(game)
    // In a real app, you might navigate to a specific game page
    // navigate(`/game/${game.id}`)
  }

  const handleBackToGames = () => {
    setSelectedGame(null)
  }

  const isGameFavorite = (game) => {
    return favoriteTeams.some(team => 
      game.homeTeam.name.includes(team) || game.awayTeam.name.includes(team)
    )
  }

  if (selectedGame) {
    return (
      <div className="main-container live-game-active">
        <div className="live-game-header">
          <button onClick={handleBackToGames} className="back-button">
            ← Back to Games
          </button>
          <h1>Live Game: {selectedGame.awayTeam.name} @ {selectedGame.homeTeam.name}</h1>
        </div>
        
        <div className="live-game-content">
          <div className="live-scoreboard">
            <div className="live-teams">
              <div className="live-team">
                <h2>{selectedGame.awayTeam.name}</h2>
                <div className="live-score">{selectedGame.awayScore}</div>
              </div>
              <div className="vs">@</div>
              <div className="live-team">
                <h2>{selectedGame.homeTeam.name}</h2>
                <div className="live-score">{selectedGame.homeScore}</div>
              </div>
            </div>
            
            <div className="game-info">
              <div className="quarter-time">
                {selectedGame.quarter} - {selectedGame.timeRemaining}
              </div>
              <div className="possession-info">
                <strong>{selectedGame.ballPossession}</strong> has the ball
              </div>
              <div className="down-info">
                {selectedGame.down} & {selectedGame.distance} at {selectedGame.fieldPosition}
              </div>
            </div>
          </div>
          
          <div className="live-play-section">
            <h3>Live Play Analysis</h3>
            <div className="play-details">
              <p>This is where you would show live play-by-play updates, 
                 educational content about the current play, and interactive 
                 learning features about American football.</p>
              <div className="learning-tips">
                <h4>Learning Tips:</h4>
                <ul>
                  <li>Watch how the quarterback reads the defense</li>
                  <li>Notice the offensive line protection</li>
                  <li>Observe the defensive coverage schemes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          
          <div className="favorite-teams">
            <h3>Your Favorite Teams</h3>
            <div className="favorite-list">
              {favoriteTeams.map(team => (
                <span key={team} className="favorite-team-tag">
                  {team}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
