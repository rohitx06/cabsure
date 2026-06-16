// src/components/RecommendationCard.jsx
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Bike, TrendingUp, Clock4, AlertTriangle, Star } from "lucide-react";

const APP_CONFIG = {
  Uber:   { Icon: Car,  badgeCls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  Rapido: { Icon: Bike, badgeCls: "bg-cyan-100  text-cyan-800  dark:bg-cyan-900/30  dark:text-cyan-400  border-cyan-200  dark:border-cyan-800"  },
};

export default function RecommendationCard({ data, loading, error }) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-52 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-28" />
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
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
            <Star className="h-4 w-4 text-muted-foreground" /> Recommendation
          </CardTitle>
          <CardDescription>Run a query to see which platform to use.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const cfg  = APP_CONFIG[data.recommendedApp] ?? APP_CONFIG.Uber;
  const rate = Number(data.acceptanceRate);
  const wait = Number(data.avgWaitTime);
  const rateOk = !isNaN(rate);
  const waitOk = !isNaN(wait);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" /> Recommendation
          </CardTitle>
          <Badge variant="outline" className={cfg.badgeCls}>Best Pick</Badge>
        </div>
        <CardDescription>Best platform for your area right now</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* App name */}
        <div className="flex items-center gap-2">
          <cfg.Icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-2xl font-bold">{data.recommendedApp}</span>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/40 px-3 py-2.5 space-y-0.5">
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> Acceptance rate
            </p>
            <p className="text-xl font-semibold tabular-nums">
              {rateOk ? rate.toFixed(0) : "—"}<span className="text-sm font-normal text-muted-foreground">%</span>
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 px-3 py-2.5 space-y-0.5">
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock4 className="h-3 w-3" /> Avg wait
            </p>
            <p className="text-xl font-semibold tabular-nums">
              {waitOk ? wait.toFixed(1) : "—"}<span className="ml-1 text-sm font-normal text-muted-foreground">min</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}