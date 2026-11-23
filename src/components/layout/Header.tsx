import { useEffect, useRef, useState } from "react";
import { LogOut, UserCircle } from "lucide-react";

type HeaderProps = {
  userName?: string;
  onLogout?: () => void;
};

export function Header({ userName = "Subham Debnath", onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-[68px] items-center
        justify-end gap-5
        border-b border-slate-200/80
        bg-white/95
        px-5
        shadow-[0_1px_3px_rgba(15,23,42,0.03)]
        backdrop-blur-xl
        lg:px-7
      "
    >
      <div className="flex items-center gap-2">
        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className={`
              hidden
              h-9 w-9
              items-center justify-center
              rounded-lg
              border
              transition-all
              sm:flex
              ${
                open
                  ? "border-slate-200 bg-slate-50 text-blue-700"
                  : "border-transparent text-slate-400 hover:border-slate-200 hover:bg-slate-50 hover:text-blue-700"
              }
            `}
          >
            <UserCircle size={17} strokeWidth={1.9} />
          </button>

          {open && (
            <div
              role="menu"
              className="
                absolute right-0 top-full mt-2
                w-56
                overflow-hidden
                rounded-xl
                border border-slate-200
                bg-white
                shadow-lg shadow-slate-900/10
              "
            >
              <div className="px-4 py-3">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="truncate text-sm font-medium text-slate-900">
                  {userName}
                </p>
              </div>

              <div className="h-px bg-slate-100" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onLogout?.();
                }}
                className="
                  flex w-full items-center gap-2
                  px-4 py-2.5
                  text-left text-sm text-red-600
                  transition-colors
                  hover:bg-red-50
                  focus-visible:bg-red-50 focus-visible:outline-none
                "
              >
                <LogOut size={15} strokeWidth={1.9} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}