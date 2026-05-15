// src/components/RecommendationCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const APP_CONFIG = {
  Uber: {
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
    gradient: "from-amber-500/10 via-transparent to-transparent",
    border: "border-amber-400/20",
    badgeClass: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    emoji: "🚕",
  },
  Rapido: {
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.15)",
    gradient: "from-cyan-500/10 via-transparent to-transparent",
    border: "border-cyan-400/20",
    badgeClass: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    emoji: "🛵",
  },
};

const DEFAULT_CFG = APP_CONFIG.Uber;

/**
 * @param {{
 *   data: { recommendedApp: string, acceptanceRate: string, avgWaitTime: string } | null,
 *   loading: boolean,
 *   error: string | null
 * }} props
 */
export default function RecommendationCard({ data, loading, error }) {
  const cfg = data
    ? (APP_CONFIG[data.recommendedApp] ?? DEFAULT_CFG)
    : DEFAULT_CFG;

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${cfg.gradient} ${cfg.border} backdrop-blur-sm rounded-2xl h-full`}
    >
      {/* Glow orb */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
        style={{ background: cfg.glow }}
      />

      <CardContent className="pt-5 pb-5 relative z-10">
        <p
          className="mb-4 text-[10px] uppercase tracking-[0.2em] text-slate-500"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          ✦ Best Pick Right Now
        </p>

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-white/8" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-28 bg-white/8" />
                <Skeleton className="h-4 w-20 bg-white/5" />
              </div>
            </div>
            <Separator className="bg-white/5" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16 rounded-xl bg-white/5" />
              <Skeleton className="h-16 rounded-xl bg-white/5" />
            </div>
          </div>
        ) : error ? (
          <p className="text-sm text-rose-400">⚠ {error}</p>
        ) : data ? (
          <>
            {/* App name + badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{cfg.emoji}</span>
              <div>
                <h2
                  className="text-2xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {data.recommendedApp}
                </h2>
                <Badge
                  variant="outline"
                  className={`mt-1 text-[10px] font-semibold ${cfg.badgeClass}`}
                >
                  Recommended
                </Badge>
              </div>
            </div>

            <Separator className="bg-white/8 mb-4" />

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Acceptance
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: cfg.color, fontFamily: "'DM Mono', monospace" }}
                >
                  {Number(data.acceptanceRate).toFixed(1)}
                  <span className="text-sm font-normal text-slate-400">%</span>
                </p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Avg Wait
                </p>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {Number(data.avgWaitTime).toFixed(1)}
                  <span className="ml-1 text-sm font-normal text-slate-400">min</span>
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500 mt-2">
            Run a search to get the recommendation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}