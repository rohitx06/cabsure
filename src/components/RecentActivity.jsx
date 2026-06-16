// src/components/RecentActivity.jsx
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Car, Bike, AlertTriangle } from "lucide-react";

const APP_ICON = { Uber: Car, Rapido: Bike };

function timeAgo(isoString) {
  if (!isoString) return "—";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ReportRow({ report }) {
  const Icon = APP_ICON[report.app_name] ?? Car;
  const accepted = report.status === "accepted";

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate">
          {report.pickup_area}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {report.app_name} · {report.wait_time != null ? `${report.wait_time} min wait` : "—"}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge
          variant={accepted ? "default" : "destructive"}
          className="text-[10px] h-4 px-1.5"
        >
          {accepted ? "Accepted" : "Rejected"}
        </Badge>
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(report.created_at)}
        </span>
      </div>
    </div>
  );
}

export default function RecentActivity({ data, loading, error }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" /> Recent Activity
        </CardTitle>
        <CardDescription>Latest community ride reports</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-sm text-destructive py-2">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
            <Activity className="h-8 w-8 opacity-30" />
            <p className="text-sm">No recent reports yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {data.slice(0, 8).map((report, i) => (
              <ReportRow key={report.id ?? i} report={report} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}