/**
 * Mock Data for Games
 * 
 * This file contains sample game data for development and testing.
 * Once the backend API is ready, this will be replaced by real API calls.
 */

/**
 * Sample game data matching the expected API response structure
 */
export const mockGames = [
  {
    id: 1,
    homeTeam: { name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { name: 'Buffalo Bills', abbreviation: 'BUF' },
    homeScore: 24,
    awayScore: 21,
    quarter: '4th Q',
    timeRemaining: '2:34',
    ballPossession: 'Chiefs',
    down: '2nd',
    distance: '8 yards',
    fieldPosition: 'BUF 45',
    status: 'live'
  },
  {
    id: 2,
    homeTeam: { name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    homeScore: 17,
    awayScore: 14,
    quarter: '3rd Q',
    timeRemaining: '8:12',
    ballPossession: 'Eagles',
    down: '1st',
    distance: '10 yards',
    fieldPosition: 'DAL 30',
    status: 'live'
  },
  {
    id: 3,
    homeTeam: { name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { name: 'New England Patriots', abbreviation: 'NE' },
    homeScore: 28,
    awayScore: 7,
    quarter: '4th Q',
    timeRemaining: '12:45',
    ballPossession: 'Patriots',
    down: '3rd',
    distance: '15 yards',
    fieldPosition: 'NE 25',
    status: 'live'
  },
  {
    id: 4,
    homeTeam: { name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { name: 'Detroit Lions', abbreviation: 'DET' },
    homeScore: 31,
    awayScore: 28,
    quarter: 'Final',
    timeRemaining: '0:00',
    ballPossession: 'Packers',
    down: 'Final',
    distance: '',
    fieldPosition: '',
    status: 'final'
  }
]

/**
 * Simulates an API delay for more realistic testing
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the delay
 */
export const delay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

