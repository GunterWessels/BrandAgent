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
  ChevronRight,
  Download,
  FileText,
  Calendar,
} from "lucide-react"
import { DetailedSectionAnalysis } from "./detailed-section-analysis"
import { FollowUpModal } from "./follow-up-modal"
import { ReportGenerator, type DetailedAnalysis } from "@/lib/report-generator"
import { DocumentExportService } from "@/lib/document-export"

interface BrandAnalysisDashboardProps {
  data: any
}

export function BrandAnalysisDashboard({ data }: BrandAnalysisDashboardProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [isExporting, setIsExporting] = useState<string | null>(null)

  // Add safety checks for data structure
  if (!data || !data.userInfo) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Loading Analysis Results...</h3>
            <p className="text-gray-600">Please wait while we prepare your brand analysis.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check for additional insights from interactive waiting experience
  const additionalInsights = data.userInfo.additionalInsights || {}

  // Generate detailed analysis
  const detailedAnalysis: DetailedAnalysis = ReportGenerator.generateDetailedAnalysis(
    data.userInfo,
    data.webData || {},
    { ...data.interactiveAnswers, ...additionalInsights } || {},
  )

  // Provide default values for missing data
  const userInfo = data.userInfo || { name: "User" }
  const scores = data.scores || {
    professionalIdentity: detailedAnalysis.professionalIdentity.score,
    platformConsistency: detailedAnalysis.platformConsistency.score,
    thoughtLeadership: detailedAnalysis.thoughtLeadership.score,
    networkStrength: detailedAnalysis.networkStrength.score,
    discoverability: detailedAnalysis.discoverability.score,
  }
  const insights = data.insights || {
    strengths: detailedAnalysis.professionalIdentity.keyStrengths,
    improvements: detailedAnalysis.professionalIdentity.improvementAreas,
  }
  const recommendations = data.recommendations || []

  // Enhance recommendations with additional insights if available
  if (additionalInsights["specific-expertise"] && !recommendations.some((r) => r.category === "Specialization")) {
    recommendations.push({
      category: "Specialization",
      priority: "High",
      action: `Highlight your expertise in ${additionalInsights["specific-expertise"]} across all platforms`,
      template: `${userInfo.industry} Specialist in ${additionalInsights["specific-expertise"]} | Driving Improved Outcomes`,
    })
  }

  if (
    additionalInsights["value-metric"] &&
    !recommendations.some((r) => r.action?.includes(additionalInsights["value-metric"]))
  ) {
    recommendations.push({
      category: "Value Proposition",
      priority: "Medium",
      action: `Emphasize ${additionalInsights["value-metric"]} in your messaging and case studies`,
      template: `Helping healthcare providers achieve ${additionalInsights["value-metric"]} through innovative medical device solutions`,
    })
  }

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

  const handleDownloadReport = async () => {
    setIsExporting("word")
    try {
      const reportContent = ReportGenerator.generateComprehensiveReport(
        data.userInfo,
        detailedAnalysis,
        recommendations,
      )
      const filename = `${data.userInfo.name.replace(/\s+/g, "_")}_Brand_Analysis_Report`

      await DocumentExportService.exportToWord(reportContent, filename)
    } catch (error) {
      console.error("Error exporting to Word:", error)
      alert("Error exporting document. Please try again.")
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportToPDF = async () => {
    setIsExporting("pdf")
    try {
      const reportContent = ReportGenerator.generateComprehensiveReport(
        data.userInfo,
        detailedAnalysis,
        recommendations,
      )
      const filename = `${data.userInfo.name.replace(/\s+/g, "_")}_Brand_Analysis_Report`

      await DocumentExportService.exportToPDF(reportContent, filename)
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Error exporting PDF. Please try again.")
    } finally {
      setIsExporting(null)
    }
  }

  const handleFollowUpScheduled = (followUp: any) => {
    console.log("Follow-up scheduled:", followUp)
    // You could show a toast notification here
  }

  const scoreCategories = [
    {
      id: "professionalIdentity",
      title: "Professional Identity",
      icon: User,
      color: "blue",
      score: scores.professionalIdentity,
    },
    {
      id: "platformConsistency",
      title: "Platform Consistency",
      icon: Target,
      color: "green",
      score: scores.platformConsistency,
    },
    {
      id: "thoughtLeadership",
      title: "Thought Leadership",
      icon: TrendingUp,
      color: "purple",
      score: scores.thoughtLeadership,
    },
    {
      id: "networkStrength",
      title: "Network Strength",
      icon: Users,
      color: "orange",
      score: scores.networkStrength,
    },
    {
      id: "discoverability",
      title: "Discoverability",
      icon: Globe,
      color: "indigo",
      score: scores.discoverability,
    },
  ]

  if (selectedSection) {
    return (
      <DetailedSectionAnalysis
        sectionId={selectedSection}
        analysis={detailedAnalysis}
        onBack={() => setSelectedSection(null)}
      />
    )
  }

  const overallScore = Math.round(
    (scores.professionalIdentity +
      scores.platformConsistency +
      scores.thoughtLeadership +
      scores.networkStrength +
      scores.discoverability) /
      5,
  )

  return (
    <div className="space-y-8">
      {/* Header with overall score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Brand Analysis for {userInfo.name}</CardTitle>
              <CardDescription>Comprehensive analysis of your personal brand across digital platforms</CardDescription>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{overallScore}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
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
                  {insights.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                  {insights.strengths.length === 0 && (
                    <li className="text-sm text-gray-500 italic">No strengths identified yet.</li>
                  )}
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
                  {insights.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                  {insights.improvements.length === 0 && (
                    <li className="text-sm text-gray-500 italic">No improvement areas identified yet.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {detailedAnalysis.networkStrength.networkAnalysis.size.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Network Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {detailedAnalysis.thoughtLeadership.contentAnalysis.frequency}
                  </div>
                  <div className="text-sm text-gray-600">Content Frequency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {detailedAnalysis.thoughtLeadership.industryPresence.mentions}
                  </div>
                  <div className="text-sm text-gray-600">Online Mentions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {detailedAnalysis.discoverability.onlinePresence.googleResults}
                  </div>
                  <div className="text-sm text-gray-600">Google Results</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{rec.category || "General"}</CardTitle>
                      <Badge variant={rec.priority === "High" ? "destructive" : "secondary"}>
                        {rec.priority || "Medium"} Priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{rec.action || "No action specified"}</p>
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
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No recommendations available yet.</p>
                </CardContent>
              </Card>
            )}
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
                    <span className="text-sm">
                      Share a case study about a successful implementation in {userInfo.industry}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Post about emerging trends in {userInfo.industry}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Share insights from recent industry conferences</span>
                  </li>
                  {additionalInsights["specific-expertise"] && (
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span className="text-sm">
                        Create a series on innovations in {additionalInsights["specific-expertise"]}
                      </span>
                    </li>
                  )}
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
                    <span className="text-sm">Quick tips for {userInfo.industry} professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Industry news commentary and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">Behind-the-scenes insights from your work</span>
                  </li>
                  {additionalInsights["value-metric"] && (
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span className="text-sm">
                        Share metrics on how your work improves {additionalInsights["value-metric"]}
                      </span>
                    </li>
                  )}
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
                  <p className="font-medium mb-2">Recommended Headline:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm italic flex-1">
                      {additionalInsights["specific-expertise"]
                        ? `${userInfo.industry} Expert in ${additionalInsights["specific-expertise"]} | Helping Organizations Achieve Better Outcomes`
                        : detailedAnalysis.professionalIdentity.suggestedHeadline}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          additionalInsights["specific-expertise"]
                            ? `${userInfo.industry} Expert in ${additionalInsights["specific-expertise"]} | Helping Organizations Achieve Better Outcomes`
                            : detailedAnalysis.professionalIdentity.suggestedHeadline,
                        )
                      }
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {additionalInsights["value-metric"] && (
              <Card>
                <CardHeader>
                  <CardTitle>Value Proposition Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Recommended Value Proposition:</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm italic flex-1">
                        Helping healthcare providers achieve {additionalInsights["value-metric"]} through innovative
                        medical device solutions
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `Helping healthcare providers achieve ${additionalInsights["value-metric"]} through innovative medical device solutions`,
                          )
                        }
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={handleDownloadReport} disabled={isExporting === "word"}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting === "word" ? "Exporting..." : "Download Report (.doc)"}
        </Button>
        <Button variant="outline" onClick={handleExportToPDF} disabled={isExporting === "pdf"}>
          <FileText className="h-4 w-4 mr-2" />
          {isExporting === "pdf" ? "Exporting..." : "Export to PDF"}
        </Button>
        <Button onClick={() => setShowFollowUpModal(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Follow-up Analysis
        </Button>
      </div>

      {/* Follow-up Modal */}
      <FollowUpModal
        userProfile={userInfo}
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        onScheduled={handleFollowUpScheduled}
      />
    </div>
  )
}
