import './GameCard.css'

export default function GameCard({ game, isFavorite, onGameClick }) {
  const handleClick = () => {
    onGameClick(game)
  }

  const homeTeam = game.home_team || {}
  const awayTeam = game.away_team || {}
  const status = game.status || 'scheduled'
  const startTime = game.start_time || ''

  const getStatusDisplay = () => {
    if (status === 'STATUS_IN_PROGRESS') return 'Live'
    if (status === 'STATUS_SCHEDULED') return 'Upcoming'
    if (status === 'STATUS_FINAL') return 'Final'
    if (status === 'STATUS_HALFTIME') return 'Halftime'
    return status
  }

  const getTimeDisplay = () => {
    if (!startTime) return ''
    try {
      const date = new Date(startTime)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return startTime
    }
  }

  return (
    <div 
      className={`game-card ${isFavorite ? 'favorite' : ''}`}
      onClick={handleClick}
    >
      <div className="game-header">
        <div className="game-status">
          <span className="quarter">{getStatusDisplay()}</span>
          <span className="time">{getTimeDisplay()}</span>
        </div>
        {isFavorite && <div className="favorite-indicator">★</div>}
      </div>
      
      <div className="teams">
        <div className="team away-team">
          <div className="team-name">{awayTeam.name || 'Away Team'}</div>
          <div className="team-abbr">{awayTeam.abbr || ''}</div>
        </div>
        
        <div className="vs">@</div>
        
        <div className="team home-team">
          <div className="team-name">{homeTeam.name || 'Home Team'}</div>
          <div className="team-abbr">{homeTeam.abbr || ''}</div>
        </div>
      </div>
      
      <div className="game-details">
        <div className="detail-text">
          Click to view live game details
        </div>
      </div>
    </div>
  )
}