import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  // MapPin,
  // ArrowLeftRight,
  // FileText,
  // Settings,
  LogOut,
  Boxes,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PackageMinus,
  PackageCheck,
  Undo2,
  Truck,
  MapPin,
  Menu,
  Globe,
  Layers,
  Container,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ---------------- Menu config ---------------- */

interface NavChild {
  to: string;
  label: string;
  icon?: LucideIcon;
}
interface NavItem {
  label: string;
  icon: LucideIcon;
  to?: string; // single link
  children?: NavChild[]; // or a group with submenu
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: Layers, to: "/" },
  // {
  //   label: "Store-1",
  //   icon: ClipboardList,
  //   children: [
  //     { to: "/store-1", label: "Store-1-Child" },
  //   ],
  // },

  { label: "Suppliers", icon: Container, to: "/suppliers" },
];

/* ---------------- Helpers ---------------- */

function useIsDesktop() {
  const query = "(min-width: 1024px)";
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return matches;
}

const isGroupActive = (item: NavItem, pathname: string) =>
  !!item.children?.some((c) => pathname === c.to || pathname.startsWith(c.to + "/"));

const childCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${isActive ? "bg-blue-50 font-medium text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
  }`;

function ChildContent({ child }: { child: NavChild }) {
  const Icon = child.icon;
  return (
    <>
      {Icon && <Icon size={16} className="shrink-0" />}
      <span>{child.label}</span>
    </>
  );
}

/* ---------------- Group with submenu ---------------- */

interface GroupProps {
  item: NavItem;
  compact: boolean;
  open: boolean;
  active: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

function NavGroup({ item, compact, open, active, onToggle, onNavigate }: GroupProps) {
  const { pathname } = useLocation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [fly, setFly] = useState<{ top: number; left: number } | null>(null);
  const Icon = item.icon;

  // Close the flyout after navigating
  useEffect(() => setFly(null), [pathname]);

  const openFlyout = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setFly({ top: r.top, left: r.right });
  };

  const rowCls = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${compact ? "justify-center px-0" : ""
    } ${active
      ? compact
        ? "bg-blue-50 text-blue-600"
        : "text-blue-600"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div
      onMouseEnter={compact ? openFlyout : undefined}
      onMouseLeave={compact ? () => setFly(null) : undefined}
    >
      <button
        ref={btnRef}
        onClick={compact ? openFlyout : onToggle}
        aria-expanded={compact ? fly !== null : open}
        aria-haspopup="true"
        className={rowCls}
      >
        <Icon size={20} className="shrink-0" />
        {!compact && (
          <>
            <span className="flex-1 whitespace-nowrap text-left">{item.label}</span>
            <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      {/* Expanded: accordion submenu */}
      {!compact && (
        <div className={`grid transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <ul className="ml-[22px] mt-1 space-y-0.5 border-l border-gray-200 pl-3">
              {item.children!.map((c) => (
                <li key={c.to}>
                  <NavLink to={c.to} end onClick={onNavigate} tabIndex={open ? 0 : -1} className={childCls}>
                    <ChildContent child={c} />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Collapsed: flyout (portal avoids clipping by the scrolling nav) */}
      {compact &&
        fly &&
        createPortal(
          <div style={{ top: fly.top, left: fly.left }} className="fixed z-50 pl-2">
            <div className="w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
              <p className="px-3 py-1.5 text-xs font-semibold text-gray-400">{item.label}</p>
              {item.children!.map((c) => (
                <NavLink key={c.to} to={c.to} end onClick={onNavigate} className={childCls}>
                  <ChildContent child={c} />
                </NavLink>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ---------------- Sidebar ---------------- */

interface SidebarProps {
  collapsed: boolean; // desktop only
  mobileOpen: boolean; // mobile only
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const { pathname } = useLocation();
  const isDesktop = useIsDesktop();
  const compact = collapsed && isDesktop; // icon-only rail

  // One group open at a time; follows the current route
  const [openKey, setOpenKey] = useState<string | null>(
    () => navItems.find((i) => isGroupActive(i, pathname))?.label ?? null
  );
  useEffect(() => {
    const match = navItems.find((i) => isGroupActive(i, pathname));
    if (match) setOpenKey(match.label);
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white
          transition-all duration-300 ease-in-out lg:relative
          ${collapsed ? "lg:w-[72px]" : "lg:w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-5 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:text-blue-600 lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className={`flex h-16 shrink-0 items-center justify-between border-b border-gray-100 ${compact ? "justify-center px-4" : "px-5"}`}>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Globe size={20} />
            </div>
            {!compact && <span className="text-lg font-bold text-gray-900">STORE</span>}
          </div>
          <button onClick={onCloseMobile} className="rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden" aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <NavGroup
                  key={item.label}
                  item={item}
                  compact={compact}
                  open={openKey === item.label}
                  active={isGroupActive(item, pathname)}
                  onToggle={() => setOpenKey((k) => (k === item.label ? null : item.label))}
                  onNavigate={onCloseMobile}
                />
              );
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === "/"}
                onClick={onCloseMobile}
                title={compact ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${compact ? "justify-center px-0" : ""} ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                {!compact && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 p-3">
          {/* <button
            title={compact ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 ${compact ? "justify-center px-0" : ""}`}
            // TODO: hook up to auth + navigate("/login")
          >
            <LogOut size={20} className="shrink-0" />
            {!compact && <span className="whitespace-nowrap">Logout</span>}
          </button> */}
        </div>
      </aside>
    </>
  );
}





