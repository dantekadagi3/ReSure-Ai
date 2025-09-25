"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Download,
  Eye,
  RefreshCw,
  Bell,
  Target,
} from "lucide-react"

interface ComplianceItem {
  id: string
  regulation: string
  requirement: string
  status: "compliant" | "warning" | "non-compliant" | "pending"
  dueDate: string
  lastReview: string
  riskLevel: "low" | "medium" | "high" | "critical"
  description: string
  actions: string[]
}

interface RegulatoryReport {
  id: string
  name: string
  regulator: string
  frequency: string
  nextDue: string
  status: "submitted" | "in-progress" | "overdue" | "draft"
  completionRate: number
}

const complianceItems: ComplianceItem[] = [
  {
    id: "1",
    regulation: "Solvency II",
    requirement: "Own Risk and Solvency Assessment (ORSA)",
    status: "compliant",
    dueDate: "2024-12-31",
    lastReview: "2024-10-01",
    riskLevel: "high",
    description: "Annual assessment of risk management and solvency position",
    actions: ["Complete risk assessment", "Update capital model", "Board approval required"],
  },
  {
    id: "2",
    regulation: "IFRS 17",
    requirement: "Insurance Contract Liability Measurement",
    status: "warning",
    dueDate: "2024-11-15",
    lastReview: "2024-09-15",
    riskLevel: "medium",
    description: "Quarterly measurement and disclosure of insurance contract liabilities",
    actions: ["Update actuarial models", "Review discount rates", "Prepare disclosures"],
  },
  {
    id: "3",
    regulation: "NAIC RBC",
    requirement: "Risk-Based Capital Calculation",
    status: "compliant",
    dueDate: "2025-03-01",
    lastReview: "2024-10-10",
    riskLevel: "high",
    description: "Annual risk-based capital adequacy assessment",
    actions: ["Calculate RBC ratio", "Stress test scenarios", "Regulatory filing"],
  },
  {
    id: "4",
    regulation: "CEIOPS Guidelines",
    requirement: "Internal Model Validation",
    status: "pending",
    dueDate: "2024-11-30",
    lastReview: "2024-08-20",
    riskLevel: "critical",
    description: "Annual validation of internal risk models",
    actions: ["Model backtesting", "Independent validation", "Documentation update"],
  },
  {
    id: "5",
    regulation: "Lloyd's Requirements",
    requirement: "Business Plan Submission",
    status: "non-compliant",
    dueDate: "2024-10-31",
    lastReview: "2024-09-01",
    riskLevel: "high",
    description: "Annual business plan and capital requirements",
    actions: ["Urgent: Submit business plan", "Capital adequacy review", "Risk appetite statement"],
  },
]

const regulatoryReports: RegulatoryReport[] = [
  {
    id: "1",
    name: "Quarterly Financial Report",
    regulator: "Insurance Commission",
    frequency: "Quarterly",
    nextDue: "2024-11-15",
    status: "in-progress",
    completionRate: 75,
  },
  {
    id: "2",
    name: "Annual Solvency Report",
    regulator: "EIOPA",
    frequency: "Annual",
    nextDue: "2025-03-31",
    status: "draft",
    completionRate: 25,
  },
  {
    id: "3",
    name: "Risk Management Report",
    regulator: "PRA",
    frequency: "Annual",
    nextDue: "2024-12-31",
    status: "submitted",
    completionRate: 100,
  },
  {
    id: "4",
    name: "ORSA Report",
    regulator: "Local Supervisor",
    frequency: "Annual",
    nextDue: "2024-12-15",
    status: "in-progress",
    completionRate: 60,
  },
]

const complianceMetrics = [
  { name: "Overall Compliance", value: 78, target: 95, status: "warning" },
  { name: "Regulatory Reports", value: 85, target: 100, status: "good" },
  { name: "Risk Management", value: 92, target: 90, status: "excellent" },
  { name: "Capital Adequacy", value: 145, target: 120, status: "excellent" },
]

const complianceTrends = [
  { month: "Jul", compliance: 72, issues: 8 },
  { month: "Aug", compliance: 75, issues: 6 },
  { month: "Sep", compliance: 78, issues: 5 },
  { month: "Oct", compliance: 78, issues: 4 },
  { month: "Nov", compliance: 82, issues: 3 },
  { month: "Dec", compliance: 85, issues: 2 },
]

