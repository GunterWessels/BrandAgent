"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Users,
  Globe,
  User,
  Copy,
  Star,
  ArrowRight,
  Lightbulb,
  BarChart3,
} from "lucide-react"
import { ActionCenter } from "./action-center"

interface DetailedReportSectionProps {
  category: string
  data: any
  score: number
}

export function DetailedReportSection({ category, data, score }: DetailedReportSectionProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getDetailedAnalysis = (category: string) => {
    const analyses = {
      professionalIdentity: {
        title: "Professional Identity & Messaging Analysis",
        icon: User,
        color: "blue",
        summary:
          "Your professional identity represents how you position yourself in your industry and the unique value you bring to your network.",
        keyFindings: [
          {
            type: "strength",
            title: "Clear Industry Focus",
            description: "Your LinkedIn profile clearly identifies you as a medical device sales professional",
            impact: "High",
          },
          {
            type: "weakness",
            title: "Generic Value Proposition",
            description: "Your headline lacks specific outcomes you deliver for clients",
            impact: "High",
          },
          {
            type: "opportunity",
            title: "Expertise Positioning",
            description: "Opportunity to highlight specific medical device categories or therapeutic areas",
            impact: "Medium",
          },
        ],
        recommendations: [
          {
            priority: "High",
            action: "Revise LinkedIn headline to include specific value proposition",
            template:
              "Medical Device Sales Expert | Helping Hospitals Reduce Surgical Complications by 30% | Specializing in Cardiovascular Technologies",
            timeframe: "This week",
          },
          {
            priority: "Medium",
            action: "Create a personal mission statement",
            template:
              "I help healthcare organizations improve patient outcomes through innovative medical technology solutions.",
            timeframe: "Next 2 weeks",
          },
        ],
        metrics: [
          { label: "Profile Views", current: "45/week", target: "100/week", improvement: "+122%" },
          { label: "Message Clarity", current: "6/10", target: "9/10", improvement: "+50%" },
          {
            label: "Value Proposition",
            current: "Generic",
            target: "Specific",
            improvement: "Complete rewrite needed",
          },
        ],
      },
      platformConsistency: {
        title: "Platform Consistency Analysis",
        icon: Target,
        color: "green",
        summary: "Consistency across platforms builds trust and reinforces your professional brand message.",
        keyFindings: [
          {
            type: "strength",
            title: "Professional Photo Consistency",
            description: "Same professional headshot used across LinkedIn and Twitter",
            impact: "Medium",
          },
          {
            type: "weakness",
            title: "Messaging Inconsistency",
            description: "LinkedIn focuses on sales expertise while Twitter lacks professional focus",
            impact: "High",
          },
          {
            type: "opportunity",
            title: "Cross-Platform Content Strategy",
            description: "Opportunity to create cohesive content themes across platforms",
            impact: "High",
          },
        ],
        recommendations: [
          {
            priority: "High",
            action: "Align Twitter bio with LinkedIn positioning",
            template: "Medical Device Sales Expert | Healthcare Innovation Advocate | Improving Patient Outcomes",
            timeframe: "Today",
          },
          {
            priority: "Medium",
            action: "Create consistent content pillars across platforms",
            template:
              "1) Industry insights, 2) Product innovations, 3) Customer success stories, 4) Professional development",
            timeframe: "Next week",
          },
        ],
        metrics: [
          { label: "Brand Consistency Score", current: "60%", target: "90%", improvement: "+30%" },
          { label: "Message Alignment", current: "Partial", target: "Full", improvement: "Needs work" },
          { label: "Visual Consistency", current: "85%", target: "95%", improvement: "+10%" },
        ],
      },
      thoughtLeadership: {
        title: "Thought Leadership & Content Strategy Analysis",
        icon: TrendingUp,
        color: "purple",
        summary: "Thought leadership establishes you as an industry expert and drives inbound opportunities.",
        keyFindings: [
          {
            type: "weakness",
            title: "Limited Content Creation",
            description: "Only 2 posts in the last month, minimal industry commentary",
            impact: "High",
          },
          {
            type: "opportunity",
            title: "Industry Expertise Untapped",
            description: "Deep knowledge of medical devices not reflected in content strategy",
            impact: "High",
          },
          {
            type: "strength",
            title: "Engagement Quality",
            description: "When you do post, engagement rates are above average",
            impact: "Medium",
          },
        ],
        recommendations: [
          {
            priority: "High",
            action: "Establish weekly content schedule",
            template: "Monday: Industry insights, Wednesday: Product spotlights, Friday: Professional tips",
            timeframe: "Start next week",
          },
          {
            priority: "High",
            action: "Create signature content series",
            template:
              "'Medical Monday' - Weekly insights on medical device innovations and their impact on patient care",
            timeframe: "Launch in 2 weeks",
          },
        ],
        metrics: [
          { label: "Content Frequency", current: "0.5/week", target: "3/week", improvement: "+500%" },
          { label: "Engagement Rate", current: "4.2%", target: "6%", improvement: "+43%" },
          { label: "Industry Recognition", current: "Low", target: "High", improvement: "Significant opportunity" },
        ],
      },
      networkStrength: {
        title: "Network Strength & Influence Analysis",
        icon: Users,
        color: "orange",
        summary: "Your network strength determines your reach and ability to create opportunities.",
        keyFindings: [
          {
            type: "strength",
            title: "Strong Connection Count",
            description: "500+ LinkedIn connections with good industry representation",
            impact: "High",
          },
          {
            type: "strength",
            title: "Quality Connections",
            description: "Connections include decision-makers in healthcare organizations",
            impact: "High",
          },
          {
            type: "opportunity",
            title: "Engagement Optimization",
            description: "Could better leverage network through regular engagement",
            impact: "Medium",
          },
        ],
        recommendations: [
          {
            priority: "Medium",
            action: "Implement daily engagement routine",
            template: "Spend 15 minutes daily commenting meaningfully on connections' posts",
            timeframe: "Start immediately",
          },
          {
            priority: "Medium",
            action: "Strategic connection building",
            template: "Target 5 new strategic connections weekly in target hospitals/health systems",
            timeframe: "Ongoing",
          },
        ],
        metrics: [
          { label: "Network Size", current: "500+", target: "750+", improvement: "+50%" },
          { label: "Engagement Rate", current: "2.1%", target: "5%", improvement: "+138%" },
          { label: "Influence Score", current: "72", target: "85", improvement: "+18%" },
        ],
      },
      discoverability: {
        title: "Discoverability & SEO Presence Analysis",
        icon: Globe,
        color: "indigo",
        summary: "Your online discoverability determines how easily opportunities can find you.",
        keyFindings: [
          {
            type: "weakness",
            title: "Limited SEO Optimization",
            description: "Profile lacks industry keywords that prospects might search for",
            impact: "High",
          },
          {
            type: "opportunity",
            title: "Google Search Presence",
            description: "Opportunity to rank for 'medical device sales [your city]' searches",
            impact: "High",
          },
          {
            type: "weakness",
            title: "Content SEO",
            description: "Posts don't include strategic keywords for discoverability",
            impact: "Medium",
          },
        ],
        recommendations: [
          {
            priority: "High",
            action: "Optimize LinkedIn profile with target keywords",
            template: "Include: medical device sales, healthcare technology, surgical equipment, [therapeutic areas]",
            timeframe: "This week",
          },
          {
            priority: "Medium",
            action: "Create SEO-optimized content",
            template: "Use keywords naturally in posts: 'medical device innovation', 'healthcare technology trends'",
            timeframe: "Ongoing",
          },
        ],
        metrics: [
          { label: "Search Visibility", current: "Low", target: "High", improvement: "Major opportunity" },
          { label: "Keyword Optimization", current: "25%", target: "80%", improvement: "+220%" },
          { label: "Google Ranking", current: "Not ranked", target: "Page 1", improvement: "Significant potential" },
        ],
      },
    }

    return analyses[category as keyof typeof analyses]
  }

  const analysis = getDetailedAnalysis(category)

  if (!analysis) {
    return <div>Analysis not found</div>
  }

  const IconComponent = analysis.icon

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${analysis.color}-100`}>
                <IconComponent className={`h-6 w-6 text-${analysis.color}-600`} />
              </div>
              <div>
                <CardTitle className="text-xl">{analysis.title}</CardTitle>
                <CardDescription className="mt-1">{analysis.summary}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
              <div className="text-sm text-gray-500">Current Score</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.keyFindings.map((finding, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                <div className="flex-shrink-0">
                  {finding.type === "strength" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {finding.type === "weakness" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  {finding.type === "opportunity" && <Star className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{finding.title}</h4>
                    <Badge
                      variant={
                        finding.impact === "High"
                          ? "destructive"
                          : finding.impact === "Medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {finding.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{finding.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Actionable Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={rec.priority === "High" ? "destructive" : "default"}>{rec.priority} Priority</Badge>
                  <span className="text-sm text-gray-500">Timeline: {rec.timeframe}</span>
                </div>
                <h4 className="font-medium mb-2">{rec.action}</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Template/Example:</span>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(rec.template)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm italic">{rec.template}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics & Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{metric.label}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">Current: {metric.current}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Target: {metric.target}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">{metric.improvement}</div>
                  <div className="text-xs text-gray-500">Potential Improvement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Center */}
      <ActionCenter
        category={category}
        recommendations={analysis.recommendations}
        currentData={data}
        onActionComplete={(action, result) => {
          console.log("Action completed:", action, result)
          // Handle action completion - could update UI, show success message, etc.
        }}
      />

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-sm">Complete high-priority recommendations within 1 week</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm">Implement medium-priority items over the next 2-4 weeks</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm">Schedule follow-up analysis in 30 days to track progress</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
