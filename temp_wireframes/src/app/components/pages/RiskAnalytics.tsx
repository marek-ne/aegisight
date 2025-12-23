import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, AlertTriangle, Target, Activity } from "lucide-react";

const riskDistribution = [
  { name: "Critical", value: 7, color: "#ef4444" },
  { name: "High", value: 15, color: "#f97316" },
  { name: "Medium", value: 45, color: "#eab308" },
  { name: "Low", value: 75, color: "#10b981" },
];

const riskTrends = [
  { month: "Jan", avgRisk: 45, incidents: 12 },
  { month: "Feb", avgRisk: 52, incidents: 15 },
  { month: "Mar", avgRisk: 48, incidents: 10 },
  { month: "Apr", avgRisk: 61, incidents: 18 },
  { month: "May", avgRisk: 58, incidents: 14 },
  { month: "Jun", avgRisk: 68, incidents: 22 },
];

const categoryRisk = [
  { category: "Security", risk: 85 },
  { category: "Performance", risk: 72 },
  { category: "Availability", risk: 45 },
  { category: "Compliance", risk: 38 },
  { category: "Capacity", risk: 65 },
  { category: "Network", risk: 58 },
];

const topRiskFactors = [
  { factor: "High CPU Usage", impact: 92, frequency: 45 },
  { factor: "Memory Leaks", impact: 88, frequency: 23 },
  { factor: "Network Latency", impact: 75, frequency: 67 },
  { factor: "Database Locks", impact: 82, frequency: 34 },
  { factor: "API Timeouts", impact: 78, frequency: 56 },
];

export function RiskAnalytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Risk Analytics</h1>
        <p className="text-gray-500">Comprehensive risk analysis and trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Critical Risks</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">7</div>
          <p className="text-sm text-red-600 mt-1">↑ 2 from last week</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Risk Score</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">68</div>
          <p className="text-sm text-orange-600 mt-1">↑ 5% increase</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Prediction Accuracy</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">94%</div>
          <p className="text-sm text-green-600 mt-1">↑ 2% improvement</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Mitigated Risks</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">34</div>
          <p className="text-sm text-green-600 mt-1">This month</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Risk Distribution by Severity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Trends */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            6-Month Risk Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgRisk"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Average Risk Score"
              />
              <Line
                type="monotone"
                dataKey="incidents"
                stroke="#ef4444"
                strokeWidth={2}
                name="Incidents"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Risk Radar */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Risk by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={categoryRisk}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Radar
                name="Risk Score"
                dataKey="risk"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Risk Factors */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Risk Factors
          </h2>
          <div className="space-y-4">
            {topRiskFactors.map((factor) => (
              <div key={factor.factor} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{factor.factor}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">Impact: {factor.impact}</span>
                    <span className="text-gray-500">Freq: {factor.frequency}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${factor.impact}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${factor.frequency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
