import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export interface UserProfile {
  name: string
  linkedinUrl: string
  twitterHandle: string
  industry: string
  goals: string
  refinedGoals?: string[]
  currentState?: any
  idealState?: any
}

export interface AnalysisPlan {
  steps: Array<{
    id: string
    title: string
    description: string
    questions: string[]
    duration: number
  }>
  focusAreas: string[]
  expectedOutcomes: string[]
}

export interface InteractiveQuestion {
  id: string
  question: string
  type: "text" | "choice" | "rating"
  options?: string[]
  context: string
}

export class BrandingAgent {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private hasValidApiKey(): boolean {
    return this.apiKey && this.apiKey.length > 0 && this.apiKey !== ""
  }

  async createAnalysisPlan(userProfile: UserProfile): Promise<AnalysisPlan> {
    if (!this.hasValidApiKey()) {
      throw new Error("OpenAI API key is required for analysis plan generation")
    }

    const { object } = await generateObject({
      model: openai("gpt-4o", { apiKey: this.apiKey }),
      schema: z.object({
        steps: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            questions: z.array(z.string()),
            duration: z.number(),
          }),
        ),
        focusAreas: z.array(z.string()),
        expectedOutcomes: z.array(z.string()),
      }),
      system: `You are an expert personal branding strategist specializing in ${userProfile.industry} professionals. 
      Create a comprehensive analysis plan that will help identify gaps between current state and ideal personal brand.
      Focus on LinkedIn optimization, thought leadership, network building, and industry positioning.`,
      prompt: `Create an analysis plan for:
      Name: ${userProfile.name}
      Industry: ${userProfile.industry}
      LinkedIn: ${userProfile.linkedinUrl}
      Twitter: ${userProfile.twitterHandle}
      Current Goals: ${userProfile.goals}
      
      The plan should include interactive steps that help refine their goals and identify improvement areas.
      Each step should have specific questions to ask the user to gather more insights.`,
    })

    return object
  }

  async generateInteractiveQuestions(
    step: string,
    userProfile: UserProfile,
    previousAnswers: Record<string, any>,
  ): Promise<InteractiveQuestion[]> {
    if (!this.hasValidApiKey()) {
      throw new Error("OpenAI API key is required for question generation")
    }

    const { object } = await generateObject({
      model: openai("gpt-4o", { apiKey: this.apiKey }),
      schema: z.object({
        questions: z.array(
          z.object({
            id: z.string(),
            question: z.string(),
            type: z.enum(["text", "choice", "rating"]),
            options: z.array(z.string()).optional(),
            context: z.string(),
          }),
        ),
      }),
      system: `You are a personal branding expert for ${userProfile.industry} professionals. 
      Generate interactive questions that help users understand personal branding best practices 
      while gathering information about their current situation.
      
      Focus on:
      - LinkedIn headline optimization
      - Value proposition clarity
      - Target audience definition
      - Content strategy
      - Network building
      - Thought leadership positioning
      
      Tailor your questions to be specific to the ${userProfile.industry} industry.`,
      prompt: `Generate 2-3 interactive questions for the "${step}" step.
      
      User Profile: ${JSON.stringify(userProfile)}
      Previous Answers: ${JSON.stringify(previousAnswers)}
      
      Make questions educational and help users think strategically about their personal brand.
      Include context that explains why each question matters for their success in ${userProfile.industry}.`,
    })

    return object.questions
  }

  async analyzeCurrentVsIdeal(
    userProfile: UserProfile,
    interactiveAnswers: Record<string, any>,
    webData: any = {},
  ): Promise<{
    currentState: any
    idealState: any
    gaps: string[]
    recommendations: any[]
  }> {
    if (!this.hasValidApiKey()) {
      throw new Error("OpenAI API key is required for analysis")
    }

    const { object } = await generateObject({
      model: openai("gpt-4o", { apiKey: this.apiKey }),
      schema: z.object({
        currentState: z.object({
          linkedinHeadline: z.string(),
          valueProposition: z.string(),
          contentStrategy: z.string(),
          networkStrength: z.number(),
          thoughtLeadership: z.number(),
        }),
        idealState: z.object({
          linkedinHeadline: z.string(),
          valueProposition: z.string(),
          contentStrategy: z.string(),
          networkStrength: z.number(),
          thoughtLeadership: z.number(),
        }),
        gaps: z.array(z.string()),
        recommendations: z.array(
          z.object({
            category: z.string(),
            priority: z.enum(["High", "Medium", "Low"]),
            action: z.string(),
            template: z.string().optional(),
            reasoning: z.string(),
          }),
        ),
      }),
      system: `You are an expert in personal branding for ${userProfile.industry} professionals.
      Analyze the gap between current state and ideal state based on industry best practices.
      
      Best practices for ${userProfile.industry} professionals:
      - Clear value proposition highlighting specific results and expertise
      - LinkedIn headline with specific expertise and outcomes
      - Regular thought leadership content about industry trends
      - Strong network of industry decision makers and peers
      - Consistent professional messaging across platforms`,
      prompt: `Analyze the current vs ideal state for:
      
      User Profile: ${JSON.stringify(userProfile)}
      Interactive Answers: ${JSON.stringify(interactiveAnswers)}
      Web Data: ${JSON.stringify(webData)}
      
      Provide specific, actionable recommendations with templates where applicable.
      Focus on what will have the biggest impact on their ${userProfile.industry} career.`,
    })

    return object
  }

  async refineGoals(originalGoals: string, interactiveAnswers: Record<string, any>): Promise<string[]> {
    if (!this.hasValidApiKey()) {
      throw new Error("OpenAI API key is required for goal refinement")
    }

    const { object } = await generateObject({
      model: openai("gpt-4o", { apiKey: this.apiKey }),
      schema: z.object({
        refinedGoals: z.array(z.string()),
      }),
      system: `You are a personal branding strategist. Based on the user's original goals and their answers 
      to interactive questions, refine their goals to be more specific, measurable, and aligned with 
      personal branding best practices.`,
      prompt: `Original Goals: ${originalGoals}
      
      Interactive Answers: ${JSON.stringify(interactiveAnswers)}
      
      Refine these into 3-5 specific, actionable goals that align with personal branding best practices.
      Make them SMART goals where possible.`,
    })

    return object.refinedGoals
  }

  async generatePersonalizedContent(
    userProfile: UserProfile,
    analysisResults: any,
  ): Promise<{
    linkedinPosts: string[]
    twitterPosts: string[]
    headlines: string[]
    summaries: string[]
  }> {
    if (!this.hasValidApiKey()) {
      throw new Error("OpenAI API key is required for content generation")
    }

    const { object } = await generateObject({
      model: openai("gpt-4o", { apiKey: this.apiKey }),
      schema: z.object({
        linkedinPosts: z.array(z.string()),
        twitterPosts: z.array(z.string()),
        headlines: z.array(z.string()),
        summaries: z.array(z.string()),
      }),
      system: `You are a content strategist specializing in personal branding for ${userProfile.industry} professionals.
      Generate personalized content that positions the user as a thought leader in their field.`,
      prompt: `Generate personalized content for:
      
      User: ${userProfile.name}
      Industry: ${userProfile.industry}
      Refined Goals: ${userProfile.refinedGoals?.join(", ")}
      
      Analysis Results: ${JSON.stringify(analysisResults)}
      
      Create content that demonstrates expertise, builds trust, and attracts the right audience.
      Focus on industry-specific outcomes, trends, and professional insights.`,
    })

    return object
  }
}
