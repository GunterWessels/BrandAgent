"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Linkedin, Twitter } from "lucide-react"

interface UserInputFormProps {
  onAnalysisStart: (userInfo: any) => void
}

export function UserInputForm({ onAnalysisStart }: UserInputFormProps) {
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
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const popularIndustries = [
    "Medical Device Sales",
    "Software Engineering",
    "Financial Services",
    "Marketing",
    "Legal",
    "Healthcare",
    "Education",
    "Real Estate",
    "Consulting",
    "Human Resources",
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI-Powered Brand Analysis
        </CardTitle>
        <CardDescription>
          Our AI agent will analyze your current presence and guide you through an interactive assessment to create your
          personalized brand strategy
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
            <Label htmlFor="industry">Industry/Field *</Label>
            <div className="flex gap-2">
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {popularIndustries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or enter custom industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="flex-1"
              />
            </div>
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
            <p className="text-xs text-gray-500">
              Adding your LinkedIn profile allows our AI to analyze your current professional presence
            </p>
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
            <Label htmlFor="goals">Initial Personal Branding Goals</Label>
            <Textarea
              id="goals"
              placeholder="What do you want to achieve with your personal brand? (e.g., increase visibility, build thought leadership, expand network)"
              value={formData.goals}
              onChange={(e) => handleInputChange("goals", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Don't worry if you're not sure - our AI will help you refine these during the analysis.
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Brain className="h-4 w-4 mr-2" />
            Start AI Analysis
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
