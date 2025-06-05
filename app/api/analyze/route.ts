import { type NextRequest, NextResponse } from "next/server"
import { BrandingAgent } from "@/lib/ai-agent"
import { ExaService } from "@/lib/exa-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, step, answers, stepId } = body

    console.log("API called with step:", step)
    console.log("User profile:", userProfile)

    // Check if we have the required API keys
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found, using fallback responses")
    }

    const agent = new BrandingAgent(process.env.OPENAI_API_KEY || "")
    const exaService = new ExaService(process.env.EXA_API_KEY || "")

    switch (step) {
      case "create-plan":
        try {
          const plan = await agent.createAnalysisPlan(userProfile)
          return NextResponse.json({ plan })
        } catch (error) {
          console.error("Error creating plan:", error)
          // Return fallback plan
          return NextResponse.json({
            plan: {
              steps: [
                {
                  id: "goal-refinement",
                  title: "Goal Refinement",
                  description: "Clarify your personal branding objectives",
                  questions: ["What is your primary goal?"],
                  duration: 5,
                },
              ],
              focusAreas: ["Professional Identity", "Content Strategy"],
              expectedOutcomes: ["Clear brand positioning", "Actionable recommendations"],
            },
          })
        }

      case "generate-questions":
        try {
          const questions = await agent.generateInteractiveQuestions(stepId, userProfile, answers || {})
          return NextResponse.json({ questions })
        } catch (error) {
          console.error("Error generating questions:", error)
          // Return fallback questions based on step
          const fallbackQuestions = getFallbackQuestions(stepId, userProfile)
          return NextResponse.json({ questions: fallbackQuestions })
        }

      case "scrape-profiles":
        try {
          // Scrape LinkedIn profile if URL provided
          let linkedinData = null
          if (userProfile.linkedinUrl) {
            linkedinData = await exaService.scrapeLinkedInProfile(userProfile.linkedinUrl)
          }

          // Scrape Twitter profile if handle provided
          let twitterData = null
          if (userProfile.twitterHandle) {
            twitterData = await exaService.scrapeTwitterProfile(userProfile.twitterHandle)
          }

          // Search for web presence
          const webPresence = await exaService.searchWebPresence(userProfile.name, userProfile.industry)

          // Get industry benchmarks
          const industryBenchmarks = await exaService.getIndustryBenchmarks(userProfile.industry)

          return NextResponse.json({
            linkedinData,
            twitterData,
            webPresence,
            industryBenchmarks,
          })
        } catch (error) {
          console.error("Error scraping profiles:", error)
          return NextResponse.json({
            linkedinData: null,
            twitterData: null,
            webPresence: [],
            industryBenchmarks: null,
          })
        }

      case "final-analysis":
        try {
          // First get web data
          let webData = {}
          if (userProfile.linkedinUrl || userProfile.twitterHandle) {
            try {
              const scrapingResponse = await fetch(`${request.nextUrl.origin}/api/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  step: "scrape-profiles",
                  userProfile,
                }),
              })

              if (scrapingResponse.ok) {
                webData = await scrapingResponse.json()
              }
            } catch (scrapingError) {
              console.error("Error in scraping step:", scrapingError)
            }
          }

          // Now perform the analysis with the additional web data
          const analysis = await agent.analyzeCurrentVsIdeal(userProfile, answers, webData)
          const refinedGoals = await agent.refineGoals(userProfile.goals, answers)
          const content = await agent.generatePersonalizedContent({ ...userProfile, refinedGoals }, analysis)

          return NextResponse.json({
            analysis,
            refinedGoals,
            content,
            webData,
          })
        } catch (error) {
          console.error("Error in final analysis:", error)
          // Return fallback analysis
          return NextResponse.json({
            analysis: {
              currentState: {
                linkedinHeadline: "Current headline needs improvement",
                valueProposition: "Value proposition needs development",
                contentStrategy: "Content strategy needs work",
                networkStrength: 7,
                thoughtLeadership: 4,
              },
              idealState: {
                linkedinHeadline: `${userProfile.industry} Expert | Helping Organizations Achieve Better Outcomes`,
                valueProposition: "Clear, compelling value proposition",
                contentStrategy: "Consistent, valuable content strategy",
                networkStrength: 9,
                thoughtLeadership: 8,
              },
              gaps: [
                "LinkedIn headline lacks specific value proposition",
                "Content publishing frequency too low",
                "Network engagement could be improved",
              ],
              recommendations: [
                {
                  category: "Professional Identity",
                  priority: "High",
                  action: "Update LinkedIn headline to highlight specific expertise",
                  template: `${userProfile.industry} Expert | Helping Organizations Achieve Better Outcomes | ${Math.floor(Math.random() * 10) + 5}+ Years Experience`,
                  reasoning: "A clear headline improves discoverability and positioning",
                },
                {
                  category: "Content Strategy",
                  priority: "Medium",
                  action: "Establish weekly content publishing schedule",
                  template: "Share industry insights every Monday, case studies on Wednesday",
                  reasoning: "Consistent content builds thought leadership",
                },
              ],
            },
            refinedGoals: [
              `Become a recognized thought leader in ${userProfile.industry}`,
              "Expand professional network by 50% in next 6 months",
              "Increase LinkedIn engagement rate by 200%",
            ],
            content: {
              linkedinPosts: [
                `The future of ${userProfile.industry} is evolving rapidly. Here are 3 trends I'm watching...`,
                `Just completed a successful implementation that improved patient outcomes by 25%. Key lessons learned:`,
              ],
              twitterPosts: [
                `Quick tip for ${userProfile.industry} professionals: Always focus on patient outcomes first #${userProfile.industry.replace(/\s+/g, "")}`,
                `Attending the industry conference next week. Looking forward to connecting with fellow professionals!`,
              ],
              headlines: [
                `${userProfile.industry} Expert | Helping Organizations Achieve Better Outcomes | 8+ Years Experience`,
                `Senior ${userProfile.industry} Professional | Driving Innovation in Healthcare | Results-Focused`,
              ],
              summaries: [
                `Experienced ${userProfile.industry} professional with a track record of helping healthcare organizations improve patient outcomes through innovative solutions.`,
              ],
            },
            webData: {},
          })
        }

      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

function getFallbackQuestions(stepId: string, userProfile: any) {
  const questionSets = {
    "goal-refinement": [
      {
        id: "primary-goal",
        question: "What is your primary goal for your personal brand in the next 12 months?",
        type: "choice",
        options: [
          "Increase sales and close more deals",
          "Build thought leadership in my specialty",
          "Expand my professional network",
          "Position for career advancement",
          "Launch my own consulting practice",
        ],
        context: "Your primary goal will shape our entire strategy and recommendations.",
      },
    ],
    "value-proposition": [
      {
        id: "unique-value",
        question: `What specific value do you bring to ${userProfile.industry} that your competitors don't?`,
        type: "text",
        context: "This will become the foundation of your value proposition and messaging.",
      },
    ],
    "audience-targeting": [
      {
        id: "target-audience",
        question: "Who are your ideal prospects and decision makers?",
        type: "choice",
        options: [
          "C-suite executives",
          "Department heads and directors",
          "Mid-level managers",
          "Technical specialists",
          "End users of products/services",
        ],
        context: "Understanding your audience helps tailor your messaging and content strategy.",
      },
    ],
    "content-strategy": [
      {
        id: "content-frequency",
        question: "How often are you currently sharing professional content online?",
        type: "choice",
        options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
        context: "Consistent content sharing is crucial for building thought leadership and staying top-of-mind.",
      },
    ],
  }

  return questionSets[stepId] || []
}
