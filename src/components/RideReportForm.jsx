// src/components/RideReportForm.jsx
import { useState } from "react";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Car, Bike, CheckCircle2, XCircle,
  AlertTriangle, CircleCheck, Loader2, Send,
} from "lucide-react";
import { submitRideReport } from "../services/api";

const DAYS       = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const RIDE_TYPES = ["Auto","Bike","Mini","Sedan","SUV"];
const APP_OPTIONS = [
  { value: "Uber",   label: "Uber",   Icon: Car  },
  { value: "Rapido", label: "Rapido", Icon: Bike },
];

function localNow() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function RideReportForm({ onSuccess }) {
  const d = new Date();
  const [form, setForm] = useState({
    pickup_area: "",
    app_name:    "Uber",
    ride_type:   "Auto",
    status:      "accepted",
    wait_time:   "",
    day_of_week: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1],
    request_time: localNow(),
  });
  const [state, setState] = useState({ loading: false, success: false, error: null });

  const sf = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const si = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ loading: true, success: false, error: null });
    try {
      await submitRideReport({
        ...form,
        wait_time: Number(form.wait_time),
        request_time: new Date(form.request_time).toISOString(),
      });
      setState({ loading: false, success: true, error: null });
      setForm((f) => ({ ...f, wait_time: "", status: "accepted" }));
      onSuccess?.();
      setTimeout(() => setState((s) => ({ ...s, success: false })), 3500);
    } catch (err) {
      setState({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Log a ride</CardTitle>
          <Badge variant="secondary">Community</Badge>
        </div>
        <CardDescription>
          Help others by submitting your ride experience.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Area */}
          <div className="space-y-1.5">
            <Label htmlFor="r-area">Pickup area</Label>
            <Input
              id="r-area"
              placeholder="e.g. Thrissur"
              value={form.pickup_area}
              onChange={si("pickup_area")}
              required
            />
          </div>

          {/* Platform */}
          <div className="space-y-1.5">
            <Label htmlFor="r-app">Platform</Label>
            <Select value={form.app_name} onValueChange={sf("app_name")}>
              <SelectTrigger id="r-app" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APP_OPTIONS.map(({ value, label, Icon }) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ride type */}
          <div className="space-y-1.5">
            <Label htmlFor="r-type">Ride type</Label>
            <Select value={form.ride_type} onValueChange={sf("ride_type")}>
              <SelectTrigger id="r-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RIDE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <div className="flex gap-2">
              {[
                { v: "accepted", Icon: CheckCircle2, active: "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
                { v: "rejected", Icon: XCircle,      active: "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
              ].map(({ v, Icon, active }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: v }))}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors
                    ${form.status === v ? active : "border-input bg-background text-muted-foreground hover:bg-accent"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{v}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wait time */}
          <div className="space-y-1.5">
            <Label htmlFor="r-wait">Wait time (min)</Label>
            <Input
              id="r-wait"
              type="number"
              placeholder="e.g. 3"
              min={0}
              value={form.wait_time}
              onChange={si("wait_time")}
              required
            />
          </div>

          {/* Day */}
          <div className="space-y-1.5">
            <Label htmlFor="r-day">Day of week</Label>
            <Select value={form.day_of_week} onValueChange={sf("day_of_week")}>
              <SelectTrigger id="r-day" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Request time */}
          <div className="space-y-1.5">
            <Label htmlFor="r-time">Request time</Label>
            <Input
              id="r-time"
              type="datetime-local"
              value={form.request_time}
              onChange={si("request_time")}
              required
              className="[color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          <Separator />

          {/* Feedback */}
          {state.error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="flex items-center gap-2 rounded-md border border-green-500/40 bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <CircleCheck className="h-4 w-4 shrink-0" />
              Report submitted — thank you!
            </div>
          )}

          <Button type="submit" className="w-full" disabled={state.loading}>
            {state.loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit report</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}