"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Upload, BarChart3, PieChart } from "lucide-react"
import Link from "next/link"

const summaryCards = [
  {
    title: "Total Risks",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "High-Risk Count",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    title: "Total Premiums",
    value: "$12.4M",
    change: "+8%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Expected Profit",
    value: "$2.1M",
    change: "+15%",
    trend: "up",
    icon: TrendingUp,
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">Welcome to ReSure AI</h2>
        <p className="text-primary-foreground/90 mb-4">
          Your AI-powered facultative reinsurance decision support system. Upload submissions, analyze risks, and
          optimize your portfolio with confidence.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="secondary">
            <Link href="/dashboard/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Submission
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
          >
            <Link href="/dashboard/risk-analysis">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analyze Risks
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className={`text-xs flex items-center ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {card.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {card.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary" />
              Upload Submissions
            </CardTitle>
            <CardDescription>
              Upload CSV or PDF files containing facultative reinsurance submissions for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/upload">Start Upload</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Risk Analysis
            </CardTitle>
            <CardDescription>Analyze risk levels, claim ratios, and get AI-powered recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/risk-analysis">View Analysis</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Portfolio Optimization
            </CardTitle>
            <CardDescription>Optimize your portfolio allocation and maximize expected returns</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/optimization">Optimize Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest submissions and risk assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">New submission from Global Re</p>
                <p className="text-sm text-muted-foreground">Property risk in California - $5M sum insured</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-destructive">High Risk</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Risk analysis completed</p>
                <p className="text-sm text-muted-foreground">Marine cargo portfolio - 15 risks analyzed</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Low Risk</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Portfolio optimization run</p>
                <p className="text-sm text-muted-foreground">Recommended 12% reallocation for better returns</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">Completed</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
