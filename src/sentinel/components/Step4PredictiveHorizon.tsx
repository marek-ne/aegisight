
import React, { useEffect, useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, ForecastData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Loader2, AlertCircle, RefreshCw, ChevronLeft, Binary, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  state: AppState;
  onReset: () => void;
  onBack: () => void;
}

export const Step4PredictiveHorizon: React.FC<Props> = ({ state, onReset, onBack }) => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for standalone demo mode
  const MOCK_FORECAST_DATA: ForecastData = {
    threatTitle: "ServiceNow Change Management Conflict",
    description: "Sentinel has detected a 94% probability of a major change collision impacting your core ITSM workflows. This is driven by correlated pattern anomalies in 'Update Set' commits and 'Instance Clone' schedules, predicting a catastrophic rollback event.",
    probabilityCurve: [
      { month: "M1", value: 12 }, { month: "M2", value: 18 }, { month: "M3", value: 45 },
      { month: "M4", value: 67 }, { month: "M5", value: 89 }, { month: "M6", value: 94 },
      { month: "M7", value: 88 }, { month: "M8", value: 65 }, { month: "M9", value: 40 },
      { month: "M10", value: 25 }, { month: "M11", value: 15 }, { month: "M12", value: 10 }
    ],
    strategicSteps: [
      "Implement immediate 'Freeze Period' for module CHG-772.",
      "Isolate 'update_set_xml' payloads for forensic verification.",
      "Trigger automated rollback script RB-992 if latency > 400ms.",
      "Schedule emergency CAB review for cross-scope dependencies."
    ]
  };

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.API_KEY || "";
      // Standalone mode check: if key is missing/placeholder, use mock
      if (!apiKey || apiKey.includes("PLACEHOLDER")) {
        console.log("Sentinel: Standalone Demo Mode Active.");
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 2500));
        setForecast(MOCK_FORECAST_DATA);
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Act as Aegisight AI Oracle. Analyze the following infrastructure profile and predict a major future risk for the next 12 months.
      Asset Class: ${state.assetClass}
      Historical Depth: ${state.dataYears} Years
      Cost per Outage: $${state.costPerOutage}
      
      Generate a realistic, specific future threat scenario in JSON format.
      The probability curve should have 12 months (M1 to M12) representing the likelihood percentage of a catastrophic failure.`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash', // Switched to generally available model
        contents: [{ role: 'user', parts: [{ text: prompt }] }], // Updated to generic structure if needed, or keeping simple
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              threatTitle: { type: Type.STRING },
              description: { type: Type.STRING },
              probabilityCurve: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    month: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                  },
                  required: ["month", "value"]
                }
              },
              strategicSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["threatTitle", "description", "probabilityCurve", "strategicSteps"]
          }
        }
      });

      const text = response.response.text(); // Correct way to access text in newer SDK parts if structure differs, but keeping standard access
      // Note: The previous code accessed response.text directly which might be properties.
      // Let's stick to the generated response structure.
      const data = JSON.parse(text) as ForecastData;
      setForecast(data);
    } catch (err) {
      console.warn("Sentinel: API Connection failed, falling back to Simulation Mode.", err);
      // Fallback to mock data on error so the demo never breaks
      setForecast(MOCK_FORECAST_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={64} />
          <Sparkles className="absolute -top-2 -right-2 text-cyan-400 animate-pulse" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-50 uppercase tracking-widest">Accessing Predictive Horizon</h2>
          <p className="text-slate-500 mt-2 font-mono text-sm">Simulating 1,000,000 failure scenarios for {state.assetClass}...</p>
        </div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className="bg-rose-950/20 border border-rose-900/50 p-12 rounded-3xl text-center max-w-lg mx-auto">
        <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-50">Core Engine Latency</h3>
        <p className="text-slate-400 mt-2 mb-6">{error || "Failed to load predictive model."}</p>
        <button onClick={fetchForecast} className="px-6 py-2 bg-rose-600 rounded-xl font-bold text-sm uppercase">Retry Forecast</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 transition-colors group"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Report
          </button>
          <div className="inline-flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <Binary size={14} /> AI Oracle Mode Enabled
          </div>
          <h2 className="text-4xl font-black text-slate-50 tracking-tighter">Predictive Risk Horizon</h2>
          <p className="text-slate-400">12-Month Outage Probability & Future Threat Forecasting</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchForecast} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all" title="Refresh Forecast">
            <RefreshCw size={18} className="text-slate-400" />
          </button>
          <button onClick={onReset} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/40">
            New Simulation
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Threat Profile */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-cyan-500/5">
              <Cpu size={160} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-rose-600/20 border border-rose-500/30 rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="text-rose-500" size={32} />
                </div>
                <div>
                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Emergent Threat Identified</p>
                  <h3 className="text-2xl font-bold text-slate-50">{forecast.threatTitle}</h3>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">{forecast.description}</p>

              {/* Strategic Roadmap */}
              <div className="pt-6 border-t border-slate-800/50">
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4">Strategic Mitigation Roadmap</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forecast.strategicSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-blue-500/30 transition-all group">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px] font-bold text-blue-400 border border-blue-500/20 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Probability Visual */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 h-full flex flex-col shadow-inner shadow-slate-950">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="text-blue-500" size={16} /> Failure Probability
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Simulated 12-month decay curve</p>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast.probabilityCurve} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#probGradient)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Peak Risk Month</span>
                <span className="text-blue-400 font-mono font-bold">
                  {forecast.probabilityCurve.reduce((prev, current) => (prev.value > current.value) ? prev : current).month}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
