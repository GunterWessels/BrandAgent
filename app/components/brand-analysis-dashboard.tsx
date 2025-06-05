"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Target,
  TrendingUp,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Copy,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"

interface BrandAnalysisDashboardProps {
  data: any
}

export function BrandAnalysisDashboard({ data }: BrandAnalysisDashboardProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Needs Work"
    return "Critical"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const scoreCategories = [
    {
      id: "professionalIdentity",
      title: "Professional Identity",
      icon: User,
      color: "blue",
      score: data.scores.professionalIdentity,
    },
    {
      id: "platformConsistency",
      title: "Consistency",
      icon: Target,
      color: "green",
      score: data.scores.platformConsistency,
    },
    {
      id: "thoughtLeadership",
      title: "Thought Leadership",
      icon: TrendingUp,
      color: "purple",
      score: data.scores.thoughtLeadership,
    },
    {
      id: "networkStrength",
      title: "Network Strength",
      icon: Users,
      color: "orange",
      score: data.scores.networkStrength,
    },
    {
      id: "discoverability",
      title: "Discoverability",
      icon: Globe,
      color: "indigo",
      score: data.scores.discoverability,
    },
  ]

  if (selectedSection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedSection(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>
          <h2 className="text-2xl font-semibold">
            {scoreCategories.find((cat) => cat.id === selectedSection)?.title} Analysis
          </h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>
              Detailed analysis for {selectedSection} would appear here with specific recommendations and action items.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with overall score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Brand Analysis for {data.userInfo.name}</CardTitle>
          <CardDescription>Comprehensive analysis of your personal brand across digital platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-6">
            {scoreCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => setSelectedSection(category.id)}
                >
                  <CardContent className="text-center p-4">
                    <div className="flex items-center justify-center mb-2">
                      <IconComponent className={`h-6 w-6 text-${category.color}-600 mr-2`} />
                      <span className="font-medium text-sm">{category.title}</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>{category.score}</div>
                    <Progress value={category.score} className="mt-2" />
                    <span className="text-sm text-gray-500">{getScoreLabel(category.score)}</span>
                    <ChevronRight className="h-4 w-4 mx-auto mt-2 text-gray-400" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="content">Content Ideas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {data.insights.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {data.insights.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {data.recommendations.map((rec: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.category}</CardTitle>
                    <Badge variant={rec.priority === "High" ? "destructive" : "secondary"}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{rec.action}</p>
                  {rec.template && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Suggested Template:</span>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(rec.template)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm italic">{rec.template}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Content Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Share a case study about a successful medical device implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Post about emerging trends in healthcare technology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Share insights from recent industry conferences</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Twitter/X Content Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Quick tips for healthcare professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Industry news commentary and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Behind-the-scenes insights from your work</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Headline Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Template:</p>
                  <p className="text-sm mb-4">
                    [Your Expertise] | Helping [Target Audience] [Achieve Specific Outcome] | [Years] Years Experience |
                    [Key Differentiator]
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Example for Medical Device Sales:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          "Medical Device Sales Expert | Helping Healthcare Organizations Improve Patient Outcomes | 10+ Years Experience | Specializing in Surgical Technologies",
                        )
                      }
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm italic mt-2">
                    "Medical Device Sales Expert | Helping Healthcare Organizations Improve Patient Outcomes | 10+ Years
                    Experience | Specializing in Surgical Technologies"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button>Schedule Follow-up Analysis</Button>
      </div>
    </div>
  )
}
