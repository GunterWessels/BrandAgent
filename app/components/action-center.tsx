"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit3, Calendar, Target, Zap, Copy, ExternalLink, Save, RefreshCw } from "lucide-react"

interface ActionCenterProps {
  category: string
  recommendations: any[]
  currentData: any
  onActionComplete: (action: any, result: any) => void
}

export function ActionCenter({ category, recommendations, currentData, onActionComplete }: ActionCenterProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [actionData, setActionData] = useState<any>({})
  const [isExecuting, setIsExecuting] = useState(false)

  const executeAction = async (actionType: string, data: any) => {
    setIsExecuting(true)

    // Simulate API call to implement the action
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = {
      success: true,
      message: `Successfully ${actionType}`,
      data: data,
      timestamp: new Date().toISOString(),
    }

    onActionComplete(actionType, result)
    setIsExecuting(false)
    setActiveAction(null)
  }

  const getActionComponent = (actionType: string) => {
    switch (actionType) {
      case "optimize-headline":
        return <HeadlineOptimizer onExecute={executeAction} currentData={currentData} />
      case "create-content":
        return <ContentCreator onExecute={executeAction} currentData={currentData} />
      case "update-profile":
        return <ProfileUpdater onExecute={executeAction} currentData={currentData} />
      case "schedule-posts":
        return <ContentScheduler onExecute={executeAction} currentData={currentData} />
      case "optimize-seo":
        return <SEOOptimizer onExecute={executeAction} currentData={currentData} />
      default:
        return <div>Action component not found</div>
    }
  }

  const actionTypes = {
    professionalIdentity: [
      { id: "optimize-headline", title: "Optimize LinkedIn Headline", icon: Edit3, priority: "High" },
      { id: "update-profile", title: "Update Profile Summary", icon: Edit3, priority: "Medium" },
    ],
    thoughtLeadership: [
      { id: "create-content", title: "Create Content Series", icon: Edit3, priority: "High" },
      { id: "schedule-posts", title: "Schedule Content Calendar", icon: Calendar, priority: "Medium" },
    ],
    discoverability: [{ id: "optimize-seo", title: "Optimize SEO Keywords", icon: Target, priority: "High" }],
  }

  const availableActions = actionTypes[category as keyof typeof actionTypes] || []

  if (activeAction) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Taking Action: {activeAction}</CardTitle>
            <Button variant="outline" onClick={() => setActiveAction(null)}>
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent>{getActionComponent(activeAction)}</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Available Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availableActions.map((action) => {
            const IconComponent = action.icon
            return (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <Badge variant={action.priority === "High" ? "destructive" : "secondary"}>
                      {action.priority} Priority
                    </Badge>
                  </div>
                </div>
                <Button onClick={() => setActiveAction(action.id)}>Take Action</Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Individual action components
function HeadlineOptimizer({ onExecute, currentData }: any) {
  const [headline, setHeadline] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateHeadline = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const generated =
      "Medical Device Sales Expert | Helping Hospitals Reduce Surgical Complications by 30% | 10+ Years Cardiovascular Technology Experience"
    setHeadline(generated)
    setIsGenerating(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Current LinkedIn Headline:</h4>
        <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
          {currentData.currentHeadline || "Sales Professional at Medical Device Company"}
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Optimized Headline:</h4>
        <Textarea
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Enter your new headline..."
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={generateHeadline} disabled={isGenerating}>
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            Generate AI Suggestion
          </Button>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(headline)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onExecute("optimize-headline", { headline })} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Update LinkedIn Headline
        </Button>
        <Button variant="outline" onClick={() => window.open("https://linkedin.com", "_blank")}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open LinkedIn
        </Button>
      </div>
    </div>
  )
}

function ContentCreator({ onExecute, currentData }: any) {
  const [contentSeries, setContentSeries] = useState("")
  const [postTemplate, setPostTemplate] = useState("")

  const generateContent = () => {
    const series = "Medical Monday Insights"
    const template = `🏥 Medical Monday Insight:

[Share a specific trend, innovation, or case study from the medical device industry]

💡 What this means for healthcare professionals:
[Explain the practical implications and benefits]

🎯 Key takeaway: [One actionable insight]

What's your experience with [relevant topic]? Share your thoughts below! 👇

#MedicalDevices #HealthcareInnovation #PatientCare #MedicalTechnology`

    setContentSeries(series)
    setPostTemplate(template)
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Content Series Name:</h4>
        <Input
          value={contentSeries}
          onChange={(e) => setContentSeries(e.target.value)}
          placeholder="e.g., Medical Monday Insights"
        />
      </div>

      <div>
        <h4 className="font-medium mb-2">Post Template:</h4>
        <Textarea
          value={postTemplate}
          onChange={(e) => setPostTemplate(e.target.value)}
          placeholder="Create your post template..."
          rows={8}
        />
        <Button variant="outline" onClick={generateContent} className="mt-2">
          <Zap className="h-4 w-4 mr-2" />
          Generate Template
        </Button>
      </div>

      <Button onClick={() => onExecute("create-content", { contentSeries, postTemplate })} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Create Content Series
      </Button>
    </div>
  )
}

function ContentScheduler({ onExecute, currentData }: any) {
  const [schedule, setSchedule] = useState({
    monday: "Industry insights and trends",
    wednesday: "Product spotlights and innovations",
    friday: "Professional tips and best practices",
  })

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Weekly Content Schedule:</h4>

      {Object.entries(schedule).map(([day, content]) => (
        <div key={day} className="space-y-2">
          <label className="text-sm font-medium capitalize">{day}:</label>
          <Input value={content} onChange={(e) => setSchedule((prev) => ({ ...prev, [day]: e.target.value }))} />
        </div>
      ))}

      <Button onClick={() => onExecute("schedule-posts", { schedule })} className="w-full">
        <Calendar className="h-4 w-4 mr-2" />
        Set Content Schedule
      </Button>
    </div>
  )
}

function ProfileUpdater({ onExecute, currentData }: any) {
  const [summary, setSummary] = useState("")

  const generateSummary = () => {
    const generated = `Experienced Medical Device Sales Professional with 10+ years of expertise in cardiovascular and surgical technologies. I help healthcare organizations improve patient outcomes through innovative medical solutions.

🎯 Specializations:
• Cardiovascular medical devices
• Surgical equipment and technologies  
• Healthcare workflow optimization
• Clinical training and support

💼 Track Record:
• Consistently exceeded sales targets by 25%+
• Managed relationships with 50+ healthcare facilities
• Led successful product launches in competitive markets

🤝 I'm passionate about advancing healthcare through technology and building lasting partnerships with medical professionals who share this mission.

Let's connect if you're interested in discussing how innovative medical devices can enhance patient care at your organization.`

    setSummary(generated)
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Current Summary:</h4>
        <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
          {currentData.currentSummary || "Basic summary with limited detail..."}
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Optimized Summary:</h4>
        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter your optimized summary..."
          rows={10}
        />
        <Button variant="outline" onClick={generateSummary} className="mt-2">
          <Zap className="h-4 w-4 mr-2" />
          Generate AI Summary
        </Button>
      </div>

      <Button onClick={() => onExecute("update-profile", { summary })} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Update Profile Summary
      </Button>
    </div>
  )
}

function SEOOptimizer({ onExecute, currentData }: any) {
  const [keywords, setKeywords] = useState("")
  const [optimizations, setOptimizations] = useState<any>({})

  const generateKeywords = () => {
    const keywordList = `Primary Keywords:
• medical device sales
• healthcare technology sales
• surgical equipment specialist
• cardiovascular device expert

Location-Based:
• medical device sales [your city]
• healthcare sales representative [your city]

Industry-Specific:
• cardiac catheterization equipment
• surgical robotics sales
• medical imaging devices
• patient monitoring systems`

    setKeywords(keywordList)
    setOptimizations({
      title: "Medical Device Sales Expert | Healthcare Technology Specialist | [Your City]",
      metaDescription:
        "Experienced medical device sales professional helping hospitals improve patient outcomes through innovative cardiovascular and surgical technologies.",
      profileKeywords: [
        "medical device sales",
        "healthcare technology",
        "surgical equipment",
        "cardiovascular devices",
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Target Keywords:</h4>
        <Textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter target keywords..."
          rows={6}
        />
        <Button variant="outline" onClick={generateKeywords} className="mt-2">
          <Zap className="h-4 w-4 mr-2" />
          Generate Keyword Strategy
        </Button>
      </div>

      <Button onClick={() => onExecute("optimize-seo", { keywords, optimizations })} className="w-full">
        <Target className="h-4 w-4 mr-2" />
        Implement SEO Optimizations
      </Button>
    </div>
  )
}
