import { DashboardLayout } from "@/components/dashboard-layout"
import { PortfolioOptimizer } from "@/components/portfolio-optimizer"

export default function OptimizationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio Optimization</h1>
          <p className="text-muted-foreground">
            AI-powered portfolio optimization to maximize returns while managing risk exposure
          </p>
        </div>
        <PortfolioOptimizer />
      </div>
    </DashboardLayout>
  )
}
