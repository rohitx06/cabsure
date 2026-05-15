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
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="bg-white/4 border-white/8 backdrop-blur-sm rounded-2xl">
      <CardContent className="pt-5 pb-5">
        {/* Panel label */}
        <p
          className="mb-4 text-[10px] uppercase tracking-[0.2em] text-slate-500"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Query Parameters
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Area */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Pickup Area
              </Label>
              <Input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Thrissur"
                required
                className="h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/40"
              />
            </div>

            {/* App selector */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Platform
              </Label>
              <Select value={app} onValueChange={setApp}>
                <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white focus:ring-amber-400/50">
                  <SelectValue placeholder="Select app" />
                </SelectTrigger>
                <SelectContent className="bg-[#0e1420] border-white/10 text-white">
                  {APPS.map((a) => (
                    <SelectItem
                      key={a}
                      value={a}
                      className="focus:bg-white/10 focus:text-white"
                    >
                      {a === "Uber" ? "🚕 Uber" : "🛵 Rapido"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hour */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Hour (0–23)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  min={0}
                  max={23}
                  required
                  className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-amber-400/50 focus-visible:border-amber-400/40 pr-14"
                />
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="h-10 bg-amber-400 text-black font-bold hover:bg-amber-300 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed px-6 rounded-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Fetching…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                  Get Analytics
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}