import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface BrandAnalysisPrompt {
  userInfo: any
  linkedinData?: any
  twitterData?: any
  industryContext?: string
}

export interface ContentGenerationRequest {
  type: "headline" | "summary" | "post" | "content-series"
  context: any
  userProfile: any
  industry: string
}

export class AIBrandAnalyst {
  private model = openai("gpt-4o")

  async analyzeLinkedInProfile(profileData: any, userInfo: any): Promise<any> {
    const prompt = `You are an expert personal brand strategist analyzing a LinkedIn profile for ${userInfo.name} in the ${userInfo.industry} industry.

Profile Data:
- Name: ${userInfo.name}
- Industry: ${userInfo.industry}
- LinkedIn URL: ${userInfo.linkedinUrl}
- Goals: ${userInfo.goals}

Analyze this profile and provide:
1. Professional Identity Score (0-100)
2. Key strengths (3-5 points)
3. Critical weaknesses (3-5 points)
4. Specific improvement opportunities
5. Industry-specific recommendations

Focus on medical device sales best practices and provide actionable insights.`

    const { text } = await generateText({
      model: this.model,
      prompt,
      system:
        "You are a personal branding expert specializing in medical device sales professionals. Provide specific, actionable insights based on industry best practices.",
    })

    return this.parseAnalysisResponse(text)
  }

  async generateOptimizedHeadline(currentHeadline: string, userProfile: any): Promise<string> {
    const prompt = `Create an optimized LinkedIn headline for ${userProfile.name}, a medical device sales professional.

Current headline: "${currentHeadline}"
Industry: ${userProfile.industry}
Goals: ${userProfile.goals}

Requirements:
- Include specific value proposition
- Mention target audience (hospitals, healthcare organizations)
- Include measurable outcomes or expertise
- Stay under 220 characters
- Use medical device sales best practices

Provide 3 headline options, then recommend the best one.`

    const { text } = await generateText({
      model: this.model,
      prompt,
      system:
        "You are a LinkedIn optimization expert specializing in medical device sales. Create compelling headlines that drive profile views and connections.",
    })

    return this.extractBestHeadline(text)
  }

  async generateProfileSummary(userProfile: any, currentSummary?: string): Promise<string> {
    const prompt = `Write an optimized LinkedIn summary for ${userProfile.name}, a medical device sales professional.

User Info:
- Industry: ${userProfile.industry}
- Goals: ${userProfile.goals}
- Current summary: ${currentSummary || "None provided"}

Requirements:
- Start with a compelling hook
- Include specific expertise and value proposition
- Mention target audience and outcomes
- Include relevant keywords for SEO
- End with a call-to-action
- Use medical device sales industry best practices
- Keep it engaging and professional

Structure:
1. Opening hook (1-2 sentences)
2. Expertise and experience (2-3 sentences)
3. Value proposition and outcomes (2-3 sentences)
4. Call to action (1-2 sentences)`

    const { text } = await generateText({
      model: this.model,
      prompt,
      system:
        "You are a LinkedIn profile optimization expert. Write compelling summaries that convert profile visitors into connections and opportunities.",
    })

    return text
  }

  async generateContentIdeas(userProfile: any, contentType: string): Promise<string[]> {
    const prompt = `Generate 10 content ideas for ${userProfile.name}, a medical device sales professional, for ${contentType}.

User Context:
- Industry: ${userProfile.industry}
- Goals: ${userProfile.goals}

Content should:
- Establish thought leadership
- Provide value to healthcare professionals
- Showcase industry expertise
- Drive engagement and connections
- Be relevant to medical device sales

Format: Return as a numbered list of specific, actionable content ideas.`

    const { text } = await generateText({
      model: this.model,
      prompt,
      system:
        "You are a content strategy expert for medical device sales professionals. Create engaging content ideas that build thought leadership and drive business results.",
    })

    return this.parseContentIdeas(text)
  }

  async generateSEOKeywords(userProfile: any): Promise<string[]> {
    const prompt = `Generate SEO keywords for ${userProfile.name}'s personal brand in medical device sales.

Context:
- Industry: ${userProfile.industry}
- Goals: ${userProfile.goals}
- Location: Extract from profile if available

Provide:
1. Primary keywords (5-7)
2. Long-tail keywords (5-7)
3. Location-based keywords (3-5)
4. Industry-specific terms (5-7)

Focus on terms that medical device buyers and healthcare decision-makers would search for.`

    const { text } = await generateText({
      model: this.model,
      prompt,
      system:
        "You are an SEO expert specializing in personal branding for B2B sales professionals. Generate keywords that drive qualified traffic and opportunities.",
    })

    return this.parseKeywords(text)
  }

