import { Boxes, LayoutDashboard, MapPinned, PackageSearch, Truck } from "lucide-react";
import { useState } from "react";

const ITEMS = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "districts", icon: MapPinned, label: "Districts" },
  { id: "stores", icon: Boxes, label: "Stores" },
  { id: "items", icon: PackageSearch, label: "Items" },
  { id: "transactions", icon: Truck, label: "Transactions" },
];


export function Sidebar() {
  const [active, setActive] = useState("overview");

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-slate-100 bg-white py-5 xl:flex">
      {ITEMS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          title={label}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            active === id
              ? "bg-blue-50 text-blue-600"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          <Icon size={18} />
        </button>
      ))}
    </aside>
  );
}
