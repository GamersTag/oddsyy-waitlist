import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Local testing only, e.g. VITE_FIRESTORE_EMULATOR=127.0.0.1:8080 npm run dev
if (import.meta.env.DEV && import.meta.env.VITE_FIRESTORE_EMULATOR) {
  const [host, port] = import.meta.env.VITE_FIRESTORE_EMULATOR.split(':')
  connectFirestoreEmulator(db, host, Number(port))
}
