import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VehicleGallery } from "@/components/VehicleGallery";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import { FavouriteButton } from "@/components/FavouriteButton";
import { SALES_EMAIL, SALES_WHATSAPP } from "@/lib/contact";
import { formatMiles, formatPrice, useStore } from "@/lib/store";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  head: () => ({
    meta: [
      { title: "Vehicle details — Saaza Motors" },
      {
        name: "description",
        content:
          "Full specifications, high-resolution gallery and financing estimate for this Saaza Motors import.",
      },
      { property: "og:title", content: "Vehicle details — Saaza Motors" },
      {
        property: "og:description",
        content: "Specifications, gallery and financing estimate for this Saaza Motors import.",
      },
    ],
  }),
  component: VehicleDetail,
});

function VehicleDetail() {
  const { vehicleId } = Route.useParams();
  const { vehicles, hydrated } = useStore();
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-sm text-dim">
            {hydrated ? "This vehicle is no longer listed." : "Loading vehicle…"}
          </p>
          <Link to="/inventory" className="mt-4 inline-block text-sm text-gold">
            Back to inventory
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
  const message = encodeURIComponent(
    `Hello Saaza Motors, I'm interested in the ${title} listed at ${formatPrice(vehicle.price)}.`,
  );

  const specs: [string, string][] = [
    ["Price", formatPrice(vehicle.price)],
    ["Mileage", formatMiles(vehicle.mileage)],
    ["Engine", vehicle.engine],
    ["Horsepower", `${vehicle.horsepower} hp`],
    ["0–60 mph", vehicle.zeroToSixty],
    ["Transmission", vehicle.transmission],
    ["Drivetrain", vehicle.drivetrain],
    ["Body type", vehicle.bodyType],
    ["Fuel", vehicle.fuel],
    ["Exterior", vehicle.exteriorColor],
    ["Interior", vehicle.interiorColor],
    ["Status", vehicle.status],
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-4 pb-4">
        <Link to="/inventory" className="text-xs text-dim">
          ← Back to inventory
        </Link>

        <div className="mt-3 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <VehicleGallery images={vehicle.images} badge={vehicle.status} />
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="font-serif text-3xl leading-tight font-semibold">{title}</h1>
              <p className="mt-1 text-2xl font-semibold text-gold">
                {formatPrice(vehicle.price)}
              </p>
              <p className="mt-2 text-sm text-dim">{vehicle.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${SALES_WHATSAPP}?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-ink"
              >
                Enquire on WhatsApp
              </a>
              <a
                href={`mailto:${SALES_EMAIL}?subject=${encodeURIComponent(`Enquiry: ${title}`)}&body=${message}`}
                className="rounded-full border border-line px-4 py-2.5 text-sm text-ivory"
              >
                Email sales
              </a>
              <FavouriteButton vehicleId={vehicle.id} withLabel className="px-4 py-2.5 text-sm" />
            </div>

            <FinanceCalculator price={vehicle.price} />
          </div>
        </div>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">Specifications</h2>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[10px] bg-panel px-3 py-2.5 text-sm"
              >
                <dt className="text-xs text-dim">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">Features</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {vehicle.features.map((feature) => (
              <li
                key={feature}
                className="rounded-full bg-raise px-3 py-1.5 text-xs text-ivory"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
