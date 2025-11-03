export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

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

export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

