import { DashboardLayout } from "@/components/dashboard-layout"
import { PortfolioView } from "@/components/portfolio-view"
import { PortfolioImpactAssessment } from "@/components/portfolio-impact-assessment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio Management & Impact Assessment</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive portfolio analysis with advanced impact assessment and optimization recommendations
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="impact">Impact Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <PortfolioView />
          </TabsContent>

          <TabsContent value="impact" className="mt-6">
            <PortfolioImpactAssessment />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
