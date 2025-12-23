import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, Filter } from "lucide-react";

const reportTemplates = [
  {
    id: 1,
    name: "Executive Summary",
    description: "High-level overview of IT risk and service health",
    icon: FileText,
    type: "Summary",
    frequency: "Monthly",
    lastGenerated: "Dec 1, 2024",
  },
  {
    id: 2,
    name: "Risk Analysis Report",
    description: "Detailed risk assessment and predictions",
    icon: TrendingUp,
    type: "Analysis",
    frequency: "Weekly",
    lastGenerated: "Dec 15, 2024",
  },
  {
    id: 3,
    name: "Service Performance",
    description: "Service uptime, performance metrics, and SLA compliance",
    icon: BarChart3,
    type: "Performance",
    frequency: "Weekly",
    lastGenerated: "Dec 15, 2024",
  },
  {
    id: 4,
    name: "Compliance Audit",
    description: "Compliance status across all frameworks",
    icon: PieChart,
    type: "Compliance",
    frequency: "Quarterly",
    lastGenerated: "Oct 1, 2024",
  },
  {
    id: 5,
    name: "Incident Summary",
    description: "Incident statistics and resolution metrics",
    icon: FileText,
    type: "Incidents",
    frequency: "Monthly",
    lastGenerated: "Dec 1, 2024",
  },
  {
    id: 6,
    name: "Trend Analysis",
    description: "Historical trends and forecasting",
    icon: TrendingUp,
    type: "Analysis",
    frequency: "Monthly",
    lastGenerated: "Dec 1, 2024",
  },
];

const recentReports = [
  {
    id: 1,
    name: "Risk Analysis Report - Week 50",
    type: "PDF",
    generatedBy: "System",
    date: "Dec 15, 2024",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Service Performance - Week 50",
    type: "PDF",
    generatedBy: "Sarah Chen",
    date: "Dec 15, 2024",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Executive Summary - November",
    type: "PDF",
    generatedBy: "System",
    date: "Dec 1, 2024",
    size: "3.2 MB",
  },
  {
    id: 4,
    name: "Incident Summary - November",
    type: "PDF",
    generatedBy: "Mike Johnson",
    date: "Dec 1, 2024",
    size: "1.5 MB",
  },
];

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and download IT risk reports</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Custom Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Reports</div>
          <div className="text-3xl font-semibold text-gray-900">127</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">This Month</div>
          <div className="text-3xl font-semibold text-gray-900">12</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Scheduled</div>
          <div className="text-3xl font-semibold text-gray-900">8</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Last Generated</div>
          <div className="text-xl font-semibold text-gray-900">2 hours ago</div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <template.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900">{template.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Frequency:</span>
                  <span className="font-medium text-gray-900">{template.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Generated:</span>
                  <span className="font-medium text-gray-900">{template.lastGenerated}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Generate
                </button>
                <button className="px-3 py-2 border border-gray-200 text-gray-700 text-sm rounded hover:bg-gray-50">
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Report Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Generated By</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Size</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{report.generatedBy}</td>
                  <td className="py-4 px-4 text-gray-600">{report.date}</td>
                  <td className="py-4 px-4 text-gray-600">{report.size}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Weekly Risk Analysis</div>
                <div className="text-sm text-gray-500">Every Monday at 8:00 AM</div>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Edit Schedule
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Monthly Executive Summary</div>
                <div className="text-sm text-gray-500">First day of month at 9:00 AM</div>
              </div>
            </div>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              Edit Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
