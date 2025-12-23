import { Shield, CheckCircle, XCircle, AlertTriangle, FileText, Download, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const complianceFrameworks = [
  { name: "SOC 2 Type II", status: "compliant", score: 95, lastAudit: "Jan 2024", nextAudit: "Jul 2024" },
  { name: "ISO 27001", status: "compliant", score: 92, lastAudit: "Feb 2024", nextAudit: "Aug 2024" },
  { name: "GDPR", status: "warning", score: 78, lastAudit: "Mar 2024", nextAudit: "Jun 2024" },
  { name: "HIPAA", status: "non-compliant", score: 65, lastAudit: "Dec 2023", nextAudit: "May 2024" },
];

const controls = [
  { category: "Access Control", total: 45, passed: 42, failed: 3 },
  { category: "Data Protection", total: 38, passed: 35, failed: 3 },
  { category: "Incident Response", total: 28, passed: 26, failed: 2 },
  { category: "Network Security", total: 52, passed: 48, failed: 4 },
  { category: "Audit Logging", total: 34, passed: 32, failed: 2 },
];

const recentFindings = [
  {
    id: 1,
    severity: "high",
    title: "Insufficient Password Complexity",
    framework: "SOC 2",
    status: "open",
    dueDate: "Dec 25, 2024",
  },
  {
    id: 2,
    severity: "medium",
    title: "Missing Encryption at Rest",
    framework: "GDPR",
    status: "in-progress",
    dueDate: "Dec 30, 2024",
  },
  {
    id: 3,
    severity: "critical",
    title: "Unapproved Data Access",
    framework: "HIPAA",
    status: "open",
    dueDate: "Dec 20, 2024",
  },
];

const statusConfig = {
  compliant: { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
  warning: { color: "text-orange-600", bg: "bg-orange-50", icon: AlertTriangle },
  "non-compliant": { color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

export function Compliance() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-500">Monitor compliance status and controls</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Schedule Audit
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Compliant</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">2/4</div>
          <p className="text-sm text-gray-500 mt-1">Frameworks</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Avg Score</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">82.5%</div>
          <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">Open Findings</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">14</div>
          <p className="text-sm text-red-600 mt-1">3 critical</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Next Audit</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">Jun 15, 2024</div>
          <p className="text-sm text-gray-500 mt-1">GDPR Review</p>
        </div>
      </div>

      {/* Frameworks Status */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Frameworks</h2>
        <div className="space-y-4">
          {complianceFrameworks.map((framework) => {
            const statusStyle = statusConfig[framework.status as keyof typeof statusConfig];
            const StatusIcon = statusStyle.icon;

            return (
              <div key={framework.name} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusStyle.bg}`}>
                      <Shield className={`w-5 h-5 ${statusStyle.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusIcon className={`w-4 h-4 ${statusStyle.color}`} />
                        <span className={`text-sm font-medium ${statusStyle.color}`}>
                          {framework.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-gray-900">{framework.score}%</div>
                    <div className="text-sm text-gray-500">Compliance Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Last Audit: </span>
                    <span className="font-medium text-gray-900">{framework.lastAudit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Audit: </span>
                    <span className="font-medium text-gray-900">{framework.nextAudit}</span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      framework.score >= 90 ? "bg-green-500" : framework.score >= 70 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${framework.score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Control Status by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={controls}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="passed" fill="#10b981" radius={[4, 4, 0, 0]} name="Passed" />
            <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Findings */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Findings</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentFindings.map((finding) => (
            <div key={finding.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      finding.severity === "critical" ? "bg-red-50 text-red-600" :
                      finding.severity === "high" ? "bg-orange-50 text-orange-600" :
                      "bg-yellow-50 text-yellow-600"
                    }`}>
                      {finding.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{finding.framework}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">{finding.title}</h4>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    finding.status === "open" ? "text-red-600" : "text-orange-600"
                  }`}>
                    {finding.status.replace('-', ' ').toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Due: {finding.dueDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
