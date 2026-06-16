// src/App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("cabsure-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("cabsure-theme", dark ? "dark" : "light");
  }, [dark]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground antialiased">
      <Navbar
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
      />
      <Dashboard
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />
    </div>
  );
}