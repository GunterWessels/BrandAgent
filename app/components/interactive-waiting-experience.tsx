"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Lightbulb, CheckCircle, MessageSquare } from "lucide-react"

interface InteractiveWaitingExperienceProps {
  userProfile: any
  onAdditionalInsights: (insights: Record<string, any>) => void
  onComplete: () => void
}

export function InteractiveWaitingExperience({
  userProfile,
  onAdditionalInsights,
  onComplete,
}: InteractiveWaitingExperienceProps) {
  const [progress, setProgress] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showQuestion, setShowQuestion] = useState(false)
  const [analysisStage, setAnalysisStage] = useState(0)

  // Industry-specific tips
  const industryTips = [
    `In ${userProfile.industry}, the most effective LinkedIn headlines clearly state your specialty and the specific outcomes you help achieve.`,
    `Top performers in ${userProfile.industry} publish content at least once per week focusing on industry trends and insights.`,
    `Building a network of quality connections in ${userProfile.industry} is more valuable than quantity. Focus on decision-makers and peers.`,
    `Personal branding in ${userProfile.industry} should emphasize your unique approach and specific results you've achieved.`,
    `Using industry-specific keywords in your profiles helps you appear in more search results from potential employers and clients.`,
  ]

  // Quick refinement questions
  const refinementQuestions = [
    {
      id: "specific-expertise",
      question: `What specific area of ${userProfile.industry} do you specialize in?`,
      type: "text",
      placeholder: "E.g., orthopedic devices, cardiac monitoring, surgical equipment...",
    },
    {
      id: "target-audience",
      question: "Which decision-makers do you primarily work with?",
      type: "choice",
      options: [
        "Hospital Administrators",
        "Department Heads",
        "Surgeons/Physicians",
        "Procurement Teams",
        "Multiple Stakeholders",
      ],
    },
    {
      id: "value-metric",
      question: "What metric best demonstrates your value to organizations?",
      type: "choice",
      options: [
        "Cost Reduction",
        "Improved Patient Outcomes",
        "Efficiency Gains",
        "Reduced Complications",
        "Increased Revenue",
      ],
    },
    {
      id: "content-comfort",
      question: "How comfortable are you with creating professional content?",
      type: "choice",
      options: ["Very comfortable", "Somewhat comfortable", "Neutral", "Somewhat uncomfortable", "Very uncomfortable"],
    },
  ]

  // Analysis stages
  const analysisStages = [
    "Analyzing professional identity",
    "Evaluating platform consistency",
    "Assessing thought leadership",
    "Measuring network strength",
    "Checking online discoverability",
    "Generating recommendations",
  ]

  useEffect(() => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.5
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            onComplete()
          }, 1000)
          return 100
        }
        return newProgress
      })
    }, 150)

    // Rotate tips
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % industryTips.length)
    }, 8000)

    // Show questions periodically
    const questionInterval = setInterval(() => {
      if (!showQuestion && currentQuestion < refinementQuestions.length) {
        setShowQuestion(true)
      }
    }, 12000)

    // Update analysis stage
    const stageInterval = setInterval(() => {
      setAnalysisStage((prev) => (prev + 1) % analysisStages.length)
    }, 10000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(tipInterval)
      clearInterval(questionInterval)
      clearInterval(stageInterval)
    }
  }, [])

  // When user answers a question
  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  // When user submits a question
  const handleNextQuestion = () => {
    // Send the current answer to parent
    onAdditionalInsights(answers)

    // Move to next question or hide question UI
    if (currentQuestion < refinementQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowQuestion(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Analysis in Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="relative">
            <Brain className="h-12 w-12 animate-pulse text-purple-600 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{analysisStages[analysisStage]}</h3>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
        </div>

        {/* Industry Tips */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Industry Insight</h4>
                <p className="text-sm text-blue-800 mt-1">{industryTips[currentTip]}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Refinement Question */}
        {showQuestion && currentQuestion < refinementQuestions.length && (
          <Card className="border-purple-100">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium">While we analyze, help us refine your results:</h4>
                  <p className="text-sm text-gray-600 mt-1">{refinementQuestions[currentQuestion].question}</p>
                </div>
              </div>

              {refinementQuestions[currentQuestion].type === "text" && (
                <Textarea
                  placeholder={refinementQuestions[currentQuestion].placeholder || "Your answer..."}
                  value={answers[refinementQuestions[currentQuestion].id] || ""}
                  onChange={(e) => handleAnswer(refinementQuestions[currentQuestion].id, e.target.value)}
                  className="mt-2"
                />
              )}

              {refinementQuestions[currentQuestion].type === "choice" && (
                <RadioGroup
                  value={answers[refinementQuestions[currentQuestion].id] || ""}
                  onValueChange={(value) => handleAnswer(refinementQuestions[currentQuestion].id, value)}
                  className="mt-2"
                >
                  {refinementQuestions[currentQuestion].options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleNextQuestion}
                  disabled={!answers[refinementQuestions[currentQuestion].id]}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Progress Visualization */}
        <div className="grid grid-cols-5 gap-2">
          {analysisStages.slice(0, 5).map((stage, index) => {
            const isActive = index === analysisStage
            const isCompleted = progress > (index + 1) * 20

            return (
              <div key={index} className="text-center">
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    isCompleted ? "bg-green-100" : isActive ? "bg-purple-100" : "bg-gray-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Brain className={`h-4 w-4 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">{stage.split(" ").pop()}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
