import { Server, Database, Cloud, Globe, Cpu, HardDrive, Network, Activity, RefreshCw } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const services = [
  {
    id: 1,
    name: "Web Application Server",
    type: "Application",
    icon: Server,
    status: "healthy",
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 234,
    uptime: 99.9,
    responseTime: 145,
  },
  {
    id: 2,
    name: "Database Cluster",
    type: "Database",
    icon: Database,
    status: "warning",
    cpu: 78,
    memory: 85,
    disk: 72,
    network: 567,
    uptime: 98.2,
    responseTime: 289,
  },
  {
    id: 3,
    name: "Cloud Infrastructure",
    type: "Infrastructure",
    icon: Cloud,
    status: "healthy",
    cpu: 32,
    memory: 48,
    disk: 45,
    network: 423,
    uptime: 99.8,
    responseTime: 98,
  },
  {
    id: 4,
    name: "API Gateway",
    type: "Network",
    icon: Globe,
    status: "critical",
    cpu: 92,
    memory: 88,
    disk: 55,
    network: 892,
    uptime: 96.5,
    responseTime: 456,
  },
];

const performanceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.random() * 100,
  memory: Math.random() * 100,
  network: Math.random() * 1000,
}));

const statusConfig = {
  healthy: { color: "text-green-500", bg: "bg-green-50", dot: "bg-green-500" },
  warning: { color: "text-orange-500", bg: "bg-orange-50", dot: "bg-orange-500" },
  critical: { color: "text-red-500", bg: "bg-red-50", dot: "bg-red-500" },
};

export function ServiceMonitor() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Monitor</h1>
          <p className="text-gray-500">Real-time service performance monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => {
          const statusStyle = statusConfig[service.status as keyof typeof statusConfig];
          
          return (
            <div key={service.id} className="bg-white p-6 rounded-xl border border-gray-200">
              {/* Service Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${statusStyle.bg}`}>
                    <service.icon className={`w-6 h-6 ${statusStyle.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}></div>
                  <span className={`text-sm font-medium ${statusStyle.color}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* CPU */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">CPU Usage</span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{service.cpu}%</div>
                  <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        service.cpu > 80 ? "bg-red-500" : service.cpu > 60 ? "bg-orange-500" : "bg-green-500"
                      }`}
                      style={{ width: `${service.cpu}%` }}
                    ></div>
                  </div>
                </div>

                {/* Memory */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Memory</span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{service.memory}%</div>
                  <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        service.memory > 80 ? "bg-red-500" : service.memory > 60 ? "bg-orange-500" : "bg-green-500"
                      }`}
                      style={{ width: `${service.memory}%` }}
                    ></div>
                  </div>
                </div>

                {/* Disk */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Disk Usage</span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{service.disk}%</div>
                  <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${service.disk}%` }}
                    ></div>
                  </div>
                </div>

                {/* Network */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Network</span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{service.network}</div>
                  <div className="text-xs text-gray-500 mt-1">Mb/s</div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500">Uptime</div>
                  <div className="text-sm font-semibold text-gray-900">{service.uptime}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Response Time</div>
                  <div className="text-sm font-semibold text-gray-900">{service.responseTime}ms</div>
                </div>
                <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">CPU Usage (24h)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="url(#cpuGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Memory Usage (24h)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="memory" stroke="#10b981" fill="url(#memoryGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Network Traffic (24h)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="network" stroke="#f59e0b" fill="url(#networkGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
