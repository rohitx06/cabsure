// src/components/PeakHoursCard.jsx
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, AlertTriangle } from "lucide-react";

function confidenceLevel(reports) {
  if (reports >= 20) return { label: "High",     variant: "default"     };
  if (reports >= 8)  return { label: "Moderate", variant: "secondary"   };
  return               { label: "Low",      variant: "outline"     };
}

function fmt(h) {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:00 ${period}`;
}

export default function PeakHoursCard({ data, loading, error }) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-52 mt-1" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-28" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="flex items-center gap-2 pt-6 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" /> Peak Hours
          </CardTitle>
          <CardDescription>Run a query to see the best booking time.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const conf = confidenceLevel(data.total_reports);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" /> Peak Hours
          </CardTitle>
          <Badge variant={conf.variant}>{conf.label} confidence</Badge>
        </div>
        <CardDescription>Best hour to book based on community data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Best time hero */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Best time to book</p>
          <p className="text-3xl font-bold tabular-nums">{fmt(data.best_hour)}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground mb-0.5">Acceptance</p>
            <p className="text-lg font-semibold tabular-nums">
              {!isNaN(Number(data.acceptance_rate)) ? Number(data.acceptance_rate).toFixed(0) : "—"}
              <span className="text-sm font-normal text-muted-foreground">%</span>
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground mb-0.5">Reports</p>
            <p className="text-lg font-semibold tabular-nums">{data.total_reports}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}