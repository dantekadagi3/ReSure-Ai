"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert } from "@/components/ui/alert"
import { Search, Eye, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react"

interface RiskData {
  id: string
  cedant: string
  insured: string
  geography: string
  peril: string
  sumInsured: string
  lossHistory: string
  claimRatio: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  suggestedPremium: string
  shareRecommendation: "Accept" | "Accept with Modified Terms" | "Reject" | "Subject to Underwriting"
  lossRatio: number
  esgRisk: "Low" | "Medium" | "High"
  climateRisk: "Low" | "Medium" | "High"
  maxPossibleLoss: string
  retention: string
  premiumRate: string
}

const mockRiskData: RiskData[] = [
  {
    id: "1",
    cedant: "Global Re Ltd",
    insured: "Tech Corp Industries",
    geography: "California, USA",
    peril: "Property - Fire & Allied",
    sumInsured: "$5,000,000",
    lossHistory: "2 claims in 5 years",
    claimRatio: 0.65,
    riskLevel: "Medium",
    suggestedPremium: "$125,000",
    shareRecommendation: "Accept with Modified Terms",
    lossRatio: 0.72,
    esgRisk: "Medium",
    climateRisk: "High",
    maxPossibleLoss: "$4,500,000",
    retention: "$500,000",
    premiumRate: "2.5%",
  },
  {
    id: "2",
    cedant: "European Reinsurance",
    insured: "Manufacturing Co",
    geography: "Germany",
    peril: "Liability - Product",
    sumInsured: "$10,000,000",
    lossHistory: "No claims in 5 years",
    claimRatio: 0.15,
    riskLevel: "Low",
    suggestedPremium: "$85,000",
    shareRecommendation: "Accept",
    lossRatio: 0.25,
    esgRisk: "Low",
    climateRisk: "Low",
    maxPossibleLoss: "$8,000,000",
    retention: "$1,000,000",
    premiumRate: "0.85%",
  },
  {
    id: "3",
    cedant: "Asia Pacific Re",
    insured: "Coastal Resort Chain",
    geography: "Philippines",
    peril: "Catastrophe - Typhoon",
    sumInsured: "$25,000,000",
    lossHistory: "5 claims in 3 years",
    claimRatio: 0.95,
    riskLevel: "Critical",
    suggestedPremium: "$850,000",
    shareRecommendation: "Subject to Underwriting",
    lossRatio: 0.88,
    esgRisk: "High",
    climateRisk: "Critical",
    maxPossibleLoss: "$22,000,000",
    retention: "$2,000,000",
    premiumRate: "3.4%",
  },
  {
    id: "4",
    cedant: "North American Re",
    insured: "Energy Solutions Inc",
    geography: "Texas, USA",
    peril: "Energy - Operational",
    sumInsured: "$15,000,000",
    lossHistory: "1 claim in 5 years",
    claimRatio: 0.45,
    riskLevel: "Medium",
    suggestedPremium: "$275,000",
    shareRecommendation: "Accept with Modified Terms",
    lossRatio: 0.58,
    esgRisk: "Medium",
    climateRisk: "Medium",
    maxPossibleLoss: "$12,000,000",
    retention: "$1,500,000",
    premiumRate: "1.83%",
  },
  {
    id: "5",
    cedant: "London Market Re",
    insured: "Shipping Consortium",
    geography: "International Waters",
    peril: "Marine - Cargo",
    sumInsured: "$8,000,000",
    lossHistory: "3 claims in 5 years",
    claimRatio: 0.82,
    riskLevel: "High",
    suggestedPremium: "$195,000",
    shareRecommendation: "Reject",
    lossRatio: 0.85,
    esgRisk: "Medium",
    climateRisk: "High",
    maxPossibleLoss: "$7,200,000",
    retention: "$800,000",
    premiumRate: "2.44%",
  },
]

export function RiskAnalysisTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [selectedRisk, setSelectedRisk] = useState<RiskData | null>(null)

  const filteredData = mockRiskData.filter((risk) => {
    const matchesSearch =
      risk.cedant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.insured.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.geography.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.peril.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterRisk === "all" || risk.riskLevel.toLowerCase() === filterRisk.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return <Badge className="bg-green-600 hover:bg-green-700">Low Risk</Badge>
      case "Medium":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Medium Risk</Badge>
      case "High":
        return <Badge className="bg-orange-600 hover:bg-orange-700">High Risk</Badge>
      case "Critical":
        return <Badge variant="destructive">Critical Risk</Badge>
      default:
        return <Badge variant="secondary">{riskLevel}</Badge>
    }
  }

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "Accept":
        return <Badge className="bg-green-600 hover:bg-green-700">Accept</Badge>
      case "Accept with Modified Terms":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Modified Terms</Badge>
      case "Reject":
        return <Badge variant="destructive">Reject</Badge>
      case "Subject to Underwriting":
        return <Badge className="bg-orange-600 hover:bg-orange-700">Underwriting Review</Badge>
      default:
        return <Badge variant="secondary">{recommendation}</Badge>
    }
  }

  const getDecisionLogic = (lossRatio: number, claimRatio: number) => {
    if (lossRatio >= 0.8) {
      return {
        decision: "High Risk - Subject to underwriting criteria unless exceptional conditions apply",
        reasoning: `Loss ratio of ${(lossRatio * 100).toFixed(1)}% exceeds 80% threshold for past 3-5 years`,
        icon: <XCircle className="h-4 w-4 text-destructive" />,
      }
    } else if (lossRatio >= 0.6) {
      return {
        decision: "Moderate Risk - Accept with modified terms and increased premium",
        reasoning: `Loss ratio of ${(lossRatio * 100).toFixed(1)}% falls within 60-80% range`,
        icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
      }
    } else {
      return {
        decision: "Low Risk - Standard acceptance recommended",
        reasoning: `Loss ratio of ${(lossRatio * 100).toFixed(1)}% is below 60% threshold`,
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Analysis Dashboard</CardTitle>
        <CardDescription>Comprehensive risk assessment with AI-powered decision recommendations</CardDescription>

        {/* Filters */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by cedant, insured, geography, or peril..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="critical">Critical Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Cedant</th>
                <th className="text-left p-2 font-medium">Insured</th>
                <th className="text-left p-2 font-medium">Geography</th>
                <th className="text-left p-2 font-medium">Peril</th>
                <th className="text-left p-2 font-medium">Sum Insured</th>
                <th className="text-left p-2 font-medium">Loss Ratio</th>
                <th className="text-left p-2 font-medium">Risk Level</th>
                <th className="text-left p-2 font-medium">Recommendation</th>
                <th className="text-left p-2 font-medium">Premium</th>
                <th className="text-left p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((risk) => (
                <tr key={risk.id} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{risk.cedant}</td>
                  <td className="p-2">{risk.insured}</td>
                  <td className="p-2">{risk.geography}</td>
                  <td className="p-2">{risk.peril}</td>
                  <td className="p-2">{risk.sumInsured}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          risk.lossRatio >= 0.8
                            ? "text-destructive font-medium"
                            : risk.lossRatio >= 0.6
                              ? "text-orange-600 font-medium"
                              : "text-green-600 font-medium"
                        }
                      >
                        {(risk.lossRatio * 100).toFixed(1)}%
                      </span>
                      {risk.lossRatio >= 0.8 ? (
                        <TrendingUp className="h-3 w-3 text-destructive" />
                      ) : risk.lossRatio >= 0.6 ? (
                        <TrendingUp className="h-3 w-3 text-orange-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-2">{getRiskBadge(risk.riskLevel)}</td>
                  <td className="p-2">{getRecommendationBadge(risk.shareRecommendation)}</td>
                  <td className="p-2 font-medium">{risk.suggestedPremium}</td>
                  <td className="p-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRisk(risk)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Explain
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Risk Analysis Explanation</DialogTitle>
                          <DialogDescription>Detailed AI-powered risk assessment and decision logic</DialogDescription>
                        </DialogHeader>
                        {selectedRisk && (
                          <div className="space-y-4">
                            {/* Decision Logic */}
                            <Alert>
                              <div className="flex items-start gap-3">
                                {getDecisionLogic(selectedRisk.lossRatio, selectedRisk.claimRatio).icon}
                                <div>
                                  <h4 className="font-medium mb-1">Decision Logic</h4>
                                  <p className="text-sm">
                                    {getDecisionLogic(selectedRisk.lossRatio, selectedRisk.claimRatio).decision}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {getDecisionLogic(selectedRisk.lossRatio, selectedRisk.claimRatio).reasoning}
                                  </p>
                                </div>
                              </div>
                            </Alert>

                            {/* Risk Factors */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Risk Metrics</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Loss Ratio:</span>
                                    <span className="font-medium">{(selectedRisk.lossRatio * 100).toFixed(1)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Claim Ratio:</span>
                                    <span className="font-medium">{(selectedRisk.claimRatio * 100).toFixed(1)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Premium Rate:</span>
                                    <span className="font-medium">{selectedRisk.premiumRate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Retention:</span>
                                    <span className="font-medium">{selectedRisk.retention}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">Risk Factors</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>ESG Risk:</span>
                                    <Badge
                                      variant={
                                        selectedRisk.esgRisk === "High"
                                          ? "destructive"
                                          : selectedRisk.esgRisk === "Medium"
                                            ? "secondary"
                                            : "outline"
                                      }
                                    >
                                      {selectedRisk.esgRisk}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Climate Risk:</span>
                                    <Badge
                                      variant={
                                        selectedRisk.climateRisk === "Critical"
                                          ? "destructive"
                                          : selectedRisk.climateRisk === "High"
                                            ? "destructive"
                                            : selectedRisk.climateRisk === "Medium"
                                              ? "secondary"
                                              : "outline"
                                      }
                                    >
                                      {selectedRisk.climateRisk}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Max Possible Loss:</span>
                                    <span className="font-medium">{selectedRisk.maxPossibleLoss}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Catastrophe Model Explanation */}
                            <div className="p-3 bg-muted rounded-lg">
                              <h4 className="font-medium mb-2">Catastrophe Model Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                This risk has been analyzed using our proprietary catastrophe model which considers:
                                historical loss patterns, geographic exposure concentration, climate change projections,
                                and correlation with other portfolio risks. The model suggests a{" "}
                                {selectedRisk.lossRatio >= 0.8
                                  ? "high probability"
                                  : selectedRisk.lossRatio >= 0.6
                                    ? "moderate probability"
                                    : "low probability"}{" "}
                                of significant losses based on current market conditions.
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No risks found matching your search criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
