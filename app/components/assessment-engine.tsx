"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Loader2,
  CheckCircle,
  Globe,
  Linkedin,
  Twitter,
  BarChart3,
  MessageSquare,
  Users,
  TrendingUp,
} from "lucide-react"

interface AssessmentEngineProps {
  userInfo: any
  onAssessmentComplete: (assessment: any) => void
}

export function AssessmentEngine({ userInfo, onAssessmentComplete }: AssessmentEngineProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [assessmentData, setAssessmentData] = useState<any>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const assessmentSteps = [
    {
      id: "linkedin-analysis",
      title: "LinkedIn Profile Analysis",
      description: "Analyzing profile completeness, messaging, and engagement",
      icon: Linkedin,
    },
    {
      id: "twitter-analysis",
      title: "Twitter/X Presence Analysis",
      description: "Evaluating content strategy and audience engagement",
      icon: Twitter,
    },
    {
      id: "content-analysis",
      title: "Content Strategy Assessment",
      description: "Reviewing posting frequency, engagement, and thought leadership",
      icon: MessageSquare,
    },
    {
      id: "network-analysis",
      title: "Network & Influence Analysis",
      description: "Assessing connection quality and industry influence",
      icon: Users,
    },
    {
      id: "seo-analysis",
      title: "SEO & Discoverability Analysis",
      description: "Evaluating search presence and keyword optimization",
      icon: Globe,
    },
  ]

  const runComprehensiveAssessment = async () => {
    setIsAnalyzing(true)

    for (let i = 0; i < assessmentSteps.length; i++) {
      setCurrentStep(i)

      // Simulate API calls and analysis for each step
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock assessment data for each step
      const stepData = await analyzeStep(assessmentSteps[i].id)
      setAssessmentData((prev) => ({ ...prev, [assessmentSteps[i].id]: stepData }))
    }

    // Compile final assessment
    const finalAssessment = compileAssessment(assessmentData)
    onAssessmentComplete(finalAssessment)
    setIsAnalyzing(false)
  }

  const analyzeStep = async (stepId: string) => {
    // Mock comprehensive analysis for each step
    const analyses = {
      "linkedin-analysis": {
        profileCompleteness: 85,
        headlineOptimization: 45,
        summaryQuality: 60,
        experienceDetail: 80,
        skillsEndorsements: 70,
        recommendations: 30,
        activityLevel: 40,
        connectionQuality: 85,
        findings: [
          { type: "critical", item: "Headline lacks value proposition", impact: "High" },
          { type: "warning", item: "Summary doesn't include keywords", impact: "Medium" },
          { type: "success", item: "Strong professional experience section", impact: "High" },
        ],
      },
      "twitter-analysis": {
        profileOptimization: 30,
        contentFrequency: 20,
        engagementRate: 45,
        followerQuality: 60,
        brandConsistency: 40,
        thoughtLeadership: 25,
        findings: [
          { type: "critical", item: "Inconsistent posting schedule", impact: "High" },
          { type: "warning", item: "Bio doesn't align with LinkedIn", impact: "Medium" },
          { type: "opportunity", item: "Good engagement when posting", impact: "Medium" },
        ],
      },
      "content-analysis": {
        postingFrequency: 30,
        contentQuality: 65,
        engagementMetrics: 55,
        thoughtLeadership: 40,
        industryRelevance: 70,
        visualContent: 35,
        findings: [
          { type: "critical", item: "Posting only 0.5 times per week", impact: "High" },
          { type: "success", item: "High-quality content when posted", impact: "Medium" },
          { type: "opportunity", item: "Strong industry knowledge untapped", impact: "High" },
        ],
      },
      "network-analysis": {
        networkSize: 80,
        connectionQuality: 85,
        industryInfluence: 60,
        engagementLevel: 45,
        referralPotential: 70,
        findings: [
          { type: "success", item: "Strong network of 500+ connections", impact: "High" },
          { type: "warning", item: "Low engagement with network", impact: "Medium" },
          { type: "opportunity", item: "High-quality decision-maker connections", impact: "High" },
        ],
      },
      "seo-analysis": {
        searchVisibility: 25,
        keywordOptimization: 30,
        googlePresence: 20,
        contentSEO: 35,
        localSEO: 40,
        findings: [
          { type: "critical", item: "Not ranking for target keywords", impact: "High" },
          { type: "critical", item: "Limited Google search presence", impact: "High" },
          { type: "opportunity", item: "Easy wins with profile optimization", impact: "Medium" },
        ],
      },
    }

    return analyses[stepId as keyof typeof analyses]
  }

  const compileAssessment = (data: any) => {
    return {
      overallScores: {
        professionalIdentity: 75,
        platformConsistency: 60,
        thoughtLeadership: 45,
        networkStrength: 80,
        discoverability: 55,
      },
      detailedAnalysis: data,
      priorityActions: [
        {
          category: "Professional Identity",
          priority: "Critical",
          action: "Optimize LinkedIn headline with value proposition",
          currentState: "Generic sales professional",
          targetState: "Medical Device Sales Expert helping hospitals improve outcomes",
          estimatedImpact: "40% increase in profile views",
          timeToComplete: "30 minutes",
        },
        {
          category: "Thought Leadership",
          priority: "High",
          action: "Establish consistent content publishing schedule",
          currentState: "0.5 posts per week",
          targetState: "3 posts per week with industry insights",
          estimatedImpact: "300% increase in engagement",
          timeToComplete: "2 hours weekly",
        },
        {
          category: "Discoverability",
          priority: "High",
          action: "Implement SEO keyword strategy",
          currentState: "Not ranking for target terms",
          targetState: "Page 1 ranking for 'medical device sales [city]'",
          estimatedImpact: "500% increase in discovery",
          timeToComplete: "1 week",
        },
      ],
      actionableInsights: data,
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comprehensive Brand Assessment in Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{assessmentSteps[currentStep]?.title}</h3>
              <p className="text-gray-600 mb-4">{assessmentSteps[currentStep]?.description}</p>
              <Progress
                value={((currentStep + 1) / assessmentSteps.length) * 100}
                className="w-full max-w-md mx-auto"
              />
              <p className="text-sm text-gray-500 mt-2">
                Step {currentStep + 1} of {assessmentSteps.length}
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {assessmentSteps.map((step, index) => {
                const IconComponent = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep

                return (
                  <div key={step.id} className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        isCompleted ? "bg-green-100" : isCurrent ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <IconComponent className={`h-6 w-6 ${isCurrent ? "text-blue-600" : "text-gray-400"}`} />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{step.title}</p>
                  </div>
                )
              })}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What We're Analyzing:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Profile completeness and optimization opportunities</li>
                <li>• Content strategy and engagement patterns</li>
                <li>• Network quality and influence metrics</li>
                <li>• SEO presence and keyword optimization</li>
                <li>• Cross-platform consistency and messaging</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Ready for Comprehensive Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              We'll conduct a thorough analysis of your digital presence across all platforms and provide actionable
              recommendations with implementation support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Assessment Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  LinkedIn profile optimization analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Content strategy evaluation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Network influence assessment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  SEO and discoverability audit
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">You'll Receive:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Detailed scoring across 5 categories
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Prioritized action plan
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Ready-to-use templates
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Implementation assistance
                </li>
              </ul>
            </div>
          </div>

          <Button onClick={runComprehensiveAssessment} className="w-full" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Start Comprehensive Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
