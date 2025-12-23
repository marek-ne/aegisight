import { MetricsCards } from "../MetricsCards";
import { RiskChart } from "../RiskChart";
import { ServiceStatus } from "../ServiceStatus";
import { AlertPanel } from "../AlertPanel";
import { PredictionInsights } from "../PredictionInsights";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <MetricsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskChart />
        <PredictionInsights />
      </div>

      {/* Service Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServiceStatus />
        </div>
        <div>
          <AlertPanel />
        </div>
      </div>
    </div>
  );
}