export function ComplianceDashboard() {
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-600 hover:bg-green-700">Compliant</Badge>
      case "warning":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Warning</Badge>
      case "non-compliant":
        return <Badge variant="destructive">Non-Compliant</Badge>
      case "pending":
        return <Badge variant="outline">Pending Review</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge variant="outline">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-orange-600 hover:bg-orange-700">High Risk</Badge>
      case "critical":
        return <Badge variant="destructive">Critical Risk</Badge>
      default:
        return <Badge variant="secondary">{risk}</Badge>
    }
  }

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-600 hover:bg-green-700">Submitted</Badge>
      case "in-progress":
        return <Badge className="bg-blue-600 hover:bg-blue-700">In Progress</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredItems = complianceItems.filter((item) => filterStatus === "all" || item.status === filterStatus)

  const refreshCompliance = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
              {metric.status === "excellent" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : metric.status === "good" ? (
                <TrendingUp className="h-4 w-4 text-blue-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.name === "Capital Adequacy" ? `${metric.value}%` : `${metric.value}%`}
              </div>
              <div className="flex items-center justify-between mt-2">
                <Progress value={(metric.value / metric.target) * 100} className="flex-1 mr-2" />
                <span className="text-xs text-muted-foreground">Target: {metric.target}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="compliance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">Compliance Items</TabsTrigger>
          <TabsTrigger value="reports">Regulatory Reports</TabsTrigger>
          <TabsTrigger value="trends">Compliance Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Requirements</CardTitle>
                  <CardDescription>Monitor and track regulatory compliance across all requirements</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={refreshCompliance} disabled={isRefreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.regulation}</h4>
                          {getStatusBadge(item.status)}
                          {getRiskBadge(item.riskLevel)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.requirement}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {selectedItem?.regulation} - {selectedItem?.requirement}
                            </DialogTitle>
                            <DialogDescription>Detailed compliance information and required actions</DialogDescription>
                          </DialogHeader>
                          {selectedItem && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Status Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Current Status:</span>
                                      {getStatusBadge(selectedItem.status)}
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Risk Level:</span>
                                      {getRiskBadge(selectedItem.riskLevel)}
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Due Date:</span>
                                      <span className="font-medium">{formatDate(selectedItem.dueDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Last Review:</span>
                                      <span>{formatDate(selectedItem.lastReview)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Days Until Due:</span>
                                      <span
                                        className={`font-medium ${getDaysUntilDue(selectedItem.dueDate) < 30 ? "text-destructive" : ""}`}
                                      >
                                        {getDaysUntilDue(selectedItem.dueDate)} days
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Required Actions</h4>
                                  <ul className="space-y-1">
                                    {selectedItem.actions.map((action, index) => (
                                      <li key={index} className="flex items-start gap-2 text-sm">
                                        <Target className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                        {action}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{selectedItem.description}</AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>
                        <p className="font-medium">{formatDate(item.dueDate)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Review:</span>
                        <p className="font-medium">{formatDate(item.lastReview)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Days Until Due:</span>
                        <p className={`font-medium ${getDaysUntilDue(item.dueDate) < 30 ? "text-destructive" : ""}`}>
                          {getDaysUntilDue(item.dueDate)} days
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Reports</CardTitle>
              <CardDescription>Track submission status and deadlines for regulatory reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regulatoryReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{report.name}</h4>
                          {getReportStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.regulator} • {report.frequency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {formatDate(report.nextDue)}</p>
                        <p className="text-xs text-muted-foreground">
                          {getDaysUntilDue(report.nextDue)} days remaining
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Progress</span>
                        <span>{report.completionRate}%</span>
                      </div>
                      <Progress value={report.completionRate} className="h-2" />
                    </div>
                    <div className="flex justify-end mt-3 gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Score Trend</CardTitle>
                <CardDescription>Overall compliance performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="compliance"
                        stroke="#00274C"
                        strokeWidth={3}
                        name="Compliance Score (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outstanding Issues</CardTitle>
                <CardDescription>Number of compliance issues over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="issues" fill="#CF0B3C" name="Outstanding Issues" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Active Alerts
                </CardTitle>
                <CardDescription>Urgent compliance issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Lloyd's Business Plan</strong> submission is overdue by 5 days. Immediate action required.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <strong>IFRS 17 Liability Measurement</strong> due in 10 days. Review actuarial models needed.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Internal Model Validation</strong> pending review. Documentation update required.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>AI-powered recommendations to improve compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Priority: High</h4>
                    <p className="text-sm">Schedule quarterly compliance reviews to prevent last-minute issues</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Priority: Medium</h4>
                    <p className="text-sm">Implement automated compliance monitoring for real-time alerts</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Priority: Medium</h4>
                    <p className="text-sm">Create compliance templates to standardize reporting processes</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Priority: Low</h4>
                    <p className="text-sm">Establish compliance training program for staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
