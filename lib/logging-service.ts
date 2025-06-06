import { FirebaseService } from "./firebase-service"

export interface InteractionLog {
  sessionId: string
  timestamp: Date
  userInfo: {
    name: string
    email?: string
    industry: string
    ipAddress?: string
    userAgent?: string
    location?: {
      url: string
      pathname: string
      search: string
      referrer: string
    }
  }
  timing: {
    sessionStart: Date
    analysisStart?: Date
    analysisComplete?: Date
    totalDuration?: number
    stepDurations: Record<string, number>
  }
  interactions: {
    formSubmission: any
    interactiveAnswers: Record<string, any>
    additionalInsights: Record<string, any>
    buttonClicks: Array<{
      action: string
      timestamp: Date
      element: string
    }>
    pageViews: Array<{
      page: string
      timestamp: Date
      duration?: number
    }>
  }
  systemEvents: {
    apiCalls: Array<{
      endpoint: string
      method: string
      timestamp: Date
      duration: number
      success: boolean
      error?: string
    }>
    ragUpdates: Array<{
      type: "profile_analysis" | "content_generation" | "recommendation_update"
      timestamp: Date
      data: any
      success: boolean
    }>
    externalServices: Array<{
      service: "openai" | "exa" | "email" | "firebase"
      action: string
      timestamp: Date
      success: boolean
      error?: string
    }>
  }
  outputs: {
    analysisResults: any
    recommendations: any[]
    generatedContent: any
    exportedDocuments: Array<{
      type: "pdf" | "word"
      timestamp: Date
      filename: string
    }>
    followUpScheduled?: any
  }
  performance: {
    loadTimes: Record<string, number>
    errorCount: number
    warningCount: number
    memoryUsage?: number
  }
}

