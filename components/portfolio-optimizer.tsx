"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Play, TrendingUp, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

const currentAllocation = [
  { name: "Property", value: 35, amount: "$8.75M", color: "#CF0B3C" },
  { name: "Casualty", value: 25, amount: "$6.25M", color: "#00274C" },
  { name: "Marine", value: 20, amount: "$5.00M", color: "#B2B2B2" },
  { name: "Energy", value: 15, amount: "$3.75M", color: "#4F46E5" },
  { name: "Aviation", value: 5, amount: "$1.25M", color: "#059669" },
]

const optimizedAllocation = [
  { name: "Property", value: 28, amount: "$7.00M", color: "#CF0B3C" },
  { name: "Casualty", value: 30, amount: "$7.50M", color: "#00274C" },
  { name: "Marine", value: 18, amount: "$4.50M", color: "#B2B2B2" },
  { name: "Energy", value: 18, amount: "$4.50M", color: "#4F46E5" },
  { name: "Aviation", value: 6, amount: "$1.50M", color: "#059669" },
]

const performanceData = [
  { metric: "Expected Return", current: "8.2%", optimized: "11.4%", improvement: "+3.2%" },
  { metric: "Risk-Adjusted Return", current: "1.24", optimized: "1.67", improvement: "+0.43" },
  { metric: "Maximum Drawdown", current: "-15.3%", optimized: "-12.1%", improvement: "+3.2%" },
  { metric: "Sharpe Ratio", current: "0.89", optimized: "1.23", improvement: "+0.34" },
]

const riskMetrics = [
  { geography: "North America", current: 45, optimized: 38, limit: 40 },
  { geography: "Europe", current: 25, optimized: 28, limit: 35 },
  { geography: "Asia Pacific", current: 20, optimized: 22, limit: 25 },
  { geography: "Latin America", current: 10, optimized: 12, limit: 15 },
]

const monthlyProjections = [
  { month: "Jan", current: 8.2, optimized: 11.4 },
  { month: "Feb", current: 7.8, optimized: 11.1 },
  { month: "Mar", current: 9.1, optimized: 12.3 },
  { month: "Apr", current: 8.5, optimized: 11.8 },
  { month: "May", current: 7.9, optimized: 11.2 },
  { month: "Jun", current: 8.7, optimized: 12.1 },
]

export function PortfolioOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationComplete, setOptimizationComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  const runOptimization = () => {
    setIsOptimizing(true)
    setOptimizationComplete(false)
    setProgress(0)

    // Simulate optimization process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsOptimizing(false)
          setOptimizationComplete(true)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

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
      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Portfolio Optimization Engine</span>
            <Button onClick={runOptimization} disabled={isOptimizing}>
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Optimizer
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Optimize your portfolio allocation using AI-powered risk-return analysis and constraint optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOptimizing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Optimization Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Analyzing risk correlations, return projections, and regulatory constraints...
              </p>
            </div>
          )}

          {optimizationComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Optimization complete! The recommended allocation could improve your risk-adjusted returns by 34.7%
                while reducing maximum drawdown by 3.2%.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      {optimizationComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>Current vs. Optimized Portfolio Metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceData.map((item) => (
                <div key={item.metric} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">{item.metric}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current:</span>
                      <span className="font-medium">{item.current}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Optimized:</span>
                      <span className="font-medium text-green-600">{item.optimized}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t">
                      <span className="text-sm">Improvement:</span>
                      <Badge className="bg-green-600 hover:bg-green-700">{item.improvement}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocation Comparison */}
      <Tabs defaultValue="allocation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allocation">Allocation Comparison</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          <TabsTrigger value="projections">Return Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Allocation</CardTitle>
                <CardDescription>Your existing portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {currentAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, "Allocation"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {currentAllocation.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.value}%</div>
                        <div className="text-xs text-muted-foreground">{item.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {optimizationComplete && (
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Allocation</CardTitle>
                  <CardDescription>AI-recommended portfolio distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={optimizedAllocation}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {optimizedAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value}%`, "Allocation"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {optimizedAllocation.map((item, index) => {
                      const currentItem = currentAllocation[index]
                      const change = item.value - currentItem.value
                      return (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.value}%</span>
                              {change !== 0 && (
                                <Badge
                                  variant={change > 0 ? "default" : "secondary"}
                                  className={
                                    change > 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                  }
                                >
                                  {change > 0 ? "+" : ""}
                                  {change}%
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{item.amount}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Risk Distribution</CardTitle>
              <CardDescription>Risk concentration by geography with regulatory limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="geography" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value}%`, "Exposure"]} />
                    <Bar dataKey="current" fill="#CF0B3C" name="Current" />
                    {optimizationComplete && <Bar dataKey="optimized" fill="#00274C" name="Optimized" />}
                    <Bar dataKey="limit" fill="#B2B2B2" name="Regulatory Limit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {riskMetrics.map((item) => (
                  <div key={item.geography} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium">{item.geography}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Current: {item.current}%</span>
                      {optimizationComplete && <span>Optimized: {item.optimized}%</span>}
                      <span className="text-muted-foreground">Limit: {item.limit}%</span>
                      {item.current > item.limit && <AlertCircle className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Return Projections</CardTitle>
              <CardDescription>Expected returns comparison over the next 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value}%`, "Expected Return"]} />
                    <Line type="monotone" dataKey="current" stroke="#CF0B3C" name="Current Portfolio" strokeWidth={2} />
                    {optimizationComplete && (
                      <Line
                        type="monotone"
                        dataKey="optimized"
                        stroke="#00274C"
                        name="Optimized Portfolio"
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Implementation Recommendations */}
      {optimizationComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Implementation Recommendations
            </CardTitle>
            <CardDescription>Step-by-step guide to implement the optimized allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommended Implementation Timeline: 3-6 months</strong>
                  <br />
                  Gradual reallocation to minimize market impact and maintain liquidity.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">Increase Allocation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span>Casualty</span>
                      <Badge className="bg-green-600 hover:bg-green-700">+5% (+$1.25M)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span>Energy</span>
                      <Badge className="bg-green-600 hover:bg-green-700">+3% (+$0.75M)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span>Aviation</span>
                      <Badge className="bg-green-600 hover:bg-green-700">+1% (+$0.25M)</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-red-600">Reduce Allocation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      <span>Property</span>
                      <Badge className="bg-red-600 hover:bg-red-700">-7% (-$1.75M)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      <span>Marine</span>
                      <Badge className="bg-red-600 hover:bg-red-700">-2% (-$0.50M)</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
