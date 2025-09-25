"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, Calculator, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"

interface PricingInputs {
  sumInsured: number
  peril: string
  geography: string
  lossHistory: number
  retention: number
  businessType: string
  esgScore: number
  climateRisk: string
  portfolioConcentration: number
}

interface PricingResult {
  suggestedPremium: number
  premiumRate: number
  riskAdjustment: number
  confidenceLevel: number
  recommendation: string
  reasoning: string[]
  alternativeScenarios: {
    conservative: { premium: number; rate: number }
    aggressive: { premium: number; rate: number }
    balanced: { premium: number; rate: number }
  }
}

export function AIPricingEngine() {
  const [inputs, setInputs] = useState<PricingInputs>({
    sumInsured: 5000000,
    peril: "",
    geography: "",
    lossHistory: 2,
    retention: 500000,
    businessType: "",
    esgScore: 50,
    climateRisk: "",
    portfolioConcentration: 15,
  })

  const [result, setResult] = useState<PricingResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculatePricing = async () => {
    setIsCalculating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI pricing calculation
    const basePremiumRate = 0.02 // 2% base rate
    let adjustedRate = basePremiumRate

    // Risk adjustments
    const riskFactors = []

    // Geography risk adjustment
    if (inputs.geography === "california" || inputs.geography === "florida") {
      adjustedRate *= 1.3
      riskFactors.push("High catastrophe exposure region (+30%)")
    } else if (inputs.geography === "midwest") {
      adjustedRate *= 0.9
      riskFactors.push("Lower catastrophe exposure region (-10%)")
    }

    // Loss history adjustment
    if (inputs.lossHistory > 3) {
      adjustedRate *= 1.4
      riskFactors.push(`High loss frequency: ${inputs.lossHistory} claims (+40%)`)
    } else if (inputs.lossHistory === 0) {
      adjustedRate *= 0.8
      riskFactors.push("No loss history (-20%)")
    }

    // ESG score adjustment
    if (inputs.esgScore < 30) {
      adjustedRate *= 1.2
      riskFactors.push("Poor ESG score (+20%)")
    } else if (inputs.esgScore > 70) {
      adjustedRate *= 0.9
      riskFactors.push("Excellent ESG score (-10%)")
    }

    // Climate risk adjustment
    if (inputs.climateRisk === "high") {
      adjustedRate *= 1.25
      riskFactors.push("High climate risk exposure (+25%)")
    }

    // Portfolio concentration adjustment
    if (inputs.portfolioConcentration > 25) {
      adjustedRate *= 1.15
      riskFactors.push("High portfolio concentration (+15%)")
    }

    const suggestedPremium = inputs.sumInsured * adjustedRate
    const riskAdjustment = ((adjustedRate - basePremiumRate) / basePremiumRate) * 100

    let recommendation = "Accept"
    if (adjustedRate > 0.035) {
      recommendation = "Subject to Underwriting"
    } else if (adjustedRate > 0.025) {
      recommendation = "Accept with Modified Terms"
    }

    const confidenceLevel = Math.max(60, Math.min(95, 85 - Math.abs(riskAdjustment) * 0.5))

    setResult({
      suggestedPremium,
      premiumRate: adjustedRate * 100,
      riskAdjustment,
      confidenceLevel,
      recommendation,
      reasoning: riskFactors,
      alternativeScenarios: {
        conservative: {
          premium: suggestedPremium * 1.2,
          rate: adjustedRate * 1.2 * 100,
        },
        balanced: {
          premium: suggestedPremium,
          rate: adjustedRate * 100,
        },
        aggressive: {
          premium: suggestedPremium * 0.85,
          rate: adjustedRate * 0.85 * 100,
        },
      },
    })

    setIsCalculating(false)
  }

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "Accept":
        return <Badge className="bg-green-600 hover:bg-green-700">Accept</Badge>
      case "Accept with Modified Terms":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Modified Terms</Badge>
      case "Subject to Underwriting":
        return <Badge className="bg-orange-600 hover:bg-orange-700">Underwriting Review</Badge>
      default:
        return <Badge variant="secondary">{recommendation}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            AI-Powered Pricing Engine
          </CardTitle>
          <CardDescription>
            Advanced machine learning algorithms analyze risk factors to provide optimal pricing recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inputs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inputs">Risk Inputs</TabsTrigger>
              <TabsTrigger value="calculation">AI Analysis</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sumInsured">Sum Insured</Label>
                    <Input
                      id="sumInsured"
                      type="number"
                      value={inputs.sumInsured}
                      onChange={(e) => setInputs({ ...inputs, sumInsured: Number(e.target.value) })}
                      placeholder="5000000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="peril">Peril Type</Label>
                    <Select value={inputs.peril} onValueChange={(value) => setInputs({ ...inputs, peril: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select peril type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property-fire">Property - Fire & Allied Perils</SelectItem>
                        <SelectItem value="property-nat-cat">Property - Natural Catastrophe</SelectItem>
                        <SelectItem value="liability-general">General Liability</SelectItem>
                        <SelectItem value="liability-product">Product Liability</SelectItem>
                        <SelectItem value="marine-cargo">Marine - Cargo</SelectItem>
                        <SelectItem value="marine-hull">Marine - Hull</SelectItem>
                        <SelectItem value="aviation">Aviation</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="geography">Geography</Label>
                    <Select
                      value={inputs.geography}
                      onValueChange={(value) => setInputs({ ...inputs, geography: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select geography" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="california">California, USA</SelectItem>
                        <SelectItem value="florida">Florida, USA</SelectItem>
                        <SelectItem value="texas">Texas, USA</SelectItem>
                        <SelectItem value="midwest">Midwest USA</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                        <SelectItem value="latin-america">Latin America</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={inputs.businessType}
                      onValueChange={(value) => setInputs({ ...inputs, businessType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="energy">Energy & Utilities</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="retention">Retention Amount</Label>
                    <Input
                      id="retention"
                      type="number"
                      value={inputs.retention}
                      onChange={(e) => setInputs({ ...inputs, retention: Number(e.target.value) })}
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lossHistory">Loss History (Claims in 5 years)</Label>
                    <Input
                      id="lossHistory"
                      type="number"
                      value={inputs.lossHistory}
                      onChange={(e) => setInputs({ ...inputs, lossHistory: Number(e.target.value) })}
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="climateRisk">Climate Risk Level</Label>
                    <Select
                      value={inputs.climateRisk}
                      onValueChange={(value) => setInputs({ ...inputs, climateRisk: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select climate risk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="esgScore">ESG Score: {inputs.esgScore}</Label>
                    <Slider
                      id="esgScore"
                      min={0}
                      max={100}
                      step={5}
                      value={[inputs.esgScore]}
                      onValueChange={(value) => setInputs({ ...inputs, esgScore: value[0] })}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="portfolioConcentration">
                      Portfolio Concentration: {inputs.portfolioConcentration}%
                    </Label>
                    <Slider
                      id="portfolioConcentration"
                      min={0}
                      max={50}
                      step={1}
                      value={[inputs.portfolioConcentration]}
                      onValueChange={(value) => setInputs({ ...inputs, portfolioConcentration: value[0] })}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Diversified</span>
                      <span>Concentrated</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={calculatePricing} disabled={isCalculating} className="w-full">
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Analyzing Risk Factors...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate AI Pricing
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="calculation" className="space-y-6 mt-6">
              {result ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Suggested Premium</p>
                            <p className="text-2xl font-bold">{formatCurrency(result.suggestedPremium)}</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Premium Rate</p>
                            <p className="text-2xl font-bold">{result.premiumRate.toFixed(2)}%</p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Confidence Level</p>
                            <p className="text-2xl font-bold">{result.confidenceLevel.toFixed(0)}%</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        AI Recommendation
                        {getRecommendationBadge(result.recommendation)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label>Confidence Level</Label>
                          <Progress value={result.confidenceLevel} className="mt-2" />
                        </div>

                        <div>
                          <Label>
                            Risk Adjustment: {result.riskAdjustment > 0 ? "+" : ""}
                            {result.riskAdjustment.toFixed(1)}%
                          </Label>
                          <Progress
                            value={Math.min(100, Math.abs(result.riskAdjustment) * 2)}
                            className={`mt-2 ${result.riskAdjustment > 0 ? "text-destructive" : "text-green-600"}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Reasoning</CardTitle>
                      <CardDescription>Factors considered in the pricing calculation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.reasoning.map((reason, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{reason}</span>
                          </div>
                        ))}
                        {result.reasoning.length === 0 && (
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">
                              Standard risk profile with no significant adjustments required
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please complete the risk inputs and run the AI pricing calculation to see detailed analysis.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6 mt-6">
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Conservative Approach</CardTitle>
                        <CardDescription>Higher premium for maximum security</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Premium:</span>
                            <span className="font-bold">
                              {formatCurrency(result.alternativeScenarios.conservative.premium)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span className="font-bold">
                              {result.alternativeScenarios.conservative.rate.toFixed(2)}%
                            </span>
                          </div>
                          <Badge className="bg-blue-600 hover:bg-blue-700 w-full justify-center">
                            Recommended for High Risk
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary">
                      <CardHeader>
                        <CardTitle className="text-lg">Balanced Approach</CardTitle>
                        <CardDescription>AI-optimized pricing recommendation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Premium:</span>
                            <span className="font-bold">
                              {formatCurrency(result.alternativeScenarios.balanced.premium)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span className="font-bold">{result.alternativeScenarios.balanced.rate.toFixed(2)}%</span>
                          </div>
                          <Badge className="bg-primary hover:bg-primary/90 w-full justify-center">AI Recommended</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Aggressive Approach</CardTitle>
                        <CardDescription>Competitive pricing for market share</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Premium:</span>
                            <span className="font-bold">
                              {formatCurrency(result.alternativeScenarios.aggressive.premium)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span className="font-bold">{result.alternativeScenarios.aggressive.rate.toFixed(2)}%</span>
                          </div>
                          <Badge className="bg-green-600 hover:bg-green-700 w-full justify-center">
                            Competitive Edge
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Scenario analysis helps evaluate different pricing strategies based on market conditions and risk
                      appetite. The balanced approach represents our AI's optimal recommendation considering all risk
                      factors.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Run the AI pricing calculation to see alternative pricing scenarios and strategic recommendations.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
