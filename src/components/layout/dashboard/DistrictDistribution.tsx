"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { Card, CardHeader } from "../../ui/Card";

const COLORS = [
  "#3B82F6",
  "#22D3EE",
  "#34D399",
  "#FBBF24",
  "#F472B6",
  "#A78BFA",
  "#FB923C",
  "#94A3B8",
];

interface DistrictData {
  district: string;
  district_code: number;
  percentage: number;
}

export function DistrictDistribution() {
  const [districtData, setDistrictData] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://dash-test-6yil.onrender.com/dash/district_percentage"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch district data");
        }

        const data: DistrictData[] = await response.json();

        setDistrictData(
          data.filter((item) => item.percentage > 0)
        );
      } catch (err) {
        console.error("Error fetching district percentage:", err);
        setError("Unable to load district data");
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictData();
  }, []);

  return (
    <Card>
      <CardHeader
        title="District Share"
        subtitle="% of total indent quantity"
        icon={<PieIcon size={15} />}
      />

      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-400">
          Loading district data...
        </div>
      ) : error ? (
        <div className="flex h-40 items-center justify-center text-sm text-red-400">
          {error}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Pie Chart */}
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={districtData}
                  dataKey="percentage"
                  nameKey="district"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={2}
                  stroke="none"
                >
                  {districtData.map((entry, i) => (
                    <Cell
                      key={entry.district_code}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number) => [
                    `${value}%`,
                    "Share",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* District List */}
          <ul className="flex-1 space-y-2">
            {districtData.map((entry, i) => (
              <li
                key={entry.district_code}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-slate-500">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[i % COLORS.length],
                    }}
                  />

                  {entry.district}
                </span>

                <span className="font-medium text-slate-700">
                  {entry.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}