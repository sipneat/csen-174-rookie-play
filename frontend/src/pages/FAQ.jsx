import './css/FAQ.css'

export default function FAQ() {
  return (
    <div className="faq-container">
      <div className="faq-content">
        <div className="faq-header">
          <h1>FAQ & Help</h1>
          <p>Everything you need to know about using RookiePlay</p>
        </div>

        <div className="faq-section">
          <h2><span className="emoji-icon">🏈</span>Getting Started</h2>
          
          <h3>What is RookiePlay?</h3>
          <p>
            RookiePlay is your go-to platform for following NFL games in real-time. 
            Whether you're new to football or a seasoned fan, our app provides 
            live scores, game updates, and detailed play-by-play action to enhance 
            your viewing experience.
          </p>

          <h3>How to Navigate the App</h3>
          <div className="instruction-box">
            <p>
              <strong>Home Page:</strong> View all live and upcoming NFL games. 
              Click on any game card to see detailed information, live scores, 
              and play-by-play updates.
            </p>
          </div>
          <div className="instruction-box">
            <p>
              <strong>Favorites Page:</strong> Save your favorite teams to quickly 
              access their games. Only available when you're signed in.
            </p>
          </div>
        </div>

        <div className="faq-section">
          <h2><span className="emoji-icon">👤</span>Account & Sign In</h2>
          
          <h3>How do I sign in?</h3>
          <ol>
            <li>Click the <strong>Sign in with Google</strong> button in the top right corner</li>
            <li>Choose your Google account or sign in with your credentials</li>
            <li>Grant the necessary permissions</li>
            <li>You're all set! Your session will be saved automatically</li>
          </ol>

          <h3>Do I need an account?</h3>
          <p>
            You can browse games and view live scores without an account. However, 
            signing in unlocks additional features like saving favorite teams and 
            personalizing your experience.
          </p>
        </div>

        <div className="faq-section">
          <h2><span className="emoji-icon">⭐</span>Using Favorites</h2>
          
          <h3>How to add teams to favorites</h3>
          <ol>
            <li>Sign in to your account</li>
            <li>Click on any game to view the game details</li>
            <li>Click the <strong>♡ Add to Favorites</strong> button next to a team name</li>
            <li>The button will change to <strong>★ Remove from Favorites</strong></li>
            <li>Access all your favorite teams' games from the Favorites page</li>
          </ol>

          <h3>Managing your favorites</h3>
          <p>
            You can add or remove teams from your favorites at any time. Your 
            preferences are saved automatically and will persist across devices 
            when you sign in.
          </p>
        </div>

        <div className="faq-section">
          <h2><span className="emoji-icon">🎮</span>Game Features</h2>
          
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Live Scores</h3>
              <p>
                Real-time score updates for all ongoing NFL games. Scores refresh 
                automatically every 30 seconds.
              </p>
            </div>
            <div className="feature-card">
              <h3>Game Details</h3>
              <p>
                Click any game to see detailed information including quarter, time 
                remaining, possession, and down & distance.
              </p>
            </div>
            <div className="feature-card">
              <h3>Play-by-Play</h3>
              <p>
                Follow every play as it happens with detailed descriptions, yard 
                gains, and key moments in the game.
              </p>
            </div>
            <div className="feature-card">
              <h3>Game Status</h3>
              <p>
                See at a glance whether games are live, scheduled, or finished 
                with clear status indicators.
              </p>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2><span className="emoji-icon">👥</span>Who Is This App For?</h2>
          <p>
            RookiePlay is designed for everyone who loves football:
          </p>
          <ul>
            <li><strong>New Fans:</strong> Learn the game with easy-to-follow play descriptions</li>
            <li><strong>Casual Viewers:</strong> Keep track of scores without cable subscriptions</li>
            <li><strong>Die-Hard Fans:</strong> Follow every play of your favorite teams</li>
            <li><strong>Fantasy Players:</strong> Monitor multiple games simultaneously</li>
          </ul>
        </div>

        <div className="faq-section">
          <h2><span className="emoji-icon">🏆</span>About the Team</h2>
          <p>
            RookiePlay was built by a team of passionate developers at Santa Clara University:
          </p>
          <div className="team-list">
            <div className="team-member">Anish Raina</div>
            <div className="team-member">Jake Esperson</div>
            <div className="team-member">Colin Friedel</div>
            <div className="team-member">Ramzi Ibrahim</div>
          </div>
        </div>
      </div>
    </div>
  );
}
  