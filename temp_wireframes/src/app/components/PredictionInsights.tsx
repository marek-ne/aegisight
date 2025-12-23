import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Brain, ArrowUp, ArrowDown } from "lucide-react";

const predictionData = [
  { service: "API Gateway", currentRisk: 89, predictedRisk: 92, change: 3 },
  { service: "Database", currentRisk: 72, predictedRisk: 68, change: -4 },
  { service: "Web Server", currentRisk: 35, predictedRisk: 42, change: 7 },
  { service: "Auth Service", currentRisk: 42, predictedRisk: 38, change: -4 },
  { service: "Cloud Infra", currentRisk: 28, predictedRisk: 31, change: 3 },
];

export function PredictionInsights() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              AI Risk Predictions
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Next 4-hour risk forecast by service
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={predictionData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis
            dataKey="service"
            type="category"
            width={100}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="currentRisk" fill="#94a3b8" radius={[0, 4, 4, 0]} name="Current" />
          <Bar dataKey="predictedRisk" radius={[0, 4, 4, 0]} name="Predicted">
            {predictionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.predictedRisk > 70 ? "#ef4444" : entry.predictedRisk > 50 ? "#f97316" : "#10b981"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Prediction Details */}
      <div className="mt-6 space-y-2">
        {predictionData.map((item) => (
          <div
            key={item.service}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-sm font-medium text-gray-700">{item.service}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {item.currentRisk} → {item.predictedRisk}
              </span>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  item.change > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {item.change > 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span>{Math.abs(item.change)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
