import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import './css/Favorites.css'

const NFL_TEAMS = [
  { name: 'Arizona Cardinals', abbr: 'ARI' },
  { name: 'Atlanta Falcons', abbr: 'ATL' },
  { name: 'Baltimore Ravens', abbr: 'BAL' },
  { name: 'Buffalo Bills', abbr: 'BUF' },
  { name: 'Carolina Panthers', abbr: 'CAR' },
  { name: 'Chicago Bears', abbr: 'CHI' },
  { name: 'Cincinnati Bengals', abbr: 'CIN' },
  { name: 'Cleveland Browns', abbr: 'CLE' },
  { name: 'Dallas Cowboys', abbr: 'DAL' },
  { name: 'Denver Broncos', abbr: 'DEN' },
  { name: 'Detroit Lions', abbr: 'DET' },
  { name: 'Green Bay Packers', abbr: 'GB' },
  { name: 'Houston Texans', abbr: 'HOU' },
  { name: 'Indianapolis Colts', abbr: 'IND' },
  { name: 'Jacksonville Jaguars', abbr: 'JAX' },
  { name: 'Kansas City Chiefs', abbr: 'KC' },
  { name: 'Las Vegas Raiders', abbr: 'LV' },
  { name: 'Los Angeles Chargers', abbr: 'LAC' },
  { name: 'Los Angeles Rams', abbr: 'LAR' },
  { name: 'Miami Dolphins', abbr: 'MIA' },
  { name: 'Minnesota Vikings', abbr: 'MIN' },
  { name: 'New England Patriots', abbr: 'NE' },
  { name: 'New Orleans Saints', abbr: 'NO' },
  { name: 'New York Giants', abbr: 'NYG' },
  { name: 'New York Jets', abbr: 'NYJ' },
  { name: 'Philadelphia Eagles', abbr: 'PHI' },
  { name: 'Pittsburgh Steelers', abbr: 'PIT' },
  { name: 'San Francisco 49ers', abbr: 'SF' },
  { name: 'Seattle Seahawks', abbr: 'SEA' },
  { name: 'Tampa Bay Buccaneers', abbr: 'TB' },
  { name: 'Tennessee Titans', abbr: 'TEN' },
  { name: 'Washington Commanders', abbr: 'WAS' }
]

export default function Favorites() {
  const [user, setUser] = useState(null)
  const [favoriteTeams, setFavoriteTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/')
        return
      }
      
      setUser(currentUser)
      
      try {
        const userDocRef = doc(db, 'users', currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const data = userDoc.data()
          setFavoriteTeams(data.favoriteTeams || [])
        }
      } catch (error) {
        console.error('Error loading favorites:', error)
        setMessage('Error loading your favorites')
      } finally {
        setLoading(false)
      }
    })
    
    return () => unsub()
  }, [navigate])

  const toggleTeam = (teamName) => {
    setFavoriteTeams(prev => {
      if (prev.includes(teamName)) {
        return prev.filter(t => t !== teamName)
      } else {
        return [...prev, teamName]
      }
    })
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    setMessage('')
    
    try {
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        favoriteTeams,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      
      setMessage('Favorites saved successfully!')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      console.error('Error saving favorites:', error)
      setMessage('Error saving favorites. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading-message">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>Manage Your Favorite Teams</h1>
        <p>Select the NFL teams you want to follow. Games featuring your favorite teams will be highlighted on the home page.</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="teams-grid">
        {NFL_TEAMS.map(team => (
          <div
            key={team.abbr}
            className={`team-card ${favoriteTeams.includes(team.name) ? 'selected' : ''}`}
            onClick={() => toggleTeam(team.name)}
          >
            <div className="team-abbr">{team.abbr}</div>
            <div className="team-name">{team.name}</div>
            {favoriteTeams.includes(team.name) && (
              <div className="selected-indicator">★</div>
            )}
          </div>
        ))}
      </div>

      <div className="favorites-actions">
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Favorites'}
        </button>
        <button 
          className="cancel-button" 
          onClick={() => navigate('/')}
          disabled={saving}
        >
          Cancel
        </button>
      </div>

      <div className="favorites-info">
        <p>Selected: {favoriteTeams.length} team{favoriteTeams.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}
