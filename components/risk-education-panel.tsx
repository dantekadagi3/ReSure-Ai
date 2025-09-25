import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, TrendingUp, AlertTriangle, Shield } from "lucide-react"

export function RiskEducationPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Understanding Loss Ratios
          </CardTitle>
          <CardDescription>Key concepts for reinsurance decision making</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Loss Ratio = (Claims Paid + Reserves) / Premiums Earned</strong>
              <br />
              This metric shows how much of premium income is used to pay claims.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="font-medium text-green-800 dark:text-green-200">Below 60% - Low Risk</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Standard acceptance recommended. Profitable business with good risk profile.
              </p>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="font-medium text-orange-800 dark:text-orange-200">60-80% - Moderate Risk</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Accept with modified terms and increased premium. Requires careful monitoring.
              </p>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="font-medium text-red-800 dark:text-red-200">Above 80% - High Risk</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                Subject to underwriting criteria unless exceptional conditions apply.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
            Catastrophe Modeling
          </CardTitle>
          <CardDescription>How our AI analyzes catastrophic risks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Key Components:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>
                    <strong>Hazard Models:</strong> Frequency and severity of natural disasters
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>
                    <strong>Vulnerability Functions:</strong> How structures respond to hazards
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>
                    <strong>Financial Models:</strong> Translation of damage to financial loss
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>
                    <strong>Climate Projections:</strong> Future risk scenarios and trends
                  </span>
                </li>
              </ul>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Our models incorporate climate change factors, showing 15-25% increase in catastrophic risk exposure
                over the next decade for coastal and wildfire-prone areas.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
