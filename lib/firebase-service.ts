import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs, limit } from "firebase/firestore"
import { getStorage, ref, uploadString } from "firebase/storage"
import type { InteractionLog } from "./logging-service"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only on client side
let app: any = null
let db: any = null
let storage: any = null

const initializeFirebase = () => {
  if (typeof window !== "undefined" && !app) {
    try {
      // Check if we have the required config
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.warn("Firebase configuration incomplete, skipping initialization")
        return false
      }

      app = initializeApp(firebaseConfig)
      db = getFirestore(app)
      storage = getStorage(app)
      console.log("Firebase initialized successfully")
      return true
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      return false
    }
  }
  return !!app
}

export class FirebaseService {
  /**
   * Store a session log in Firebase Firestore and Storage
   */
  static async storeSessionLog(log: InteractionLog): Promise<string | null> {
    try {
      if (!initializeFirebase()) {
        console.warn("Firebase not available, skipping storage")
        return null
      }

      // Store metadata and summary in Firestore
      const logSummary = {
        sessionId: log.sessionId,
        timestamp: serverTimestamp(),
        userInfo: {
          name: log.userInfo.name,
          industry: log.userInfo.industry,
          ipAddress: log.userInfo.ipAddress,
        },
        timing: {
          sessionStart: log.timing.sessionStart,
          analysisStart: log.timing.analysisStart,
          analysisComplete: log.timing.analysisComplete,
          totalDuration: log.timing.totalDuration,
        },
        interactionCounts: {
          buttonClicks: log.interactions.buttonClicks.length,
          pageViews: log.interactions.pageViews.length,
          apiCalls: log.systemEvents.apiCalls.length,
          ragUpdates: log.systemEvents.ragUpdates.length,
        },
        outputCounts: {
          recommendations: log.outputs.recommendations.length,
          exportedDocuments: log.outputs.exportedDocuments.length,
        },
        performance: {
          errorCount: log.performance.errorCount,
          warningCount: log.performance.warningCount,
        },
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, "session_logs"), logSummary)
      console.log("Session log summary stored in Firestore with ID:", docRef.id)

      // Store full log in Firebase Storage
      if (storage) {
        const storageRef = ref(storage, `logs/${log.sessionId}_${Date.now()}.json`)
        const fullLogJson = JSON.stringify(log, null, 2)
        await uploadString(storageRef, fullLogJson, "raw")
        console.log("Full session log stored in Firebase Storage")
      }

      return docRef.id
    } catch (error) {
      console.error("Error storing session log in Firebase:", error)
      return null
    }
  }

  /**
   * Get recent session logs from Firestore
   */
  static async getRecentLogs(limitCount = 50): Promise<any[]> {
    try {
      if (!initializeFirebase()) {
        console.warn("Firebase not available, returning empty logs")
        return []
      }

      const logsQuery = query(collection(db, "session_logs"), orderBy("timestamp", "desc"), limit(limitCount))
      const querySnapshot = await getDocs(logsQuery)

      const logs: any[] = []
      querySnapshot.forEach((doc) => {
        logs.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      return logs
    } catch (error) {
      console.error("Error getting recent logs from Firebase:", error)
      return []
    }
  }

  /**
   * Store RAG update in Firebase
   */
  static async storeRAGUpdate(type: string, data: any): Promise<string | null> {
    try {
      if (!initializeFirebase()) {
        console.warn("Firebase not available, skipping RAG update storage")
        return null
      }

      const ragUpdate = {
        type,
        timestamp: serverTimestamp(),
        data: JSON.parse(JSON.stringify(data)), // Sanitize data
      }

      const docRef = await addDoc(collection(db, "rag_updates"), ragUpdate)
      console.log("RAG update stored in Firebase with ID:", docRef.id)

      return docRef.id
    } catch (error) {
      console.error("Error storing RAG update in Firebase:", error)
      return null
    }
  }

  /**
   * Check if Firebase is available and configured
   */
  static isAvailable(): boolean {
    return initializeFirebase()
  }
}
