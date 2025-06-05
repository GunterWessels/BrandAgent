export interface ExaSearchResult {
  title: string
  url: string
  content: string
  publishedDate?: string
  author?: string
}

export interface ProfileScrapingResult {
  linkedinData?: {
    headline?: string
    summary?: string
    experience?: string[]
    skills?: string[]
    recommendations?: number
    connectionCount?: string
    activityFrequency?: string
    engagementRate?: string
  }
  twitterData?: {
    bio?: string
    followerCount?: number
    followingCount?: number
    tweetCount?: number
    recentTweets?: string[]
    engagementRate?: string
    hashtagsUsed?: string[]
  }
  webPresence?: {
    domains?: string[]
    articles?: ExaSearchResult[]
    mentions?: ExaSearchResult[]
  }
}

export class ExaService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private hasValidApiKey(): boolean {
    return this.apiKey && this.apiKey.length > 0 && this.apiKey !== ""
  }

  async scrapeLinkedInProfile(profileUrl: string): Promise<any> {
    try {
      if (!this.hasValidApiKey()) {
        console.warn("EXA API key not available, using mock data for LinkedIn scraping")
        return this.getMockLinkedInData(profileUrl)
      }

      // TODO: Implement actual EXA API call when API key is available
      console.log(`Scraping LinkedIn profile with EXA: ${profileUrl}`)

      // For now, simulate API delay and return enhanced mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return this.getMockLinkedInData(profileUrl)
    } catch (error) {
      console.error("Error scraping LinkedIn profile:", error)
      return this.getMockLinkedInData(profileUrl)
    }
  }

  async scrapeTwitterProfile(handle: string): Promise<any> {
    try {
      if (!this.hasValidApiKey()) {
        console.warn("EXA API key not available, using mock data for Twitter scraping")
        return this.getMockTwitterData(handle)
      }

      // TODO: Implement actual EXA API call when API key is available
      console.log(`Scraping Twitter profile with EXA: ${handle}`)

      // For now, simulate API delay and return enhanced mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return this.getMockTwitterData(handle)
    } catch (error) {
      console.error("Error scraping Twitter profile:", error)
      return this.getMockTwitterData(handle)
    }
  }

  async searchWebPresence(name: string, industry: string): Promise<ExaSearchResult[]> {
    try {
      if (!this.hasValidApiKey()) {
        console.warn("EXA API key not available, using mock data for web presence search")
        return this.getMockWebPresence(name, industry)
      }

      // TODO: Implement actual EXA API call when API key is available
      console.log(`Searching web presence with EXA for: ${name} in ${industry}`)

      // For now, simulate API delay and return enhanced mock data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return this.getMockWebPresence(name, industry)
    } catch (error) {
      console.error("Error searching web presence:", error)
      return this.getMockWebPresence(name, industry)
    }
  }

  async getIndustryBenchmarks(industry: string): Promise<any> {
    try {
      if (!this.hasValidApiKey()) {
        console.warn("EXA API key not available, using static benchmarks")
      }

      // Industry benchmarks can be static or enhanced with EXA data
      console.log(`Getting industry benchmarks for: ${industry}`)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const benchmarks = {
        "Medical Device Sales": {
          linkedinHeadlineFormat:
            "[Title] | Helping [Healthcare Organizations] [Improve Patient Outcomes] | [Specialization]",
          keySkills: [
            "Medical Devices",
            "Healthcare Sales",
            "Hospital Relationships",
            "Clinical Knowledge",
            "Value-Based Selling",
          ],
          contentTopics: [
            "Healthcare Innovation",
            "Surgical Techniques",
            "Patient Outcomes",
            "Hospital Administration",
            "Value-Based Care",
          ],
          thoughtLeadershipScore: 75,
          networkQualityScore: 80,
        },
        "Software Engineering": {
          linkedinHeadlineFormat: "[Role] | [Programming Languages] Developer | Building [Type of Solutions]",
          keySkills: ["Software Development", "Cloud Architecture", "DevOps", "Agile Methodologies", "System Design"],
          contentTopics: [
            "Software Architecture",
            "Development Best Practices",
            "New Technologies",
            "Open Source",
            "Tech Leadership",
          ],
          thoughtLeadershipScore: 70,
          networkQualityScore: 75,
        },
        "Financial Services": {
          linkedinHeadlineFormat: "[Financial Role] | Helping [Client Type] [Achieve Financial Goals] | [Credentials]",
          keySkills: [
            "Financial Analysis",
            "Wealth Management",
            "Risk Assessment",
            "Client Relationships",
            "Regulatory Compliance",
          ],
          contentTopics: [
            "Market Trends",
            "Investment Strategies",
            "Retirement Planning",
            "Tax Optimization",
            "Economic Outlook",
          ],
          thoughtLeadershipScore: 65,
          networkQualityScore: 85,
        },
        Marketing: {
          linkedinHeadlineFormat:
            "[Marketing Role] | Driving [Growth/Engagement] for [Industry/Company Type] | [Specialization]",
          keySkills: ["Digital Marketing", "Brand Strategy", "Content Creation", "Analytics", "Campaign Management"],
          contentTopics: [
            "Marketing Trends",
            "Brand Building",
            "Customer Experience",
            "Digital Transformation",
            "Analytics",
          ],
          thoughtLeadershipScore: 80,
          networkQualityScore: 75,
        },
      }

      return (
        benchmarks[industry] || {
          linkedinHeadlineFormat: "[Role] | Helping [Target Audience] [Achieve Goal] | [Specialization/Credential]",
          keySkills: [
            "Communication",
            "Industry Knowledge",
            "Relationship Building",
            "Problem Solving",
            "Strategic Thinking",
          ],
          contentTopics: [
            "Industry Trends",
            "Best Practices",
            "Case Studies",
            "Professional Development",
            "Thought Leadership",
          ],
          thoughtLeadershipScore: 70,
          networkQualityScore: 70,
        }
      )
    } catch (error) {
      console.error("Error getting industry benchmarks:", error)
      return null
    }
  }

  private getMockLinkedInData(profileUrl: string) {
    return {
      headline: "Senior Medical Device Sales Representative | Helping Hospitals Improve Patient Outcomes",
      summary:
        "Experienced medical device sales professional with 8+ years helping healthcare organizations implement cutting-edge surgical technologies.",
      experience: [
        "Senior Sales Rep at MedTech Inc. (2018-Present)",
        "Territory Manager at Surgical Innovations (2015-2018)",
      ],
      skills: ["Medical Devices", "Sales", "Healthcare", "CRM", "Negotiation"],
      recommendations: 12,
      connectionCount: "500+",
      activityFrequency: "Weekly",
      engagementRate: "Medium",
    }
  }

  private getMockTwitterData(handle: string) {
    return {
      bio: "Medical device sales professional | Healthcare tech enthusiast | Helping improve patient outcomes",
      followerCount: 850,
      followingCount: 1200,
      tweetCount: 1450,
      recentTweets: [
        "Excited to attend the #MedTech conference next week!",
        "New study shows improved outcomes with our latest surgical device",
      ],
      engagementRate: "Low",
      hashtagsUsed: ["#MedTech", "#Healthcare", "#Surgery"],
    }
  }

  private getMockWebPresence(name: string, industry: string): ExaSearchResult[] {
    return [
      {
        title: `${name} discusses innovation in ${industry}`,
        url: "https://example.com/article1",
        content: `In a recent interview, ${name} shared insights about the future of ${industry} and how professionals can stay ahead of the curve.`,
        publishedDate: "2023-10-15",
      },
      {
        title: `Industry leaders in ${industry} to watch`,
        url: "https://example.com/article2",
        content: `${name} was featured in our list of top professionals making an impact in ${industry} this year.`,
        publishedDate: "2023-08-22",
      },
    ]
  }
}
