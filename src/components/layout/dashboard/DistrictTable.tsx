import { useMemo, useState } from "react";
import { Search, Table2 } from "lucide-react";
import { Card, CardHeader } from "../../ui/Card";
import { districtIndentQuantity } from "../../../data/dashboardData";

export function DistrictTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      districtIndentQuantity.filter((row) =>
        row.district.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <Card>
      <CardHeader
        title="All Districts"
        subtitle="Total & annual indent per district"
        icon={<Table2 size={15} />}
        action={
          <label className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400">
            <Search size={13} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search district"
              className="w-28 bg-transparent text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 pr-3 font-medium">#</th>
              <th className="pb-2 pr-3 font-medium">District / Store</th>
              <th className="pb-2 pr-3 font-medium text-right">Total Indent</th>
              <th className="pb-2 font-medium text-right">Annual Indent</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={`${row.district}-${row.slNo}`}
                className={idx % 2 === 0 ? "bg-slate-50/60" : ""}
              >
                <td className="rounded-l-lg py-2.5 pl-2 pr-3 text-slate-400">{row.slNo}</td>
                <td className="py-2.5 pr-3 font-medium text-slate-700">{row.district}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-slate-600">
                  {row.totalIndent.toLocaleString("en-IN")}
                </td>
                <td className="rounded-r-lg py-2.5 pr-2 text-right tabular-nums text-slate-600">
                  {row.annualIndent.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-slate-400">
                  No districts match "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
