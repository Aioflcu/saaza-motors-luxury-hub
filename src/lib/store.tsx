import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedVehicles } from "@/data/vehicles";
import type { Client, ClientNotification, SourcingRequest, Vehicle } from "./types";

const INVENTORY_KEY = "saaza.inventory.v1";
const REQUESTS_KEY = "saaza.requests.v1";
const ADMIN_KEY = "saaza.admin.v1";
const CLIENTS_KEY = "saaza.clients.v1";
const SESSION_KEY = "saaza.session.v1";
const NOTIFS_KEY = "saaza.notifications.v1";

export const ADMIN_USERNAME = "Saaza";
export const ADMIN_PASSWORD = "Saaza1234";

type AuthResult = { ok: boolean; error?: string };

type StoreValue = {
  vehicles: Vehicle[];
  requests: SourcingRequest[];
  isAdmin: boolean;
  hydrated: boolean;
  client: Client | null;
  notifications: ClientNotification[];
  unreadCount: number;
  favourites: Vehicle[];
  myRequests: SourcingRequest[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  addRequest: (request: Omit<SourcingRequest, "id" | "createdAt" | "status">) => void;
  setRequestStatus: (id: string, status: SourcingRequest["status"]) => void;
  removeRequest: (id: string) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  signUp: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => AuthResult;
  signIn: (email: string, password: string) => AuthResult;
  signOut: () => void;
  toggleFavourite: (vehicleId: string) => void;
  isFavourite: (vehicleId: string) => boolean;
  markNotificationsRead: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

function pushBrowserNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  try {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  } catch {
    /* notifications unavailable */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setVehicles(read<Vehicle[]>(INVENTORY_KEY, seedVehicles));
    setRequests(read<SourcingRequest[]>(REQUESTS_KEY, []));
    setIsAdmin(read<boolean>(ADMIN_KEY, false));
    setClients(read<Client[]>(CLIENTS_KEY, []));
    setSessionId(read<string | null>(SESSION_KEY, null));
    setNotifications(read<ClientNotification[]>(NOTIFS_KEY, []));
    setHydrated(true);
  }, []);

  // Live sync across tabs / windows.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === INVENTORY_KEY) setVehicles(read<Vehicle[]>(INVENTORY_KEY, seedVehicles));
      if (event.key === REQUESTS_KEY) setRequests(read<SourcingRequest[]>(REQUESTS_KEY, []));
      if (event.key === ADMIN_KEY) setIsAdmin(read<boolean>(ADMIN_KEY, false));
      if (event.key === CLIENTS_KEY) setClients(read<Client[]>(CLIENTS_KEY, []));
      if (event.key === SESSION_KEY) setSessionId(read<string | null>(SESSION_KEY, null));
      if (event.key === NOTIFS_KEY) {
        const next = read<ClientNotification[]>(NOTIFS_KEY, []);
        setNotifications((prev) => {
          const known = new Set(prev.map((n) => n.id));
          const fresh = next.find((n) => !known.has(n.id) && !n.read && n.clientId === sessionId);
          if (fresh) pushBrowserNotification(fresh.title, fresh.body);
          return next;
        });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [sessionId]);

  const persistVehicles = useCallback((next: Vehicle[]) => {
    setVehicles(next);
    write(INVENTORY_KEY, next);
  }, []);

  const persistRequests = useCallback((next: SourcingRequest[]) => {
    setRequests(next);
    write(REQUESTS_KEY, next);
  }, []);

  const persistClients = useCallback((next: Client[]) => {
    setClients(next);
    write(CLIENTS_KEY, next);
  }, []);

  const persistNotifications = useCallback((next: ClientNotification[]) => {
    setNotifications(next);
    write(NOTIFS_KEY, next);
  }, []);

  const client = useMemo(
    () => clients.find((c) => c.id === sessionId) ?? null,
    [clients, sessionId],
  );

  const myNotifications = useMemo(
    () => (client ? notifications.filter((n) => n.clientId === client.id) : []),
    [notifications, client],
  );

  const value = useMemo<StoreValue>(() => {
    const notify = (clientId: string, title: string, body: string) => {
      const entry: ClientNotification = {
        id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        clientId,
        title,
        body,
        createdAt: new Date().toISOString(),
        read: false,
      };
      persistNotifications([entry, ...read<ClientNotification[]>(NOTIFS_KEY, notifications)]);
      if (clientId === sessionId) pushBrowserNotification(title, body);
    };

    return {
      vehicles,
      requests,
      isAdmin,
      hydrated,
      client,
      notifications: myNotifications,
      unreadCount: myNotifications.filter((n) => !n.read).length,
      favourites: client
        ? vehicles.filter((v) => client.favourites.includes(v.id))
        : [],
      myRequests: client
        ? requests.filter(
            (r) =>
              r.clientId === client.id ||
              r.email.trim().toLowerCase() === client.email.toLowerCase(),
          )
        : [],
      addVehicle: (vehicle) => persistVehicles([vehicle, ...vehicles]),
      updateVehicle: (vehicle) =>
        persistVehicles(vehicles.map((v) => (v.id === vehicle.id ? vehicle : v))),
      removeVehicle: (id) => {
        persistVehicles(vehicles.filter((v) => v.id !== id));
        persistClients(
          clients.map((c) => ({ ...c, favourites: c.favourites.filter((f) => f !== id) })),
        );
      },
      addRequest: (request) =>
        persistRequests([
          {
            ...request,
            id: `req-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: "New",
            ...(sessionId ? { clientId: sessionId } : {}),
          },
          ...requests,
        ]),
      setRequestStatus: (id, status) => {
        const target = requests.find((r) => r.id === id);
        persistRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
        if (target) {
          const owner =
            target.clientId ??
            clients.find(
              (c) => c.email.toLowerCase() === target.email.trim().toLowerCase(),
            )?.id;
          if (owner && target.status !== status) {
            notify(
              owner,
              `Request update — ${target.makeModel}`,
              status === "In progress"
                ? "Our sourcing team is now working on your request."
                : status === "Closed"
                  ? "Your sourcing request has been closed. Contact us for details."
                  : "Your sourcing request was reopened as new.",
            );
          }
        }
      },
      removeRequest: (id) => persistRequests(requests.filter((r) => r.id !== id)),
      login: (username, password) => {
        const ok =
          username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
          password === ADMIN_PASSWORD;
        if (ok) {
          setIsAdmin(true);
          write(ADMIN_KEY, true);
        }
        return ok;
      },
      logout: () => {
        setIsAdmin(false);
        write(ADMIN_KEY, false);
      },
      signUp: ({ name, email, phone, password }) => {
        const clean = email.trim().toLowerCase();
        if (!name.trim()) return { ok: false, error: "Please enter your name." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean))
          return { ok: false, error: "Please enter a valid email address." };
        if (password.length < 6)
          return { ok: false, error: "Password must be at least 6 characters." };
        if (clients.some((c) => c.email.toLowerCase() === clean))
          return { ok: false, error: "An account with this email already exists." };

        const account: Client = {
          id: `cli-${Date.now()}`,
          name: name.trim(),
          email: clean,
          phone: phone.trim(),
          password,
          favourites: [],
          createdAt: new Date().toISOString(),
        };
        persistClients([account, ...clients]);
        setSessionId(account.id);
        write(SESSION_KEY, account.id);
        return { ok: true };
      },
      signIn: (email, password) => {
        const clean = email.trim().toLowerCase();
        const found = clients.find((c) => c.email.toLowerCase() === clean);
        if (!found || found.password !== password)
          return { ok: false, error: "Invalid email or password." };
        setSessionId(found.id);
        write(SESSION_KEY, found.id);
        return { ok: true };
      },
      signOut: () => {
        setSessionId(null);
        write(SESSION_KEY, null);
      },
      toggleFavourite: (vehicleId) => {
        if (!client) return;
        const favourites = client.favourites.includes(vehicleId)
          ? client.favourites.filter((f) => f !== vehicleId)
          : [vehicleId, ...client.favourites];
        persistClients(clients.map((c) => (c.id === client.id ? { ...c, favourites } : c)));
      },
      isFavourite: (vehicleId) => Boolean(client?.favourites.includes(vehicleId)),
      markNotificationsRead: () => {
        if (!client) return;
        persistNotifications(
          notifications.map((n) => (n.clientId === client.id ? { ...n, read: true } : n)),
        );
      },
    };
  }, [
    vehicles,
    requests,
    isAdmin,
    hydrated,
    clients,
    client,
    sessionId,
    notifications,
    myNotifications,
    persistVehicles,
    persistRequests,
    persistClients,
    persistNotifications,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const formatPrice = (value: number) =>
  `$${Math.round(value).toLocaleString("en-US")}`;

export const formatMiles = (value: number) => `${value.toLocaleString("en-US")} mi`;
