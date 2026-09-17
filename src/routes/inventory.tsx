import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VehicleCard } from "@/components/VehicleCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Saaza Motors" },
      {
        name: "description",
        content:
          "Browse live Saaza Motors inventory: luxury SUVs, coupes and sedans with full specifications and photo galleries.",
      },
      { property: "og:title", content: "Inventory — Saaza Motors" },
      {
        property: "og:description",
        content: "Live luxury vehicle inventory with full specifications and photo galleries.",
      },
    ],
  }),
  component: InventoryPage,
});

const SORTS = ["Newest", "Price: low", "Price: high", "Lowest mileage"] as const;

function InventoryPage() {
  const { vehicles } = useStore();
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("All");
  const [body, setBody] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Newest");

  const makes = useMemo(
    () => ["All", ...Array.from(new Set(vehicles.map((v) => v.make))).sort()],
    [vehicles],
  );
  const bodies = useMemo(
    () => ["All", ...Array.from(new Set(vehicles.map((v) => v.bodyType))).sort()],
    [vehicles],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = vehicles.filter((v) => {
      const haystack = `${v.year} ${v.make} ${v.model} ${v.trim} ${v.bodyType}`.toLowerCase();
      return (
        (!q || haystack.includes(q)) &&
        (make === "All" || v.make === make) &&
        (body === "All" || v.bodyType === body) &&
        (status === "All" || v.status === status)
      );
    });

    return [...list].sort((a, b) => {
      if (sort === "Price: low") return a.price - b.price;
      if (sort === "Price: high") return b.price - a.price;
      if (sort === "Lowest mileage") return a.mileage - b.mileage;
      return b.year - a.year;
    });
  }, [vehicles, query, make, body, status, sort]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-4">
        <h1 className="font-serif text-3xl font-semibold">Inventory</h1>
        <p className="mt-1 text-sm text-dim">
          {results.length} of {vehicles.length} vehicles
        </p>

        <div className="mt-4 space-y-3 rounded-[14px] bg-panel p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make, model, trim…"
            aria-label="Search inventory"
            className="field"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              aria-label="Filter by make"
              className="field"
            >
              {makes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-label="Filter by body type"
              className="field"
            >
              {bodies.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
              className="field"
            >
              {["All", "In stock", "In transit", "Sold"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
              aria-label="Sort results"
              className="field"
            >
              {SORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="mt-8 text-center text-sm text-dim">
            No vehicles match those filters yet.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {results.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
