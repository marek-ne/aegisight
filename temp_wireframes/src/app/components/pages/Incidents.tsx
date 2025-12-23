import { AlertCircle, CheckCircle, Clock, XCircle, Filter, Search, Download } from "lucide-react";

const incidents = [
  {
    id: "INC-2024-001",
    title: "API Gateway High CPU Usage",
    severity: "critical",
    status: "active",
    service: "API Gateway",
    reported: "2 hours ago",
    assignee: "Sarah Chen",
    description: "CPU utilization exceeding 90% causing request timeouts",
  },
  {
    id: "INC-2024-002",
    title: "Database Connection Pool Saturation",
    severity: "high",
    status: "investigating",
    service: "Database Cluster",
    reported: "5 hours ago",
    assignee: "Mike Johnson",
    description: "Connection pool reaching maximum capacity",
  },
  {
    id: "INC-2024-003",
    title: "Memory Leak in Web Server",
    severity: "medium",
    status: "mitigating",
    service: "Web Application Server",
    reported: "1 day ago",
    assignee: "Lisa Park",
    description: "Gradual memory consumption increase detected",
  },
  {
    id: "INC-2024-004",
    title: "Network Latency Spike",
    severity: "high",
    status: "resolved",
    service: "Cloud Infrastructure",
    reported: "2 days ago",
    assignee: "Tom Davis",
    description: "Regional network latency exceeded threshold",
  },
  {
    id: "INC-2024-005",
    title: "Authentication Service Timeout",
    severity: "medium",
    status: "resolved",
    service: "Authentication Service",
    reported: "3 days ago",
    assignee: "Anna Wilson",
    description: "Intermittent timeout on authentication requests",
  },
];

const severityConfig = {
  critical: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  high: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  low: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
};

const statusConfig = {
  active: { label: "Active", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  investigating: { label: "Investigating", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  mitigating: { label: "Mitigating", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  resolved: { label: "Resolved", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
};

export function Incidents() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Incidents</h1>
          <p className="text-gray-500">Track and manage service incidents</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Incident
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Active</div>
          <div className="text-3xl font-semibold text-red-600">7</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Investigating</div>
          <div className="text-3xl font-semibold text-orange-600">12</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Resolved (Today)</div>
          <div className="text-3xl font-semibold text-green-600">23</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Avg Resolution Time</div>
          <div className="text-3xl font-semibold text-gray-900">2.4h</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search incidents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident) => {
          const severity = severityConfig[incident.severity as keyof typeof severityConfig];
          const status = statusConfig[incident.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div key={incident.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">{incident.id}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${severity.bg} ${severity.color}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.color} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{incident.title}</h3>
                  <p className="text-gray-600">{incident.description}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Service</div>
                  <div className="text-sm font-medium text-gray-900">{incident.service}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Assignee</div>
                  <div className="text-sm font-medium text-gray-900">{incident.assignee}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Reported</div>
                  <div className="text-sm font-medium text-gray-900">{incident.reported}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded hover:bg-gray-50">
                  Update Status
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded hover:bg-gray-50">
                  Add Comment
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
