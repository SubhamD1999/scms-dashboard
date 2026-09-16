import { CheckCircle2, ListChecks } from "lucide-react";
import { Card, CardHeader } from "../../ui/Card";
import { allTransactions } from "../../../data/dashboardData";

const FACILITY_TINT: Record<string, string> = {
  WareHouse: "bg-blue-50 text-blue-600",
  "Sub District Hospital": "bg-amber-50 text-amber-600",
  "District Hospital": "bg-emerald-50 text-emerald-600",
};

export function TransactionTable() {
  return (
    <Card>
      <CardHeader
        title="All Transactions"
        subtitle="Latest store-level indent, issue & receipt"
        icon={<ListChecks size={15} />}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 pr-3 font-medium">District</th>
              <th className="pb-2 pr-3 font-medium">Facility</th>
              <th className="pb-2 pr-3 font-medium">Store</th>
              <th className="pb-2 pr-3 font-medium text-right">Indent</th>
              <th className="pb-2 pr-3 font-medium text-right">Issued</th>
              <th className="pb-2 font-medium text-right">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.map((row, idx) => (
              <tr key={row.slNo} className={idx % 2 === 0 ? "bg-slate-50/60" : ""}>
                <td className="rounded-l-lg py-3 pl-2 pr-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {row.district}
                  </span>
                </td>
                <td className="py-3 pr-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      FACILITY_TINT[row.facilityType] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.facilityType}
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    {row.storeName}
                    {row.verified && (
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                    )}
                  </div>
                </td>
                <td className="py-3 pr-3 text-right tabular-nums text-slate-600">{row.totalIndent}</td>
                <td className="py-3 pr-3 text-right tabular-nums text-slate-600">
                  {row.totalIssued.toLocaleString("en-IN")}
                </td>
                <td className="rounded-r-lg py-3 text-right tabular-nums text-slate-600">
                  {row.totalReceipt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