  async scoreProfile(profileData: any, userInfo: any): Promise<any> {
    const prompt = `Score this LinkedIn profile across 5 categories (0-100 scale):

Profile Owner: ${userInfo.name}
Industry: ${userInfo.industry}

Categories to score:
1. Professional Identity & Messaging
2. Platform Consistency  
3. Thought Leadership & Content Strategy
4. Network Strength and Influence
5. Discoverability & SEO Presence

For each category, provide:
- Score (0-100)
- 2-3 specific reasons for the score
- Top improvement recommendation

Use medical device sales industry benchmarks.`

    const { text } = await generateText({
      model: this.model,
      prompt,
      system:
        "You are a personal brand assessment expert. Provide accurate, actionable scoring based on industry best practices.",
    })

    return this.parseScoring(text)
  }

  // Streaming for real-time analysis
  async streamAnalysis(prompt: string, onChunk: (chunk: string) => void): Promise<string> {
    const result = streamText({
      model: this.model,
      prompt,
      system: "You are a personal branding expert providing real-time analysis and recommendations.",
    })

    let fullText = ""

    for await (const chunk of result.textStream) {
      fullText += chunk
      onChunk(chunk)
    }

    return fullText
  }

  // Helper methods to parse AI responses
  private parseAnalysisResponse(text: string): any {
    // Parse structured analysis from AI response
    return {
      score: this.extractScore(text),
      strengths: this.extractList(text, "strengths"),
      weaknesses: this.extractList(text, "weaknesses"),
      opportunities: this.extractList(text, "opportunities"),
      recommendations: this.extractList(text, "recommendations"),
    }
  }

  private extractBestHeadline(text: string): string {
    // Extract the recommended headline from AI response
    const lines = text.split("\n")
    for (const line of lines) {
      if (line.toLowerCase().includes("recommend") || line.toLowerCase().includes("best")) {
        const nextLine = lines[lines.indexOf(line) + 1]
        if (nextLine && nextLine.trim()) {
          return nextLine.trim().replace(/^[0-9.\-*\s]+/, "")
        }
      }
    }
    return lines.find((line) => line.length > 50 && line.length < 220) || text.substring(0, 200)
  }

  private parseContentIdeas(text: string): string[] {
    return text
      .split("\n")
      .filter((line) => line.match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 10)
  }

  private parseKeywords(text: string): string[] {
    const keywords: string[] = []
    const lines = text.split("\n")

    for (const line of lines) {
      if (line.includes(":")) {
        const parts = line.split(":")[1]
        if (parts) {
          const lineKeywords = parts
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 2)
          keywords.push(...lineKeywords)
        }
      }
    }

    return keywords.filter((k) => k.length > 2)
  }

  private parseScoring(text: string): any {
    const scores = {
      professionalIdentity: 0,
      platformConsistency: 0,
      thoughtLeadership: 0,
      networkStrength: 0,
      discoverability: 0,
    }

    // Extract scores from AI response
    const scoreMatches = text.match(/(\d+)\/100|\b(\d+)\b/g)
    if (scoreMatches) {
      const numericScores = scoreMatches.map((s) => Number.parseInt(s.replace("/100", ""))).filter((s) => s <= 100)
      if (numericScores.length >= 5) {
        scores.professionalIdentity = numericScores[0]
        scores.platformConsistency = numericScores[1]
        scores.thoughtLeadership = numericScores[2]
        scores.networkStrength = numericScores[3]
        scores.discoverability = numericScores[4]
      }
    }

    return scores
  }

  private extractScore(text: string): number {
    const scoreMatch = text.match(/(\d+)\/100|\b(\d+)\b/)
    return scoreMatch ? Number.parseInt(scoreMatch[1] || scoreMatch[2]) : 0
  }

  private extractList(text: string, section: string): string[] {
    const sectionRegex = new RegExp(`${section}:?\\s*\\n([\\s\\S]*?)(?=\\n\\n|\\n[A-Z]|$)`, "i")
    const match = text.match(sectionRegex)

    if (match) {
      return match[1]
        .split("\n")
        .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•") || line.match(/^\d+\./))
        .map((line) => line.replace(/^[-•\d.\s]+/, "").trim())
        .filter((line) => line.length > 5)
    }

    return []
  }
}

export const aiBrandAnalyst = new AIBrandAnalyst()
