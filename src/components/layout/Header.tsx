import {
  Bell,
  LayoutGrid,
  Search,
  Settings,
  Warehouse,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  "Dashboard",
  "Districts",
  "Stores",
  "Transactions",
  "Reports",
];

export function Header() {
  const [active, setActive] = useState("Dashboard");

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-[68px] items-center
        justify-between gap-5
        border-b border-slate-200/80
        bg-white/95
        px-5
        shadow-[0_1px_3px_rgba(15,23,42,0.03)]
        backdrop-blur-xl
        lg:px-7
      "
    >

      <div className="flex shrink-0 items-center gap-2.5">
        <div
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg
            bg-gradient-to-br
            from-blue-800 to-blue-600
            text-white
            shadow-sm shadow-blue-700/20
          "
        >
          <Warehouse size={18} strokeWidth={2.1} />
        </div>

        <div className="leading-none">
          <div
            className="
              text-[16px]
              font-bold
              tracking-tight
              text-slate-800
            "
          >
            SCMS<span className="text-blue-700">.</span>
          </div>

          <div
            className="
              mt-1
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
          >
            Supply Chain Management
          </div>
        </div>
      </div>

    
      <nav
        className="
          hidden
          h-10
          items-center
          gap-0.5
          rounded-lg
          border border-slate-200
          bg-slate-50/70
          p-1
          lg:flex
        "
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item;

          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`
                relative
                h-8
                rounded-md
                px-3.5
                text-[13px]
                font-medium
                transition-all
                duration-150

                ${
                  isActive
                    ? `
                      bg-white
                      text-blue-800
                      shadow-sm
                      ring-1 ring-inset ring-slate-200/80
                    `
                    : `
                      text-slate-500
                      hover:bg-white/70
                      hover:text-slate-700
                    `
                }
              `}
            >
              {item}

              {isActive && (
                <span
                  className="
                    absolute
                    bottom-0.5
                    left-1/2
                    h-0.5
                    w-5
                    -translate-x-1/2
                    rounded-full
                    bg-blue-700
                  "
                />
              )}
            </button>
          );
        })}
      </nav>

      
      <div className="flex items-center gap-2">
        <label
          className="
            hidden
            h-9
            items-center
            gap-2
            rounded-lg
            border border-slate-200
            bg-slate-50/70
            px-3
            text-slate-400
            transition-all

            focus-within:border-blue-300
            focus-within:bg-white
            focus-within:ring-2
            focus-within:ring-blue-100

            md:flex
          "
        >
          <Search size={15} strokeWidth={2} />

          <input
            type="text"
            placeholder="Search stores, districts..."
            className="
              w-40
              bg-transparent
              text-xs
              font-medium
              text-slate-700
              placeholder:text-slate-400
              focus:outline-none
              lg:w-48
            "
          />

          <span
            className="
              hidden
              rounded
              border border-slate-200
              bg-white
              px-1.5
              py-0.5
              text-[9px]
              font-medium
              text-slate-400
              lg:block
            "
          >
            ⌘K
          </span>
        </label>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        <button
          aria-label="Grid view"
          className="
            hidden
            h-9 w-9
            items-center justify-center
            rounded-lg
            border border-transparent
            text-slate-400
            transition-all

            hover:border-slate-200
            hover:bg-slate-50
            hover:text-blue-700

            sm:flex
          "
        >
          <LayoutGrid size={17} strokeWidth={1.9} />
        </button>

        <button
          aria-label="Settings"
          className="
            hidden
            h-9 w-9
            items-center justify-center
            rounded-lg
            border border-transparent
            text-slate-400
            transition-all

            hover:border-slate-200
            hover:bg-slate-50
            hover:text-blue-700

            sm:flex
          "
        >
          <Settings size={17} strokeWidth={1.9} />
        </button>

        <button
          aria-label="Notifications"
          className="
            relative
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            border border-transparent
            text-slate-400
            transition-all

            hover:border-slate-200
            hover:bg-slate-50
            hover:text-blue-700
          "
        >
          <Bell size={17} strokeWidth={1.9} />

          <span
            className="
              absolute
              right-[8px]
              top-[7px]
              h-1.5
              w-1.5
              rounded-full
              bg-rose-500
              ring-2 ring-white
            "
          />
        </button>
      </div>
    </header>
  );
}