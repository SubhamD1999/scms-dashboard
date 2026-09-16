import { Boxes, Layers, Pill, Store, type LucideIcon } from "lucide-react";
import type { TopStat } from "../../../data/dashboardData";

const ICONS: Record<TopStat["icon"], LucideIcon> = {
  store: Store,
  layers: Layers,
  box: Boxes,
  pill: Pill,
};



const PALETTE: Record<TopStat["icon"], { fill: string; iconBg: string; iconText: string; line: string; freq: number; phase: number }> = {
  store:  { fill: "bg-gradient-to-b from-blue-500 to-blue-400",       iconBg: "bg-blue-50",    iconText: "text-blue-600",    line: "#2563EB", freq: 8.5, phase: 8.5 },
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

function DotCluster({ seed }: { seed: number }) {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const r = ((seed + i * 37) % 100) / 100;
    const angle = (i / 12) * Math.PI * 2 + r;
    const radius = 10 + ((seed + i * 13) % 10);
    return {
      cx: 20 + Math.cos(angle) * radius,
      cy: 20 + Math.sin(angle) * radius * 0.7,
      r: 2 + ((seed + i) % 3),
    };
  });
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="white" opacity={0.35 + (i % 4) * 0.15} />
      ))}
    </svg>
  );
}

function RingSegments({ seed }: { seed: number }) {
  const segs = 5;
  const gap = 8;
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
      {Array.from({ length: segs }, (_, i) => {
        const start = i * (360 / segs) + gap / 2;
        const end = (i + 1) * (360 / segs) - gap / 2;
        const r = 16;
        const cx = 20;
        const cy = 20;
        const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
        const x1 = cx + r * Math.cos(toRad(start));
        const y1 = cy + r * Math.sin(toRad(start));
        const x2 = cx + r * Math.cos(toRad(end));
        const y2 = cy + r * Math.sin(toRad(end));
        const largeArc = end - start > 180 ? 1 : 0;
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
            fill="none"
            stroke="white"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.4 + ((seed + i) % 4) * 0.15}
          />
        );
      })}
    </svg>
  );
}

function ItemGrid({ seed }: { seed: number }) {
  const size = 3;
  const cells = Array.from({ length: size * size }, (_, i) => (seed + i * 17) % 4);
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
      {cells.map((v, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        return (
          <rect
            key={i}
            x={4 + col * 12}
            y={4 + row * 12}
            width={8}
            height={8}
            rx={2}
            fill="white"
            opacity={0.3 + (v / 4) * 0.5}
          />
        );
      })}
    </svg>
  );
}

/** EDL: an orbit motif — small moons circling a center point. */
function Orbit({ seed }: { seed: number }) {
  const moons = 3;
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
      <circle cx={20} cy={20} r={4} fill="white" opacity={0.9} />
      {Array.from({ length: moons }, (_, i) => {
        const r = 10 + i * 6;
        const angle = ((seed + i * 53) % 360) * (Math.PI / 180);
        return (
          <g key={i}>
            <circle cx={20} cy={20} r={r} fill="none" stroke="white" strokeWidth={1} opacity={0.25} />
            <circle cx={20 + r * Math.cos(angle)} cy={20 + r * Math.sin(angle)} r={2.5} fill="white" opacity={0.85} />
          </g>
        );
      })}
    </svg>
  );
}

/** Per-icon-type decorative visual shown on the "filled" (gradient) card variant. */
const DECOR: Record<TopStat["icon"], (seed: number) => JSX.Element> = {
  store: (seed) => <DotCluster seed={seed} />,
  layers: (seed) => <RingSegments seed={seed} />,
  box: (seed) => <ItemGrid seed={seed} />,
  pill: (seed) => <Orbit seed={seed} />,
};

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
        DECOR[stat.icon](stat.value)
      ) : (
        <Sparkline seed={stat.value} color={palette.line} freq={palette.freq} phase={palette.phase} />
      )}
    </div>
  );
}