import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { SmokerReading } from "@/types";

interface TempChartProps {
  history: SmokerReading[];
}

export function TempChart({ history }: TempChartProps) {
  const data = history.map(r => ({
    time: new Date(r.created_at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }),
    "Komora 1": +r.t_chamber1.toFixed(1),
    "Komora 2": +r.t_chamber2.toFixed(1),
    "Mięso":    +r.t_meat.toFixed(1),
    "Cel":      +r.t_set.toFixed(1),
  }));

  return (
    <div className="bg-gradient-card border border-gray-700 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Wykres temperatur</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={["auto", "auto"]} unit="°" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line dataKey="Komora 1" stroke="#ff6b2b" dot={false} strokeWidth={2} />
          <Line dataKey="Komora 2" stroke="#fbbf24" dot={false} strokeWidth={2} />
          <Line dataKey="Mięso"    stroke="#f87171" dot={false} strokeWidth={2} />
          <Line dataKey="Cel"      stroke="#6b7280" dot={false} strokeWidth={1} strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
