import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from "lucide-react"

const summaryData = [
  {
    title: "Average Loss Ratio",
    value: "68.4%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
    description: "Across all analyzed risks",
  },
  {
    title: "High Risk Count",
    value: "2",
    change: "-1",
    trend: "down",
    icon: AlertTriangle,
    description: "Risks requiring underwriting review",
  },
  {
    title: "Acceptance Rate",
    value: "76%",
    change: "+5%",
    trend: "up",
    icon: Shield,
    description: "Risks recommended for acceptance",
  },
  {
    title: "Premium Adjustment",
    value: "+12.5%",
    change: "+3.2%",
    trend: "up",
    icon: TrendingUp,
    description: "Average premium increase recommended",
  },
]

export function RiskSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item) => (
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
              {item.change} from last period
            </div>
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
