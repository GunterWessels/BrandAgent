"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FirebaseService } from "@/lib/firebase-service"

export default function LogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    try {
      if (FirebaseService.isAvailable()) {
        const recentLogs = await FirebaseService.getRecentLogs(100)
        setLogs(recentLogs)
      } else {
        console.warn("Firebase not available, showing empty logs")
        setLogs([])
      }
    } catch (error) {
      console.error("Error loading logs:", error)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.userInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userInfo?.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sessionId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"

    // Handle Firestore timestamps
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString()
    }

    // Handle regular dates
    try {
      return new Date(timestamp).toLocaleString()
    } catch (e) {
      return "Invalid date"
    }
  }

  const viewLogDetails = (log) => {
    setSelectedLog(log)
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Session Logs</CardTitle>
            <Button onClick={loadLogs} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, industry, or session ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading logs...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatDate(log.timestamp)}</TableCell>
                        <TableCell>{log.userInfo?.name || "Anonymous"}</TableCell>
                        <TableCell>{log.userInfo?.industry || "Unknown"}</TableCell>
                        <TableCell>
                          {log.timing?.totalDuration ? `${Math.round(log.timing.totalDuration / 1000)}s` : "N/A"}
                        </TableCell>
                        <TableCell>{log.performance?.errorCount || 0}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => viewLogDetails(log)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Log Details: {selectedLog.sessionId}</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Session Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="font-medium">Session ID:</span> {selectedLog.sessionId}
                    </div>
                    <div>
                      <span className="font-medium">Timestamp:</span> {formatDate(selectedLog.timestamp)}
                    </div>
                    <div>
                      <span className="font-medium">User:</span> {selectedLog.userInfo?.name || "Anonymous"}
                    </div>
                    <div>
                      <span className="font-medium">Industry:</span> {selectedLog.userInfo?.industry || "Unknown"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Interaction Summary</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="font-medium">Button Clicks:</span>{" "}
                      {selectedLog.interactionCounts?.buttonClicks || 0}
                    </div>
                    <div>
                      <span className="font-medium">Page Views:</span> {selectedLog.interactionCounts?.pageViews || 0}
                    </div>
                    <div>
                      <span className="font-medium">API Calls:</span> {selectedLog.interactionCounts?.apiCalls || 0}
                    </div>
                    <div>
                      <span className="font-medium">RAG Updates:</span> {selectedLog.interactionCounts?.ragUpdates || 0}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Performance</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="font-medium">Errors:</span> {selectedLog.performance?.errorCount || 0}
                    </div>
                    <div>
                      <span className="font-medium">Warnings:</span> {selectedLog.performance?.warningCount || 0}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Raw Data</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mt-2 text-xs">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
