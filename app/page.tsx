"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Globe, Brain } from "lucide-react"
import { BrandAnalysisDashboard } from "./components/brand-analysis-dashboard"
import { UserInputForm } from "./components/user-input-form"
import { AIAssessmentProgress } from "./components/ai-assessment-progress"

export default function BrandSMARTSApp() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [formData, setFormData] = useState(null)

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setIsAnalyzing(false)
    setShowAssessment(false)
  }

  const handleStartAssessment = (userInfo: any) => {
    setShowAssessment(true)
    setIsAnalyzing(true)
    setFormData(userInfo)
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
            Advanced AI analysis of your online presence with personalized insights and automated improvements for
            medical device sales professionals.
          </p>
        </div>

        {/* Main Content */}
        {!analysisData ? (
          showAssessment ? (
            <AIAssessmentProgress userInfo={formData} onComplete={handleAnalysisComplete} />
          ) : (
            <UserInputForm
              onAnalysisStart={handleStartAssessment}
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
            />
          )
        ) : (
          <BrandAnalysisDashboard data={analysisData} />
        )}

        {/* Features Preview */}
        {!analysisData && !isAnalyzing && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-8">AI-Powered Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Brain className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <CardTitle className="text-lg">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Advanced AI analyzes your professional identity and generates personalized recommendations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <CardTitle className="text-lg">Smart Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    AI-generated headlines, summaries, and content optimized for your industry
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Memory & Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Persistent memory tracks your progress and learns from your preferences
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Globe className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                  <CardTitle className="text-lg">Automated Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Take direct action to implement improvements with AI-powered automation
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
