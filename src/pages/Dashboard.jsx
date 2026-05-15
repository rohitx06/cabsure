// src/pages/Dashboard.jsx
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SearchPanel from "../components/SearchPanel";
import StatsCard from "../components/StatsCard";
import RecommendationCard from "../components/RecommendationCard";
import RideReportForm from "../components/RideReportForm";
import { getOverallStats, getTimeStats, getRecommendation } from "../services/api";

const INITIAL_DATA = { overall: null, timeBased: null, recommendation: null };

export default function Dashboard() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState({ search: false, rec: false });
  const [error, setError] = useState({ stats: null, rec: null });
  const [lastQuery, setLastQuery] = useState(null);

  const handleSearch = async ({ area, app, hour }) => {
    setLastQuery({ area, app, hour });
    setLoading({ search: true, rec: true });
    setError({ stats: null, rec: null });
    setData(INITIAL_DATA);

    const [statsResult, recResult] = await Promise.allSettled([
      Promise.all([
        getOverallStats(area, app),
        getTimeStats(area, app, hour),
      ]),
      getRecommendation(area, hour),
    ]);

    if (statsResult.status === "fulfilled") {
      const [overall, timeBased] = statsResult.value;
      setData((d) => ({ ...d, overall, timeBased }));
    } else {
      setError((e) => ({ ...e, stats: statsResult.reason?.message }));
    }

    if (recResult.status === "fulfilled") {
      setData((d) => ({ ...d, recommendation: recResult.value }));
    } else {
      setError((e) => ({ ...e, rec: recResult.reason?.message }));
    }

    setLoading({ search: false, rec: false });
  };

  const appAccent = lastQuery?.app === "Rapido" ? "#22d3ee" : "#f59e0b";
  const statsLoading = loading.search;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Ride Availability{" "}
          <span className="text-amber-400">Intelligence</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Community-powered predictions for Uber & Rapido in your area.
        </p>
      </div>

      {/* Search */}
      <SearchPanel onSearch={handleSearch} loading={loading.search} />

      {/* Active query context strip */}
      {lastQuery && !loading.search && (
        <div className="mt-3 flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-400 text-[10px] font-mono"
          >
            {lastQuery.area}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[10px] font-mono ${
              lastQuery.app === "Rapido"
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                : "border-amber-400/30 bg-amber-400/10 text-amber-300"
            }`}
          >
            {lastQuery.app}
          </Badge>
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-400 text-[10px] font-mono"
          >
            {String(lastQuery.hour).padStart(2, "0")}:00
          </Badge>
        </div>
      )}

      {/* Stats error */}
      {error.stats && (
        <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          ⚠ {error.stats}
        </div>
      )}

      {/* Main layout: stats (2/3) + recommendation (1/3) */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* ── Stats column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Overall stats */}
          <div>
            <p
              className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-600"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Overall Stats
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatsCard
                label="Acceptance Rate"
                value={
                  data.overall
                    ? Number(data.overall.acceptanceRate).toFixed(1)
                    : null
                }
                sub="All time"
                accent={appAccent}
                loading={statsLoading}
                showGauge
              />
              <StatsCard
                label="Total Reports"
                value={data.overall?.totalReports ?? null}
                sub="Community data points"
                accent={appAccent}
                loading={statsLoading}
              />
              <StatsCard
                label="Accepted Rides"
                value={data.overall?.acceptedReports ?? null}
                sub="Successfully matched"
                accent="#10b981"
                loading={statsLoading}
              />
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Hour-based stats */}
          <div>
            <p
              className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-600"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              At Selected Hour
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatsCard
                label="Hourly Acceptance"
                value={
                  data.timeBased
                    ? Number(data.timeBased.acceptanceRate).toFixed(1)
                    : null
                }
                sub={
                  lastQuery
                    ? `${String(lastQuery.hour).padStart(2, "0")}:00 window`
                    : "—"
                }
                accent={appAccent}
                loading={statsLoading}
                showGauge
              />
              <StatsCard
                label="Hourly Reports"
                value={data.timeBased?.totalReports ?? null}
                sub="In that hour"
                accent={appAccent}
                loading={statsLoading}
              />
              <StatsCard
                label="Hourly Accepted"
                value={data.timeBased?.acceptedReports ?? null}
                sub="Accepted in that hour"
                accent="#10b981"
                loading={statsLoading}
              />
            </div>
          </div>
        </div>

        {/* ── Recommendation column ── */}
        <div className="lg:col-span-1">
          <p
            className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-600"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Recommendation
          </p>
          <RecommendationCard
            data={data.recommendation}
            loading={loading.rec}
            error={error.rec}
          />
        </div>
      </div>

      {/* Report form */}
      <div className="mt-10">
        <p
          className="mb-4 text-[10px] uppercase tracking-[0.2em] text-slate-600"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Contribute Data
        </p>
        <RideReportForm />
      </div>

      {/* Footer */}
      <footer className="mt-14 border-t border-white/5 pt-6 text-center text-xs text-slate-700">
        CabSure © {new Date().getFullYear()} · Community-powered ride analytics
      </footer>
    </main>
  );
}