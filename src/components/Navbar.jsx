// src/components/Navbar.jsx
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#080c14]/90 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🚖</span>
          <span
            className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Cab<span className="text-amber-400">Sure</span>
          </span>
          <Badge
            variant="outline"
            className="hidden sm:inline-flex border-amber-400/30 bg-amber-400/10 text-amber-400 text-[10px] tracking-widest uppercase py-0"
          >
            Analytics
          </Badge>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs text-slate-400">Live</span>
          </div>
          <Separator orientation="vertical" className="h-4 bg-white/10" />
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-400 text-[10px]"
          >
            MVP v0.1
          </Badge>
        </div>
      </div>
    </header>
  );
}