import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin SDK
let firebaseAdmin
let adminDb
let adminStorage

if (typeof window === "undefined") {
  try {
    // Only initialize on server side
    if (!getApps().length) {
      // Use service account if available
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        firebaseAdmin = initializeApp({
          credential: cert(serviceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        })
      } else {
        // Fall back to application default credentials
        firebaseAdmin = initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        })
      }

      adminDb = getFirestore()
      adminStorage = getStorage()
      console.log("Firebase Admin initialized successfully")
    } else {
      firebaseAdmin = getApps()[0]
      adminDb = getFirestore()
      adminStorage = getStorage()
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
  }
}

export { firebaseAdmin, adminDb, adminStorage }
