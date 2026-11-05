import type { SVGProps } from "react";
import { CarIcon, CarProfileIcon, JeepIcon, MountainsIcon, ShieldCheckIcon, VanIcon } from "@phosphor-icons/react/dist/ssr";

// Íconos de cada tipo de auto (31-oct): Phosphor Icons (licencia MIT) en su versión a dos tonos, más una pickup
// dibujada con el mismo trazo porque Phosphor no tiene una. «Recreativos» usa montañas (todoterreno).

function Pickup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M112 112V72h40l30 40Z" fill="currentColor" opacity={0.2} stroke="none" />
      <circle cx={64} cy={176} r={24} fill="currentColor" opacity={0.2} stroke="none" />
      <circle cx={192} cy={176} r={24} fill="currentColor" opacity={0.2} stroke="none" />
      <path d="M40 176H24a8 8 0 0 1-8-8v-48a8 8 0 0 1 8-8h80V72a8 8 0 0 1 8-8h42.4a8 8 0 0 1 6.4 3.2L196 112h36a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8h-16" />
      <path d="M168 176H88" />
      <circle cx={64} cy={176} r={24} />
      <circle cx={192} cy={176} r={24} />
      <path d="M104 112h92" />
    </svg>
  );
}

export function VehicleIcon({ type, className }: { type: string; className?: string }) {
  const common = { className, weight: "duotone" as const, "aria-hidden": true };
  switch (type) {
    case "SUV":
      return <JeepIcon {...common} />;
    case "Deportivo":
    case "Coupé":
    case "Convertible":
    case "Sedán":
    case "Hatchback":
      return <CarProfileIcon {...common} />;
    case "Blindado":
      return <ShieldCheckIcon {...common} />;
    case "Pickup":
      return <Pickup className={className} />;
    case "Recreativo":
      return <MountainsIcon {...common} />;
    case "Van":
      return <VanIcon {...common} />;
    default:
      return <CarIcon {...common} />;
  }
}
