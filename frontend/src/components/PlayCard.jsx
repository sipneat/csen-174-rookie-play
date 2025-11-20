import { useState, useEffect } from 'react'
import { buildApiUrl, API_ENDPOINTS } from '../config/api'
import './PlayCard.css'

export default function PlayCard({ play, gameId, index, totalPlays, user }) {
  const [explanation, setExplanation] = useState(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)

  const playId = play.id || play.sequenceNumber
  const playText = play.text || play.shortText || play.alternativeText || 'No description available'
  const clock = play.clock?.displayValue || ''
  const quarter = play.period?.number || 0

  const getQuarterText = () => {
    if (quarter === 1) return '1st'
    if (quarter === 2) return '2nd'
    if (quarter === 3) return '3rd'
    if (quarter === 4) return '4th'
    if (quarter > 4) return 'OT'
    return ''
  }

  useEffect(() => {
    const fetchExplanation = async () => {
      if (!playId || !user) return
      
      setLoadingExplanation(true)
      try {
        const url = buildApiUrl(API_ENDPOINTS.EXPLAIN_PLAY(gameId))
        const params = new URLSearchParams({ play_id: playId })
        const response = await fetch(`${url}?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch explanation')
        }
        
        const data = await response.json()
        setExplanation(data.explanation)
      } catch (error) {
        console.error('Error fetching play explanation:', error)
        setExplanation(null)
      } finally {
        setLoadingExplanation(false)
      }
    }

    fetchExplanation()
  }, [playId, gameId, user])

  return (
    <div className="play-item">
      <div className="play-header">
        <span className="play-number">
          Play #{totalPlays - index}
        </span>
        <span className="play-clock">
          {getQuarterText()} {clock}
        </span>
      </div>
      
      <div className="play-main-content">
        <div className="play-description">
          <p className="play-text">{playText}</p>
        </div>

        {!user ? (
          <div className="login-prompt">
            <p>🔒 Sign in to see AI analysis of this play</p>
          </div>
        ) : loadingExplanation ? (
          <div className="loading-explanation">
            <div className="loading-spinner-small"></div>
            <p>Generating AI analysis...</p>
          </div>
        ) : explanation ? (
          <div className="play-explanation">
            {explanation.ai_explanation && (
              <div className="explanation-section ai-analysis">
                <div className="explanation-content">
                  <h5>🤖 AI Analysis</h5>
                  <p>{explanation.ai_explanation}</p>
                </div>
              </div>
            )}

            {explanation.why_the_play_happened && (
              <div className="explanation-section situation">
                <div className="explanation-content">
                  <h5>Situation</h5>
                  <p>{explanation.why_the_play_happened}</p>
                </div>
              </div>
            )}

            {explanation.numbers_explained && Object.keys(explanation.numbers_explained).length > 0 && (
              <div className="explanation-section stats">
                <div className="explanation-content">
                  <h5>Stats</h5>
                  <div className="stats-grid">
                    {explanation.numbers_explained.yards !== undefined && (
                      <div className="stat-item">
                        <span className="stat-label">Yards Gained</span>
                        <span className="stat-value">{explanation.numbers_explained.yards}</span>
                      </div>
                    )}
                    {explanation.numbers_explained.score && (
                      <>
                        {explanation.numbers_explained.score.home !== undefined && (
                          <div className="stat-item">
                            <span className="stat-label">Home Score</span>
                            <span className="stat-value">{explanation.numbers_explained.score.home}</span>
                          </div>
                        )}
                        {explanation.numbers_explained.score.away !== undefined && (
                          <div className="stat-item">
                            <span className="stat-label">Away Score</span>
                            <span className="stat-value">{explanation.numbers_explained.score.away}</span>
                          </div>
                        )}
                        {explanation.numbers_explained.score.change !== undefined && (
                          <div className="stat-item">
                            <span className="stat-label">Points Scored</span>
                            <span className="stat-value score-change">
                              +{explanation.numbers_explained.score.change}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}