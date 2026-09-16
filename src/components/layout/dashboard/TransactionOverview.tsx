import { useState } from "react";
import { ClipboardList, PackageCheck, Timer, Truck } from "lucide-react";
import { Card, CardHeader } from "../../ui/Card";
import {
  averageTransactions,
  todaysTransactions,
  totalTransactions,
  type TransactionMetric,
} from "../../../data/dashboardData";

const TABS = [
  { id: "total", label: "Total", data: totalTransactions },
  { id: "average", label: "Average", data: averageTransactions },
  { id: "today", label: "Today", data: todaysTransactions },
] as const;

const ICONS = {
  indent: ClipboardList,
  issue: Truck,
  receive: PackageCheck,
  expiry: Timer,
};

const TINTS: Record<TransactionMetric["icon"], string> = {
  indent: "text-blue-600 bg-blue-500",
  issue: "text-violet-600 bg-violet-500",
  receive: "text-emerald-600 bg-emerald-500",
  expiry: "text-rose-600 bg-rose-500",
};

export function TransactionOverview() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("total");
  const tab = TABS.find((t) => t.id === activeTab)!;
  const max = Math.max(...tab.data.map((m) => m.value), 1);

  return (
    <Card>
      <CardHeader
        title="Transaction Overview"
        subtitle="Indent, issue, receive & short expiry"
        action={
          <div className="flex rounded-full bg-slate-50 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === t.id
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tab.data.map((metric) => {
          const Icon = ICONS[metric.icon];
          const [textTint, barTint] = TINTS[metric.icon].split(" ");
          const pct = Math.min(100, Math.round((metric.value / max) * 100));

          return (
            <div key={metric.label} className="rounded-xl border border-slate-100 p-3.5">
              <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 ${textTint}`}>
                <Icon size={15} />
              </div>
              <p className="text-lg font-semibold tabular-nums text-slate-800">
                {metric.value.toLocaleString("en-IN")}
              </p>
              <p className="mb-2 truncate text-xs text-slate-400">{metric.label}</p>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className={`h-1.5 rounded-full ${barTint}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
