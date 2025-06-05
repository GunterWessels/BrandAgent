"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  User,
  Target,
  TrendingUp,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Copy,
  BarChart3,
  Eye,
  MessageSquare,
  Award,
} from "lucide-react"
import type { DetailedAnalysis } from "@/lib/report-generator"

interface DetailedSectionAnalysisProps {
  sectionId: string
  analysis: DetailedAnalysis
  onBack: () => void
}

export function DetailedSectionAnalysis({ sectionId, analysis, onBack }: DetailedSectionAnalysisProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const renderProfessionalIdentity = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Current vs Recommended
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Current Headline:</Label>
              <p className="text-sm bg-gray-50 p-2 rounded mt-1">{analysis.professionalIdentity.currentHeadline}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Recommended Headline:</Label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm bg-green-50 p-2 rounded flex-1">
                  {analysis.professionalIdentity.suggestedHeadline}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(analysis.professionalIdentity.suggestedHeadline)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Benchmark Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Your Score</span>
                <span className="font-semibold text-blue-600">
                  {analysis.professionalIdentity.benchmarkComparison.yourScore}%
                </span>
              </div>
              <Progress value={analysis.professionalIdentity.benchmarkComparison.yourScore} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm">Industry Average</span>
                <span className="text-gray-600">
                  {analysis.professionalIdentity.benchmarkComparison.industryAverage}%
                </span>
              </div>
              <Progress value={analysis.professionalIdentity.benchmarkComparison.industryAverage} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm">Top Performers</span>
                <span className="text-green-600">
                  {analysis.professionalIdentity.benchmarkComparison.topPerformers}%
                </span>
              </div>
              <Progress value={analysis.professionalIdentity.benchmarkComparison.topPerformers} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.professionalIdentity.keyStrengths.map((strength, index) => (
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
              Improvement Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.professionalIdentity.improvementAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPlatformConsistency = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(analysis.platformConsistency.platforms).map(([platform, data]) => (
          <Card key={platform}>
            <CardHeader>
              <CardTitle className="capitalize">{platform}</CardTitle>
              <CardDescription>
                {data.present ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="secondary">Not Present</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completeness</span>
                    <span>{data.completeness}%</span>
                  </div>
                  <Progress value={data.completeness} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Consistency</span>
                    <span>{data.consistency}%</span>
                  </div>
                  <Progress value={data.consistency} className="h-2" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Issues:</Label>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    {data.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.platformConsistency.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )

  const renderThoughtLeadership = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Frequency</Label>
                <p className="text-lg font-semibold">{analysis.thoughtLeadership.contentAnalysis.frequency}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Quality Score</Label>
                <p className="text-lg font-semibold">{analysis.thoughtLeadership.contentAnalysis.quality}%</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Engagement Rate</Label>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={analysis.thoughtLeadership.contentAnalysis.engagement} className="flex-1" />
                <span className="text-sm">{analysis.thoughtLeadership.contentAnalysis.engagement}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Industry Presence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analysis.thoughtLeadership.industryPresence.mentions}
                </p>
                <p className="text-sm text-gray-600">Online Mentions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {analysis.thoughtLeadership.industryPresence.citations}
                </p>
                <p className="text-sm text-gray-600">Citations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {analysis.thoughtLeadership.industryPresence.speakingEngagements}
                </p>
                <p className="text-sm text-gray-600">Speaking Events</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {analysis.thoughtLeadership.industryPresence.publications}
                </p>
                <p className="text-sm text-gray-600">Publications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.thoughtLeadership.contentAnalysis.topics.map((topic, index) => (
                <Badge key={index} variant="default">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.thoughtLeadership.contentAnalysis.missingTopics.map((topic, index) => (
                <Badge key={index} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderNetworkStrength = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Size</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {analysis.networkStrength.networkAnalysis.size.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Quality</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-green-600">{analysis.networkStrength.networkAnalysis.quality}%</p>
            <Progress value={analysis.networkStrength.networkAnalysis.quality} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry Relevance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {analysis.networkStrength.networkAnalysis.industryRelevance}%
            </p>
            <Progress value={analysis.networkStrength.networkAnalysis.industryRelevance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.networkStrength.growthOpportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{opportunity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.networkStrength.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDiscoverability = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              SEO Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analysis.discoverability.seoAnalysis).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span>{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {analysis.discoverability.onlinePresence.googleResults}
              </p>
              <p className="text-sm text-gray-600">Google Results</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Social Media Visibility</span>
                <span>{analysis.discoverability.onlinePresence.socialMediaVisibility}%</span>
              </div>
              <Progress value={analysis.discoverability.onlinePresence.socialMediaVisibility} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Professional Directories</span>
                <span>{analysis.discoverability.onlinePresence.professionalDirectories}%</span>
              </div>
              <Progress value={analysis.discoverability.onlinePresence.professionalDirectories} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.discoverability.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )

  const getSectionTitle = () => {
    const titles = {
      professionalIdentity: "Professional Identity Analysis",
      platformConsistency: "Platform Consistency Analysis",
      thoughtLeadership: "Thought Leadership Analysis",
      networkStrength: "Network Strength Analysis",
      discoverability: "Discoverability Analysis",
    }
    return titles[sectionId] || "Analysis"
  }

  const renderSectionContent = () => {
    switch (sectionId) {
      case "professionalIdentity":
        return renderProfessionalIdentity()
      case "platformConsistency":
        return renderPlatformConsistency()
      case "thoughtLeadership":
        return renderThoughtLeadership()
      case "networkStrength":
        return renderNetworkStrength()
      case "discoverability":
        return renderDiscoverability()
      default:
        return <div>Section not found</div>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </Button>
        <h2 className="text-2xl font-semibold">{getSectionTitle()}</h2>
      </div>

      {renderSectionContent()}
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
