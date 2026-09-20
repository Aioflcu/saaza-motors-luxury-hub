import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export function SiteHeader() {
  const { isAdmin, client, unreadCount } = useStore();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-gold font-serif text-lg leading-none font-bold text-ink">
            S
          </span>
          <span className="font-serif text-xl font-semibold tracking-wide">
            Saaza <span className="text-gold">Motors</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/inventory"
            className="hidden text-xs tracking-wide text-dim sm:block"
            activeProps={{ className: "text-gold" }}
          >
            Inventory
          </Link>
          <Link
            to="/import"
            className="hidden text-xs tracking-wide text-dim sm:block"
            activeProps={{ className: "text-gold" }}
          >
            Custom Import
          </Link>
          <Link
            to="/account"
            className="relative flex items-center gap-1.5 text-xs tracking-wide text-dim"
            activeProps={{ className: "text-gold" }}
          >
            {client ? client.name.split(" ")[0] : "Sign in"}
            {unreadCount > 0 ? (
              <span className="grid size-4 place-items-center rounded-full bg-gold text-[10px] font-semibold text-ink">
                {unreadCount}
              </span>
            ) : null}
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-dim"
          >
            <span className="size-1.5 rounded-full bg-gold" />
            {isAdmin ? "Admin Dashboard" : "Admin Portal"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
