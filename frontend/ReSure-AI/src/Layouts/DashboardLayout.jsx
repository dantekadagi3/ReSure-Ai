// src/layouts/DashboardLayout.jsx
import { Link, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Risk Analysis", path: "/risk-analysis" },
    { name: "Portfolio Optimization", path: "/portfolio-optimization" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="flex h-screen bg-[#B2B2B2]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#00274C] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#B2B2B2]">
          <h1 className="text-2xl font-bold text-[#CF0B3C]">MyApp</h1>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-2 rounded transition ${
                location.pathname === item.path
                  ? "bg-[#CF0B3C] text-white font-semibold"
                  : "hover:bg-[#B2B2B2]/30 text-[#FFFFFF]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main section */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="h-16 bg-[#00274C] text-white shadow-md flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">Welcome</h2>

          {/* Example: Right-side items */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-[#CF0B3C]/80">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-[#CF0B3C] flex items-center justify-center">
              <span className="text-sm font-bold text-white">U</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#FFFFFF] text-[#00274C]">
          {children}
        </main>
      </div>
    </div>
  );
}
