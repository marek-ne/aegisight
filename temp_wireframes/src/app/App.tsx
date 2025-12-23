import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/pages/Dashboard";
import { RiskAnalytics } from "./components/pages/RiskAnalytics";
import { ServiceMonitor } from "./components/pages/ServiceMonitor";
import { Incidents } from "./components/pages/Incidents";
import { Compliance } from "./components/pages/Compliance";
import { Reports } from "./components/pages/Reports";
import { Settings } from "./components/pages/Settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "risk-analytics":
        return <RiskAnalytics />;
      case "service-monitor":
        return <ServiceMonitor />;
      case "incidents":
        return <Incidents />;
      case "compliance":
        return <Compliance />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-[1600px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}