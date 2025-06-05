"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, X } from "lucide-react"
import { FollowUpService } from "@/lib/follow-up-service"

interface FollowUpModalProps {
  userProfile: any
  isOpen: boolean
  onClose: () => void
  onScheduled: (followUp: any) => void
}

export function FollowUpModal({ userProfile, isOpen, onClose, onScheduled }: FollowUpModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduledFollowUp, setScheduledFollowUp] = useState<any>(null)

  if (!isOpen) return null

  const followUpOptions = FollowUpService.getFollowUpRecommendations(userProfile)

  const handleSchedule = async (optionType: string, days: number) => {
    setIsScheduling(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const followUp = FollowUpService.scheduleFollowUp(userProfile, optionType as any, days)

      setScheduledFollowUp(followUp)
      onScheduled(followUp)
    } catch (error) {
      console.error("Error scheduling follow-up:", error)
    } finally {
      setIsScheduling(false)
    }
  }

  if (scheduledFollowUp) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Follow-up Scheduled!
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium">
                  {scheduledFollowUp.scheduledDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">We'll send you a reminder 3 days before</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Follow-up ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{scheduledFollowUp.id}</code>
                </p>
                <p className="text-sm text-gray-600">You can reschedule or cancel anytime by contacting support.</p>
              </div>
            </div>

            <Button onClick={onClose} className="w-full">
              Got it!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Schedule Follow-up Analysis
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Regular follow-ups help track your progress and identify new opportunities for brand improvement. Choose the
            option that best fits your goals:
          </p>

          <div className="space-y-4">
            {followUpOptions.map((option, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedOption === option.type ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedOption(option.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{option.title}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.recommendedDays} days
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>

                  {selectedOption === option.type && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={() => handleSchedule(option.type, option.recommendedDays)}
                        disabled={isScheduling}
                        className="w-full"
                      >
                        {isScheduling
                          ? "Scheduling..."
                          : `Schedule for ${new Date(Date.now() + option.recommendedDays * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You'll receive a reminder email 3 days before your scheduled follow-up</li>
              <li>• We'll analyze your progress since the last assessment</li>
              <li>• You'll get updated recommendations based on your improvements</li>
              <li>• You can reschedule or cancel anytime</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
