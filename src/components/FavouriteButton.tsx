import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export function FavouriteButton({
  vehicleId,
  className = "",
  withLabel = false,
}: {
  vehicleId: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { client, isFavourite, toggleFavourite } = useStore();
  const navigate = useNavigate();
  const active = isFavourite(vehicleId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favourites" : "Save to favourites"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!client) {
          void navigate({ to: "/account" });
          return;
        }
        toggleFavourite(vehicleId);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-3 py-1.5 text-xs backdrop-blur transition-colors ${
        active ? "text-gold" : "text-dim"
      } ${className}`}
    >
      <span aria-hidden className="text-sm leading-none">
        {active ? "♥" : "♡"}
      </span>
      {withLabel ? (active ? "Saved" : "Save") : null}
    </button>
  );
}
