import { DashboardLayout } from "@/components/dashboard-layout"
import { InsuranceGlossary } from "@/components/insurance-glossary"

export default function EducationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Educational Resources</h1>
          <p className="text-muted-foreground">
            Learn about reinsurance concepts, risk assessment, and decision-making criteria
          </p>
        </div>
        <InsuranceGlossary />
      </div>
    </DashboardLayout>
  )
}
