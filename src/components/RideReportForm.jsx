// src/components/RideReportForm.jsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitRideReport } from "../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const RIDE_TYPES = ["Auto", "Bike", "Mini", "Sedan", "SUV"];
const APPS = ["Uber", "Rapido"];

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function RideReportForm() {
  const now = new Date();
  const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [form, setForm] = useState({
    pickup_area: "",
    app_name: "Uber",
    ride_type: "Auto",
    status: "accepted",
    wait_time: "",
    day_of_week: DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1],
    request_time: localISO,
  });

  const [submitState, setSubmitState] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const setField = (key) => (val) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setInput = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false, error: null });
    try {
      await submitRideReport({
        ...form,
        wait_time: Number(form.wait_time),
        request_time: new Date(form.request_time).toISOString(),
      });
      setSubmitState({ loading: false, success: true, error: null });
      // Reset form except area
      setForm((f) => ({ ...f, wait_time: "", status: "accepted" }));
      setTimeout(() => setSubmitState((s) => ({ ...s, success: false })), 3500);
    } catch (err) {
      setSubmitState({ loading: false, success: false, error: err.message });
    }
  };

  const inputCls =
    "h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/40";

  const selectContentCls = "bg-[#0e1420] border-white/10 text-white";
  const selectItemCls = "focus:bg-white/10 focus:text-white";
  const triggerCls = "h-10 bg-white/5 border-white/10 text-white focus:ring-amber-400/50";

  return (
    <Card className="bg-white/4 border-white/8 backdrop-blur-sm rounded-2xl">
      <CardContent className="pt-5 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-slate-500"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Submit Report
            </p>
            <h3 className="mt-0.5 text-base font-semibold text-white">
              Log a Ride Attempt
            </h3>
          </div>
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-400 text-[10px]"
          >
            Community Data
          </Badge>
        </div>

        <Separator className="bg-white/8 my-4" />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Pickup Area */}
            <Field label="Pickup Area">
              <Input
                type="text"
                placeholder="e.g. Thrissur"
                value={form.pickup_area}
                onChange={setInput("pickup_area")}
                required
                className={inputCls}
              />
            </Field>

            {/* Platform */}
            <Field label="Platform">
              <Select value={form.app_name} onValueChange={setField("app_name")}>
                <SelectTrigger className={triggerCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {APPS.map((a) => (
                    <SelectItem key={a} value={a} className={selectItemCls}>
                      {a === "Uber" ? "🚕 Uber" : "🛵 Rapido"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Ride Type */}
            <Field label="Ride Type">
              <Select value={form.ride_type} onValueChange={setField("ride_type")}>
                <SelectTrigger className={triggerCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {RIDE_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className={selectItemCls}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Status toggle */}
            <Field label="Status">
              <div className="flex h-10 gap-1 rounded-md border border-white/10 bg-white/5 p-1">
                {["accepted", "rejected"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`flex-1 rounded-sm text-xs font-semibold capitalize transition-all ${
                      form.status === s
                        ? s === "accepted"
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-rose-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            {/* Wait Time */}
            <Field label="Wait Time (min)">
              <Input
                type="number"
                placeholder="e.g. 3"
                min={0}
                value={form.wait_time}
                onChange={setInput("wait_time")}
                required
                className={inputCls}
              />
            </Field>

            {/* Day of Week */}
            <Field label="Day of Week">
              <Select value={form.day_of_week} onValueChange={setField("day_of_week")}>
                <SelectTrigger className={triggerCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {DAYS.map((d) => (
                    <SelectItem key={d} value={d} className={selectItemCls}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Request Time — full width */}
            <div className="sm:col-span-2">
              <Field label="Request Time">
                <Input
                  type="datetime-local"
                  value={form.request_time}
                  onChange={setInput("request_time")}
                  required
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </Field>
            </div>
          </div>

          {/* Feedback */}
          <div className="mt-4 space-y-3">
            {submitState.error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                ⚠ {submitState.error}
              </div>
            )}
            {submitState.success && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                ✓ Report submitted successfully! Thank you for contributing.
              </div>
            )}

            <Button
              type="submit"
              disabled={submitState.loading}
              className="w-full h-11 rounded-xl border border-white/10 bg-white/8 text-white font-semibold hover:bg-white/12 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitState.loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </span>
              ) : (
                "Submit Report →"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}