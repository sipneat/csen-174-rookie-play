import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { buildApiUrl, API_ENDPOINTS } from '../config/api'
import './css/GameDetail.css'

export default function GameDetail() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [plays, setPlays] = useState([])
  const [playsLoading, setPlaysLoading] = useState(false)
  const previousPlaysRef = useRef(null)

  const doFetchJson = async (url, options = {}) => {
    const res = await fetch(url, options)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`${res.status} ${res.statusText} ${text}`)
    }
    const data = await res.json().catch(() => null)
    return data
  }

  const fetchGameDetails = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = buildApiUrl(API_ENDPOINTS.GAME_BY_ID(gameId))
      const data = await doFetchJson(url)
      const gameData = data.game || data
      setGame(gameData)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
  }, [gameId])

  const fetchPlays = useCallback(async (silent = false) => {
    if (!silent) {
      setPlaysLoading(true)
    }
    try {
      const playsUrl = buildApiUrl(API_ENDPOINTS.GAME_PLAYS(gameId))
      const playsData = await doFetchJson(playsUrl)
      const allPlays = playsData.plays || []
      
      const recentPlays = allPlays.slice(-5).reverse()
      
      const playsWithExplanations = await Promise.all(
        recentPlays.map(async (play) => {
          try {
            const playId = play.id || play.sequenceNumber
            if (!playId) return { ...play, explanation: null }
            
            const explainUrl = buildApiUrl(API_ENDPOINTS.EXPLAIN_PLAY(gameId)) + `?play_id=${playId}`
            const explainData = await doFetchJson(explainUrl)
            return {
              ...play,
              explanation: explainData.explanation
            }
          } catch (err) {
            console.error('Error fetching explanation for play:', err)
            return { ...play, explanation: null }
          }
        })
      )
      
      const newPlayIds = playsWithExplanations.map(p => p.id || p.sequenceNumber).join(',')
      const oldPlayIds = previousPlaysRef.current?.map(p => p.id || p.sequenceNumber).join(',')
      
      if (newPlayIds !== oldPlayIds) {
        previousPlaysRef.current = playsWithExplanations
        setPlays(playsWithExplanations)
      }
    } catch (err) {
      console.error('Error fetching plays:', err)
      if (!silent) {
        setPlays([])
      }
    } finally {
      if (!silent) {
        setPlaysLoading(false)
      }
    }
  }, [gameId])

  useEffect(() => {
    fetchGameDetails()
  }, [fetchGameDetails])

  useEffect(() => {
    if (game) {
      fetchPlays(false)
    }
  }, [game, fetchPlays])

  const handleBackToGames = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="game-detail-container">
        <div className="loading-message">
          <p>Loading game details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="game-detail-container">
        <div className="error-message">
          <p>Error loading game: {error}</p>
          <button onClick={fetchGameDetails} className="retry-button">Retry</button>
          <button onClick={handleBackToGames} className="back-button">Back to Games</button>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="game-detail-container">
        <div className="error-message">
          <p>Game not found</p>
          <button onClick={handleBackToGames} className="back-button">Back to Games</button>
        </div>
      </div>
    )
  }

  const gameInfo = game.gamepackageJSON?.header || {}
  const competitions = gameInfo.competitions || []
  const competition = competitions[0] || {}
  const competitors = competition.competitors || []
  
  const homeTeam = competitors.find(c => c.homeAway === 'home') || {}
  const awayTeam = competitors.find(c => c.homeAway === 'away') || {}
  
  const homeScore = homeTeam.score || '0'
  const awayScore = awayTeam.score || '0'
  
  const status = competition.status || {}
  const period = status.period || 0
  const displayClock = status.displayClock || ''
  const statusType = status.type?.name || ''
  
  const possession = competition.situation?.possession || null
  const possessionTeam = competitors.find(c => c.id === possession)
  const ballPossessionText = possessionTeam ? possessionTeam.team?.displayName : ''
  
  const situation = competition.situation || {}
  const down = situation.shortDownDistanceText || ''
  const possession_text = situation.possessionText || ''
  
  const getQuarterText = () => {
    if (statusType === 'STATUS_FINAL') return 'Final'
    if (statusType === 'STATUS_SCHEDULED') return 'Scheduled'
    if (period === 1) return '1st Quarter'
    if (period === 2) return '2nd Quarter'
    if (period === 3) return '3rd Quarter'
    if (period === 4) return '4th Quarter'
    if (period > 4) return 'OT'
    return 'Pregame'
  }

  return (
    <div className="game-detail-container">
      <div className="live-game-header">
        <button onClick={handleBackToGames} className="back-button">
          ← Back to Games
        </button>
        <h1>{awayTeam.team?.displayName || 'Away'} @ {homeTeam.team?.displayName || 'Home'}</h1>
      </div>
      
      <div className="live-game-content">
        <div className="live-scoreboard">
          <div className="live-teams">
            <div className="live-team">
              <h2>{awayTeam.team?.displayName || 'Away Team'}</h2>
              <div className="live-score">{awayScore}</div>
            </div>
            <div className="vs">@</div>
            <div className="live-team">
              <h2>{homeTeam.team?.displayName || 'Home Team'}</h2>
              <div className="live-score">{homeScore}</div>
            </div>
          </div>
          
          <div className="game-info">
            <div className="quarter-time">
              {getQuarterText()} {displayClock && statusType !== 'STATUS_FINAL' && `- ${displayClock}`}
            </div>
            {ballPossessionText && statusType === 'STATUS_IN_PROGRESS' && (
              <div className="possession-info">
                <strong>{ballPossessionText}</strong> has the ball
              </div>
            )}
            {down && statusType === 'STATUS_IN_PROGRESS' && (
              <div className="down-info">
                {down} {possession_text && `at ${possession_text}`}
              </div>
            )}
          </div>
        </div>
        
        <div className="live-play-section">
          <h3>Recent Plays Explained</h3>
          <p className="section-subtitle">Learn what happened and why the team made each decision</p>
          {playsLoading ? (
            <div className="loading-plays">
              <div className="loading-spinner"></div>
              <p>Loading recent plays...</p>
            </div>
          ) : plays.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                {statusType === 'STATUS_SCHEDULED' 
                  ? 'Scheduled'
                  : statusType === 'STATUS_FINAL'
                  ? 'Final'
                  : 'Pending'}
              </div>
              <p className="empty-state-message">
                {statusType === 'STATUS_SCHEDULED' 
                  ? 'Game hasn\'t kicked off yet! Come back once the game starts to see live play explanations.'
                  : statusType === 'STATUS_FINAL'
                  ? 'Game over! This game has ended. Check out other live games to see play-by-play action.'
                  : 'Waiting for plays... The game should start soon!'}
              </p>
            </div>
          ) : (
            <div className="plays-list">
              {plays.map((play, index) => {
                const playText = play.text || play.shortText || play.alternativeText || 'Play description unavailable'
                const explanation = play.explanation
                const stableKey = play.id || play.sequenceNumber || `play-${index}`
                
                return (
                  <div key={stableKey} className="play-item">
                    <div className="play-data">
                      <div><strong>Play #{plays.length - index}</strong></div>
                      {play.clock?.displayValue && (
                        <div>Time: {play.clock.displayValue}</div>
                      )}
                      <div>Description: {playText}</div>
                      
                      {explanation && (
                        <>
                          {explanation.why_the_play_happened && (
                            <div>Situation: {explanation.why_the_play_happened}</div>
                          )}
                          
                          {explanation.numbers_explained && Object.keys(explanation.numbers_explained).length > 0 && (
                            <>
                              {explanation.numbers_explained.yards !== undefined && (
                                <div>Yards: {explanation.numbers_explained.yards}</div>
                              )}
                              {explanation.numbers_explained.score && (
                                <div>Score: {explanation.numbers_explained.score.home} - {explanation.numbers_explained.score.away}</div>
                              )}
                            </>
                          )}
                          
                          {explanation.possible_alternatives && explanation.possible_alternatives.length > 0 && (
                            <div>Alternatives: {explanation.possible_alternatives.join(', ')}</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}