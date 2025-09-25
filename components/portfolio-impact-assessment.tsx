"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts"
import { Target, AlertTriangle, CheckCircle, Activity, Zap, Shield, DollarSign, BarChart3 } from "lucide-react"

interface ScenarioInput {
  name: string
  probability: number
  severity: number
  description: string
}

interface ImpactResult {
  scenario: string
  portfolioLoss: number
  lossRatio: number
  capitalImpact: number
  ratingImpact: string
  recommendedActions: string[]
}

const defaultScenarios: ScenarioInput[] = [
  {
    name: "Major Hurricane - Category 4",
    probability: 15,
    severity: 85,
    description: "Major hurricane hitting Florida/Gulf Coast with $50B+ industry losses",
  },
  {
    name: "California Wildfire Season",
    probability: 35,
    severity: 60,
    description: "Severe wildfire season in California affecting multiple counties",
  },
  {
    name: "European Windstorm",
    probability: 25,
    severity: 45,
    description: "Major windstorm affecting UK, Germany, and Netherlands",
  },
  {
    name: "Cyber Attack - Systemic",
    probability: 20,
    severity: 70,
    description: "Large-scale cyber attack affecting multiple industries",
  },
  {
    name: "Pandemic - Business Interruption",
    probability: 10,
    severity: 90,
    description: "Global pandemic causing widespread business interruption claims",
  },
]

const portfolioMetrics = {
  totalExposure: 25000000,
  diversificationRatio: 0.75,
  concentrationRisk: 0.35,
  correlationFactor: 0.42,
  capitalBuffer: 5000000,
  ratingRequirement: "A-",
}

const optimizationSuggestions = [
  {
    category: "Geographic Diversification",
    current: 65,
    target: 80,
    impact: "Reduce concentration risk by 15%",
    actions: ["Increase Asia-Pacific exposure", "Reduce North American concentration"],
  },
  {
    category: "Peril Diversification",
    current: 70,
    target: 85,
    impact: "Improve risk-adjusted returns by 8%",
    actions: ["Add more specialty lines", "Reduce property catastrophe exposure"],
  },
  {
    category: "Capital Efficiency",
    current: 78,
    target: 90,
    impact: "Increase ROE by 12%",
    actions: ["Optimize retention levels", "Consider alternative capital sources"],
  },
  {
    category: "ESG Integration",
    current: 45,
    target: 75,
    impact: "Improve sustainability rating",
    actions: ["Implement ESG screening", "Increase green/sustainable risks"],
  },
]

