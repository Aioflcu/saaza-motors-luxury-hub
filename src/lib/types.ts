export type VehicleImage = { url: string; label: string };

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  price: number;
  mileage: number;
  bodyType: string;
  horsepower: number;
  engine: string;
  transmission: string;
  drivetrain: string;
  zeroToSixty: string;
  exteriorColor: string;
  interiorColor: string;
  fuel: string;
  status: "In stock" | "In transit" | "Sold";
  featured: boolean;
  description: string;
  features: string[];
  images: VehicleImage[];
};

export type SourcingRequest = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  makeModel: string;
  year: string;
  budget: string;
  bodyType: string;
  notes: string;
  status: "New" | "In progress" | "Closed";
};
