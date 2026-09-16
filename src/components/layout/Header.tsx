import { Bell, LayoutGrid, Search, Settings, Warehouse } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = ["Dashboard", "Districts", "Stores", "Transactions", "Reports"];

export function Header() {
  const [active, setActive] = useState("Dashboard");

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/70 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm shadow-blue-500/30">
          <Warehouse size={18} />
        </span>
        <span className="text-[17px] font-semibold tracking-tight text-slate-800">
          SCMS<span className="text-blue-600">.</span>
        </span>
      </div>

      <nav className="hidden items-center gap-1 rounded-full bg-slate-50 p-1 lg:flex">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === item
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 md:flex">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search stores, districts..."
            className="w-44 bg-transparent text-slate-600 placeholder:text-slate-400 focus:outline-none"
          />
        </label>

        <button
          aria-label="Grid view"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:flex"
        >
          <LayoutGrid size={17} />
        </button>
        <button
          aria-label="Settings"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:flex"
        >
          <Settings size={17} />
        </button>
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

      </div>
    </header>
  );
}
