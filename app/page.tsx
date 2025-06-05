"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Globe, Brain } from "lucide-react"
import { BrandAnalysisDashboard } from "./components/brand-analysis-dashboard"
import { UserInputForm } from "./components/user-input-form"
import { InteractiveAnalysis } from "./components/interactive-analysis"

export default function BrandSMARTSApp() {
  const [analysisData, setAnalysisData] = useState(null)
  const [showInteractiveAnalysis, setShowInteractiveAnalysis] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setShowInteractiveAnalysis(false)
  }

  const handleStartAnalysis = (userInfo: any) => {
    setUserProfile(userInfo)
    setShowInteractiveAnalysis(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">LiquidSMARTS-BrandSMARTS</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">AI-Powered Personal Brand Strategist</p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Interactive AI agent that analyzes your current presence, guides you through best practices, and creates a
            personalized brand strategy for medical device sales professionals.
          </p>
        </div>

        {/* Main Content */}
        {!analysisData ? (
          showInteractiveAnalysis && userProfile ? (
            <InteractiveAnalysis userProfile={userProfile} onComplete={handleAnalysisComplete} />
          ) : (
            <UserInputForm onAnalysisStart={handleStartAnalysis} />
          )
        ) : (
          <BrandAnalysisDashboard data={analysisData} />
        )}

        {/* Features Preview */}
        {!analysisData && !showInteractiveAnalysis && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-8">AI Agent Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Brain className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Interactive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    AI agent guides you through personalized questions to refine your goals and strategy
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <CardTitle className="text-lg">Real-time Coaching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Learn personal branding best practices while the AI analyzes your current state
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Dynamic Refinement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Your profile and recommendations improve as you provide more insights to the AI
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Globe className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                  <CardTitle className="text-lg">Industry-Specific</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Specialized knowledge and templates for medical device sales professionals
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
