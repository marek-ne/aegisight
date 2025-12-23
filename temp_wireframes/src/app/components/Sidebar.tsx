import { LayoutDashboard, AlertTriangle, Shield, Activity, Settings, BarChart3, FileText } from "lucide-react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BarChart3, label: "Risk Analytics", id: "risk-analytics" },
  { icon: Activity, label: "Service Monitor", id: "service-monitor" },
  { icon: AlertTriangle, label: "Incidents", id: "incidents" },
  { icon: Shield, label: "Compliance", id: "compliance" },
  { icon: FileText, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-500" />
          <div>
            <div className="font-semibold">Aegisight AI</div>
            <div className="text-xs text-gray-400">IT Service Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <span>JD</span>
          </div>
          <div className="flex-1">
            <div className="text-sm">John Doe</div>
            <div className="text-xs text-gray-400">IT Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
}