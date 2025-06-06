import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"
import { FirebaseService } from "@/lib/firebase-service"

const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize Supabase client only if credentials are available
let supabase = null
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const { log, emailContent, subject } = await request.json()

    // Log to console for debugging
    console.log("=".repeat(80))
    console.log("EMAIL LOG NOTIFICATION")
    console.log("=".repeat(80))
    console.log("To:", process.env.LOG_STORAGE_EMAIL || "your-storage-email@example.com")
    console.log("Subject:", subject)
    console.log("Timestamp:", new Date().toISOString())
    console.log("-".repeat(80))
    console.log("Email content length:", emailContent.length)
    console.log("Session ID:", log.sessionId)
    console.log("User:", log.userInfo?.name || "Anonymous")
    console.log("Industry:", log.userInfo?.industry || "Unknown")
    console.log("=".repeat(80))

    let emailSuccess = false
    let supabaseSuccess = false
    let firebaseSuccess = false

    // Send email with Resend
    if (process.env.RESEND_API_KEY && process.env.LOG_STORAGE_EMAIL) {
      try {
        const emailResult = await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@brandagent.ai",
          to: process.env.LOG_STORAGE_EMAIL,
          subject: subject,
          text: emailContent,
        })
        console.log("Email sent successfully via Resend:", emailResult.data?.id)
        emailSuccess = true
      } catch (emailError) {
        console.error("Error sending email via Resend:", emailError)
      }
    } else {
      console.log("Resend not configured - skipping email")
    }

    // Store in Supabase with simplified approach
    if (supabase) {
      try {
        // Prepare minimal log data for Supabase
        const supabaseLogData = {
          session_id: log.sessionId || `unknown_${Date.now()}`,
          user_name: log.userInfo?.name || "Anonymous",
          user_industry: log.userInfo?.industry || "Unknown",
          timestamp: new Date().toISOString(),
          duration_ms: log.timing?.totalDuration || null,
          error_count: log.performance?.errorCount || 0,
          full_log_data: log,
        }

        console.log("Attempting to store in Supabase...")
        const { data, error } = await supabase.from("session_logs").insert(supabaseLogData).select()

        if (error) {
          console.error("Supabase insert error:", error)
          console.error("Error code:", error.code)
          console.error("Error message:", error.message)
          console.error("Error details:", error.details)
          console.error("Error hint:", error.hint)

          // If table doesn't exist, try to create a simple logs table
          if (error.code === "42P01" || error.message?.includes("does not exist")) {
            console.log("Table doesn't exist, trying to create it...")

            // Try to create a simple table
            const { error: createError } = await supabase.rpc("exec_sql", {
              sql: `
                CREATE TABLE IF NOT EXISTS session_logs (
                  id SERIAL PRIMARY KEY,
                  session_id TEXT,
                  user_name TEXT,
                  user_industry TEXT,
                  timestamp TIMESTAMPTZ DEFAULT NOW(),
                  duration_ms INTEGER,
                  error_count INTEGER DEFAULT 0,
                  full_log_data JSONB,
                  created_at TIMESTAMPTZ DEFAULT NOW()
                );
              `,
            })

            if (createError) {
              console.error("Could not create table:", createError)
            } else {
              console.log("Table created, retrying insert...")
              // Retry the insert
              const { data: retryData, error: retryError } = await supabase
                .from("session_logs")
                .insert(supabaseLogData)
                .select()

              if (retryError) {
                console.error("Retry insert failed:", retryError)
              } else {
                console.log("Retry insert successful:", retryData)
                supabaseSuccess = true
              }
            }
          }
        } else {
          console.log("Log stored in Supabase successfully:", data?.[0]?.id)
          supabaseSuccess = true
        }
      } catch (supabaseError) {
        console.error("Supabase operation error:", supabaseError)
        console.error("Supabase URL configured:", !!process.env.SUPABASE_URL)
        console.error("Supabase Key configured:", !!process.env.SUPABASE_ANON_KEY)
      }
    } else {
      console.log("Supabase not configured - skipping database storage")
    }

    // Store in Firebase (backup attempt from server side)
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        await FirebaseService.storeSessionLog(log)
        console.log("Log stored in Firebase successfully (backup)")
        firebaseSuccess = true
      } else {
        console.log("Firebase not configured for server-side storage")
      }
    } catch (firebaseError) {
      console.error("Error storing log in Firebase (backup):", firebaseError)
    }

    // Return success if at least one storage method worked
    const successCount = [emailSuccess, supabaseSuccess, firebaseSuccess].filter(Boolean).length
    const totalAttempts = [
      process.env.RESEND_API_KEY && process.env.LOG_STORAGE_EMAIL,
      supabase,
      process.env.FIREBASE_PROJECT_ID,
    ].filter(Boolean).length

    console.log(`Storage results: ${successCount}/${totalAttempts} methods successful`)

    return NextResponse.json({
      success: true,
      message: `Log processed successfully (${successCount}/${totalAttempts} storage methods worked)`,
      sessionId: log.sessionId,
      storage: {
        email: emailSuccess,
        supabase: supabaseSuccess,
        firebase: firebaseSuccess,
      },
    })
  } catch (error) {
    console.error("Error in send-log-email API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process log",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