export class LoggingService {
  private static instance: LoggingService
  private currentSession: InteractionLog | null = null
  private sessionStartTime: Date | null = null

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService()
    }
    return LoggingService.instance
  }

  startSession(userInfo: any, locationData?: any): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.sessionStartTime = new Date()

    this.currentSession = {
      sessionId,
      timestamp: this.sessionStartTime,
      userInfo: {
        name: userInfo.name || "Anonymous",
        email: userInfo.email,
        industry: userInfo.industry || "Unknown",
        ipAddress: this.getClientIP(),
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "Server",
        location: locationData || this.getLocationData(),
      },
      timing: {
        sessionStart: this.sessionStartTime,
        stepDurations: {},
      },
      interactions: {
        formSubmission: userInfo,
        interactiveAnswers: {},
        additionalInsights: {},
        buttonClicks: [],
        pageViews: [],
      },
      systemEvents: {
        apiCalls: [],
        ragUpdates: [],
        externalServices: [],
      },
      outputs: {
        analysisResults: null,
        recommendations: [],
        generatedContent: null,
        exportedDocuments: [],
      },
      performance: {
        loadTimes: {},
        errorCount: 0,
        warningCount: 0,
      },
    }

    this.logPageView("session_start")
    return sessionId
  }

  log(message: string, data?: any) {
    console.log(`[${new Date().toISOString()}] ${message}`, data || "")
  }

  error(message: string, error?: any) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || "")
    if (this.currentSession) {
      this.currentSession.performance.errorCount++
    }
  }

  logApiCall(endpoint: string, method: string, duration: number, success: boolean, error?: string) {
    if (!this.currentSession) return

    this.currentSession.systemEvents.apiCalls.push({
      endpoint,
      method,
      timestamp: new Date(),
      duration,
      success,
      error,
    })

    if (!success) {
      this.currentSession.performance.errorCount++
    }
  }

  logExternalService(
    service: "openai" | "exa" | "email" | "firebase",
    action: string,
    success: boolean,
    error?: string,
  ) {
    if (!this.currentSession) return

    this.currentSession.systemEvents.externalServices.push({
      service,
      action,
      timestamp: new Date(),
      success,
      error,
    })
  }

  logRAGUpdate(type: "profile_analysis" | "content_generation" | "recommendation_update", data: any, success: boolean) {
    if (!this.currentSession) return

    const sanitizedData = this.sanitizeData(data)

    this.currentSession.systemEvents.ragUpdates.push({
      type,
      timestamp: new Date(),
      data: sanitizedData,
      success,
    })

    // Only try Firebase if we're on the client side and it's available
    if (typeof window !== "undefined" && FirebaseService.isAvailable()) {
      FirebaseService.storeRAGUpdate(type, sanitizedData)
        .then((id) => {
          if (id) {
            this.logExternalService("firebase", "store_rag_update", true)
          } else {
            this.logExternalService("firebase", "store_rag_update", false, "Failed to store RAG update")
          }
        })
        .catch((error) => {
          this.logExternalService("firebase", "store_rag_update", false, error.message)
        })
    }
  }

  logInteractiveAnswer(questionId: string, answer: any) {
    if (!this.currentSession) return

    this.currentSession.interactions.interactiveAnswers[questionId] = {
      answer,
      timestamp: new Date(),
    }
  }

  logAdditionalInsights(insights: Record<string, any>) {
    if (!this.currentSession) return

    this.currentSession.interactions.additionalInsights = {
      ...this.currentSession.interactions.additionalInsights,
      ...insights,
      timestamp: new Date(),
    }
  }

  logButtonClick(action: string, element: string) {
    if (!this.currentSession) return

    this.currentSession.interactions.buttonClicks.push({
      action,
      element,
      timestamp: new Date(),
    })
  }

  logPageView(page: string) {
    if (!this.currentSession) return

    // End previous page view
    const pageViews = this.currentSession.interactions.pageViews
    if (pageViews.length > 0) {
      const lastView = pageViews[pageViews.length - 1]
      if (!lastView.duration) {
        lastView.duration = Date.now() - lastView.timestamp.getTime()
      }
    }

    // Start new page view
    pageViews.push({
      page,
      timestamp: new Date(),
    })
  }

  logStepTiming(stepName: string, duration: number) {
    if (!this.currentSession) return

    this.currentSession.timing.stepDurations[stepName] = duration
  }

  logAnalysisStart() {
    if (!this.currentSession) return

    this.currentSession.timing.analysisStart = new Date()
  }

  logAnalysisComplete(results: any) {
    if (!this.currentSession) return

    this.currentSession.timing.analysisComplete = new Date()
    if (this.currentSession.timing.analysisStart) {
      this.currentSession.timing.totalDuration =
        this.currentSession.timing.analysisComplete.getTime() - this.currentSession.timing.analysisStart.getTime()
    }

    this.currentSession.outputs.analysisResults = this.sanitizeData(results)
  }

  logRecommendations(recommendations: any[]) {
    if (!this.currentSession) return

    this.currentSession.outputs.recommendations = recommendations.map((rec) => this.sanitizeData(rec))
  }

  logGeneratedContent(content: any) {
    if (!this.currentSession) return

    this.currentSession.outputs.generatedContent = this.sanitizeData(content)
  }

  logDocumentExport(type: "pdf" | "word", filename: string) {
    if (!this.currentSession) return

    this.currentSession.outputs.exportedDocuments.push({
      type,
      filename,
      timestamp: new Date(),
    })
  }

  logFollowUpScheduled(followUp: any) {
    if (!this.currentSession) return

    this.currentSession.outputs.followUpScheduled = this.sanitizeData(followUp)
  }

  logPerformanceMetric(metric: string, value: number) {
    if (!this.currentSession) return

    this.currentSession.performance.loadTimes[metric] = value
  }

  private async storeLogWithFallback(log: InteractionLog): Promise<void> {
    const storageAttempts = []

    // Always try localStorage first (most reliable)
    try {
      this.storeLogLocally(log)
      storageAttempts.push({ method: "localStorage", success: true })
      this.log("Log stored in localStorage successfully")
    } catch (error) {
      storageAttempts.push({ method: "localStorage", success: false, error: error.message })
      this.error("Failed to store log in localStorage:", error)
    }

    // Try Firebase if available (client-side only)
    if (typeof window !== "undefined" && FirebaseService.isAvailable()) {
      try {
        await FirebaseService.storeSessionLog(log)
        storageAttempts.push({ method: "firebase", success: true })
        this.logExternalService("firebase", "store_session_log", true)
        this.log("Log stored in Firebase successfully")
      } catch (error) {
        storageAttempts.push({ method: "firebase", success: false, error: error.message })
        this.logExternalService("firebase", "store_session_log", false, error.message)
        this.error("Failed to store log in Firebase:", error)
      }
    }

    // Try email/Supabase via API (don't let this fail the whole process)
    try {
      await this.sendLogToEmail(log)
      storageAttempts.push({ method: "email_api", success: true })
      this.log("Log sent via email API successfully")
    } catch (error) {
      storageAttempts.push({ method: "email_api", success: false, error: error.message })
      this.error("Failed to send log via email API:", error)
      // Don't throw - this is not critical
    }

    // Log the results
    const successfulMethods = storageAttempts.filter((attempt) => attempt.success).map((attempt) => attempt.method)
    const failedMethods = storageAttempts.filter((attempt) => !attempt.success)

    if (successfulMethods.length > 0) {
      this.log(`Session log stored successfully via: ${successfulMethods.join(", ")}`)
    }

    if (failedMethods.length > 0) {
      this.log(`Some storage methods failed: ${failedMethods.map((f) => f.method).join(", ")}`)
    }

    // As long as localStorage worked, we consider this a success
    const localStorageSuccess = storageAttempts.find((attempt) => attempt.method === "localStorage" && attempt.success)
    if (localStorageSuccess) {
      return Promise.resolve()
    } else {
      throw new Error("Critical: localStorage failed - all storage methods failed")
    }
  }

  async endSession(): Promise<void> {
    if (!this.currentSession) return

    // Finalize timing
    const endTime = new Date()
    if (this.sessionStartTime) {
      this.currentSession.timing.totalDuration = endTime.getTime() - this.sessionStartTime.getTime()
    }

    // End last page view
    const pageViews = this.currentSession.interactions.pageViews
    if (pageViews.length > 0) {
      const lastView = pageViews[pageViews.length - 1]
      if (!lastView.duration) {
        lastView.duration = Date.now() - lastView.timestamp.getTime()
      }
    }

    try {
      // Use the fallback storage method
      await this.storeLogWithFallback(this.currentSession)
      this.log(`Session ${this.currentSession.sessionId} ended and logged successfully`)
    } catch (error) {
      this.error("Error ending session", error)
      // Store failed session for retry
      this.storeFailedSessionLog(this.currentSession)
    }

    // Clear current session
    this.currentSession = null
    this.sessionStartTime = null
  }

  private async sendLogToEmail(log: InteractionLog): Promise<void> {
    const emailContent = this.formatLogForEmail(log)

    // Send via API route with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch("/api/send-log-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          log,
          emailContent,
          subject: `BrandAgent Session Log - ${log.userInfo.name} - ${log.timestamp.toISOString()}`,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(
          `Failed to send log email: ${response.statusText} - ${responseData.details || responseData.error}`,
        )
      }

      this.logExternalService("email", "send_log_email", true)
    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === "AbortError") {
        throw new Error("Email API request timed out")
      }

      this.logExternalService("email", "send_log_email", false, error.message)

      // Store failed email attempts for retry
      this.storeFailedEmailLog(log)

      throw error
    }
  }

  private formatLogForEmail(log: InteractionLog): string {
    return `
# BrandAgent Session Log

## Session Information
- **Session ID**: ${log.sessionId}
- **Timestamp**: ${log.timestamp.toISOString()}
- **Duration**: ${log.timing.totalDuration ? `${Math.round(log.timing.totalDuration / 1000)}s` : "N/A"}

## User Information
- **Name**: ${log.userInfo.name}
- **Email**: ${log.userInfo.email || "Not provided"}
- **Industry**: ${log.userInfo.industry}
- **IP Address**: ${log.userInfo.ipAddress || "Unknown"}
- **User Agent**: ${log.userInfo.userAgent}
- **URL**: ${log.userInfo.location?.url || "Unknown"}
- **Referrer**: ${log.userInfo.location?.referrer || "Direct"}

## Performance Summary
- **Total Duration**: ${log.timing.totalDuration ? `${Math.round(log.timing.totalDuration / 1000)}s` : "N/A"}
- **Errors**: ${log.performance.errorCount}
- **Warnings**: ${log.performance.warningCount}
- **API Calls**: ${log.systemEvents.apiCalls.length}
- **Button Clicks**: ${log.interactions.buttonClicks.length}
- **Page Views**: ${log.interactions.pageViews.length}

## Outputs Generated
- **Analysis Results**: ${log.outputs.analysisResults ? "✅" : "❌"}
- **Recommendations**: ${log.outputs.recommendations.length}
- **Generated Content**: ${log.outputs.generatedContent ? "✅" : "❌"}
- **Exported Documents**: ${log.outputs.exportedDocuments.length}
- **Follow-up Scheduled**: ${log.outputs.followUpScheduled ? "✅" : "❌"}

---
*Generated by BrandAgent Logging Service*
    `.trim()
  }

  private storeLogLocally(log: InteractionLog): void {
    const logs = this.getStoredLogs()
    logs.push(log)

    // Keep only last 50 logs locally
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50)
    }

    localStorage.setItem("brandagent_logs", JSON.stringify(logs))
  }

  private storeFailedEmailLog(log: InteractionLog): void {
    try {
      const failedLogs = JSON.parse(localStorage.getItem("brandagent_failed_logs") || "[]")
      failedLogs.push(log)
      localStorage.setItem("brandagent_failed_logs", JSON.stringify(failedLogs))
    } catch (error) {
      this.error("Failed to store failed email log:", error)
    }
  }

  private storeFailedSessionLog(log: InteractionLog): void {
    try {
      const failedSessions = JSON.parse(localStorage.getItem("brandagent_failed_sessions") || "[]")
      failedSessions.push(log)
      localStorage.setItem("brandagent_failed_sessions", JSON.stringify(failedSessions))
    } catch (error) {
      this.error("Failed to store failed session log:", error)
    }
  }

  private getStoredLogs(): InteractionLog[] {
    try {
      return JSON.parse(localStorage.getItem("brandagent_logs") || "[]")
    } catch {
      return []
    }
  }

  private sanitizeData(data: any): any {
    if (!data) return data

    const sanitized = JSON.parse(JSON.stringify(data))

    // Remove potential sensitive fields
    if (sanitized.apiKey) delete sanitized.apiKey
    if (sanitized.password) delete sanitized.password
    if (sanitized.token) delete sanitized.token

    return sanitized
  }

  private getClientIP(): string {
    return "Client IP detection requires server-side implementation"
  }

  private getLocationData(): any {
    if (typeof window === "undefined") return null

    return {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer,
    }
  }

  getCurrentSession(): InteractionLog | null {
    return this.currentSession
  }

  getSessionId(): string | null {
    return this.currentSession?.sessionId || null
  }
}
