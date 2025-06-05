"use client"

import type React from "react"
// import AssessmentEngine from "@/components/assessment-engine" // Import AssessmentEngine

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Loader2, Linkedin, Twitter } from "lucide-react"

interface UserInputFormProps {
  onAnalysisStart: (userInfo: any) => void
  onAnalysisComplete: (data: any) => void
  isAnalyzing: boolean
}

export function UserInputForm({ onAnalysisStart, onAnalysisComplete, isAnalyzing }: UserInputFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    linkedinUrl: "",
    twitterHandle: "",
    industry: "",
    goals: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onAnalysisStart(formData)

    // Simulate comprehensive assessment process
    setTimeout(() => {
      const mockAnalysisData = {
        userInfo: formData,
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
            "Consistent posting schedule on LinkedIn",
            "Clear industry expertise in medical device sales",
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
      onAnalysisComplete(mockAnalysisData)
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isAnalyzing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Brand Presence</h3>
          <p className="text-gray-600 text-center">
            We're searching across platforms and analyzing your content, messaging, and network...
          </p>
          <div className="mt-6 w-full max-w-md">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Searching LinkedIn...</span>
              <span>✓</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Analyzing Twitter/X...</span>
              <span>⏳</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Evaluating content strategy...</span>
              <span>⏳</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Generating recommendations...</span>
              <span>⏳</span>
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
          <Search className="h-5 w-5" />
          Let's Analyze Your Personal Brand
        </CardTitle>
        <CardDescription>
          Provide your information below and we'll conduct a comprehensive analysis of your online presence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn Profile URL
            </Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Twitter/X Handle
            </Label>
            <Input
              id="twitter"
              placeholder="@yourusername"
              value={formData.twitterHandle}
              onChange={(e) => handleInputChange("twitterHandle", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry/Field</Label>
            <Input
              id="industry"
              placeholder="e.g., Medical Device Sales, Technology, Healthcare"
              value={formData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Personal Branding Goals (Optional)</Label>
            <Textarea
              id="goals"
              placeholder="What do you want to achieve with your personal brand? (e.g., thought leadership, career advancement, business development)"
              value={formData.goals}
              onChange={(e) => handleInputChange("goals", e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Analyze My Brand
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
