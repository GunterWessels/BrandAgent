interface UserProfile {
  id: string
  name: string
  linkedinUrl?: string
  twitterHandle?: string
  industry?: string
  goals?: string
  createdAt: Date
  updatedAt: Date
}

interface AssessmentHistory {
  id: string
  userId: string
  assessment: any
  scores: any
  recommendations: any
  createdAt: Date
}

interface ActionHistory {
  id: string
  userId: string
  assessmentId: string
  actionType: string
  actionData: any
  result: any
  createdAt: Date
}

export class MemoryStore {
  private profiles: Map<string, UserProfile> = new Map()
  private assessments: Map<string, AssessmentHistory> = new Map()
  private actions: Map<string, ActionHistory> = new Map()

  // User Profile Management
  async saveUserProfile(profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">): Promise<UserProfile> {
    const id = this.generateId()
    const now = new Date()
    const userProfile: UserProfile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now,
    }

    this.profiles.set(id, userProfile)

    // In production, this would save to a database
    if (typeof window !== "undefined") {
      localStorage.setItem(`profile_${id}`, JSON.stringify(userProfile))
    }

    return userProfile
  }

  async getUserProfile(id: string): Promise<UserProfile | null> {
    let profile = this.profiles.get(id)

    if (!profile && typeof window !== "undefined") {
      const stored = localStorage.getItem(`profile_${id}`)
      if (stored) {
        profile = JSON.parse(stored)
        if (profile) {
          this.profiles.set(id, profile)
        }
      }
    }

    return profile || null
  }

  async findUserByEmail(email: string): Promise<UserProfile | null> {
    // In production, this would query a database
    for (const profile of this.profiles.values()) {
      if (profile.linkedinUrl?.includes(email) || profile.name.toLowerCase().includes(email.toLowerCase())) {
        return profile
      }
    }
    return null
  }

  // Assessment History
  async saveAssessment(assessment: Omit<AssessmentHistory, "id" | "createdAt">): Promise<AssessmentHistory> {
    const id = this.generateId()
    const assessmentRecord: AssessmentHistory = {
      ...assessment,
      id,
      createdAt: new Date(),
    }

    this.assessments.set(id, assessmentRecord)

    if (typeof window !== "undefined") {
      localStorage.setItem(`assessment_${id}`, JSON.stringify(assessmentRecord))
    }

    return assessmentRecord
  }

  async getAssessmentHistory(userId: string): Promise<AssessmentHistory[]> {
    const userAssessments: AssessmentHistory[] = []

    for (const assessment of this.assessments.values()) {
      if (assessment.userId === userId) {
        userAssessments.push(assessment)
      }
    }

    // Also check localStorage
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("assessment_")) {
          const stored = localStorage.getItem(key)
          if (stored) {
            const assessment = JSON.parse(stored)
            if (assessment.userId === userId && !userAssessments.find((a) => a.id === assessment.id)) {
              userAssessments.push(assessment)
            }
          }
        }
      }
    }

    return userAssessments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Action History
  async saveAction(action: Omit<ActionHistory, "id" | "createdAt">): Promise<ActionHistory> {
    const id = this.generateId()
    const actionRecord: ActionHistory = {
      ...action,
      id,
      createdAt: new Date(),
    }

    this.actions.set(id, actionRecord)

    if (typeof window !== "undefined") {
      localStorage.setItem(`action_${id}`, JSON.stringify(actionRecord))
    }

    return actionRecord
  }

  async getActionHistory(userId: string, assessmentId?: string): Promise<ActionHistory[]> {
    const userActions: ActionHistory[] = []

    for (const action of this.actions.values()) {
      if (action.userId === userId && (!assessmentId || action.assessmentId === assessmentId)) {
        userActions.push(action)
      }
    }

    return userActions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export const memoryStore = new MemoryStore()
