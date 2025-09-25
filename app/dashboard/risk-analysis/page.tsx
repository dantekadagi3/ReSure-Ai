import { DashboardLayout } from "@/components/dashboard-layout"
import { RiskAnalysisTable } from "@/components/risk-analysis-table"
import { RiskSummaryCards } from "@/components/risk-summary-cards"
import { RiskEducationPanel } from "@/components/risk-education-panel"
import { AIPricingEngine } from "@/components/ai-pricing-engine"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RiskAnalysisPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Analysis & Pricing Engine</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered risk assessment with advanced pricing algorithms and decision recommendations
          </p>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="pricing">AI Pricing Engine</TabsTrigger>
            <TabsTrigger value="education">Risk Education</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            <RiskSummaryCards />
            <RiskAnalysisTable />
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <AIPricingEngine />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <RiskEducationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
