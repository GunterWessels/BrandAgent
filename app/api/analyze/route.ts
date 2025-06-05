import { type NextRequest, NextResponse } from "next/server"
import { BrandingAgent } from "@/lib/ai-agent"
import { ExaService } from "@/lib/exa-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, step, answers, stepId } = body

    const agent = new BrandingAgent(process.env.OPENAI_API_KEY || "")
    const exaService = new ExaService(process.env.EXA_API_KEY || "")

    switch (step) {
      case "create-plan":
        const plan = await agent.createAnalysisPlan(userProfile)
        return NextResponse.json({ plan })

      case "generate-questions":
        const questions = await agent.generateInteractiveQuestions(stepId, userProfile, answers || {})
        return NextResponse.json({ questions })

      case "scrape-profiles":
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

      case "final-analysis":
        // First get web data
        let webData = {}
        if (userProfile.linkedinUrl || userProfile.twitterHandle) {
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

      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
