import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

const metrics = [
  {
    label: "Overall Risk Score",
    value: "68",
    unit: "/100",
    trend: -5,
    status: "warning",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    label: "Services Monitored",
    value: "142",
    trend: 12,
    status: "success",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    label: "Active Incidents",
    value: "7",
    trend: -3,
    status: "error",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    label: "Avg Response Time",
    value: "2.4",
    unit: "min",
    trend: 8,
    status: "success",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
];

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${
                metric.trend > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {metric.trend > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(metric.trend)}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-gray-900">
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-gray-500">{metric.unit}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
