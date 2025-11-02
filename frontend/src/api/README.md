# API Data Structure Documentation

This document describes the expected data structures for all API endpoints. The backend should return data matching these formats.

## Game Object Structure

The game object is the primary data structure used throughout the application. All games endpoints should return data in this format.

```javascript
{
  id: number,                    // Unique game identifier
  homeTeam: {                    // Home team information
    name: string,                // Full team name (e.g., "Kansas City Chiefs")
    abbreviation: string         // Team abbreviation (e.g., "KC")
  },
  awayTeam: {                    // Away team information
    name: string,                // Full team name (e.g., "Buffalo Bills")
    abbreviation: string         // Team abbreviation (e.g., "BUF")
  },
  homeScore: number,             // Current home team score
  awayScore: number,             // Current away team score
  quarter: string,               // Current quarter (e.g., "1st Q", "2nd Q", "3rd Q", "4th Q", "Final", "OT")
  timeRemaining: string,         // Time remaining in quarter (e.g., "15:00", "2:34", "0:00")
  ballPossession: string,        // Team name with possession (e.g., "Chiefs", "Bills")
  down: string,                  // Current down (e.g., "1st", "2nd", "3rd", "4th", "Final", or empty string if not applicable)
  distance: string,              // Distance to first down (e.g., "8 yards", "10 yards", or empty string if not applicable)
  fieldPosition: string,         // Field position (e.g., "BUF 45", "KC 30", "50", or empty string if not applicable)
  status: string                 // Game status: "live" or "final"
}
```

## API Endpoints

### GET `/api/games`

Returns an array of all live games.

**Response:**
```json
[
  {
    "id": 1,
    "homeTeam": {
      "name": "Kansas City Chiefs",
      "abbreviation": "KC"
    },
    "awayTeam": {
      "name": "Buffalo Bills",
      "abbreviation": "BUF"
    },
    "homeScore": 24,
    "awayScore": 21,
    "quarter": "4th Q",
    "timeRemaining": "2:34",
    "ballPossession": "Chiefs",
    "down": "2nd",
    "distance": "8 yards",
    "fieldPosition": "BUF 45",
    "status": "live"
  }
]
```

### GET `/api/games/<game_id>`

Returns a single game object matching the structure above.

### GET `/api/games/<game_id>/plays`

Returns play-by-play data for a game.

**Expected Response Structure:**
```javascript
[
  {
    playId: number,              // Unique play identifier
    quarter: string,             // Quarter in which play occurred
    time: string,                // Time on clock
    down: string,                // Down (e.g., "1st", "2nd")
    distance: string,           // Distance to first down
    fieldPosition: string,       // Field position
    description: string,         // Play description
    // Additional fields as needed
  }
]
```

### POST `/api/games/<game_id>/explain-play`

Requests an explanation for a specific play.

**Request Body:**
```json
{
  "playId": 123
}
```

**Expected Response:**
```javascript
{
  playId: number,
  explanation: string,           // Detailed explanation of the play
  learningPoints: Array<string> // Educational points about the play
}
```

### GET `/api/teams`

Returns array of all teams.

**Expected Response:**
```javascript
[
  {
    name: string,               // Full team name
    abbreviation: string        // Team abbreviation
  }
]
```

### GET `/api/players/<player_id>`

Returns player information.

**Expected Response Structure:**
```javascript
{
  id: number,
  name: string,
  position: string,
  team: string
  // Additional fields as needed
}
```

### GET `/api/users/<uid>/favorites`

Returns user's favorite teams.

**Expected Response:**
```javascript
["Chiefs", "Bills", "Cowboys"]  // Array of team names or IDs
```

### PUT/POST `/api/users/<uid>/favorites`

Updates user's favorite teams.

**Request Body:**
```json
{
  "favorites": ["Chiefs", "Bills", "Cowboys"]
}
```

**Expected Response:**
```json
{
  "success": true,
  "favorites": ["Chiefs", "Bills", "Cowboys"]
}
```

### GET `/api/health`

Health check endpoint.

**Expected Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

## Notes

- All string fields should not be `null` - use empty strings (`""`) instead if no value is available
- Score values should be non-negative integers
- Game IDs should be unique positive integers
- The `status` field determines if a game is active ("live") or finished ("final")
- When a game is final, some fields like `down`, `distance`, and `fieldPosition` may be empty strings

