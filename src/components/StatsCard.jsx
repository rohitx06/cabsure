// src/components/StatsCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function GaugeRing({ pct = 0, color = "#f59e0b" }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;

  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="shrink-0">
      <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 34 34)"
        style={{ transition: "stroke-dasharray 0.9s ease" }}
      />
      <text
        x="34"
        y="38"
        textAnchor="middle"
        fill={color}
        fontSize="10"
        fontWeight="700"
        fontFamily="'DM Mono', monospace"
      >
        {pct}%
      </text>
    </svg>
  );
}

/**
 * @param {{
 *   label: string,
 *   value: string | number | null,
 *   sub?: string,
 *   accent?: string,
 *   loading?: boolean,
 *   showGauge?: boolean
 * }} props
 */
export default function StatsCard({
  label,
  value,
  sub,
  accent = "#f59e0b",
  loading = false,
  showGauge = false,
}) {
  return (
    <Card className="relative overflow-hidden bg-white/4 border-white/8 backdrop-blur-sm rounded-2xl hover:border-white/12 hover:bg-white/6 transition-colors">
      {/* Top accent line */}
      <div
        className="absolute left-0 top-0 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
        }}
      />

      <CardContent className="pt-5 pb-5">
        <p
          className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {label}
        </p>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24 bg-white/8" />
            <Skeleton className="h-3 w-16 bg-white/5" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p
                className="text-3xl font-bold tracking-tight text-white"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {value != null ? value : "—"}
              </p>
              {sub && (
                <p className="mt-1 text-xs text-slate-500">{sub}</p>
              )}
            </div>
            {showGauge && (
              <GaugeRing pct={Number(value) || 0} color={accent} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}