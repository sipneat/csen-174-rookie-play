/**
 * API Configuration
 * 
 * This file contains all API-related configuration settings.
 * Modify these values to switch between mock data and real API endpoints.
 */

// Base URL for the backend API
// In development, this should point to your local Flask server (default: http://localhost:3000)
// In production, update this to your production API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Toggle between using mock data or real API endpoints
// Set to true to use mock data, false to use real API
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

// API endpoints
export const API_ENDPOINTS = {
  GAMES: '/api/games',
  GAME_BY_ID: (id) => `/api/games/${id}`,
  GAME_PLAYS: (gameId) => `/api/games/${gameId}/plays`,
  EXPLAIN_PLAY: (gameId) => `/api/games/${gameId}/explain-play`,
  TEAMS: '/api/teams',
  PLAYER: (playerId) => `/api/players/${playerId}`,
  USER_FAVORITES: (uid) => `/api/users/${uid}/favorites`,
  HEALTH: '/api/health'
}

/**
 * Builds a full URL for an API endpoint
 * @param {string} endpoint - The API endpoint path
 * @returns {string} Full URL including base URL
 */
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

