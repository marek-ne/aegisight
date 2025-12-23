import { AlertTriangle, Info, AlertCircle, TrendingUp } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "High CPU Usage Detected",
    service: "API Gateway",
    message: "CPU utilization exceeded 90% threshold",
    time: "2 minutes ago",
    icon: AlertCircle,
  },
  {
    id: 2,
    type: "warning",
    title: "Database Connection Pool Near Limit",
    service: "Database Cluster",
    message: "85% of connections in use",
    time: "15 minutes ago",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "info",
    title: "Predicted Risk Increase",
    service: "Authentication Service",
    message: "AI model predicts 15% risk increase in next 4 hours",
    time: "1 hour ago",
    icon: TrendingUp,
  },
  {
    id: 4,
    type: "warning",
    title: "Memory Usage Trending Up",
    service: "Web Application Server",
    message: "Memory consumption increased by 20% over last hour",
    time: "2 hours ago",
    icon: AlertTriangle,
  },
];

const alertConfig = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    iconBg: "bg-red-100",
  },
  warning: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
  },
};

export function AlertPanel() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          <p className="text-sm text-gray-500">Critical events and predictions</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type as keyof typeof alertConfig];
          
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${config.bg} ${config.border}`}
            >
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg ${config.iconBg} h-fit`}>
                  <alert.icon className={`w-5 h-5 ${config.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className={`font-medium ${config.text}`}>
                      {alert.title}
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{alert.message}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>Service:</span>
                    <span className="font-medium text-gray-700">{alert.service}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
