export default function FAQ() {
    return (
      <>
        <div>
          <h1>FAQ & Help</h1>
          <p>Welcome to our FAQ page! Here you’ll find all information you'll need in order to use our app.</p>
  
          <h2>App Walkthrough</h2>
          <p>Here are some screenshots that will help you to understand what’s happening in the app:</p>
          <img
            src="/images/screenshot-home.png"
            alt="App home screenshot"
            style={{ width: "80%", borderRadius: "8px", margin: "10px 0" }}
          />
          <p>
            <strong>Home Page:</strong> Shows updates from the teams you follow.
          </p>
          <img
            src="/images/screenshot-team-follow.png"
            alt="Follow team screenshot"
            style={{ width: "80%", borderRadius: "8px", margin: "10px 0" }}
          />
          <p>
            <strong>Team Page:</strong> Click “Follow” to get updates and click again to unfollow.
          </p>
  
          <h2>How to Sign In</h2>
          <ol>
            <li>Click the <strong>Sign In</strong> button in the top right corner.</li>
            <li>Enter your email and password (or use Google sign-in).</li>
            <li>Once signed in, you can easily follow or unfollow your teams.</li>
          </ol>
  
          <h2>👥 Who Is This App For?</h2>
          <p>
            This app is designed for fans, students, and sports enthusiasts who want quick and
            organized access to team updates, news, and events.
          </p>
  
          <h2>🏆 About the Team</h2>
          <p>We’re a passionate group of aspiring software developers who have built this app together for you:</p>
          <ul>
            <li><strong>[Anish Raina]</strong></li>
            <li><strong>[Jake Esperson]</strong></li>
            <li><strong>[Colin Friedel]</strong></li>
            <li><strong>[Ramzi Ibrahim]</strong></li>
          </ul>
        </div>
      </>
    );
  }
  