export function PortfolioImpactAssessment() {
  const [scenarios, setScenarios] = useState<ScenarioInput[]>(defaultScenarios)
  const [results, setResults] = useState<ImpactResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<ScenarioInput | null>(null)

  const runImpactAnalysis = async () => {
    setIsAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const analysisResults: ImpactResult[] = scenarios.map((scenario) => {
      const severityFactor = scenario.severity / 100
      const probabilityFactor = scenario.probability / 100

      // Calculate portfolio impact based on scenario
      const baseImpact = portfolioMetrics.totalExposure * severityFactor * 0.15
      const concentrationAdjustment = baseImpact * portfolioMetrics.concentrationRisk
      const correlationAdjustment = baseImpact * portfolioMetrics.correlationFactor
      const diversificationBenefit = baseImpact * (1 - portfolioMetrics.diversificationRatio) * 0.3

      const portfolioLoss = baseImpact + concentrationAdjustment + correlationAdjustment - diversificationBenefit
      const lossRatio = (portfolioLoss / portfolioMetrics.totalExposure) * 100

      let ratingImpact = "Stable"
      let recommendedActions: string[] = []

      if (lossRatio > 25) {
        ratingImpact = "Negative Watch"
        recommendedActions = [
          "Immediate capital injection required",
          "Reduce exposure in affected regions",
          "Activate reinsurance protection",
          "Review underwriting guidelines",
        ]
      } else if (lossRatio > 15) {
        ratingImpact = "Under Review"
        recommendedActions = [
          "Monitor capital adequacy",
          "Consider additional reinsurance",
          "Tighten underwriting standards",
        ]
      } else if (lossRatio > 8) {
        ratingImpact = "Stable"
        recommendedActions = ["Continue monitoring", "Maintain current strategy"]
      } else {
        ratingImpact = "Positive"
        recommendedActions = ["Consider increasing capacity", "Explore growth opportunities"]
      }

      return {
        scenario: scenario.name,
        portfolioLoss,
        lossRatio,
        capitalImpact: Math.max(0, portfolioLoss - portfolioMetrics.capitalBuffer),
        ratingImpact,
        recommendedActions,
      }
    })

    setResults(analysisResults)
    setIsAnalyzing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "Positive":
        return <Badge className="bg-green-600 hover:bg-green-700">Positive</Badge>
      case "Stable":
        return <Badge variant="outline">Stable</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Under Review</Badge>
      case "Negative Watch":
        return <Badge variant="destructive">Negative Watch</Badge>
      default:
        return <Badge variant="secondary">{rating}</Badge>
    }
  }

  const chartData = results.map((result) => ({
    scenario: result.scenario.split(" - ")[0],
    lossRatio: result.lossRatio,
    portfolioLoss: result.portfolioLoss / 1000000, // Convert to millions
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Portfolio Impact Assessment
          </CardTitle>
          <CardDescription>
            Analyze potential portfolio impacts under various catastrophic scenarios and stress tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map((scenario, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {scenario.name}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedScenario(scenario)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Scenario</DialogTitle>
                              <DialogDescription>Adjust scenario parameters for analysis</DialogDescription>
                            </DialogHeader>
                            {selectedScenario && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Scenario Name</Label>
                                  <Input
                                    value={selectedScenario.name}
                                    onChange={(e) => setSelectedScenario({ ...selectedScenario, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Probability: {selectedScenario.probability}%</Label>
                                  <Slider
                                    value={[selectedScenario.probability]}
                                    onValueChange={(value) =>
                                      setSelectedScenario({ ...selectedScenario, probability: value[0] })
                                    }
                                    max={100}
                                    step={5}
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label>Severity: {selectedScenario.severity}%</Label>
                                  <Slider
                                    value={[selectedScenario.severity]}
                                    onValueChange={(value) =>
                                      setSelectedScenario({ ...selectedScenario, severity: value[0] })
                                    }
                                    max={100}
                                    step={5}
                                    className="mt-2"
                                  />
                                </div>
                                <Button
                                  onClick={() => {
                                    const updatedScenarios = [...scenarios]
                                    updatedScenarios[index] = selectedScenario
                                    setScenarios(updatedScenarios)
                                    setSelectedScenario(null)
                                  }}
                                  className="w-full"
                                >
                                  Update Scenario
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Probability</span>
                            <span>{scenario.probability}%</span>
                          </div>
                          <Progress value={scenario.probability} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Severity</span>
                            <span>{scenario.severity}%</span>
                          </div>
                          <Progress value={scenario.severity} className="h-2" />
                        </div>
                        <Badge
                          variant={
                            scenario.probability * scenario.severity > 2000
                              ? "destructive"
                              : scenario.probability * scenario.severity > 1000
                                ? "secondary"
                                : "outline"
                          }
                        >
                          Risk Score: {Math.round((scenario.probability * scenario.severity) / 100)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={runImpactAnalysis} disabled={isAnalyzing} className="w-full" size="lg">
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Running Impact Analysis...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Run Portfolio Impact Analysis
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6 mt-6">
              {results.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Loss Ratio Impact</CardTitle>
                        <CardDescription>Potential loss ratios under different scenarios</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="scenario" angle={-45} textAnchor="end" height={80} />
                              <YAxis />
                              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, "Loss Ratio"]} />
                              <Bar dataKey="lossRatio" fill="#CF0B3C">
                                {chartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.lossRatio > 25
                                        ? "#DC2626"
                                        : entry.lossRatio > 15
                                          ? "#F59E0B"
                                          : entry.lossRatio > 8
                                            ? "#3B82F6"
                                            : "#059669"
                                    }
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Loss Impact</CardTitle>
                        <CardDescription>Absolute portfolio losses in millions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="scenario" angle={-45} textAnchor="end" height={80} />
                              <YAxis />
                              <Tooltip formatter={(value: any) => [`$${value.toFixed(1)}M`, "Portfolio Loss"]} />
                              <Line
                                type="monotone"
                                dataKey="portfolioLoss"
                                stroke="#00274C"
                                strokeWidth={3}
                                dot={{ fill: "#00274C", strokeWidth: 2, r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {result.scenario}
                            {getRatingBadge(result.ratingImpact)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Portfolio Loss</p>
                              <p className="text-xl font-bold text-destructive">
                                {formatCurrency(result.portfolioLoss)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Loss Ratio</p>
                              <p className="text-xl font-bold">{result.lossRatio.toFixed(1)}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Capital Impact</p>
                              <p className="text-xl font-bold">
                                {result.capitalImpact > 0 ? formatCurrency(result.capitalImpact) : "None"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Rating Impact</p>
                              <p className="text-xl font-bold">{result.ratingImpact}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Recommended Actions:</h4>
                            <ul className="space-y-1">
                              {result.recommendedActions.map((action, actionIndex) => (
                                <li key={actionIndex} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Run the portfolio impact analysis to see detailed scenario results and recommendations.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {optimizationSuggestions.map((suggestion, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {suggestion.category}
                        <Badge variant="outline">{suggestion.current}% Current</Badge>
                      </CardTitle>
                      <CardDescription>{suggestion.impact}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Current Performance</span>
                            <span>{suggestion.current}%</span>
                          </div>
                          <Progress value={suggestion.current} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Target Performance</span>
                            <span>{suggestion.target}%</span>
                          </div>
                          <Progress value={suggestion.target} className="h-2" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Action Items:</h4>
                          <ul className="space-y-1">
                            {suggestion.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-start gap-2 text-sm">
                                <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Risk Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current Utilization</span>
                        <span className="font-bold">68%</span>
                      </div>
                      <Progress value={68} className="h-3" />
                      <p className="text-xs text-muted-foreground">$17M of $25M capacity utilized</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                      Capital Adequacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Solvency Ratio</span>
                        <span className="font-bold">145%</span>
                      </div>
                      <Progress value={145} max={200} className="h-3" />
                      <p className="text-xs text-muted-foreground">Well above regulatory minimum</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                      Concentration Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Risk Concentration</span>
                        <span className="font-bold">35%</span>
                      </div>
                      <Progress value={35} className="h-3" />
                      <p className="text-xs text-muted-foreground">Within acceptable limits</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  Real-time monitoring is active. Portfolio metrics are updated every 15 minutes during market hours.
                  Alerts will be triggered if any metric exceeds predefined thresholds.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
