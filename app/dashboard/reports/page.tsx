import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsGenerator } from "@/components/reports-generator"
import { ComplianceDashboard } from "@/components/compliance-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Compliance</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive reporting suite with regulatory compliance monitoring and automated report generation
          </p>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Report Generation</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            <ReportsGenerator />
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <ComplianceDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
