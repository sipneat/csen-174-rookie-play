/**
 * Game API Service
 * 
 * This file contains all API service functions for interacting with the backend.
 * Currently uses mock data. Once the backend is ready, uncomment the fetch calls
 * and remove/comment out the mock data returns.
 */

import { buildApiUrl, API_ENDPOINTS, USE_MOCK_DATA } from '../config/api'
import { mockGames, delay } from './mockData'

/**
 * Fetches all live games
 * @returns {Promise<Array>} Array of game objects
 */
export const fetchGames = async () => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await delay(300)
    return [...mockGames]
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.GAMES))
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch games: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock data until backend is ready
  await delay(300)
  return [...mockGames]
}

/**
 * Fetches a specific game by ID
 * @param {number|string} gameId - The game ID
 * @returns {Promise<Object>} Game object
 */
export const fetchGameById = async (gameId) => {
  if (USE_MOCK_DATA) {
    await delay(200)
    const game = mockGames.find(g => g.id === parseInt(gameId))
    if (!game) {
      throw new Error(`Game with id ${gameId} not found`)
    }
    return { ...game }
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.GAME_BY_ID(gameId)))
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch game: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock data until backend is ready
  await delay(200)
  const game = mockGames.find(g => g.id === parseInt(gameId))
  if (!game) {
    throw new Error(`Game with id ${gameId} not found`)
  }
  return { ...game }
}

/**
 * Fetches play-by-play data for a specific game
 * @param {number|string} gameId - The game ID
 * @returns {Promise<Array>} Array of play objects
 */
export const fetchGamePlays = async (gameId) => {
  if (USE_MOCK_DATA) {
    await delay(200)
    // Return empty array for now - backend will provide actual plays
    return []
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.GAME_PLAYS(gameId)))
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch game plays: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return empty array until backend is ready
  return []
}

/**
 * Fetches explanation for a specific play
 * @param {number|string} gameId - The game ID
 * @param {number|string} playId - The play ID
 * @returns {Promise<Object>} Play explanation object
 */
export const explainPlay = async (gameId, playId) => {
  if (USE_MOCK_DATA) {
    await delay(300)
    // Return mock explanation structure
    return {
      playId,
      explanation: 'Mock play explanation',
      learningPoints: []
    }
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.EXPLAIN_PLAY(gameId)), {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ playId })
  // })
  // if (!response.ok) {
  //   throw new Error(`Failed to explain play: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock data until backend is ready
  await delay(300)
  return {
    playId,
    explanation: 'Mock play explanation',
    learningPoints: []
  }
}

/**
 * Fetches all teams
 * @returns {Promise<Array>} Array of team objects
 */
export const fetchTeams = async () => {
  if (USE_MOCK_DATA) {
    await delay(200)
    // Extract unique teams from mock games
    const teams = new Set()
    mockGames.forEach(game => {
      teams.add(JSON.stringify(game.homeTeam))
      teams.add(JSON.stringify(game.awayTeam))
    })
    return Array.from(teams).map(t => JSON.parse(t))
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.TEAMS))
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch teams: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock data until backend is ready
  await delay(200)
  const teams = new Set()
  mockGames.forEach(game => {
    teams.add(JSON.stringify(game.homeTeam))
    teams.add(JSON.stringify(game.awayTeam))
  })
  return Array.from(teams).map(t => JSON.parse(t))
}

/**
 * Fetches player information
 * @param {number|string} playerId - The player ID
 * @returns {Promise<Object>} Player object
 */
export const fetchPlayer = async (playerId) => {
  if (USE_MOCK_DATA) {
    await delay(200)
    return {
      id: playerId,
      name: 'Mock Player',
      position: 'QB',
      team: 'Mock Team'
    }
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.PLAYER(playerId)))
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch player: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock data until backend is ready
  await delay(200)
  return {
    id: playerId,
    name: 'Mock Player',
    position: 'QB',
    team: 'Mock Team'
  }
}

/**
 * Fetches user's favorite teams
 * @param {string} uid - User ID
 * @returns {Promise<Array>} Array of favorite team names or IDs
 */
export const fetchUserFavorites = async (uid) => {
  if (USE_MOCK_DATA) {
    await delay(200)
    // Return default favorites
    return ['Chiefs', 'Bills', 'Cowboys']
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.USER_FAVORITES(uid)))
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch user favorites: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock data until backend is ready
  await delay(200)
  return ['Chiefs', 'Bills', 'Cowboys']
}

/**
 * Updates user's favorite teams
 * @param {string} uid - User ID
 * @param {Array} favorites - Array of favorite team names or IDs
 * @returns {Promise<Object>} Updated favorites response
 */
export const updateUserFavorites = async (uid, favorites) => {
  if (USE_MOCK_DATA) {
    await delay(300)
    return { success: true, favorites }
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.USER_FAVORITES(uid)), {
  //   method: 'PUT', // or POST, depending on backend implementation
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ favorites })
  // })
  // if (!response.ok) {
  //   throw new Error(`Failed to update user favorites: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock response until backend is ready
  await delay(300)
  return { success: true, favorites }
}

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  if (USE_MOCK_DATA) {
    await delay(100)
    return { status: 'ok', message: 'Mock mode - using mock data' }
  }

  // TODO: Uncomment this once backend is ready
  // const response = await fetch(buildApiUrl(API_ENDPOINTS.HEALTH))
  // if (!response.ok) {
  //   throw new Error(`Health check failed: ${response.statusText}`)
  // }
  // return await response.json()

  // Temporary: return mock response until backend is ready
  await delay(100)
  return { status: 'ok', message: 'Mock mode - using mock data' }
}

