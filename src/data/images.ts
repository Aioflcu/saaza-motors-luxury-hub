import rangerover from "@/assets/car-rangerover.jpg";
import porsche911 from "@/assets/car-porsche911.jpg";
import g63 from "@/assets/car-g63.jpg";
import lx600 from "@/assets/car-lx600.jpg";
import bentley from "@/assets/car-bentley.jpg";
import landcruiser from "@/assets/car-landcruiser.jpg";
import interior from "@/assets/detail-interior.jpg";
import dashboard from "@/assets/detail-dashboard.jpg";
import engine from "@/assets/detail-engine.jpg";
import wheel from "@/assets/detail-wheel.jpg";
import rearseats from "@/assets/detail-rearseats.jpg";
import boot from "@/assets/detail-boot.jpg";
import headlight from "@/assets/detail-headlight.jpg";
import infotainment from "@/assets/detail-infotainment.jpg";
import rear from "@/assets/detail-rear.jpg";
import trim from "@/assets/detail-trim.jpg";

export const exteriors = { rangerover, porsche911, g63, lx600, bentley, landcruiser };

export const detailShots: { url: string; label: string }[] = [
  { url: interior, label: "Interior" },
  { url: dashboard, label: "Instrument cluster" },
  { url: engine, label: "Engine bay" },
  { url: wheel, label: "Wheels & brakes" },
  { url: rearseats, label: "Rear cabin" },
  { url: boot, label: "Luggage bay" },
  { url: headlight, label: "Headlight" },
  { url: infotainment, label: "Infotainment" },
  { url: rear, label: "Rear three-quarter" },
  { url: trim, label: "Trim detail" },
];
