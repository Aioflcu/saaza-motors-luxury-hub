import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SALES_EMAIL, SALES_WHATSAPP } from "@/lib/contact";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title: "Custom Vehicle Import — Saaza Motors" },
      {
        name: "description",
        content:
          "Tell Saaza Motors the exact vehicle you want. We source, inspect, import and deliver it to your door.",
      },
      { property: "og:title", content: "Custom Vehicle Import — Saaza Motors" },
      {
        property: "og:description",
        content: "Submit your specification and our sourcing team responds with options.",
      },
    ],
  }),
  component: ImportPortal,
});

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  makeModel: "",
  year: "",
  budget: "",
  bodyType: "SUV",
  notes: "",
};

function ImportPortal() {
  const { addRequest } = useStore();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const summary = [
    `New import request — Saaza Motors`,
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Vehicle: ${form.makeModel}`,
    `Year: ${form.year}`,
    `Budget: ${form.budget}`,
    `Body type: ${form.bodyType}`,
    `Notes: ${form.notes || "—"}`,
  ].join("\n");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.makeModel.trim()) {
      setError("Please add your name, email and the vehicle you want.");
      return;
    }
    setError("");
    addRequest(form);
    setSent(true);

    const encoded = encodeURIComponent(summary);
    window.open(`https://wa.me/${SALES_WHATSAPP}?text=${encoded}`, "_blank", "noopener");
    window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(
      `Import request — ${form.makeModel}`,
    )}&body=${encoded}`;
  };

  if (sent) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="font-serif text-3xl font-semibold text-gold">Request received</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-dim">
            Your specification has been logged and sent to our sales desk on WhatsApp and
            email. We normally respond within one business day.
          </p>
          <button
            type="button"
            onClick={() => {
              setForm(EMPTY);
              setSent(false);
            }}
            className="mt-5 rounded-full border border-line px-5 py-2.5 text-sm"
          >
            Submit another request
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 pt-6 pb-4">
        <h1 className="font-serif text-3xl font-semibold">Custom vehicle import</h1>
        <p className="mt-1 text-sm text-dim">
          Give us the specification and we'll source, inspect and deliver it.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4 rounded-[16px] bg-panel p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={set("name")} />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} />
            <Field label="Phone / WhatsApp" value={form.phone} onChange={set("phone")} />
            <Field
              label="Make & model"
              value={form.makeModel}
              onChange={set("makeModel")}
              placeholder="e.g. Mercedes-Benz GLE 450"
            />
            <Field label="Year" value={form.year} onChange={set("year")} placeholder="2023" />
            <Field
              label="Budget"
              value={form.budget}
              onChange={set("budget")}
              placeholder="$80,000 – $95,000"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="bodyType">
              Body type
            </label>
            <select
              id="bodyType"
              value={form.bodyType}
              onChange={(e) => set("bodyType")(e.target.value)}
              className="field"
            >
              {["SUV", "Sedan", "Coupe", "Convertible", "Pickup", "Van"].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Colour, trim, options, delivery city…"
              className="field"
            />
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink"
          >
            Send to sales
          </button>
          <p className="text-center text-[11px] text-dim">
            Submitting opens WhatsApp and your email client with the details pre-filled.
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}
