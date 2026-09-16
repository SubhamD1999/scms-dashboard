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

export function DistrictPerformance() {
  return (
    <Card>
      <CardHeader
        title="District Indent Quantity"
        subtitle="Total indent volume by district"
        icon={<BarChart3 size={15} />}
      />
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={merged} margin={{ left: -18, right: 8, top: 4 }} barCategoryGap="15%">
            <CartesianGrid vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="district"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={{ stroke: "#F1F5F9" }}
              interval={0}
              height={40}
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
