// src/components/StatsCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function TrendIcon({ trend }) {
  if (trend === "up")   return <TrendingUp   className="h-3.5 w-3.5 text-green-500" />;
  if (trend === "down") return <TrendingDown  className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

/**
 * @param {{
 *   title: string,
 *   value: string|number|null,
 *   suffix?: string,
 *   description?: string,
 *   loading?: boolean,
 *   icon?: React.ReactNode,
 *   trend?: "up"|"down"|"neutral",
 *   badge?: string,          // e.g. "High confidence"
 *   badgeVariant?: string,   // shadcn badge variant
 * }} props
 */
export default function StatsCard({
  title,
  value,
  suffix = "",
  description,
  loading = false,
  icon,
  trend,
  badge,
  badgeVariant = "secondary",
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold tabular-nums">
                {value != null ? `${value}${suffix}` : "—"}
              </span>
              {trend && <TrendIcon trend={trend} />}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              {badge && (
                <Badge variant={badgeVariant} className="text-[10px] h-4 px-1.5">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}