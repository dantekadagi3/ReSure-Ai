"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from "lucide-react"
import { useRouter } from "next/navigation"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedData?: any
  errorMessage?: string
}

export function DataUploadForm() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }, [])

  const processFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id)
    })
  }

  const simulateFileProcessing = (fileId: string) => {
    const updateProgress = (progress: number, status?: UploadedFile["status"]) => {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress,
                status: status || file.status,
                ...(status === "completed" && {
                  extractedData: {
                    cedant: "Global Reinsurance Ltd",
                    insured: "Tech Corp Industries",
                    geography: "California, USA",
                    peril: "Property - Fire & Allied Perils",
                    sumInsured: "$5,000,000",
                    lossHistory: "2 claims in 5 years",
                    claimRatio: "0.65",
                    riskLevel: "Medium-High",
                    suggestedPremium: "$125,000",
                    shareRecommendation: "Accept with modified terms",
                  },
                }),
                ...(status === "error" && {
                  errorMessage: "Failed to extract data from file. Please check file format.",
                }),
              }
            : file,
        ),
      )
    }

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        clearInterval(uploadInterval)
        updateProgress(100, "processing")

        // Simulate processing
        setTimeout(() => {
          const success = Math.random() > 0.2 // 80% success rate
          updateProgress(100, success ? "completed" : "error")
        }, 2000)
      } else {
        updateProgress(progress)
      }
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusBadge = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Badge variant="secondary">Uploading</Badge>
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const completedFiles = files.filter((file) => file.status === "completed")

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Reinsurance Submissions</CardTitle>
          <CardDescription>Supported formats: CSV, PDF, DOCX. Maximum file size: 10MB per file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
            <p className="text-muted-foreground mb-4">
              Upload your reinsurance submission files for AI-powered risk analysis
            </p>
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="file-upload">
                <Button asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".csv,.pdf,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
            <CardDescription>Track the progress of your file uploads and data extraction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      {getStatusBadge(file.status)}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {(file.status === "uploading" || file.status === "processing") && (
                    <div className="mb-2">
                      <Progress value={file.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.status === "uploading" ? "Uploading..." : "Extracting data..."}
                      </p>
                    </div>
                  )}

                  {file.status === "error" && file.errorMessage && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{file.errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  {file.status === "completed" && file.extractedData && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Extracted Data Preview:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Cedant:</span> {file.extractedData.cedant}
                        </div>
                        <div>
                          <span className="font-medium">Insured:</span> {file.extractedData.insured}
                        </div>
                        <div>
                          <span className="font-medium">Geography:</span> {file.extractedData.geography}
                        </div>
                        <div>
                          <span className="font-medium">Peril:</span> {file.extractedData.peril}
                        </div>
                        <div>
                          <span className="font-medium">Sum Insured:</span> {file.extractedData.sumInsured}
                        </div>
                        <div>
                          <span className="font-medium">Risk Level:</span> {file.extractedData.riskLevel}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {completedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              {completedFiles.length} file{completedFiles.length > 1 ? "s" : ""} processed successfully. Choose your
              next action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/dashboard/risk-analysis")}>
                Analyze Risks
                <FileText className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard/portfolio")}>
                View Portfolio
                <Download className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Extraction Info */}
      <Card>
        <CardHeader>
          <CardTitle>What Data Do We Extract?</CardTitle>
          <CardDescription>
            Our AI system automatically extracts the following information from your files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Basic Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cedant details</li>
                <li>• Broker information</li>
                <li>• Insured party</li>
                <li>• Geography/Location</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Risk Details</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Perils covered</li>
                <li>• Sum insured amounts</li>
                <li>• Retention levels</li>
                <li>• Maximum possible loss</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Financial Data</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Premium rates</li>
                <li>• Claims history (3-5 years)</li>
                <li>• Loss ratios</li>
                <li>• ESG risk factors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
