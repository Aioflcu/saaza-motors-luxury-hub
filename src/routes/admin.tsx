import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { VehicleForm } from "@/components/VehicleForm";
import { formatPrice, useStore } from "@/lib/store";
import type { SourcingRequest, Vehicle } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Saaza Motors" },
      {
        name: "description",
        content:
          "Saaza Motors staff portal for managing live inventory, vehicle galleries and client sourcing requests.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Portal — Saaza Motors" },
      { property: "og:description", content: "Staff portal for inventory and requests." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, hydrated } = useStore();
  if (!hydrated) {
    return <div className="min-h-screen px-4 py-16 text-center text-sm text-dim">Loading…</div>;
  }
  return isAdmin ? <Dashboard /> : <AdminLogin />;
}

function AdminLogin() {
  const { login } = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!login(username, password)) setError("Invalid Admin Credentials");
        }}
        className="w-full max-w-sm rounded-[16px] bg-panel p-5"
      >
        <h1 className="font-serif text-2xl font-semibold">Admin Portal</h1>
        <p className="mt-1 text-xs text-dim">Staff access only.</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="field-label" htmlFor="admin-user">
              Username
            </label>
            <input
              id="admin-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-pass">
              Password
            </label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="field"
            />
          </div>
        </div>

        {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}

        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink"
        >
          Sign in
        </button>
        <Link to="/" className="mt-3 block text-center text-xs text-dim">
          Back to site
        </Link>
      </form>
    </div>
  );
}

function Dashboard() {
  const { vehicles, requests, removeVehicle, logout } = useStore();
  const [tab, setTab] = useState<"inventory" | "requests">("inventory");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="font-serif text-xl font-semibold">Admin Control Panel</p>
            <p className="text-[11px] text-dim">Saaza Motors</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-full border border-line px-3 py-1.5 text-xs">
              View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-ink"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-5 pb-6">
        <div className="flex gap-2">
          {(["inventory", "requests"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={
                tab === key
                  ? "rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink capitalize"
                  : "rounded-full border border-line px-4 py-2 text-xs text-dim capitalize"
              }
            >
              {key} ({key === "inventory" ? vehicles.length : requests.length})
            </button>
          ))}
        </div>

        {tab === "inventory" ? (
          <section className="mt-5">
            {creating || editing ? (
              <VehicleForm
                vehicle={editing ?? undefined}
                onDone={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="w-full rounded-[12px] border border-dashed border-line py-3 text-sm text-gold"
              >
                + Add vehicle
              </button>
            )}

            <div className="mt-4 space-y-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center gap-3 rounded-[12px] bg-panel p-3"
                >
                  <img
                    src={vehicle.images[0]?.url}
                    alt=""
                    className="size-16 shrink-0 rounded-[10px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-dim">
                      {formatPrice(vehicle.price)} · {vehicle.status} ·{" "}
                      {vehicle.images.length} photos
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreating(false);
                        setEditing(vehicle);
                      }}
                      className="rounded-full border border-line px-3 py-1.5 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove ${vehicle.make} ${vehicle.model}?`))
                          removeVehicle(vehicle.id);
                      }}
                      className="rounded-full border border-destructive/60 px-3 py-1.5 text-xs text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <RequestsPanel />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function RequestsPanel() {
  const { requests, setRequestStatus, removeRequest } = useStore();

  if (requests.length === 0) {
    return <p className="mt-8 text-center text-sm text-dim">No sourcing requests yet.</p>;
  }

  return (
    <div className="mt-5 space-y-3">
      {requests.map((request) => (
        <article key={request.id} className="rounded-[12px] bg-panel p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{request.makeModel}</p>
              <p className="text-xs text-dim">
                {request.name} · {request.email} · {request.phone || "no phone"}
              </p>
            </div>
            <span className="rounded-full bg-raise px-2.5 py-1 text-[11px] text-gold">
              {request.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-dim">
            {request.year || "any year"} · {request.bodyType} · {request.budget || "budget n/a"}
          </p>
          {request.notes ? <p className="mt-1 text-xs">{request.notes}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {(["New", "In progress", "Closed"] as SourcingRequest["status"][]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setRequestStatus(request.id, status)}
                className="rounded-full border border-line px-3 py-1.5 text-[11px]"
              >
                {status}
              </button>
            ))}
            <button
              type="button"
              onClick={() => removeRequest(request.id)}
              className="rounded-full border border-destructive/60 px-3 py-1.5 text-[11px] text-destructive"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
