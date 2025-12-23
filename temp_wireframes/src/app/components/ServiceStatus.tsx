import { Server, Database, Cloud, Globe, Circle } from "lucide-react";

const services = [
  {
    name: "Web Application Server",
    type: "Application",
    icon: Server,
    status: "healthy",
    riskScore: 35,
    uptime: "99.9%",
    incidents: 0,
  },
  {
    name: "Database Cluster",
    type: "Database",
    icon: Database,
    status: "warning",
    riskScore: 72,
    uptime: "98.2%",
    incidents: 2,
  },
  {
    name: "Cloud Infrastructure",
    type: "Infrastructure",
    icon: Cloud,
    status: "healthy",
    riskScore: 28,
    uptime: "99.8%",
    incidents: 0,
  },
  {
    name: "API Gateway",
    type: "Network",
    icon: Globe,
    status: "critical",
    riskScore: 89,
    uptime: "96.5%",
    incidents: 5,
  },
  {
    name: "Authentication Service",
    type: "Security",
    icon: Server,
    status: "healthy",
    riskScore: 42,
    uptime: "99.7%",
    incidents: 1,
  },
];

const statusConfig = {
  healthy: { color: "text-green-500", bg: "bg-green-50", label: "Healthy" },
  warning: { color: "text-orange-500", bg: "bg-orange-50", label: "Warning" },
  critical: { color: "text-red-500", bg: "bg-red-50", label: "Critical" },
};

export function ServiceStatus() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Service Health Status</h2>
        <p className="text-sm text-gray-500">Current status of monitored services</p>
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          const statusStyle = statusConfig[service.status as keyof typeof statusConfig];
          
          return (
            <div
              key={service.name}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusStyle.bg}`}>
                    <service.icon className={`w-5 h-5 ${statusStyle.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className={`w-2 h-2 fill-current ${statusStyle.color}`} />
                  <span className={`text-sm font-medium ${statusStyle.color}`}>
                    {statusStyle.label}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Risk Score</div>
                  <div
                    className={`font-semibold ${
                      service.riskScore > 70
                        ? "text-red-600"
                        : service.riskScore > 50
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {service.riskScore}/100
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Uptime</div>
                  <div className="font-semibold text-gray-900">{service.uptime}</div>
                </div>
                <div>
                  <div className="text-gray-500">Incidents</div>
                  <div className="font-semibold text-gray-900">{service.incidents}</div>
                </div>
              </div>

              {/* Risk Bar */}
              <div className="mt-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      service.riskScore > 70
                        ? "bg-red-500"
                        : service.riskScore > 50
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${service.riskScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
