# API Integration Guide

This guide explains how to integrate the backend API endpoints with the frontend application.

## Overview

The frontend is currently set up to use mock data by default. To switch to using real API endpoints, you need to:

1. Update the API configuration
2. Uncomment the fetch calls in the API service layer
3. Ensure the backend returns data in the expected format

## Quick Start

### Step 1: Configure API Base URL

Edit `frontend/src/config/api.js`:

```javascript
// Change from:
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// To your backend URL (if different):
export const API_BASE_URL = 'http://your-backend-url:3000'
```

Or set an environment variable:
```bash
VITE_API_BASE_URL=http://your-backend-url:3000 npm run dev
```

### Step 2: Disable Mock Data

Edit `frontend/src/config/api.js`:

```javascript
// Change from:
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

// To:
export const USE_MOCK_DATA = false
```

Or set environment variable:
```bash
VITE_USE_MOCK_DATA=false npm run dev
```

### Step 3: Enable Real API Calls

In `frontend/src/api/gameApi.js`, for each function you want to use:

1. Find the function (e.g., `fetchGames()`)
2. Uncomment the fetch code block
3. Comment out or remove the mock data return

Example:

```javascript
export const fetchGames = async () => {
  // Remove or comment out this block:
  // if (USE_MOCK_DATA) {
  //   await delay(300)
  //   return [...mockGames]
  // }

  // Uncomment this block:
  const response = await fetch(buildApiUrl(API_ENDPOINTS.GAMES))
  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.statusText}`)
  }
  return await response.json()
}
```

## API Endpoints

The frontend expects the following endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/games` | GET | Get all live games |
| `/api/games/<game_id>` | GET | Get specific game details |
| `/api/games/<game_id>/plays` | GET | Get play-by-play data |
| `/api/games/<game_id>/explain-play` | POST | Get play explanation |
| `/api/teams` | GET | Get all teams |
| `/api/players/<player_id>` | GET | Get player details |
| `/api/users/<uid>/favorites` | GET | Get user's favorite teams |
| `/api/users/<uid>/favorites` | PUT/POST | Update favorite teams |
| `/api/health` | GET | Health check |

## Expected Data Format

### Game Object

The most important data structure is the Game object. See `frontend/src/api/README.md` for detailed documentation.

**Required Fields:**
- `id` (number)
- `homeTeam` (object with `name` and `abbreviation`)
- `awayTeam` (object with `name` and `abbreviation`)
- `homeScore` (number)
- `awayScore` (number)
- `quarter` (string: "1st Q", "2nd Q", "3rd Q", "4th Q", "Final", "OT")
- `timeRemaining` (string: "MM:SS" format)
- `ballPossession` (string: team name)
- `down` (string: "1st", "2nd", "3rd", "4th", "Final", or "")
- `distance` (string: "X yards" or "")
- `fieldPosition` (string: "TEAM YL" or "")
- `status` (string: "live" or "final")

**Example Response:**
```json
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
```

## Files to Modify

When integrating the backend, you'll need to modify:

1. **`frontend/src/config/api.js`**
   - Set `USE_MOCK_DATA = false`
   - Update `API_BASE_URL` if needed

2. **`frontend/src/api/gameApi.js`**
   - Uncomment fetch calls in each function
   - Remove or comment out mock data returns
   - Adjust error handling as needed

## Testing

1. **Test with Mock Data First**
   - Ensure `USE_MOCK_DATA = true`
   - Verify the UI works correctly with mock data

2. **Test Health Endpoint**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"status": "ok", ...}`

3. **Test Games Endpoint**
   ```bash
   curl http://localhost:3000/api/games
   ```
   Should return an array of game objects matching the expected format

4. **Switch to Real API**
   - Set `USE_MOCK_DATA = false`
   - Uncomment fetch calls in `gameApi.js`
   - Test each endpoint

## Error Handling

The frontend handles errors gracefully:
- Network errors are caught and displayed to the user
- Invalid data formats may cause UI issues - ensure backend returns data matching the expected structure
- The `useGames` hook includes error state management

## CORS Configuration

Ensure your Flask backend has CORS enabled for the frontend origin:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins in development
# Or: CORS(app, origins=["http://localhost:5173"]) for production
```

## Environment Variables

You can use environment variables for configuration:

- `VITE_API_BASE_URL`: Override the API base URL
- `VITE_USE_MOCK_DATA`: Set to "false" to disable mock data

Create a `.env` file in the `frontend/` directory:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK_DATA=false
```

## Troubleshooting

**Issue**: Games not loading
- Check browser console for errors
- Verify backend is running and accessible
- Check CORS configuration
- Verify API endpoint returns data in expected format

**Issue**: Data format errors
- Compare backend response with expected format in `frontend/src/api/README.md`
- Ensure all required fields are present
- Check field types (strings, numbers, objects)

**Issue**: CORS errors
- Ensure Flask-CORS is configured correctly
- Check that frontend origin is allowed

## Additional Resources

- See `frontend/src/api/README.md` for detailed data structure documentation
- See `frontend/src/api/gameApi.js` for API function implementations
- See `frontend/src/hooks/useGames.js` for React hook usage

