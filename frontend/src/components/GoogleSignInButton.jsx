import { auth, provider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }, { merge: true });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <button onClick={handleSignIn}>
      Sign in with Google
    </button>
  );
}