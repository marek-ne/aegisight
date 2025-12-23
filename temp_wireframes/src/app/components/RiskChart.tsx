import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const riskData = [
  { time: "00:00", predicted: 45, actual: 42, threshold: 70 },
  { time: "04:00", predicted: 52, actual: 48, threshold: 70 },
  { time: "08:00", predicted: 68, actual: 65, threshold: 70 },
  { time: "12:00", predicted: 75, actual: 72, threshold: 70 },
  { time: "16:00", predicted: 82, actual: 78, threshold: 70 },
  { time: "20:00", predicted: 71, actual: 68, threshold: 70 },
  { time: "24:00", predicted: 58, actual: 55, threshold: 70 },
];

export function RiskChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Risk Prediction Trend
        </h2>
        <p className="text-sm text-gray-500">
          Predicted vs Actual risk levels over 24 hours
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={riskData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.1}
            strokeWidth={2}
            name="Predicted Risk"
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
            strokeWidth={2}
            name="Actual Risk"
          />
          <Line
            type="monotone"
            dataKey="threshold"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Risk Threshold"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">AI Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>
          <span className="text-gray-600">Threshold</span>
        </div>
      </div>
    </div>
  );
}
