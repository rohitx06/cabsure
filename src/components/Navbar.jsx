// src/components/Navbar.jsx
import { Car, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Navbar({ dark, onToggleDark, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6">

        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger — hidden on lg+ */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-8 w-8 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <Car className="h-5 w-5" />
          <span className="text-base font-semibold tracking-tight">
            CabSure
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Live dot */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            className="h-8 w-8"
            aria-label="Toggle theme"
          >
            {dark
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
    </header>
  );
}