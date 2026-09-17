import { useState } from "react";
import { detailShots } from "@/data/images";
import { useStore } from "@/lib/store";
import type { Vehicle, VehicleImage } from "@/lib/types";

const blank = (): Vehicle => ({
  id: `veh-${Date.now()}`,
  make: "",
  model: "",
  trim: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  bodyType: "SUV",
  horsepower: 0,
  engine: "",
  transmission: "",
  drivetrain: "AWD",
  zeroToSixty: "",
  exteriorColor: "",
  interiorColor: "",
  fuel: "Petrol",
  status: "In stock",
  featured: false,
  description: "",
  features: [],
  images: [],
});

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export function VehicleForm({
  vehicle,
  onDone,
}: {
  vehicle?: Vehicle;
  onDone: () => void;
}) {
  const { addVehicle, updateVehicle } = useStore();
  const [draft, setDraft] = useState<Vehicle>(vehicle ?? blank());
  const [featureText, setFeatureText] = useState((vehicle?.features ?? []).join(", "));
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const set = <K extends keyof Vehicle>(key: K, value: Vehicle[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const addImages = (images: VehicleImage[]) =>
    setDraft((prev) => ({ ...prev, images: [...prev.images, ...images] }));

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const next = await Promise.all(
        Array.from(files).map(async (file) => ({
          url: await readFile(file),
          label: file.name.replace(/\.[^.]+$/, ""),
        })),
      );
      addImages(next);
    } catch {
      setError("Those photos couldn't be read. Try smaller files.");
    }
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.make.trim() || !draft.model.trim() || draft.images.length === 0) {
      setError("Make, model and at least one photo are required.");
      return;
    }
    const payload: Vehicle = {
      ...draft,
      features: featureText
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };
    if (vehicle) updateVehicle(payload);
    else addVehicle(payload);
    onDone();
  };

  return (
    <form onSubmit={save} className="space-y-4 rounded-[16px] bg-panel p-4">
      <p className="font-serif text-xl font-semibold">
        {vehicle ? "Edit vehicle" : "Add vehicle"}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Text label="Make" value={draft.make} onChange={(v) => set("make", v)} />
        <Text label="Model" value={draft.model} onChange={(v) => set("model", v)} />
        <Text label="Trim" value={draft.trim} onChange={(v) => set("trim", v)} />
        <Num label="Year" value={draft.year} onChange={(v) => set("year", v)} />
        <Num label="Price (USD)" value={draft.price} onChange={(v) => set("price", v)} />
        <Num label="Mileage" value={draft.mileage} onChange={(v) => set("mileage", v)} />
        <Text label="Body type" value={draft.bodyType} onChange={(v) => set("bodyType", v)} />
        <Num
          label="Horsepower"
          value={draft.horsepower}
          onChange={(v) => set("horsepower", v)}
        />
        <Text label="Engine" value={draft.engine} onChange={(v) => set("engine", v)} />
        <Text
          label="Transmission"
          value={draft.transmission}
          onChange={(v) => set("transmission", v)}
        />
        <Text
          label="Drivetrain"
          value={draft.drivetrain}
          onChange={(v) => set("drivetrain", v)}
        />
        <Text label="0–60 mph" value={draft.zeroToSixty} onChange={(v) => set("zeroToSixty", v)} />
        <Text
          label="Exterior colour"
          value={draft.exteriorColor}
          onChange={(v) => set("exteriorColor", v)}
        />
        <Text
          label="Interior colour"
          value={draft.interiorColor}
          onChange={(v) => set("interiorColor", v)}
        />
        <Text label="Fuel" value={draft.fuel} onChange={(v) => set("fuel", v)} />
        <div>
          <label className="field-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={draft.status}
            onChange={(e) => set("status", e.target.value as Vehicle["status"])}
            className="field"
          >
            {["In stock", "In transit", "Sold"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="accent-[var(--gold)]"
        />
        Feature on the home page
      </label>

      <div>
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
          className="field"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="features">
          Features (comma separated)
        </label>
        <input
          id="features"
          value={featureText}
          onChange={(e) => setFeatureText(e.target.value)}
          className="field"
        />
      </div>

      <div className="rounded-[12px] bg-ink p-3">
        <p className="text-sm font-semibold">Gallery ({draft.images.length} photos)</p>
        <p className="mt-1 text-[11px] text-dim">
          Add 10 or more: exterior angles, interior, dashboard, engine bay, wheels.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs">
            Upload photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onFiles(e.target.files)}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={() => addImages(detailShots)}
            className="rounded-full border border-line px-3 py-1.5 text-xs"
          >
            Add 10 stock detail shots
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL"
            className="field"
          />
          <button
            type="button"
            onClick={() => {
              if (!imageUrl.trim()) return;
              addImages([{ url: imageUrl.trim(), label: "Photo" }]);
              setImageUrl("");
            }}
            className="shrink-0 rounded-[10px] bg-raise px-3 text-xs"
          >
            Add
          </button>
        </div>

        {draft.images.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {draft.images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="relative">
                <img
                  src={image.url}
                  alt={image.label}
                  className="size-16 rounded-[10px] object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove photo ${index + 1}`}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink text-xs text-destructive ring-1 ring-line"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink"
        >
          {vehicle ? "Save changes" : "Publish vehicle"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-line px-5 py-2.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field" />
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="field"
      />
    </div>
  );
}
