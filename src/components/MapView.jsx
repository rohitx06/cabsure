// src/components/MapView.jsx
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, AlertTriangle } from "lucide-react";

function markerColor(rate) {
  const r = Number(rate);
  if (r >= 70) return "#22c55e"; // green
  if (r >= 40) return "#f59e0b"; // amber
  return "#ef4444";              // red
}

let L = null;

async function getL() {
  if (L) return L;
  L = (await import("leaflet")).default;
  return L;
}

function makeIcon(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
    <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8z"
      fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="8" r="3" fill="white"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
  });
}

export default function MapView({ data, loading, error }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  // Init map once — the container div is ALWAYS rendered (hidden via CSS when
  // showing placeholders), so containerRef.current is guaranteed to exist.
  useEffect(() => {
    let mounted = true;

    getL().then((Leaflet) => {
      if (!mounted || !containerRef.current || mapRef.current) return;

      mapRef.current = Leaflet.map(containerRef.current, {
        center: [10.5, 76.2],
        zoom: 9,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      Leaflet.tileLayer(
        "https://{s}.basemap.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap © CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(mapRef.current);

      setMapReady(true);
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Invalidate map size when container resizes (responsive breakpoint changes)
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!data || !mapRef.current) return;

    getL().then(() => {
      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (!data.length) return;

      const bounds = [];

      data.forEach((point) => {
        const lat  = Number(point.latitude);
        const lng  = Number(point.longitude);
        if (isNaN(lat) || isNaN(lng)) return; // skip bad data

        const rate = Number(point.acceptance_rate);
        const color = markerColor(rate);

        const icon   = makeIcon(color);
        const marker = L.marker([lat, lng], { icon });

        const rateLabel =
          rate >= 70 ? "🟢 High" : rate >= 40 ? "🟡 Medium" : "🔴 Low";

        marker.bindPopup(`
          <div style="min-width:160px;font-family:system-ui,sans-serif">
            <p style="font-weight:600;font-size:14px;margin:0 0 6px">${point.pickup_area}</p>
            <div style="display:grid;gap:4px;font-size:12px">
              <div><span style="color:#6b7280">Acceptance</span>
                <strong style="float:right">${isNaN(rate) ? "—" : rate.toFixed(1) + "%"}</strong></div>
              <div><span style="color:#6b7280">Reports</span>
                <strong style="float:right">${point.total_reports}</strong></div>
              <div><span style="color:#6b7280">Status</span>
                <strong style="float:right">${rateLabel}</strong></div>
            </div>
          </div>
        `, { maxWidth: 220 });

        marker.addTo(mapRef.current);
        markersRef.current.push(marker);
        bounds.push([lat, lng]);
      });

      if (bounds.length) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    });
  }, [data, mapReady]);

  // Determine what overlay to show on top of the always-present map container
  const showMap = !error && !loading && data?.length > 0;

  // When the map container goes from hidden → visible, Leaflet can't detect
  // the change and tiles may be mis-positioned. Force a re-layout.
  useEffect(() => {
    if (showMap && mapRef.current) {
      // Small delay so the browser has time to repaint visibility
      const t = setTimeout(() => mapRef.current?.invalidateSize(), 100);
      return () => clearTimeout(t);
    }
  }, [showMap]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Area Map
            </CardTitle>
            <CardDescription>Acceptance rate by pickup location</CardDescription>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" /> High ≥70%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" /> Med ≥40%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" /> Low
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-hidden rounded-b-xl relative">
        {/* Map container — always in the DOM so Leaflet can initialize */}
        <div
          ref={containerRef}
          className="h-[240px] sm:h-[320px] md:h-[380px] w-full"
          style={{ visibility: showMap ? "visible" : "hidden" }}
        />

        {/* Overlays rendered on top of the map container when needed */}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-destructive bg-card">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        ) : loading ? (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) : !data?.length ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-card">
            <MapPin className="h-8 w-8 opacity-30" />
            <p className="text-sm">No location data available</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}