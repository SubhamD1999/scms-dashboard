import { Activity } from "lucide-react";
import { Card } from "../../ui/Card";
import { fulfillmentRate, totalTransactions } from "../../../data/dashboardData";

const RADIUS = 70;
const STROKE = 14;
const CIRCUMFERENCE = Math.PI * RADIUS; // half circle

export function FulfillmentGauge() {
  const progress = (fulfillmentRate / 100) * CIRCUMFERENCE;
  const indent = totalTransactions[0].value;
  const issue = totalTransactions[1].value;

  return (
    <Card className="flex flex-col items-center text-center">
      <div className="mb-1 flex w-full items-center gap-2 text-slate-800">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Activity size={15} />
        </span>
        <h3 className="text-[15px] font-semibold">Fulfillment Rate</h3>
      </div>

      <svg viewBox="0 0 180 100" className="mt-2 w-full max-w-[220px]">
        <path
          d={`M 20 90 A ${RADIUS} ${RADIUS} 0 0 1 160 90`}
          fill="none"
          stroke="#EEF2FF"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        <path
          d={`M 20 90 A ${RADIUS} ${RADIUS} 0 0 1 160 90`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
      </svg>

      <p className="-mt-8 text-3xl font-semibold tabular-nums text-slate-800">
        {fulfillmentRate}%
      </p>
      <p className="mb-4 text-xs text-slate-400">Issued vs indented</p>

      <div className="grid w-full grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-left">
        <div>
          <p className="text-xs text-slate-400">Total Indent</p>
          <p className="text-sm font-semibold text-slate-700">
            {indent.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Total Issue</p>
          <p className="text-sm font-semibold text-slate-700">
            {issue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Card>
  );
}
