"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, Globe, BarChart3, MessageSquare, Brain, Zap } from "lucide-react"
import { AIBrandAssessmentEngine, type AIAssessmentStep, type AIAssessmentResult } from "../utils/ai-assessment-engine"

interface AIAssessmentProgressProps {
  userInfo: any
  onComplete: (result: AIAssessmentResult) => void
}

export function AIAssessmentProgress({ userInfo, onComplete }: AIAssessmentProgressProps) {
  const [currentStep, setCurrentStep] = useState<AIAssessmentStep | null>(null)
  const [progress, setProgress] = useState(0)
  const [aiInsight, setAiInsight] = useState<string>("")

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
    const runAssessment = async () => {
      const engine = new AIBrandAssessmentEngine(
        userInfo,
        (step: AIAssessmentStep) => {
          setCurrentStep(step)
          setProgress(step.progress)

          // Show AI insights as they're generated
          if (step.aiAnalysis) {
            setAiInsight(JSON.stringify(step.aiAnalysis, null, 2))
          }
        },
        (result: AIAssessmentResult) => {
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
            <h3 className="text-lg font-semibold mb-2">{currentStep?.title || "Initializing AI Analysis..."}</h3>
            <p className="text-gray-600 mb-4">{currentStep?.description || "Preparing AI assessment..."}</p>
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
                      isCompleted ? "bg-green-100" : isCurrent ? "bg-purple-100" : "bg-gray-100"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <IconComponent className={`h-6 w-6 ${isCurrent ? "text-purple-600" : "text-gray-400"}`} />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{step.title}</p>
                </div>
              )
            })}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Analysis in Progress:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Analyzing professional messaging and positioning</li>
              <li>• Generating industry-specific recommendations</li>
              <li>• Optimizing content for thought leadership</li>
              <li>• Creating personalized SEO strategy</li>
              <li>• Benchmarking against industry best practices</li>
            </ul>
          </div>

          {aiInsight && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                Live AI Insights:
              </h4>
              <div className="text-sm text-gray-700 font-mono bg-white p-3 rounded border max-h-32 overflow-y-auto">
                {aiInsight}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
