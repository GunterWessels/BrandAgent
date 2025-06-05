"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, Globe, Linkedin, Twitter, BarChart3, MessageSquare, Users } from "lucide-react"
import { BrandAssessmentEngine, type AssessmentStep, type AssessmentResult } from "../utils/assessment-utils"

interface AssessmentProgressProps {
  userInfo: any
  onComplete: (result: AssessmentResult) => void
}

export function AssessmentProgress({ userInfo, onComplete }: AssessmentProgressProps) {
  const [currentStep, setCurrentStep] = useState<AssessmentStep | null>(null)
  const [progress, setProgress] = useState(0)

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

  useEffect(() => {
    const runAssessment = async () => {
      const engine = new BrandAssessmentEngine(
        userInfo,
        (step: AssessmentStep) => {
          setCurrentStep(step)
          setProgress(step.progress)
        },
        (result: AssessmentResult) => {
          onComplete(result)
        },
      )

      await engine.runComprehensiveAssessment()
    }

    runAssessment()
  }, [userInfo, onComplete])

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
            <h3 className="text-lg font-semibold mb-2">{currentStep?.title || "Initializing..."}</h3>
            <p className="text-gray-600 mb-4">{currentStep?.description || "Preparing assessment..."}</p>
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {assessmentSteps.map((step, index) => {
              const IconComponent = step.icon
              const isCompleted = currentStep
                ? assessmentSteps.findIndex((s) => s.id === currentStep.id) > index
                : false
              const isCurrent = currentStep?.id === step.id

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
