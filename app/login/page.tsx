import { LoginForm } from "@/components/login-form"
import { Shield, Brain, TrendingUp, BarChart3 } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex">
      {/* Left side - Hero content */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="max-w-xl">
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl mr-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">ReSure AI</h1>
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">
            The fastest and most powerful platform for facultative reinsurance
          </h2>

          <p className="text-xl text-muted-foreground mb-12 text-pretty">
            Build transformative underwriting experiences powered by industry-leading AI models and automated risk
            analysis.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Automated document processing and risk assessment with explainable AI
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Portfolio Optimization</h3>
                <p className="text-muted-foreground">
                  Real-time portfolio impact assessment and concentration management
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Advanced Analytics</h3>
                <p className="text-muted-foreground">Comprehensive reporting and regulatory compliance tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-foreground">ReSure AI</h1>
            </div>
            <p className="text-muted-foreground">AI-Powered Facultative Reinsurance Decision Support</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
