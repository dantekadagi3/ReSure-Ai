// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import RiskAnalysis from "./pages/RiskAnalysis/RiskAnalysis.jsx";
import PortfolioOptimization from "../pages/PortfolioOptimization/PortfolioOptimization.jsx";
import Reports from "../pages/Reports/Reports.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Layout route */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/portfolio-optimization" element={<PortfolioOptimization />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}
