// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { AlertTriangle, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import SearchPanel      from "../components/SearchPanel";
import StatsCard        from "../components/StatsCard";
import RecommendationCard from "../components/RecommendationCard";
import PeakHoursCard    from "../components/PeakHoursCard";
import MapView          from "../components/MapView";
import RecentActivity   from "../components/RecentActivity";
import InsightsPanel    from "../components/InsightsPanel";
import RideReportForm   from "../components/RideReportForm";

import {
  getStats,
  getRecommend,
  getMapData,
  getPeakHours,
  getRecentReports,
} from "../services/api";

const EMPTY = {
  stats:          null,
  recommendation: null,
  peakHours:      null,
  mapData:        null,
  recentReports:  null,
};

const EMPTY_LOADING = {
  stats: false, recommendation: false,
  peakHours: false, map: false, recent: false,
};

const EMPTY_ERROR = {
  stats: null, recommendation: null,
  peakHours: null, map: null, recent: null,
};

export default function Dashboard({ sidebarOpen, onCloseSidebar }) {
  const [data,    setData]    = useState(EMPTY);
  const [loading, setLoading] = useState(EMPTY_LOADING);
  const [error,   setError]   = useState(EMPTY_ERROR);
  const [query,   setQuery]   = useState(null);

  // Load map data + recent activity on mount (global, no query params)
  useEffect(() => {
    setLoading((l) => ({ ...l, map: true, recent: true }));

    Promise.allSettled([getMapData(), getRecentReports()]).then(([mapR, recentR]) => {
      setLoading((l) => ({ ...l, map: false, recent: false }));

      setData((d) => ({
        ...d,
        mapData:       mapR.status   === "fulfilled" ? mapR.value       : null,
        recentReports: recentR.status === "fulfilled" ? recentR.value   : null,
      }));
      setError((e) => ({
        ...e,
        map:    mapR.status    === "rejected" ? mapR.reason?.message    : null,
        recent: recentR.status === "rejected" ? recentR.reason?.message : null,
      }));
    });
  }, []);

  const handleSearch = async ({ area, app, hour }) => {
    setQuery({ area, app, hour });
    setLoading((l) => ({ ...l, stats: true, recommendation: true, peakHours: true }));
    setError((e)   => ({ ...e, stats: null, recommendation: null, peakHours: null }));
    setData((d)    => ({ ...d, stats: null, recommendation: null, peakHours: null }));

    const [statsR, recR, peakR] = await Promise.allSettled([
      getStats(area, app),
      getRecommend(area),
      getPeakHours(area, app),
    ]);

    setLoading((l) => ({ ...l, stats: false, recommendation: false, peakHours: false }));

    setData((d) => ({
      ...d,
      stats:          statsR.status === "fulfilled" ? statsR.value : null,
      recommendation: recR.status   === "fulfilled" ? recR.value   : null,
      peakHours:      peakR.status  === "fulfilled" ? peakR.value  : null,
    }));
    setError((e) => ({
      ...e,
      stats:          statsR.status === "rejected" ? statsR.reason?.message : null,
      recommendation: recR.status   === "rejected" ? recR.reason?.message   : null,
      peakHours:      peakR.status  === "rejected" ? peakR.reason?.message  : null,
    }));
  };

  // Re-fetch recent activity after a report is submitted
  const refreshRecent = () => {
    getRecentReports()
      .then((r) => setData((d) => ({ ...d, recentReports: r })))
      .catch(() => {});
  };

  const stats    = data.stats;
  const sl       = loading.stats;

  // Trend: >70% up, <50% down, else neutral
  const acceptanceTrend =
    stats && Number(stats.acceptance_rate) >= 70 ? "up"
    : stats && Number(stats.acceptance_rate) < 50  ? "down"
    : "neutral";

  const confidenceBadge =
    stats && Number(stats.total_reports) >= 20 ? "High confidence"
    : stats && Number(stats.total_reports) >= 8  ? "Moderate confidence"
    : stats                                       ? "Low confidence"
    : undefined;

  /* ── Sidebar content (shared between desktop aside and mobile drawer) ── */
  const sidebarContent = (
    <div className="flex flex-col gap-4 p-5 pb-10">
      <SearchPanel onSearch={handleSearch} loading={sl} />
      <RideReportForm onSuccess={refreshRecent} />
    </div>
  );

  return (
    <div className="flex flex-1 overflow-hidden">

      {/* ─── Mobile sidebar drawer (< lg) ─── */}
      <div
        className={`sidebar-backdrop lg:hidden ${sidebarOpen ? "open" : ""}`}
        onClick={onCloseSidebar}
        aria-hidden="true"
      />
      <aside
        className={`sidebar-drawer sidebar lg:hidden ${sidebarOpen ? "open" : ""}`}
      >
        {sidebarContent}
      </aside>

      {/* ─── Desktop sidebar (lg+) ─── */}
      <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r lg:flex sidebar">
        {sidebarContent}
      </aside>

      {/* ─── Main ─── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-5 p-4 sm:space-y-6 sm:p-6">

          {/* Page header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2 sm:text-2xl">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Ride Analytics
                </h1>
                {query && (
                  <Badge variant="secondary">
                    {query.area} · {query.app} · {String(query.hour).padStart(2, "0")}:00
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Community-powered acceptance predictions for Uber & Rapido.
              </p>
            </div>
          </div>

          {/* Mobile search — only shown on mobile when sidebar drawer is NOT used */}
          {/* Removed: the sidebar drawer now handles mobile search */}

          {/* Error banner */}
          {error.stats && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error.stats}
            </div>
          )}

          {/* ── Row 1: Stats cards ── */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Overview</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <StatsCard
                title="Acceptance rate"
                value={stats ? stats.acceptance_rate : null}
                suffix="%"
                description="Across all reports"
                trend={acceptanceTrend}
                badge={confidenceBadge}
                loading={sl}
              />
              <StatsCard
                title="Total reports"
                value={stats?.total_reports ?? null}
                description="Community submissions"
                loading={sl}
              />
              <StatsCard
                title="Avg wait time"
                value={data.recommendation?.avgWaitTime != null && !isNaN(Number(data.recommendation.avgWaitTime)) ? Number(data.recommendation.avgWaitTime).toFixed(1) : null}
                suffix=" min"
                description="Based on recommendation data"
                loading={loading.recommendation}
              />
            </div>
          </section>

          <Separator />

          {/* ── Row 2: Recommendation + Peak Hours ── */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Smart picks</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <RecommendationCard
                data={data.recommendation}
                loading={loading.recommendation}
                error={error.recommendation}
              />
              <PeakHoursCard
                data={data.peakHours}
                loading={loading.peakHours}
                error={error.peakHours}
              />
            </div>
          </section>

          <Separator />

          {/* ── Row 3: Map ── */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Location heatmap</h2>
            <MapView
              data={data.mapData}
              loading={loading.map}
              error={error.map}
            />
          </section>

          <Separator />

          {/* ── Row 4: Insights + Recent Activity ── */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Activity & insights</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <InsightsPanel
                stats={data.stats}
                recommendation={data.recommendation}
                peakHours={data.peakHours}
                loading={sl || loading.recommendation || loading.peakHours}
              />
              <RecentActivity
                data={data.recentReports}
                loading={loading.recent}
                error={error.recent}
              />
            </div>
          </section>

          {/* Mobile log form */}
          <div className="lg:hidden">
            <Separator />
            <div className="mt-4">
              <RideReportForm onSuccess={refreshRecent} />
            </div>
          </div>

          {/* Footer */}
          <p className="pb-4 text-center text-xs text-muted-foreground">
            CabSure · community-powered ride analytics · {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}