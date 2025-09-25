import { DashboardLayout } from "@/components/dashboard-layout"
import { DataUploadForm } from "@/components/data-upload-form"
import { EmailIngestion } from "@/components/email-ingestion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UploadPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Ingestion</h1>
          <p className="text-muted-foreground mt-2">
            Upload files directly or configure email integration for automatic submission processing
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="email">Email Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <DataUploadForm />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <EmailIngestion />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
