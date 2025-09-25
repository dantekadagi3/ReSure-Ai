"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Shield, AlertTriangle } from "lucide-react"

const portfolioSummary = [
  {
    title: "Total Portfolio Value",
    value: "$25.0M",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Number of Risks",
    value: "247",
    change: "+12",
    trend: "up",
    icon: Shield,
  },
  {
    title: "Average Premium Rate",
    value: "2.14%",
    change: "+0.15%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Portfolio Loss Ratio",
    value: "68.4%",
    change: "+2.1%",
    trend: "up",
    icon: AlertTriangle,
  },
]

const geographicDistribution = [
  { name: "North America", value: 45, amount: "$11.25M", color: "#CF0B3C" },
  { name: "Europe", value: 25, amount: "$6.25M", color: "#00274C" },
  { name: "Asia Pacific", value: 20, amount: "$5.00M", color: "#B2B2B2" },
  { name: "Latin America", value: 10, amount: "$2.50M", color: "#4F46E5" },
]

const perilDistribution = [
  { name: "Property", value: 35, amount: "$8.75M", lossRatio: 0.72 },
  { name: "Casualty", value: 25, amount: "$6.25M", lossRatio: 0.58 },
  { name: "Marine", value: 20, amount: "$5.00M", lossRatio: 0.85 },
  { name: "Energy", value: 15, amount: "$3.75M", lossRatio: 0.45 },
  { name: "Aviation", value: 5, amount: "$1.25M", lossRatio: 0.32 },
]

const monthlyPerformance = [
  { month: "Jan", premium: 2.1, claims: 1.4, profit: 0.7 },
  { month: "Feb", premium: 1.9, claims: 1.6, profit: 0.3 },
  { month: "Mar", premium: 2.3, claims: 1.2, profit: 1.1 },
  { month: "Apr", premium: 2.0, claims: 1.8, profit: 0.2 },
  { month: "May", premium: 2.2, claims: 1.3, profit: 0.9 },
  { month: "Jun", premium: 2.4, claims: 1.5, profit: 0.9 },
]

const riskTrends = [
  { month: "Jan", lowRisk: 65, mediumRisk: 25, highRisk: 10 },
  { month: "Feb", lowRisk: 62, mediumRisk: 28, highRisk: 10 },
  { month: "Mar", lowRisk: 68, mediumRisk: 22, highRisk: 10 },
  { month: "Apr", lowRisk: 60, mediumRisk: 30, highRisk: 10 },
  { month: "May", lowRisk: 64, mediumRisk: 26, highRisk: 10 },
  { month: "Jun", lowRisk: 66, mediumRisk: 24, highRisk: 10 },
]

export function PortfolioView() {
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioSummary.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className={`text-xs flex items-center ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {item.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {item.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Distribution */}
      <Tabs defaultValue="geography" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geography">Geographic Distribution</TabsTrigger>
          <TabsTrigger value="peril">Peril Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Exposure</CardTitle>
                <CardDescription>Portfolio distribution by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={geographicDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {geographicDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, "Allocation"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Breakdown</CardTitle>
                <CardDescription>Detailed exposure by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geographicDistribution.map((region) => (
                    <div key={region.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: region.color }}></div>
                        <div>
                          <p className="font-medium">{region.name}</p>
                          <p className="text-sm text-muted-foreground">{region.amount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{region.value}%</p>
                        <p className="text-xs text-muted-foreground">of portfolio</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="peril" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peril Distribution & Performance</CardTitle>
              <CardDescription>Portfolio allocation by peril type with loss ratios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {perilDistribution.map((peril) => (
                  <div key={peril.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{peril.name}</h4>
                      <Badge
                        variant={
                          peril.lossRatio >= 0.8 ? "destructive" : peril.lossRatio >= 0.6 ? "secondary" : "outline"
                        }
                      >
                        {(peril.lossRatio * 100).toFixed(1)}% Loss Ratio
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Allocation</p>
                        <p className="font-medium">{peril.value}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{peril.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Performance</p>
                        <p
                          className={`font-medium ${peril.lossRatio >= 0.8 ? "text-destructive" : peril.lossRatio >= 0.6 ? "text-orange-600" : "text-green-600"}`}
                        >
                          {peril.lossRatio >= 0.8 ? "High Risk" : peril.lossRatio >= 0.6 ? "Medium Risk" : "Low Risk"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Premium income vs claims paid over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value}M`, ""]} />
                    <Area
                      type="monotone"
                      dataKey="premium"
                      stackId="1"
                      stroke="#00274C"
                      fill="#00274C"
                      name="Premium Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="claims"
                      stackId="2"
                      stroke="#CF0B3C"
                      fill="#CF0B3C"
                      name="Claims Paid"
                    />
                    <Line type="monotone" dataKey="profit" stroke="#059669" strokeWidth={3} name="Net Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution Trends</CardTitle>
              <CardDescription>Evolution of risk levels in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value}%`, ""]} />
                    <Area
                      type="monotone"
                      dataKey="lowRisk"
                      stackId="1"
                      stroke="#059669"
                      fill="#059669"
                      name="Low Risk"
                    />
                    <Area
                      type="monotone"
                      dataKey="mediumRisk"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      name="Medium Risk"
                    />
                    <Area
                      type="monotone"
                      dataKey="highRisk"
                      stackId="1"
                      stroke="#CF0B3C"
                      fill="#CF0B3C"
                      name="High Risk"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
