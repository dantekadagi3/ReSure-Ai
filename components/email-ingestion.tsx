"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Download, AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EmailSubmission {
  id: string
  from: string
  subject: string
  receivedAt: string
  attachments: number
  status: "pending" | "processing" | "extracted" | "error"
  extractedData?: any
  priority: "high" | "medium" | "low"
}

const mockEmails: EmailSubmission[] = [
  {
    id: "1",
    from: "submissions@globalre.com",
    subject: "Facultative Submission - Tech Corp Property Risk",
    receivedAt: "2024-01-15T10:30:00Z",
    attachments: 3,
    status: "extracted",
    priority: "high",
    extractedData: {
      cedant: "Global Reinsurance Ltd",
      insured: "Tech Corp Industries",
      sumInsured: "$5,000,000",
      peril: "Property - Fire & Allied Perils",
      geography: "California, USA",
    },
  },
  {
    id: "2",
    from: "broker@riskpartners.com",
    subject: "Marine Cargo Portfolio - Q1 2024",
    receivedAt: "2024-01-15T09:15:00Z",
    attachments: 5,
    status: "processing",
    priority: "medium",
  },
  {
    id: "3",
    from: "underwriting@europeansure.eu",
    subject: "Aviation Risk - Commercial Fleet",
    receivedAt: "2024-01-15T08:45:00Z",
    attachments: 2,
    status: "pending",
    priority: "high",
  },
]

export function EmailIngestion() {
  const [emails, setEmails] = useState<EmailSubmission[]>(mockEmails)
  const [emailAddress, setEmailAddress] = useState("")

  const getStatusIcon = (status: EmailSubmission["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "processing":
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
      case "extracted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusBadge = (status: EmailSubmission["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "extracted":
        return <Badge className="bg-green-600 hover:bg-green-700">Extracted</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const getPriorityBadge = (priority: EmailSubmission["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
    }
  }

  const processEmail = (emailId: string) => {
    setEmails((prev) => prev.map((email) => (email.id === emailId ? { ...email, status: "processing" } : email)))

    // Simulate processing
    setTimeout(() => {
      setEmails((prev) =>
        prev.map((email) =>
          email.id === emailId
            ? {
                ...email,
                status: "extracted",
                extractedData: {
                  cedant: "Sample Cedant Ltd",
                  insured: "Sample Insured Corp",
                  sumInsured: "$2,500,000",
                  peril: "Property - All Risks",
                  geography: "New York, USA",
                },
              }
            : email,
        ),
      )
    }, 3000)
  }

  const deleteEmail = (emailId: string) => {
    setEmails((prev) => prev.filter((email) => email.id !== emailId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Email Integration Setup
          </CardTitle>
          <CardDescription>
            Configure email forwarding to automatically ingest submissions from cedants and brokers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Dedicated Email Address</h4>
              <div className="flex items-center gap-2">
                <Input value="submissions@resure-ai.com" readOnly className="bg-background" />
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Share this email address with cedants and brokers for automatic submission processing
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                All emails sent to this address will be automatically processed and analyzed. Attachments in PDF, DOCX,
                and CSV formats will be extracted and structured.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Submissions ({emails.length})</CardTitle>
          <CardDescription>Monitor and process email submissions from cedants and brokers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({emails.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({emails.filter((e) => e.status === "pending").length})</TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({emails.filter((e) => e.status === "processing").length})
              </TabsTrigger>
              <TabsTrigger value="extracted">
                Extracted ({emails.filter((e) => e.status === "extracted").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {emails.map((email) => (
                <div key={email.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{email.subject}</h4>
                        {getPriorityBadge(email.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">From: {email.from}</p>
                      <p className="text-sm text-muted-foreground">Received: {formatDate(email.receivedAt)}</p>
                      <p className="text-sm text-muted-foreground">{email.attachments} attachment(s)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(email.status)}
                      {getStatusBadge(email.status)}
                      <Button variant="ghost" size="sm" onClick={() => deleteEmail(email.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {email.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => processEmail(email.id)}>
                        Process Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Attachments
                      </Button>
                    </div>
                  )}

                  {email.status === "extracted" && email.extractedData && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <h5 className="font-medium mb-2">Extracted Information:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Cedant:</span> {email.extractedData.cedant}
                        </div>
                        <div>
                          <span className="font-medium">Insured:</span> {email.extractedData.insured}
                        </div>
                        <div>
                          <span className="font-medium">Sum Insured:</span> {email.extractedData.sumInsured}
                        </div>
                        <div>
                          <span className="font-medium">Peril:</span> {email.extractedData.peril}
                        </div>
                        <div>
                          <span className="font-medium">Geography:</span> {email.extractedData.geography}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm">Analyze Risk</Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {emails
                .filter((e) => e.status === "pending")
                .map((email) => (
                  <div key={email.id} className="border rounded-lg p-4">
                    {/* Same email card structure */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{email.subject}</h4>
                          {getPriorityBadge(email.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">From: {email.from}</p>
                        <p className="text-sm text-muted-foreground">Received: {formatDate(email.receivedAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(email.status)}
                        {getStatusBadge(email.status)}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => processEmail(email.id)}>
                      Process Email
                    </Button>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4 mt-6">
              {emails
                .filter((e) => e.status === "processing")
                .map((email) => (
                  <div key={email.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{email.subject}</h4>
                        <p className="text-sm text-muted-foreground">Processing attachments and extracting data...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(email.status)}
                        {getStatusBadge(email.status)}
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="extracted" className="space-y-4 mt-6">
              {emails
                .filter((e) => e.status === "extracted")
                .map((email) => (
                  <div key={email.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{email.subject}</h4>
                        <p className="text-sm text-muted-foreground">From: {email.from}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(email.status)}
                        {getStatusBadge(email.status)}
                      </div>
                    </div>
                    {email.extractedData && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <h5 className="font-medium mb-2">Extracted Information:</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Cedant:</span> {email.extractedData.cedant}
                          </div>
                          <div>
                            <span className="font-medium">Insured:</span> {email.extractedData.insured}
                          </div>
                          <div>
                            <span className="font-medium">Sum Insured:</span> {email.extractedData.sumInsured}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
