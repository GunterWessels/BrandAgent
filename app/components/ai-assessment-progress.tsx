"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Globe, BarChart3, MessageSquare, Brain, Zap } from "lucide-react"
import { InteractiveWaitingExperience } from "./interactive-waiting-experience"

interface AIAssessmentProgressProps {
  userInfo: any
  onComplete: (result: any) => void
}

export function AIAssessmentProgress({ userInfo, onComplete }: AIAssessmentProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [additionalInsights, setAdditionalInsights] = useState<Record<string, any>>({})
  const [showInteractive, setShowInteractive] = useState(false)

  const assessmentSteps = [
    {
      id: "profile-analysis",
      title: "AI Profile Analysis",
      description: "AI is analyzing your professional identity and messaging",
      icon: Brain,
    },
    {
      id: "content-strategy",
      title: "Content Strategy Assessment",
      description: "Evaluating your thought leadership and content approach",
      icon: MessageSquare,
    },
    {
      id: "seo-optimization",
      title: "SEO & Discoverability Analysis",
      description: "Analyzing your search presence and keyword optimization",
      icon: Globe,
    },
    {
      id: "competitive-analysis",
      title: "Industry Benchmarking",
      description: "Comparing against medical device sales best practices",
      icon: BarChart3,
    },
    {
      id: "recommendation-generation",
      title: "AI Recommendation Engine",
      description: "Generating personalized improvement strategies",
      icon: Zap,
    },
  ]

  useEffect(() => {
    // Show initial loading for a short time, then transition to interactive experience
    const initialTimer = setTimeout(() => {
      setShowInteractive(true)
    }, 3000)

    return () => clearTimeout(initialTimer)
  }, [])

  const handleAdditionalInsights = (insights: Record<string, any>) => {
    setAdditionalInsights((prev) => ({ ...prev, ...insights }))
  }

  const handleInteractiveComplete = () => {
    // Complete assessment with enhanced data including additional insights
    const mockResult = {
      userInfo: {
        ...userInfo,
        additionalInsights,
      },
      scores: {
        professionalIdentity: 75,
        platformConsistency: 60,
        thoughtLeadership: 45,
        networkStrength: 80,
        discoverability: 55,
      },
      insights: {
        strengths: [
          "Strong professional network with 500+ connections",
          "Clear industry expertise in medical device sales",
          "Consistent professional image across platforms",
        ],
        improvements: [
          "LinkedIn headline could better highlight unique value proposition",
          "Twitter presence needs development for thought leadership",
          "Content strategy lacks industry-specific keywords for SEO",
        ],
      },
      recommendations: [
        {
          category: "Professional Identity",
          priority: "High",
          action: "Revise LinkedIn headline to include specific expertise and value proposition",
          template:
            "Medical Device Sales Expert | Helping Healthcare Organizations Improve Patient Outcomes | 10+ Years Experience",
        },
        {
          category: "Thought Leadership",
          priority: "Medium",
          action: "Create weekly content series about medical device trends",
          template: "Monday Medical Insights: Share industry trends and analysis",
        },
      ],
    }

    // Enhance recommendations based on additional insights
    if (additionalInsights["specific-expertise"]) {
      mockResult.recommendations.push({
        category: "Specialization",
        priority: "High",
        action: `Highlight your expertise in ${additionalInsights["specific-expertise"]} across all platforms`,
        template: `${userInfo.industry} Specialist in ${additionalInsights["specific-expertise"]} | Driving Improved Outcomes`,
      })
    }

    if (additionalInsights["value-metric"]) {
      mockResult.recommendations.push({
        category: "Value Proposition",
        priority: "Medium",
        action: `Emphasize ${additionalInsights["value-metric"]} in your messaging and case studies`,
        template: `Helping healthcare providers achieve ${additionalInsights["value-metric"]} through innovative medical device solutions`,
      })
    }

    onComplete(mockResult)
  }

  if (showInteractive) {
    return (
      <InteractiveWaitingExperience
        userProfile={userInfo}
        onAdditionalInsights={handleAdditionalInsights}
        onComplete={handleInteractiveComplete}
      />
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI-Powered Brand Assessment in Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <Brain className="h-6 w-6 text-purple-400 absolute top-3 left-1/2 transform -translate-x-1/2" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Initializing AI Analysis...</h3>
            <p className="text-gray-600 mb-4">Preparing your personalized brand assessment</p>
            <Progress value={15} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">15% Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
