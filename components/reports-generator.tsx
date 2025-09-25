"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, Calendar, PieChart, TrendingUp, Shield, CheckCircle, RefreshCw } from "lucide-react"

const reportTypes = [
  {
    id: "risk-analysis",
    title: "Risk Analysis Report",
    description: "Comprehensive risk assessment with decision recommendations",
    icon: Shield,
    estimatedTime: "2-3 minutes",
    format: ["PDF", "Excel"],
  },
  {
    id: "portfolio-summary",
    title: "Portfolio Summary",
    description: "Executive summary of portfolio performance and allocation",
    icon: PieChart,
    estimatedTime: "1-2 minutes",
    format: ["PDF", "PowerPoint"],
  },
  {
    id: "regulatory-compliance",
    title: "Regulatory Compliance Report",
    description: "Detailed compliance analysis for regulatory submissions",
    icon: FileText,
    estimatedTime: "3-5 minutes",
    format: ["PDF", "Excel"],
  },
  {
    id: "performance-analytics",
    title: "Performance Analytics",
    description: "In-depth performance analysis with trends and projections",
    icon: TrendingUp,
    estimatedTime: "2-4 minutes",
    format: ["PDF", "Excel", "PowerPoint"],
  },
]

const recentReports = [
  {
    id: "1",
    title: "Q3 2024 Risk Analysis",
    type: "Risk Analysis Report",
    generatedAt: "2024-10-15T10:30:00Z",
    status: "completed",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Portfolio Summary - October",
    type: "Portfolio Summary",
    generatedAt: "2024-10-10T14:20:00Z",
    status: "completed",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "Regulatory Compliance Q3",
    type: "Regulatory Compliance Report",
    generatedAt: "2024-10-05T09:15:00Z",
    status: "completed",
    size: "3.2 MB",
  },
]

export function ReportsGenerator() {
  const [selectedReport, setSelectedReport] = useState<string>("")
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generationComplete, setGenerationComplete] = useState(false)

  const generateReport = () => {
    if (!selectedReport || !selectedFormat) return

    setIsGenerating(true)
    setGenerationComplete(false)
    setProgress(0)

    // Simulate report generation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setGenerationComplete(true)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 200)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const selectedReportData = reportTypes.find((r) => r.id === selectedReport)

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Create comprehensive reports for analysis, compliance, and business insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      <div className="flex items-center gap-2">
                        <report.icon className="h-4 w-4" />
                        {report.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat} disabled={!selectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {selectedReportData?.format.map((format) => (
                    <SelectItem key={format} value={format.toLowerCase()}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedReportData && (
            <Alert>
              <selectedReportData.icon className="h-4 w-4" />
              <AlertDescription>
                <strong>{selectedReportData.title}</strong>
                <br />
                {selectedReportData.description}
                <br />
                <span className="text-xs text-muted-foreground">
                  Estimated generation time: {selectedReportData.estimatedTime}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating Report...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Analyzing data, generating charts, and formatting document...
              </p>
            </div>
          )}

          {generationComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Report generated successfully! Your {selectedReportData?.title} is ready for download.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={!selectedReport || !selectedFormat || isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
            {generationComplete && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <report.icon className="h-5 w-5 text-primary" />
                    {report.title}
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Generation time:</span>
                      <span>{report.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Formats:</span>
                      <div className="flex gap-1">
                        {report.format.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setSelectedReport(report.id)
                        setSelectedFormat(report.format[0].toLowerCase())
                      }}
                    >
                      Select Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports available for download</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                        <p className="text-xs text-muted-foreground">
                          Generated on {formatDate(report.generatedAt)} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation for regular compliance and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    Set up automated report generation to ensure regular compliance reporting and portfolio monitoring.
                    Reports can be scheduled daily, weekly, monthly, or quarterly.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Monthly Portfolio Summary</h4>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Generates on the 1st of each month at 9:00 AM</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Next: November 1, 2024</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Quarterly Risk Analysis</h4>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Generates quarterly on the 15th at 2:00 PM</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Next: January 15, 2025</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Your Reports</CardTitle>
          <CardDescription>Learn how to interpret and use the generated reports effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Key Metrics Explained</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h5 className="font-medium text-sm">Loss Ratio</h5>
                  <p className="text-xs text-muted-foreground">
                    Claims paid divided by premiums earned. Lower ratios indicate better profitability.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h5 className="font-medium text-sm">Risk-Adjusted Return</h5>
                  <p className="text-xs text-muted-foreground">
                    Return on investment adjusted for the level of risk taken. Higher values are better.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h5 className="font-medium text-sm">Maximum Drawdown</h5>
                  <p className="text-xs text-muted-foreground">
                    Largest peak-to-trough decline in portfolio value. Lower percentages indicate less risk.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Report Usage Guidelines</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Risk Analysis Reports</p>
                    <p className="text-xs text-muted-foreground">
                      Use for underwriting decisions and risk assessment validation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Portfolio Summaries</p>
                    <p className="text-xs text-muted-foreground">
                      Share with executives and stakeholders for strategic planning
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Compliance Reports</p>
                    <p className="text-xs text-muted-foreground">
                      Submit to regulators and use for internal audit processes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
