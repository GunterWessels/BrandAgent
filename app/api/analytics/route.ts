import { type NextRequest, NextResponse } from "next/server"
import { AnalyticsDashboard } from "@/lib/analytics-dashboard"

export async function GET(request: NextRequest) {
  try {
    const summary = await AnalyticsDashboard.generateSummary()

    return NextResponse.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating analytics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate analytics",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === "export-logs") {
      // Export all logs for analysis
      const logs = JSON.parse(localStorage.getItem("brandagent_logs") || "[]")

      return NextResponse.json({
        success: true,
        data: logs,
        count: logs.length,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing analytics request:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
