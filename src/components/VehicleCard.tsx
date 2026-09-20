import { Link } from "@tanstack/react-router";
import { FavouriteButton } from "@/components/FavouriteButton";
import { formatMiles, formatPrice } from "@/lib/store";
import type { Vehicle } from "@/lib/types";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      to="/vehicles/$vehicleId"
      params={{ vehicleId: vehicle.id }}
      className="relative block overflow-hidden rounded-[14px] bg-panel ring-1 ring-line/40"
    >
      <img
        src={vehicle.images[0]?.url}
        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        loading="lazy"
        className="aspect-[16/9] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      />
      <FavouriteButton vehicleId={vehicle.id} className="absolute top-3 right-3" />
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="font-semibold whitespace-nowrap text-gold">
            {formatPrice(vehicle.price)}
          </span>
        </div>
        <p className="mt-1 text-xs text-dim">
          {vehicle.year} · {formatMiles(vehicle.mileage)} · {vehicle.horsepower} hp ·{" "}
          {vehicle.bodyType}
        </p>
      </div>
    </Link>
  );
}
