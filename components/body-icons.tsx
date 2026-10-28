import type { SVGProps } from "react";

// Íconos propios por tipo de auto: silueta de perfil en trazo fino (tinta) con detalles en el rojo de la
// marca (rines y líneas de velocidad). Todos usan el mismo lienzo de 64×32 para que se vean parejos.

type P = SVGProps<SVGSVGElement>;

const Wheels = ({ r = 4.6, a = 17, b = 47, y = 23.5 }: { r?: number; a?: number; b?: number; y?: number }) => (
  <>
    <circle cx={a} cy={y} r={r} />
    <circle cx={b} cy={y} r={r} />
    <circle cx={a} cy={y} r={1.4} className="fill-brand stroke-none" />
    <circle cx={b} cy={y} r={1.4} className="fill-brand stroke-none" />
  </>
);

// Línea de piso entre y fuera de las llantas
const Floor = ({ a = 17, b = 47, r = 4.6, from = 4, to = 60, y = 23.5 }) => (
  <path d={`M${from} ${y}h${a - r - 1.5 - from} M${a + r + 1.5} ${y}H${b - r - 1.5} M${b + r + 1.5} ${y}H${to}`} />
);

const SHAPES: Record<string, React.ReactNode> = {
  Sedán: (
    <>
      <path d="M4 23.5V18.6l5-2 9.5-.9 6.6-6.2h14.6l7.4 6.2 9.3 1.1 3.6 2.6v4.1" />
      <path d="M22.3 15.6l4.7-4.3h5.6v4.3zM35 11.3h4.4l5 4.3H35z" />
      <Floor />
      <Wheels />
    </>
  ),
  Coupé: (
    <>
      <path d="M4 23.5v-4.6l6.8-2.3 10.4-.9 7.7-5.4h9.8l9.6 5.9 8.6 1.3 3.1 2.8v3.2" />
      <path d="M25.2 15.4l4.6-3.2h7.6l4.9 3.2z" />
      <Floor />
      <Wheels />
    </>
  ),
  Deportivo: (
    <>
      <path d="M5 23.5v-3.8l7.2-2.5 11.4-1.2 7.9-4.6h8.4l10.4 5.5 8 1.4 2.7 2.6v2.6" />
      <path d="M27.4 15.6l4.5-2.7h7.6l5.3 2.7z" />
      <path d="M1 13.5h7M3 17h6.5M0 20.5h4.5" className="stroke-brand" />
      <Floor from={5} to={61} />
      <Wheels />
    </>
  ),
  Convertible: (
    <>
      <path d="M4 23.5v-4.7l6.8-2.2 12-.9h22.4l9.4 1.2 4.4 2.6v4" />
      <path d="M36.5 15.7l-3.6-5.2M22.8 15.7c1-2.6 2.6-3.6 4.7-3.6" />
      <Floor />
      <Wheels />
    </>
  ),
  Hatchback: (
    <>
      <path d="M4 23.5V13.8l4.6-4.9h27.9l8.1 6.3 10.2 1.5 4.2 2.7v4.1" />
      <path d="M10.6 14.4l2.8-3.4h9.8v3.4zM26.1 11h9.3l4.6 3.4H26.1z" />
      <Floor />
      <Wheels />
    </>
  ),
  SUV: (
    <>
      <path d="M4 23.5v-10l3.6-1.4 4.2-6.2h31.4l7.6 6.1 7.4 1.4 2.8 2.9v7.2" />
      <path d="M13.8 11.6l2.4-3.7h9.9v3.7zM28.4 7.9h9.8v3.7h-9.8zM40.5 7.9h2l4.6 3.7h-6.6z" />
      <path d="M4 16.8h56" className="opacity-40" />
      <Floor />
      <Wheels r={5} />
    </>
  ),
  Pickup: (
    <>
      <path d="M3 23.5v-9.8h27V6.4h13.3l7.5 6.3 8.2 1.6 2.4 2.7v6.5" />
      <path d="M32.6 12V8.6h9.6l4.4 3.4zM3 13.7l1.6-1.8h22.2" />
      <Floor from={3} to={61} />
      <Wheels r={5} a={16} b={48} />
    </>
  ),
  Van: (
    <>
      <path d="M4 23.5V6.6l2.5-1.8h37.2l8.8 7.4 6.2 1.6 1.3 2.7v7" />
      <path d="M9.2 7.9h11v5.3h-11zM23.3 7.9h11v5.3h-11zM37.4 7.9h5l6 5.3h-11z" />
      <Floor />
      <Wheels />
    </>
  ),
  Recreativo: (
    <>
      <path d="M6 22.8v-5.2l8.3-1.4h33.3l9.2 1.6 2.2 3v2" />
      <path d="M15.5 16.2l4.6-11.1h18.4l7.4 11.1M29.4 5.1v11.1M20.1 5.1l-2.8-1.9M38.5 5.1l2.3-1.9" />
      <Wheels r={5.6} a={15.5} b={48.5} y={23} />
    </>
  ),
  Blindado: (
    <>
      <path d="M4 23.5v-10l3.6-1.4 4.2-6.2h24.6" />
      <path d="M36.4 5.9h6.8l7.6 6.1 7.4 1.4 2.8 2.9v7.2" />
      <path d="M13.8 11.6l2.4-3.7h9.9v3.7z" />
      <path d="M4 16.8h56" className="opacity-40" />
      <path d="M43.6 1.8l6.4 2.5v5.1c0 4.2-2.7 6.9-6.4 8.3-3.7-1.4-6.4-4.1-6.4-8.3V4.3z" className="fill-brand/10 stroke-brand" />
      <path d="M41 9.6l1.9 1.9 3.6-3.8" className="stroke-brand" />
      <Floor />
      <Wheels r={5} />
    </>
  ),
};

export const BODY_ICON_TYPES = Object.keys(SHAPES);

export function BodyIcon({ type, ...props }: P & { type: string }) {
  const shape = SHAPES[type] ?? SHAPES.Sedán;
  return (
    <svg
      viewBox="0 0 64 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {shape}
    </svg>
  );
}

// «Todos»: tres siluetas pequeñas apiladas
export function AllCarsIcon(props: P) {
  return (
    <svg viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 13h16M8 19h22M8 25h12" />
      <path d="M36 25v-5.5l3-1.2 3-4.3h13.5l4.5 4.3 2 1.4V25" />
      <circle cx={43} cy={25.5} r={2.6} />
      <circle cx={55} cy={25.5} r={2.6} />
      <circle cx={43} cy={25.5} r={0.9} className="fill-brand stroke-none" />
      <circle cx={55} cy={25.5} r={0.9} className="fill-brand stroke-none" />
      <path d="M2 13h3M2 19h3M2 25h3" className="stroke-brand" />
    </svg>
  );
}
