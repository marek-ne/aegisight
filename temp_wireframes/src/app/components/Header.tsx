import { Bell, Search, Calendar } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Risk Prediction Dashboard</h1>
        <p className="text-sm text-gray-500">Real-time service monitoring and risk analysis</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Date Range */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">Last 7 Days</span>
        </div>

        {/* Search */}
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Search className="w-5 h-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
