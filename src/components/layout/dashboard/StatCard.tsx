import { Boxes, Layers, Pill, Store, type LucideIcon } from "lucide-react";
import type { TopStat } from "../../../data/dashboardData";

const ICONS: Record<TopStat["icon"], LucideIcon> = {
  store: Store,
  layers: Layers,
  box: Boxes,
  pill: Pill,
};

// Gradient fill for the "filled" variant + tint for the "light" variant's icon badge.
// freq/phase give each icon's sparkline a distinct silhouette, not just a different color.

const PALETTE: Record<TopStat["icon"], { fill: string; iconBg: string; iconText: string; line: string; freq: number; phase: number }> = {
  store:  { fill: "bg-gradient-to-b from-blue-500 to-blue-400",       iconBg: "bg-blue-50",    iconText: "text-blue-600",    line: "#2563EB", freq: 5.5, phase: 0.4 },
  layers: { fill: "bg-gradient-to-b from-orange-500 to-orange-400",   iconBg: "bg-orange-50",  iconText: "text-orange-600",  line: "#D97706", freq: 8.5, phase: 2.1 },
  box:    { fill: "bg-gradient-to-b from-emerald-500 to-emerald-400", iconBg: "bg-emerald-50", iconText: "text-emerald-600", line: "#059669", freq: 3.2, phase: 4.8 },
  pill:   { fill: "bg-gradient-to-b from-purple-500 to-purple-400",   iconBg: "bg-purple-50",  iconText: "text-purple-600",  line: "#7C3AED", freq: 10.5, phase: 1.2 },
};

/** Deterministic pseudo-randomness so each card's decorative visual is stable across renders. */
function wave(seed: number, count: number, amplitude: number, baseline: number, freq: number, phase: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return (
      baseline +
      Math.sin(seed + phase + t * freq) * amplitude * 0.6 +
      Math.cos(seed * 1.7 + phase * 2 + t * (freq * 0.45)) * amplitude * 0.4
    );
  });
}

function smoothPath(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`;
  }
  return d;
}

function Sparkline({ seed, color, freq, phase }: { seed: number; color: string; freq: number; phase: number }) {
  const values = wave(seed, 9, 14, 20, freq, phase);
  const points = values.map((v, i) => ({ x: (i / (values.length - 1)) * 96 + 2, y: 32 - v }));

  return (
    <svg viewBox="0 0 100 40" className="h-10 w-24 shrink-0" preserveAspectRatio="none">
      <path d={smoothPath(points)} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

function BarPulse({ seed, freq, phase }: { seed: number; freq: number; phase: number }) {
  const values = wave(seed + 3, 9, 12, 16, freq, phase).map((v) => Math.max(6, Math.min(30, v + 16)));

  return (
    <div className="flex h-10 shrink-0 items-end gap-[3px]">
      {values.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-white"
          style={{ height: `${h}px`, opacity: 0.5 + (h / 30) * 0.5 }}
        />
      ))}
    </div>
  );
}

export function StatCard({ stat }: { stat: TopStat }) {
  const Icon = ICONS[stat.icon];
  const palette = PALETTE[stat.icon];
  const filled = stat.variant === "filled";

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.10)] ${
        filled ? palette.fill : "border border-slate-100 bg-white"
      }`}
    >
      <div className="min-w-0">
        <span
          className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${
            filled ? "bg-white/20 text-white" : `${palette.iconBg} ${palette.iconText}`
          }`}
        >
          <Icon size={16} />
        </span>
        <p className={`text-2xl font-semibold tabular-nums ${filled ? "text-white" : "text-slate-800"}`}>
          {stat.value.toLocaleString("en-IN")}
        </p>
        <p className={`text-sm ${filled ? "text-white/70" : "text-slate-400"}`}>{stat.label}</p>
      </div>

      {filled ? (
        <BarPulse seed={stat.value} freq={palette.freq} phase={palette.phase} />
      ) : (
        <Sparkline seed={stat.value} color={palette.line} freq={palette.freq} phase={palette.phase} />
      )}
    </div>
  );
}