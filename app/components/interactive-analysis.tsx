"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  Globe,
  Search,
} from "lucide-react"
import type { UserProfile, InteractiveQuestion } from "@/lib/ai-agent"

interface InteractiveAnalysisProps {
  userProfile: UserProfile
  onComplete: (results: any) => void
}

export function InteractiveAnalysis({ userProfile, onComplete }: InteractiveAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [questions, setQuestions] = useState<InteractiveQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [webData, setWebData] = useState<any>(null)
  const [isScrapingProfiles, setIsScrapingProfiles] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stepStartTime, setStepStartTime] = useState<number | null>(null)

  const steps = [
    {
      id: "goal-refinement",
      title: "Goal Refinement",
      description: "Let's clarify and refine your personal branding objectives",
      icon: Target,
    },
    {
      id: "web-presence",
      title: "Web Presence Analysis",
      description: "Analyzing your current online presence",
      icon: Globe,
    },
    {
      id: "value-proposition",
      title: "Value Proposition",
      description: `Define what makes you unique in ${userProfile.industry}`,
      icon: TrendingUp,
    },
    {
      id: "audience-targeting",
      title: "Audience Analysis",
      description: "Identify your ideal professional network and prospects",
      icon: Users,
    },
    {
      id: "content-strategy",
      title: "Content Strategy",
      description: "Plan your thought leadership and engagement approach",
      icon: MessageSquare,
    },
    {
      id: "final-analysis",
      title: "AI Analysis",
      description: "Generating your personalized brand strategy",
      icon: Brain,
    },
  ]

  useEffect(() => {
    loadQuestionsForStep(currentStep)
    setStepStartTime(Date.now()) // Start timing the step
  }, [currentStep])

  const loadQuestionsForStep = async (stepIndex: number) => {
    if (stepIndex >= steps.length - 1) {
      // Final analysis step
      await performFinalAnalysis()
      return
    }

    const stepId = steps[stepIndex].id

    // Special handling for web presence analysis step
    if (stepId === "web-presence") {
      await scrapeProfiles()
      // Move to next step after scraping
      setCurrentStep(currentStep + 1)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "generate-questions",
          stepId,
          userProfile,
          answers,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setQuestions(data.questions || [])
    } catch (error) {
      console.error("Error loading questions:", error)
      setError("Failed to load questions. Using fallback questions.")
      // Fallback questions
      setQuestions(getFallbackQuestions(stepIndex))
    }
    setIsLoading(false)
  }

  const scrapeProfiles = async () => {
    setIsScrapingProfiles(true)
    setError(null)

    try {
      if (userProfile.linkedinUrl || userProfile.twitterHandle) {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            step: "scrape-profiles",
            userProfile,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setWebData(data)
      } else {
        // No profiles to scrape
        setWebData({})
      }
    } catch (error) {
      console.error("Error scraping profiles:", error)
      setError("Profile analysis encountered an issue, but we'll continue with the assessment.")
      setWebData({})
    }
    setIsScrapingProfiles(false)
  }

  const getFallbackQuestions = (stepIndex: number): InteractiveQuestion[] => {
    const fallbackQuestions = [
      [
        {
          id: "primary-goal",
          question: "What is your primary goal for your personal brand in the next 12 months?",
          type: "choice" as const,
          options: [
            "Increase sales and close more deals",
            "Build thought leadership in my specialty",
            "Expand my professional network",
            "Position for career advancement",
            "Launch my own consulting practice",
          ],
          context: "Your primary goal will shape our entire strategy and recommendations.",
        },
      ],
      // Skip web presence step in fallback
      [
        {
          id: "unique-value",
          question: `What specific value do you bring to ${userProfile.industry} that your competitors don't?`,
          type: "text" as const,
          context: "This will become the foundation of your value proposition and messaging.",
        },
      ],
      [
        {
          id: "target-audience",
          question: "Who are your ideal prospects and decision makers?",
          type: "choice" as const,
          options: [
            "C-suite executives",
            "Department heads and directors",
            "Mid-level managers",
            "Technical specialists",
            "End users of products/services",
          ],
          context: "Understanding your audience helps tailor your messaging and content strategy.",
        },
      ],
      [
        {
          id: "content-frequency",
          question: "How often are you currently sharing professional content online?",
          type: "choice" as const,
          options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
          context: "Consistent content sharing is crucial for building thought leadership and staying top-of-mind.",
        },
      ],
    ]

    // Adjust for the web presence step
    const adjustedIndex = stepIndex > 1 ? stepIndex - 1 : stepIndex
    return fallbackQuestions[adjustedIndex] || []
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    // Log question response
    console.log(`Question ${questionId} answered with:`, value)
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      // Log step progression timing
      if (stepStartTime) {
        const stepDuration = Date.now() - stepStartTime
        console.log(`Step ${currentStep + 1} duration:`, stepDuration, "ms")
      }
      setCurrentStep((prev) => prev + 1)
    }
  }

  const performFinalAnalysis = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "final-analysis",
          userProfile,
          answers,
          webData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const finalResults = {
        userProfile: { ...userProfile, refinedGoals: data.refinedGoals },
        analysis: data.analysis,
        content: data.content,
        interactiveAnswers: answers,
        webData: data.webData || webData,
        scores: {
          professionalIdentity: data.analysis.currentState.thoughtLeadership * 10,
          platformConsistency: 65,
          thoughtLeadership: data.analysis.currentState.thoughtLeadership * 10,
          networkStrength: data.analysis.currentState.networkStrength * 10,
          discoverability: 55,
        },
        insights: {
          strengths: data.analysis.gaps.length > 0 ? ["Strong industry knowledge", "Clear communication skills"] : [],
          improvements: data.analysis.gaps,
        },
        recommendations: data.analysis.recommendations,
      }

      setAnalysisResults(finalResults)
      onComplete(finalResults)
      // Log completion
      console.log("Interactive analysis completed successfully.")
    } catch (error) {
      console.error("Error in final analysis:", error)
      setError("Analysis completed with some limitations. Showing available results.")

      // Provide fallback results
      const fallbackResults = {
        userProfile,
        scores: {
          professionalIdentity: 70,
          platformConsistency: 60,
          thoughtLeadership: 45,
          networkStrength: 80,
          discoverability: 55,
        },
        insights: {
          strengths: ["Industry expertise", "Professional communication"],
          improvements: ["Need better online presence", "Content strategy needs development"],
        },
        recommendations: [
          {
            category: "LinkedIn",
            priority: "High",
            action: "Update headline to highlight specific expertise",
            reasoning: "Better visibility and positioning",
            template: `${userProfile.industry} Expert | Helping Organizations Achieve Better Outcomes | 8+ Years Experience`,
          },
        ],
        interactiveAnswers: answers,
        webData: webData || {},
      }

      onComplete(fallbackResults)
      // Log completion with limitations
      console.log("Interactive analysis completed with limitations.")
    }
    setIsLoading(false)
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  // Error display
  if (error && !isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="h-12 w-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Notice</h3>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <Button onClick={() => setError(null)}>Continue</Button>
        </CardContent>
      </Card>
    )
  }

  // Web presence analysis loading screen
  if (isScrapingProfiles) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Search className="h-12 w-12 animate-pulse text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Web Presence...</h3>
          <p className="text-gray-600 text-center mb-4">
            Our AI is scanning your LinkedIn and Twitter profiles, as well as searching for your mentions across the
            web.
          </p>
          <Progress value={65} className="w-full max-w-md" />
          <p className="text-sm text-gray-500 mt-4">This may take a minute or two</p>
        </CardContent>
      </Card>
    )
  }

  // Final analysis loading screen
  if (isLoading && currentStep === steps.length - 1) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Brain className="h-12 w-12 animate-pulse text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI is analyzing your responses...</h3>
          <p className="text-gray-600 text-center mb-4">
            Comparing your current state to {userProfile.industry} industry best practices and generating personalized
            recommendations.
          </p>
          <Progress value={85} className="w-full max-w-md" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Interactive Brand Analysis
            </CardTitle>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {React.createElement(steps[currentStep].icon, {
              className: "h-6 w-6 text-blue-600",
            })}
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Brain className="h-8 w-8 animate-pulse text-purple-600 mr-2" />
              <span>AI is preparing personalized questions...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <Label className="text-base font-medium">{question.question}</Label>
                      <p className="text-sm text-gray-600 mt-1">{question.context}</p>
                    </div>
                  </div>

                  {question.type === "text" && (
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      rows={3}
                    />
                  )}

                  {question.type === "choice" && question.options && (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "rating" && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={answers[question.id] === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAnswerChange(question.id, rating)}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between pt-4">
                <div className="text-sm text-gray-500">
                  {questions.length > 0 &&
                    `${
                      Object.keys(answers).filter((key) => questions.some((q) => q.id === key) && answers[key]).length
                    } of ${questions.length} answered`}
                </div>
                <Button
                  onClick={handleNextStep}
                  disabled={questions.some((q) => !answers[q.id])}
                  className="flex items-center gap-2"
                >
                  {currentStep === steps.length - 2 ? "Complete Analysis" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Educational Insights */}
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Personal Branding Insight</h4>
              <p className="text-sm text-blue-800 mt-1">
                {currentStep === 0 &&
                  "Clear, specific goals are the foundation of effective personal branding. They guide every decision about content, networking, and positioning."}
                {currentStep === 1 &&
                  "Your online presence is your digital first impression. A cohesive presence across platforms builds credibility and expands your reach."}
                {currentStep === 2 &&
                  `Your unique value proposition should focus on specific outcomes and results you've delivered in ${userProfile.industry}.`}
                {currentStep === 3 &&
                  "Understanding your audience helps you create content that resonates and positions you as a trusted advisor rather than just another professional."}
                {currentStep === 4 &&
                  "Consistent, valuable content sharing establishes thought leadership and keeps you top-of-mind with prospects and peers."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
