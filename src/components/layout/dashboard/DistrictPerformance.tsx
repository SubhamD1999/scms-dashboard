import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardHeader } from "../../ui/Card";
import { districtIndentQuantity } from "../../../data/dashboardData";

const merged = Object.values(
  districtIndentQuantity.reduce<Record<string, { district: string; totalIndent: number }>>(
    (acc, row) => {
      acc[row.district] = {
        district: row.district,
        totalIndent: (acc[row.district]?.totalIndent ?? 0) + row.totalIndent,
      };
      return acc;
    },
    {}
  )
).sort((a, b) => b.totalIndent - a.totalIndent);

// Below this container width, per-bar labels overlap and become unreadable — hide them.
const LABEL_HIDE_BREAKPOINT = 420;

export function DistrictPerformance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setShowLabels(width >= LABEL_HIDE_BREAKPOINT);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Card>
      <CardHeader
        title="District Indent Quantity"
        subtitle="Total indent volume by district"
        icon={<BarChart3 size={15} />}
      />
      <div ref={containerRef} className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={merged} margin={{ left: -18, right: 8, top: 4 }} barCategoryGap="15%">
            <CartesianGrid vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="district"
              tick={showLabels ? { fontSize: 11, fill: "#94A3B8" } : false}
              tickLine={false}
              axisLine={{ stroke: "#F1F5F9" }}
              interval={0}
              height={showLabels ? 40 : 8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              cursor={{ fill: "#EFF6FF" }}
              formatter={(value: number) => [value.toLocaleString("en-IN"), "Indent"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                fontSize: 12,
                boxShadow: "0 8px 24px -12px rgba(15,23,42,0.15)",
              }}
            />
            <Bar dataKey="totalIndent" radius={[6, 6, 0, 0]} fill="#3B82F6" maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}