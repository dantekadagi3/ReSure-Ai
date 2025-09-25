"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, TrendingUp, Shield, AlertTriangle } from "lucide-react"

const glossaryTerms = [
  {
    term: "Cedant",
    definition: "The insurance company that transfers (cedes) risk to a reinsurer through a reinsurance contract.",
    category: "basic",
    example: "ABC Insurance Company acts as the cedant when purchasing reinsurance from XYZ Re.",
  },
  {
    term: "Loss Ratio",
    definition: "The ratio of claims paid plus reserves to premiums earned, expressed as a percentage.",
    category: "financial",
    example: "A loss ratio of 70% means $70 of claims for every $100 of premium collected.",
    formula: "Loss Ratio = (Claims Paid + Reserves) / Premiums Earned × 100",
  },
  {
    term: "Retention",
    definition: "The amount of risk that the cedant keeps for its own account before reinsurance coverage begins.",
    category: "basic",
    example: "With a $1M retention, the cedant pays the first $1M of any claim.",
  },
  {
    term: "Facultative Reinsurance",
    definition: "Reinsurance coverage for individual risks, negotiated separately for each policy or risk.",
    category: "basic",
    example: "A large commercial property requiring individual underwriting assessment.",
  },
  {
    term: "Maximum Possible Loss (MPL)",
    definition:
      "The worst-case scenario loss that could occur from a single event, assuming all protective systems fail.",
    category: "risk",
    example: "For a factory, MPL includes total destruction of buildings, equipment, and business interruption.",
  },
  {
    term: "Catastrophe Modeling",
    definition: "Computer-based simulation of natural disasters to estimate potential losses and their probabilities.",
    category: "risk",
    example: "Hurricane models predict wind speeds, storm surge, and resulting property damage.",
  },
  {
    term: "ESG Risk",
    definition: "Environmental, Social, and Governance risks that can impact business operations and profitability.",
    category: "risk",
    example: "Climate change increasing flood risk, or governance issues affecting company reputation.",
  },
  {
    term: "Sharpe Ratio",
    definition: "A measure of risk-adjusted return, calculated as excess return divided by standard deviation.",
    category: "financial",
    example: "A Sharpe ratio of 1.5 indicates good risk-adjusted performance.",
    formula: "Sharpe Ratio = (Portfolio Return - Risk-free Rate) / Standard Deviation",
  },
  {
    term: "Peril",
    definition: "A specific risk or cause of loss covered by an insurance policy.",
    category: "basic",
    example: "Fire, windstorm, earthquake, and theft are common perils in property insurance.",
  },
  {
    term: "Premium Rate",
    definition: "The cost of insurance expressed as a percentage of the sum insured or as a rate per unit of exposure.",
    category: "financial",
    example: "A premium rate of 2.5% on a $1M property means $25,000 annual premium.",
  },
]

const riskThresholds = [
  {
    metric: "Loss Ratio",
    low: "< 60%",
    medium: "60-80%",
    high: "> 80%",
    description: "Percentage of premiums paid out as claims",
  },
  {
    metric: "Claim Frequency",
    low: "< 2 per year",
    medium: "2-5 per year",
    high: "> 5 per year",
    description: "Number of claims per policy period",
  },
  {
    metric: "ESG Score",
    low: "A-B Rating",
    medium: "C Rating",
    high: "D-E Rating",
    description: "Environmental, Social, Governance risk assessment",
  },
  {
    metric: "Geographic Concentration",
    low: "< 25%",
    medium: "25-40%",
    high: "> 40%",
    description: "Percentage of portfolio in single geographic region",
  },
]

export function InsuranceGlossary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basic":
        return <BookOpen className="h-4 w-4" />
      case "financial":
        return <TrendingUp className="h-4 w-4" />
      case "risk":
        return <Shield className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "bg-blue-600 hover:bg-blue-700"
      case "financial":
        return "bg-green-600 hover:bg-green-700"
      case "risk":
        return "bg-orange-600 hover:bg-orange-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Insurance & Reinsurance Glossary
          </CardTitle>
          <CardDescription>
            Comprehensive definitions of key terms and concepts for beginners and professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terms and definitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Badge>
              <Badge
                variant={selectedCategory === "basic" ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === "basic" ? getCategoryColor("basic") : ""}`}
                onClick={() => setSelectedCategory("basic")}
              >
                Basic
              </Badge>
              <Badge
                variant={selectedCategory === "financial" ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === "financial" ? getCategoryColor("financial") : ""}`}
                onClick={() => setSelectedCategory("financial")}
              >
                Financial
              </Badge>
              <Badge
                variant={selectedCategory === "risk" ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === "risk" ? getCategoryColor("risk") : ""}`}
                onClick={() => setSelectedCategory("risk")}
              >
                Risk
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTerms.map((term, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{term.term}</h3>
                  <Badge className={getCategoryColor(term.category)}>
                    {getCategoryIcon(term.category)}
                    <span className="ml-1 capitalize">{term.category}</span>
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3">{term.definition}</p>
                {term.formula && (
                  <div className="p-2 bg-muted rounded text-sm font-mono mb-2">
                    <strong>Formula:</strong> {term.formula}
                  </div>
                )}
                {term.example && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                    <strong>Example:</strong> {term.example}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No terms found matching your search criteria.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
            Risk Assessment Thresholds
          </CardTitle>
          <CardDescription>Understanding risk levels and decision criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskThresholds.map((threshold, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{threshold.metric}</h4>
                <p className="text-sm text-muted-foreground mb-3">{threshold.description}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-center">
                    <div className="text-xs font-medium text-green-800 dark:text-green-200">Low Risk</div>
                    <div className="text-sm font-bold text-green-600">{threshold.low}</div>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded text-center">
                    <div className="text-xs font-medium text-orange-800 dark:text-orange-200">Medium Risk</div>
                    <div className="text-sm font-bold text-orange-600">{threshold.medium}</div>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded text-center">
                    <div className="text-xs font-medium text-red-800 dark:text-red-200">High Risk</div>
                    <div className="text-sm font-bold text-red-600">{threshold.high}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
