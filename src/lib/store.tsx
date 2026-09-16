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
import type { SourcingRequest, Vehicle } from "./types";

const INVENTORY_KEY = "saaza.inventory.v1";
const REQUESTS_KEY = "saaza.requests.v1";
const ADMIN_KEY = "saaza.admin.v1";

export const ADMIN_USERNAME = "Saaza";
export const ADMIN_PASSWORD = "Saaza1234";

type StoreValue = {
  vehicles: Vehicle[];
  requests: SourcingRequest[];
  isAdmin: boolean;
  hydrated: boolean;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  addRequest: (request: Omit<SourcingRequest, "id" | "createdAt" | "status">) => void;
  setRequestStatus: (id: string, status: SourcingRequest["status"]) => void;
  removeRequest: (id: string) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setVehicles(read<Vehicle[]>(INVENTORY_KEY, seedVehicles));
    setRequests(read<SourcingRequest[]>(REQUESTS_KEY, []));
    setIsAdmin(read<boolean>(ADMIN_KEY, false));
    setHydrated(true);
  }, []);

  // Live sync across tabs / windows.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === INVENTORY_KEY) setVehicles(read<Vehicle[]>(INVENTORY_KEY, seedVehicles));
      if (event.key === REQUESTS_KEY) setRequests(read<SourcingRequest[]>(REQUESTS_KEY, []));
      if (event.key === ADMIN_KEY) setIsAdmin(read<boolean>(ADMIN_KEY, false));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persistVehicles = useCallback((next: Vehicle[]) => {
    setVehicles(next);
    write(INVENTORY_KEY, next);
  }, []);

  const persistRequests = useCallback((next: SourcingRequest[]) => {
    setRequests(next);
    write(REQUESTS_KEY, next);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      vehicles,
      requests,
      isAdmin,
      hydrated,
      addVehicle: (vehicle) => persistVehicles([vehicle, ...vehicles]),
      updateVehicle: (vehicle) =>
        persistVehicles(vehicles.map((v) => (v.id === vehicle.id ? vehicle : v))),
      removeVehicle: (id) => persistVehicles(vehicles.filter((v) => v.id !== id)),
      addRequest: (request) =>
        persistRequests([
          {
            ...request,
            id: `req-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: "New",
          },
          ...requests,
        ]),
      setRequestStatus: (id, status) =>
        persistRequests(requests.map((r) => (r.id === id ? { ...r, status } : r))),
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
    }),
    [vehicles, requests, isAdmin, hydrated, persistVehicles, persistRequests],
  );

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
