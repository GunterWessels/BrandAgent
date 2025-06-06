export interface AnalyticsSummary {
  totalSessions: number
  completionRate: number
  averageSessionDuration: number
  popularIndustries: Array<{ industry: string; count: number }>
  commonIssues: Array<{ issue: string; frequency: number }>
  exportStats: {
    totalExports: number
    pdfExports: number
    wordExports: number
  }
  followUpStats: {
    scheduled: number
    completed: number
    cancelled: number
  }
  performanceMetrics: {
    averageLoadTime: number
    errorRate: number
    apiSuccessRate: number
  }
}

export class AnalyticsDashboard {
  static async generateSummary(): Promise<AnalyticsSummary> {
    const logs = this.getStoredLogs()

    return {
      totalSessions: logs.length,
      completionRate: this.calculateCompletionRate(logs),
      averageSessionDuration: this.calculateAverageSessionDuration(logs),
      popularIndustries: this.getPopularIndustries(logs),
      commonIssues: this.getCommonIssues(logs),
      exportStats: this.getExportStats(logs),
      followUpStats: this.getFollowUpStats(logs),
      performanceMetrics: this.getPerformanceMetrics(logs),
    }
  }

  private static getStoredLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem("brandagent_logs") || "[]")
    } catch {
      return []
    }
  }

  private static calculateCompletionRate(logs: any[]): number {
    const completedSessions = logs.filter((log) => log.outputs.analysisResults && log.timing.analysisComplete).length
    return logs.length > 0 ? (completedSessions / logs.length) * 100 : 0
  }

  private static calculateAverageSessionDuration(logs: any[]): number {
    const durations = logs.filter((log) => log.timing.totalDuration).map((log) => log.timing.totalDuration)

    return durations.length > 0 ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length : 0
  }

  private static getPopularIndustries(logs: any[]): Array<{ industry: string; count: number }> {
    const industries = logs.reduce((acc, log) => {
      const industry = log.userInfo.industry || "Unknown"
      acc[industry] = (acc[industry] || 0) + 1
      return acc
    }, {})

    return Object.entries(industries)
      .map(([industry, count]) => ({ industry, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private static getCommonIssues(logs: any[]): Array<{ issue: string; frequency: number }> {
    const issues = logs.reduce((acc, log) => {
      log.systemEvents.apiCalls
        .filter((call) => !call.success)
        .forEach((call) => {
          const issue = call.error || "Unknown API Error"
          acc[issue] = (acc[issue] || 0) + 1
        })
      return acc
    }, {})

    return Object.entries(issues)
      .map(([issue, frequency]) => ({ issue, frequency: frequency as number }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)
  }

  private static getExportStats(logs: any[]) {
    const exports = logs.flatMap((log) => log.outputs.exportedDocuments || [])
    return {
      totalExports: exports.length,
      pdfExports: exports.filter((exp) => exp.type === "pdf").length,
      wordExports: exports.filter((exp) => exp.type === "word").length,
    }
  }

  private static getFollowUpStats(logs: any[]) {
    const followUps = logs.filter((log) => log.outputs.followUpScheduled)
    return {
      scheduled: followUps.length,
      completed: 0, // Would need to track this separately
      cancelled: 0, // Would need to track this separately
    }
  }

  private static getPerformanceMetrics(logs: any[]) {
    const apiCalls = logs.flatMap((log) => log.systemEvents.apiCalls || [])
    const loadTimes = logs.flatMap((log) => Object.values(log.performance.loadTimes || {}))

    return {
      averageLoadTime: loadTimes.length > 0 ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length : 0,
      errorRate: apiCalls.length > 0 ? (apiCalls.filter((call) => !call.success).length / apiCalls.length) * 100 : 0,
      apiSuccessRate:
        apiCalls.length > 0 ? (apiCalls.filter((call) => call.success).length / apiCalls.length) * 100 : 100,
    }
  }
}
