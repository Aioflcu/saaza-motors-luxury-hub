import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VehicleCard } from "@/components/VehicleCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Saaza Motors" },
      {
        name: "description",
        content:
          "Sign in to save favourite vehicles, track your sourcing requests and receive status updates from Saaza Motors.",
      },
      { property: "og:title", content: "My Account — Saaza Motors" },
      {
        property: "og:description",
        content: "Saved vehicles, sourcing request tracking and updates in one place.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const {
    client,
    hydrated,
    favourites,
    myRequests,
    notifications,
    unreadCount,
    markNotificationsRead,
    signOut,
  } = useStore();

  useEffect(() => {
    if (client && unreadCount > 0) markNotificationsRead();
  }, [client, unreadCount, markNotificationsRead]);

  useEffect(() => {
    if (
      client &&
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      void Notification.requestPermission().catch(() => undefined);
    }
  }, [client]);

  if (!hydrated) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-dim">
          Loading your account…
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!client) return <AuthPanel />;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.25em] text-dim uppercase">My account</p>
            <h1 className="mt-1 font-serif text-3xl font-semibold">{client.name}</h1>
            <p className="text-sm text-dim">{client.email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-line px-4 py-2 text-xs text-dim"
          >
            Sign out
          </button>
        </div>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">Updates</h2>
          {notifications.length === 0 ? (
            <p className="mt-2 text-sm text-dim">
              No updates yet. We'll notify you when a sourcing request changes status.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {notifications.map((n) => (
                <li key={n.id} className="rounded-[12px] bg-panel p-3">
                  <p className="text-sm font-medium text-gold">{n.title}</p>
                  <p className="mt-1 text-xs text-dim">{n.body}</p>
                  <p className="mt-1 text-[11px] text-dim">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">Saved vehicles</h2>
          {favourites.length === 0 ? (
            <p className="mt-2 text-sm text-dim">
              Nothing saved yet.{" "}
              <Link to="/inventory" className="text-gold">
                Browse the showroom
              </Link>
              .
            </p>
          ) : (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {favourites.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">My sourcing requests</h2>
          {myRequests.length === 0 ? (
            <p className="mt-2 text-sm text-dim">
              No requests yet.{" "}
              <Link to="/import" className="text-gold">
                Request a custom import
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {myRequests.map((request) => (
                <li
                  key={request.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-panel p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{request.makeModel}</p>
                    <p className="text-xs text-dim">
                      {request.year || "Any year"} · {request.bodyType} ·{" "}
                      {request.budget || "Budget open"} ·{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] ${
                      request.status === "Closed"
                        ? "bg-raise text-dim"
                        : request.status === "In progress"
                          ? "bg-gold text-ink"
                          : "border border-line text-ivory"
                    }`}
                  >
                    {request.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function AuthPanel() {
  const { signIn, signUp } = useStore();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result =
      mode === "in" ? signIn(form.email, form.password) : signUp(form);
    setError(result.ok ? "" : (result.error ?? "Something went wrong."));
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 pt-10 pb-6">
        <h1 className="font-serif text-3xl font-semibold">
          {mode === "in" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-1 text-sm text-dim">
          Save favourites, track your sourcing requests and get status updates.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4 rounded-[16px] bg-panel p-4">
          {mode === "up" ? (
            <>
              <AuthField label="Full name" value={form.name} onChange={set("name")} />
              <AuthField
                label="Phone / WhatsApp"
                value={form.phone}
                onChange={set("phone")}
              />
            </>
          ) : null}
          <AuthField
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
          />
          <AuthField
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
          />

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink"
          >
            {mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setError("");
          }}
          className="mt-4 w-full text-center text-xs text-dim"
        >
          {mode === "in"
            ? "New here? Create a buyer account"
            : "Already have an account? Sign in"}
        </button>
      </main>
      <SiteFooter />
    </div>
  );
}

function AuthField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = `auth-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}
