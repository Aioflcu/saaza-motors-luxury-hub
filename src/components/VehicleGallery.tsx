import { useState } from "react";
import type { VehicleImage } from "@/lib/types";

export function VehicleGallery({ images, badge }: { images: VehicleImage[]; badge: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div className="overflow-hidden rounded-[18px] bg-panel ring-1 ring-line/40">
      <div className="relative">
        <img
          key={current.url + active}
          src={current.url}
          alt={current.label}
          className="fadein aspect-[16/11] w-full object-cover"
        />
        <div className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-gold">
          {badge}
        </div>
        <div className="absolute right-3 bottom-3 rounded-full bg-ink/80 px-3 py-1 text-xs text-dim">
          {current.label} · {active + 1} / {images.length}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3">
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={image.label}
            className={
              index === active
                ? "size-16 shrink-0 overflow-hidden rounded-[10px] outline-2 -outline-offset-2 outline-gold"
                : "size-16 shrink-0 overflow-hidden rounded-[10px] outline-1 -outline-offset-1 outline-line"
            }
          >
            <img
              src={image.url}
              alt={image.label}
              loading="lazy"
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
