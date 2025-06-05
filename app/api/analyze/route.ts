import { type NextRequest, NextResponse } from "next/server"
import { aiBrandAnalyst } from "../../lib/ai-service"
import { memoryStore } from "../../lib/memory-store"

export async function POST(request: NextRequest) {
  try {
    const { userInfo, analysisType } = await request.json()

    if (!userInfo || !analysisType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let result

    switch (analysisType) {
      case "profile":
        result = await aiBrandAnalyst.analyzeLinkedInProfile({}, userInfo)
        break
      case "headline":
        result = await aiBrandAnalyst.generateOptimizedHeadline(
          userInfo.currentHeadline || "Sales Professional",
          userInfo,
        )
        break
      case "summary":
        result = await aiBrandAnalyst.generateProfileSummary(userInfo)
        break
      case "content":
        result = await aiBrandAnalyst.generateContentIdeas(userInfo, "LinkedIn")
        break
      case "seo":
        result = await aiBrandAnalyst.generateSEOKeywords(userInfo)
        break
      case "score":
        result = await aiBrandAnalyst.scoreProfile({}, userInfo)
        break
      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    // Save analysis to memory
    const userProfile = await memoryStore.saveUserProfile(userInfo)
    await memoryStore.saveAction({
      userId: userProfile.id,
      assessmentId: "api-call",
      actionType: analysisType,
      actionData: userInfo,
      result: result,
    })

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
