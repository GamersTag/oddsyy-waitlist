// Firebase Auth is only needed by /admin, which is lazy-loaded, so this module
// stays out of the landing-page bundle.
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth'
import { app } from './firebase'

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// Local testing only, e.g. VITE_AUTH_EMULATOR=http://127.0.0.1:9099 npm run dev
if (import.meta.env.DEV && import.meta.env.VITE_AUTH_EMULATOR) {
  connectAuthEmulator(auth, import.meta.env.VITE_AUTH_EMULATOR, { disableWarnings: true })
}
