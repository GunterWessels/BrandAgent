export interface FollowUpSchedule {
  id: string
  userId: string
  scheduledDate: Date
  type: "analysis" | "check-in" | "progress-review"
  status: "scheduled" | "completed" | "cancelled"
  reminderSent: boolean
}

export class FollowUpService {
  static scheduleFollowUp(
    userProfile: any,
    followUpType: "analysis" | "check-in" | "progress-review" = "analysis",
    daysFromNow = 30,
  ): FollowUpSchedule {
    const scheduledDate = new Date()
    scheduledDate.setDate(scheduledDate.getDate() + daysFromNow)

    const followUp: FollowUpSchedule = {
      id: `followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userProfile.name.replace(/\s+/g, "_").toLowerCase(),
      scheduledDate,
      type: followUpType,
      status: "scheduled",
      reminderSent: false,
    }

    // Store in localStorage for demo purposes
    // In production, this would be stored in a database
    const existingFollowUps = this.getStoredFollowUps()
    existingFollowUps.push(followUp)
    localStorage.setItem("brandsmarts_followups", JSON.stringify(existingFollowUps))

    return followUp
  }

  static getStoredFollowUps(): FollowUpSchedule[] {
    try {
      const stored = localStorage.getItem("brandsmarts_followups")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static getUserFollowUps(userId: string): FollowUpSchedule[] {
    return this.getStoredFollowUps().filter((f) => f.userId === userId)
  }

  static cancelFollowUp(followUpId: string): boolean {
    const followUps = this.getStoredFollowUps()
    const index = followUps.findIndex((f) => f.id === followUpId)

    if (index !== -1) {
      followUps[index].status = "cancelled"
      localStorage.setItem("brandsmarts_followups", JSON.stringify(followUps))
      return true
    }

    return false
  }

  static getFollowUpRecommendations(userProfile: any): Array<{
    type: "analysis" | "check-in" | "progress-review"
    title: string
    description: string
    recommendedDays: number
  }> {
    return [
      {
        type: "check-in",
        title: "2-Week Progress Check",
        description: "Quick review of implemented recommendations and early results",
        recommendedDays: 14,
      },
      {
        type: "analysis",
        title: "30-Day Re-Analysis",
        description: "Full brand analysis to measure improvements and identify new opportunities",
        recommendedDays: 30,
      },
      {
        type: "progress-review",
        title: "90-Day Strategic Review",
        description: "Comprehensive review of brand growth and strategic planning for next quarter",
        recommendedDays: 90,
      },
    ]
  }
}
