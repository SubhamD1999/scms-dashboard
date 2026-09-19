import { ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/Button";
import { organisationName } from "../../../data/dashboardData";

const ORGANISATIONS = [
  "National Health Mission",
  "AGMC and GBP Hospital",
  "National AYUSH Mission, Tripura",
];

export function DashboardHeader() {
  const [org, setOrg] = useState(organisationName);

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-400">Supply Chain Management System</p>
      </div>

      <div className="flex lg:flex-row flex-col lg:items-center gap-1 lg:gap-4">
        <div className="relative">
          <select
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="lg:w-auto w-full appearance-none rounded-full border border-slate-200 bg-white py-2 pl-4 pr-9 text-sm font-medium text-slate-600 shadow-sm outline-none hover:bg-slate-50 focus:ring-2 focus:ring-blue-100"
          >
            {ORGANISATIONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <Button variant="outline" size="sm" className="!rounded-full">
          <Download size={14} />
          Export
        </Button>
      </div>
    </div>
  );
}