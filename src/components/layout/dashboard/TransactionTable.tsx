import { CheckCircle2, ListChecks } from "lucide-react";
import { Card, CardHeader } from "../../ui/Card";
import { allTransactions } from "../../../data/dashboardData";

const FACILITY_TINT: Record<string, string> = {
  WareHouse: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100",
  "Sub District Hospital":
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100",
  "District Hospital":
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
};

export function TransactionTable() {
  return (
    <Card>
      <CardHeader
        title="All Transactions"
        subtitle="Latest store-level indent, issue & receipt"
        icon={<ListChecks size={15} />}
      />

      <div className="px-4 pb-4 sm:px-5">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                    District
                  </th>

                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                    Facility
                  </th>

                  <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                    Store
                  </th>

                  <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                    Indent
                  </th>

                  <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                    Issued
                  </th>

                  <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                    Receipt
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {allTransactions.map((row) => (
                  <tr
                    key={row.slNo}
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
                          inline-flex items-center
                          rounded-md
                          bg-slate-100
                          px-2.5 py-1
                          text-xs font-medium
                          text-slate-600
                          ring-1 ring-inset ring-slate-200
                        "
                      >
                        {row.district}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`
                          inline-flex items-center
                          rounded-md
                          px-2.5 py-1
                          text-xs font-medium
                          ${FACILITY_TINT[row.facilityType] ??
                          "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"}
                        `}
                      >
                        {row.facilityType}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700 transition-colors group-hover:text-violet-800">
                          {row.storeName}
                        </span>

                        {row.verified && (
                          <span
                            title="Verified store"
                            className="
                              flex h-5 w-5 shrink-0
                              items-center justify-center
                              rounded-full
                              bg-emerald-50
                              text-emerald-600
                              ring-1 ring-inset ring-emerald-100
                            "
                          >
                            <CheckCircle2 size={12} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span className="tabular-nums text-sm font-medium text-slate-700">
                        {row.totalIndent}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span className="tabular-nums text-sm font-medium text-slate-700">
                        {row.totalIssued.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span className="tabular-nums text-sm font-medium text-slate-700">
                        {row.totalReceipt}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}