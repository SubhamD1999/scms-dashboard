import { useMemo, useState } from "react";
import { Search, Table2, X } from "lucide-react";
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
          <div
            className="
              flex items-center gap-2
              rounded-lg
              border border-slate-200
              bg-white
              px-3 py-2
              shadow-sm
              transition-all
              focus-within:border-violet-300
              focus-within:ring-2
              focus-within:ring-violet-100
            "
          >
            <Search size={14} className="shrink-0 text-slate-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search district"
              className="
                w-28 bg-transparent
                text-xs font-medium text-slate-700
                placeholder:text-slate-400
                focus:outline-none
                sm:w-32
              "
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="
                  flex h-4 w-4
                  items-center justify-center
                  rounded-full
                  text-slate-400
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-600
                "
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </div>
        }
      />

      <div className="px-4 pb-4 sm:px-5">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th
                    className="
                      w-16 whitespace-nowrap
                      px-4 py-3.5
                      text-xs font-semibold
                      uppercase tracking-[0.06em]
                      text-slate-500
                    "
                  >
                    #
                  </th>

                  <th
                    className="
                      whitespace-nowrap
                      px-4 py-3.5
                      text-xs font-semibold
                      uppercase tracking-[0.06em]
                      text-slate-500
                    "
                  >
                    District / Store
                  </th>

                  <th
                    className="
                      whitespace-nowrap
                      px-4 py-3.5
                      text-right
                      text-xs font-semibold
                      uppercase tracking-[0.06em]
                      text-slate-500
                    "
                  >
                    Total Indent
                  </th>

                  <th
                    className="
                      whitespace-nowrap
                      px-4 py-3.5
                      text-right
                      text-xs font-semibold
                      uppercase tracking-[0.06em]
                      text-slate-500
                    "
                  >
                    Annual Indent
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr
                    key={`${row.district}-${row.slNo}`}
                    className="
                      group
                      bg-white
                      transition-colors
                      duration-150
                      hover:bg-violet-50/40
                    "
                  >
                    <td className="px-4 py-4">
                      <span
                        className="
                          inline-flex h-7 w-7
                          items-center justify-center
                          rounded-md
                          bg-slate-50
                          text-xs font-medium
                          tabular-nums
                          text-slate-400
                          ring-1 ring-inset ring-slate-200
                        "
                      >
                        {row.slNo}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className="
                          font-medium
                          text-slate-700
                          transition-colors
                          group-hover:text-violet-800
                        "
                      >
                        {row.district}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className="
                          tabular-nums
                          text-sm font-medium
                          text-slate-700
                        "
                      >
                        {row.totalIndent.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className="
                          tabular-nums
                          text-sm font-medium
                          text-slate-700
                        "
                      >
                        {row.annualIndent.toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="
                            mb-3 flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            bg-slate-50
                            text-slate-400
                            ring-1 ring-inset ring-slate-200
                          "
                        >
                          <Search size={16} />
                        </div>

                        <p className="text-sm font-medium text-slate-600">
                          No districts found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          No districts match "{query}"
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}