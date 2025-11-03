import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import GoogleSignInButton from './GoogleSignInButton'
import './Navbar.css'

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsub()
  }, [])

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (e) {
      console.error('Sign out error', e)
    }
  }

  return (
    <header className="rp-navbar">
      <div className="rp-navbar-left">
        <Link to="/" className="rp-brand">Rookie Play</Link>
        <nav className="rp-navlinks">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
          {user && (
            <NavLink to="/favorites" className={({isActive}) => isActive ? 'active' : ''}>Favorites</NavLink>
          )}
          <NavLink to="/FAQ" className={({isActive}) => isActive ? 'active' : ''}>FAQ</NavLink>
        </nav>
      </div>

      <div className="rp-navbar-right">
        {user ? (
          <div className="rp-user">
            {user.photoURL ? <img className="rp-avatar" src={user.photoURL} alt={user.displayName || 'user'} /> : null}
            <span className="rp-username">{user.displayName || user.email}</span>
            <button className="rp-signout" onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <GoogleSignInButton />
        )}
      </div>
    </header>
  )
}
