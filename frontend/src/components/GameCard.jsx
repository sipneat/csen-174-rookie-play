import './GameCard.css'

export default function GameCard({ game, isFavorite, onGameClick }) {
  const { 
    id, 
    homeTeam, 
    awayTeam, 
    homeScore, 
    awayScore, 
    quarter, 
    timeRemaining, 
    ballPossession, 
    down, 
    distance, 
    fieldPosition 
  } = game

  const handleClick = () => {
    onGameClick(game)
  }

  return (
    <div 
      className={`game-card ${isFavorite ? 'favorite' : ''}`}
      onClick={handleClick}
    >
      <div className="game-header">
        <div className="game-status">
          <span className="quarter">{quarter}</span>
          <span className="time">{timeRemaining}</span>
        </div>
        {isFavorite && <div className="favorite-indicator">★</div>}
      </div>
      
      <div className="teams">
        <div className="team away-team">
          <div className="team-name">{awayTeam.name}</div>
          <div className="team-score">{awayScore}</div>
        </div>
        
        <div className="vs">@</div>
        
        <div className="team home-team">
          <div className="team-name">{homeTeam.name}</div>
          <div className="team-score">{homeScore}</div>
        </div>
      </div>
      
      <div className="game-details">
        <div className="possession">
          <span className="label">Ball:</span>
          <span className="team-name">{ballPossession}</span>
        </div>
        <div className="down-distance">
          <span className="down">{down}</span>
          <span className="distance">{distance}</span>
        </div>
        <div className="field-position">
          <span className="position">{fieldPosition}</span>
        </div>
      </div>
    </div>
  )
}
