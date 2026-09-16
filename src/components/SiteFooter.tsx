import { SALES_EMAIL, SALES_PHONE_DISPLAY } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-line px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-semibold">
            Saaza <span className="text-gold">Motors</span>
          </span>
          <span className="text-xs text-dim">Licensed Import · Est. 2014</span>
        </div>
        <p className="mt-2 text-xs text-dim">
          Showroom + Inventory · Financing · Custom Sourcing · {SALES_PHONE_DISPLAY} ·{" "}
          {SALES_EMAIL}
        </p>
      </div>
    </footer>
  );
}
