// src/components/InsightsPanel.jsx
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";

/**
 * Generates plain-language insights from the data we already have.
 * No new API needed — derived client-side.
 */
function deriveInsights({ stats, recommendation, peakHours }) {
  const insights = [];

  if (recommendation && recommendation.recommendedApp) {
    const rate = Number(recommendation.acceptanceRate);
    if (!isNaN(rate)) {
      insights.push({
        icon: TrendingUp,
        color: "text-green-600 dark:text-green-400",
        bg:   "bg-green-50 dark:bg-green-950/30",
        badge: "Recommendation",
        text:  `${recommendation.recommendedApp} currently has ${rate.toFixed(0)}% acceptance — the better choice right now.`,
      });
    }

    const waitTime = Number(recommendation.avgWaitTime);
    if (!isNaN(waitTime)) {
      if (waitTime <= 3) {
        insights.push({
          icon: TrendingUp,
          color: "text-blue-600 dark:text-blue-400",
          bg:   "bg-blue-50 dark:bg-blue-950/30",
          badge: "Wait Time",
          text:  `Average wait is just ${waitTime.toFixed(1)} min — low demand right now.`,
        });
      } else if (waitTime >= 7) {
        insights.push({
          icon: TrendingDown,
          color: "text-amber-600 dark:text-amber-400",
          bg:   "bg-amber-50 dark:bg-amber-950/30",
          badge: "Wait Time",
          text:  `Average wait of ${waitTime.toFixed(1)} min suggests high demand. Consider waiting.`,
        });
      }
    }
  }

  if (peakHours && peakHours.best_hour != null) {
    const best = Number(peakHours.best_hour);
    const peakRate = Number(peakHours.acceptance_rate);
    if (!isNaN(best)) {
      const period = best >= 12 ? "PM" : "AM";
      const h12 = best % 12 || 12;
      insights.push({
        icon: Clock,
        color: "text-purple-600 dark:text-purple-400",
        bg:   "bg-purple-50 dark:bg-purple-950/30",
        badge: "Best Hour",
        text:  `Peak booking success is at ${h12}:00 ${period}${!isNaN(peakRate) ? ` with ${peakRate.toFixed(0)}% acceptance` : ""}.`,
      });

      // Warn about morning rush (7–9 AM) if peak is outside
      if (best < 7 || best > 9) {
        insights.push({
          icon: AlertTriangle,
          color: "text-red-600 dark:text-red-400",
          bg:   "bg-red-50 dark:bg-red-950/30",
          badge: "Tip",
          text:  "Avoid bookings between 7–9 AM — morning rush typically reduces acceptance rates.",
        });
      }
    }
  }

  const statsRate = stats ? Number(stats.acceptance_rate) : NaN;

  if (!isNaN(statsRate) && statsRate >= 80) {
    insights.push({
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bg:   "bg-green-50 dark:bg-green-950/30",
      badge: "Area Trend",
      text:  `Overall acceptance in this area is strong at ${statsRate.toFixed(0)}%. Good time to book.`,
    });
  }

  if (!isNaN(statsRate) && statsRate < 50) {
    insights.push({
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      bg:   "bg-red-50 dark:bg-red-950/30",
      badge: "Area Trend",
      text:  `Low acceptance (${statsRate.toFixed(0)}%) in this area. Try a different platform or time.`,
    });
  }

  return insights;
}

export default function InsightsPanel({ stats, recommendation, peakHours, loading }) {
  const insights = deriveInsights({ stats, recommendation, peakHours });
  const hasData  = stats || recommendation || peakHours;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-muted-foreground" /> Insights
        </CardTitle>
        <CardDescription>Auto-generated from your query results</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
            <Lightbulb className="h-8 w-8 opacity-30" />
            <p className="text-sm">Run a query to generate insights</p>
          </div>
        ) : !insights.length ? (
          <p className="text-sm text-muted-foreground py-2">
            Not enough data to generate insights yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {insights.map((ins, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${ins.bg}`}
              >
                <ins.icon className={`mt-0.5 h-4 w-4 shrink-0 ${ins.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                      {ins.badge}
                    </Badge>
                  </div>
                  <p className="text-sm leading-snug">{ins.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}