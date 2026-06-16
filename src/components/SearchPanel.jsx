// src/components/SearchPanel.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

const APPS = ["Uber", "Rapido"];

export default function SearchPanel({ onSearch, loading }) {
  const [area, setArea] = useState("Thrissur");
  const [app, setApp] = useState("Uber");
  const [hour, setHour] = useState(String(new Date().getHours()));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!area.trim()) return;
    onSearch({ area: area.trim(), app, hour: Number(hour) });
  };

  return (
    <Card className="lg:max-h-[45vh] lg:overflow-y-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Query</CardTitle>
        <CardDescription>
          Pick a location, platform and hour to analyse.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Area */}
          <div className="space-y-1.5">
            <Label htmlFor="area">Pickup area</Label>
            <Input
              id="area"
              type="text"
              placeholder="e.g. Thrissur"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          {/* Platform */}
          <div className="space-y-1.5">
            <Label htmlFor="platform">Platform</Label>
            <Select value={app} onValueChange={setApp}>
              <SelectTrigger id="platform" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-200/10 backdrop-blur-xl border-zinc-700 shadow-lg">
                {APPS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hour */}
          <div className="space-y-1.5">
            <Label htmlFor="hour">Hour (0–23)</Label>
            <Input
              id="hour"
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Get Analytics
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
