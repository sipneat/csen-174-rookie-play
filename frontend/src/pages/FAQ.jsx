import './css/FAQ.css'

export default function FAQ() {
  return (
    <div className="faq-container">
      <div className="faq-content">
        <h1>FAQ & Help</h1>
        <p>Everything you need to know about using Rookie Play</p>

        <h2>Getting Started</h2>
        
        <h3>What is Rookie Play?</h3>
        <p>
          Rookie Play is your go-to platform for following NFL games in real-time. 
          Whether you're new to football or a seasoned fan, our app provides 
          live scores, game updates, and detailed play-by-play action to enhance 
          your viewing experience.
        </p>

        <h3>How to Navigate the App</h3>
        <p>
          <strong>Home Page:</strong> View all live and upcoming NFL games. 
          Click on any game card to see detailed information, live scores, 
          and play-by-play updates.
        </p>
        <p>
          <strong>Favorites Page:</strong> Save your favorite teams to quickly 
          access their games. Only available when you're signed in.
        </p>

        <h2>Account & Sign In</h2>
        
        <h3>How do I sign in?</h3>
        <ol>
          <li>Click the Sign in with Google button in the top right corner</li>
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

        <h2>Using Favorites</h2>
        
        <h3>How to add teams to favorites</h3>
        <ol>
          <li>Sign in to your account</li>
          <li>Click on any game to view the game details</li>
          <li>Click the Add to Favorites button next to a team name</li>
          <li>The button will change to Remove from Favorites</li>
          <li>Access all your favorite teams' games from the Favorites page</li>
        </ol>

        <h3>Managing your favorites</h3>
        <p>
          You can add or remove teams from your favorites at any time. Your 
          preferences are saved automatically and will persist across devices 
          when you sign in.
        </p>

        <h2>Game Features</h2>
        
        <h3>Live Scores</h3>
        <p>
          Real-time score updates for all ongoing NFL games. Scores refresh 
          automatically every 30 seconds.
        </p>
        
        <h3>Game Details</h3>
        <p>
          Click any game to see detailed information including quarter, time 
          remaining, possession, and down & distance.
        </p>
        
        <h3>Play-by-Play</h3>
        <p>
          Follow every play as it happens with detailed descriptions, yard 
          gains, and key moments in the game.
        </p>
        
        <h3>Game Status</h3>
        <p>
          See at a glance whether games are live, scheduled, or finished 
          with clear status indicators.
        </p>

        <h2>Who Is This App For?</h2>
        <p>
          Rookie Play is designed for everyone who loves football:
        </p>
        <ul>
          <li>New Fans: Learn the game with easy-to-follow play descriptions</li>
          <li>Casual Viewers: Keep track of scores without cable subscriptions</li>
          <li>Die-Hard Fans: Follow every play of your favorite teams</li>
          <li>Fantasy Players: Monitor multiple games simultaneously</li>
        </ul>

        <h2>About the Team</h2>
        <p>
          Rookie Play was built by a team of passionate developers at Santa Clara University:
        </p>
        <p>Anish Raina, Jake Esperson, Colin Friedel, Ramzi Ibrahim</p>
      </div>
    </div>
  );
}
  