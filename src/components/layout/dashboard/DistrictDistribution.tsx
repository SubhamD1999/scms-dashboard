  import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { Card, CardHeader } from "../../ui/Card";
import { districtIndentQuantity } from "../../../data/dashboardData";

const COLORS = ["#3B82F6", "#22D3EE", "#34D399", "#FBBF24", "#F472B6", "#A78BFA", "#FB923C", "#94A3B8"];

const merged = Object.values(
  districtIndentQuantity.reduce<Record<string, { district: string; percentage: number }>>(
    (acc, row) => {
      acc[row.district] = {
        district: row.district,
        percentage: (acc[row.district]?.percentage ?? 0) + row.percentage,
      };
      return acc;
    },
    {}
  )
).filter((d) => d.percentage > 0);

export function DistrictDistribution() {
  return (
    <Card>
      <CardHeader title="District Share" subtitle="% of total indent quantity" icon={<PieIcon size={15} />} />

      <div className="flex items-center gap-4">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={merged}
                dataKey="percentage"
                nameKey="district"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                stroke="none"
              >
                {merged.map((entry, i) => (
                  <Cell key={entry.district} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex-1 space-y-2">
          {merged.map((entry, i) => (
            <li key={entry.district} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {entry.district}
              </span>
              <span className="font-medium text-slate-700">{entry.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
