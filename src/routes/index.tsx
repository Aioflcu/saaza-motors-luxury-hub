import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VehicleCard } from "@/components/VehicleCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saaza Motors — Luxury Vehicle Imports & Sourcing" },
      {
        name: "description",
        content:
          "Hand-sourced luxury cars and SUVs, inspected, imported and delivered. Browse live inventory or request a custom import.",
      },
      { property: "og:title", content: "Saaza Motors — Luxury Vehicle Imports & Sourcing" },
      {
        property: "og:description",
        content: "Hand-sourced luxury cars and SUVs, inspected, imported and delivered.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { vehicles } = useStore();
  const featured = vehicles.filter((v) => v.featured).slice(0, 2);
  const latest = vehicles.slice(0, 4);
  const hero = featured[0] ?? vehicles[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pb-4">
        <section className="rise pt-6">
          <p className="text-[11px] tracking-[0.25em] text-dim uppercase">
            Licensed import · Worldwide sourcing
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight font-semibold sm:text-5xl">
            Exceptional cars, <span className="text-gold">sourced with intent.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-dim">
            Saaza Motors imports, inspects and delivers luxury vehicles to order. Browse the
            live showroom or tell us exactly what to find.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/inventory"
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink"
            >
              View inventory
            </Link>
            <Link
              to="/import"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-ivory"
            >
              Request an import
            </Link>
          </div>
        </section>

        {hero ? (
          <Link
            to="/vehicles/$vehicleId"
            params={{ vehicleId: hero.id }}
            className="rise-2 mt-7 block overflow-hidden rounded-[18px] ring-1 ring-line/40"
          >
            <img
              src={hero.images[0]?.url}
              alt={`${hero.year} ${hero.make} ${hero.model}`}
              className="aspect-[16/10] w-full object-cover sm:aspect-[21/9]"
            />
          </Link>
        ) : null}

        <section className="rise-3 mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-semibold">Featured</h2>
            <Link to="/inventory" className="text-xs text-gold">
              See all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(featured.length ? featured : latest).map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            ["Sourced", "We locate the exact specification you want, anywhere in the world."],
            ["Inspected", "Independent inspection and history checks before a cent moves."],
            ["Delivered", "Shipping, customs and registration handled end to end."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[14px] bg-panel p-4">
              <p className="font-serif text-xl font-semibold text-gold">{title}</p>
              <p className="mt-1 text-xs text-dim">{body}</p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
