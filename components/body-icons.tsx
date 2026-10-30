import type { SVGProps } from "react";

// Íconos por tipo de auto: siluetas sólidas de perfil (como en los configuradores de las marcas premium),
// con las ventanas recortadas y llantas con rin. Todos en el mismo lienzo de 120×48 y mirando a la derecha.
// El único color extra es el escudo rojo de «Blindado».

type P = SVGProps<SVGSVGElement>;

// Arcos de las llantas y el piso del auto
const ARCHES = (y: number, r = 9, a = 28, b = 92) =>
  `L${b + r} ${y}A${r} ${r} 0 0 0 ${b - r} ${y}L${a + r} ${y}A${r} ${r} 0 0 0 ${a - r} ${y}Z`;

function Wheels({ y = 38, a = 28, b = 92, r = 6.6 }: { y?: number; a?: number; b?: number; r?: number }) {
  return (
    <>
      {[a, b].map((x) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r - 1.5} fill="none" stroke="currentColor" strokeWidth={3} />
          <circle cx={x} cy={y} r={1.7} />
        </g>
      ))}
    </>
  );
}

// Carrocería (relleno) con ventanas recortadas
const Body = ({ d }: { d: string }) => <path d={d} fillRule="evenodd" />;

const SEDAN =
  "M10 38L9 31Q9 27 14 26.5L28 25.5L40 15.5Q44 14 52 14L68 14Q74 14 78 17L88 24L104 26Q110 27 111 31L111 38" +
  ARCHES(38) +
  "M43 23.5L47 17.6Q49 16.6 52 16.6L58 16.6L58 23.5ZM61 23.5L61 16.6L67 16.6Q71.5 16.6 74.5 18.9L80.5 23.5Z";

const COUPE =
  "M12 38L11 31Q11 27.5 16 27L32 25.5L44 16Q48 14.5 55 14.5L66 14.5Q72 14.5 76 17.5L87 24.5L104 26.5Q110 27.5 110.5 31.5L110.5 38" +
  ARCHES(38) +
  "M47 23.5L51 18Q53 17 56 17L68 17Q71.5 17 74 19L80 23.5Z";

const SPORT =
  "M10 37L9.5 31.5Q10 28 16 27L30 24.5Q41 15.5 55 14.8Q66 14.5 74 19L86 25.5L104 28Q111 29 111.5 33L111.5 37" +
  ARCHES(37) +
  "M38 24Q46 18 56 17.3L60 17.3L60 24ZM63 24L63 17.4Q68 17.7 72.5 20.2L78.5 24Z";

const CONVERTIBLE =
  "M10 38L9 31Q9 27 14 26.5L40 25L66 24.5L74 16.5L76.5 16.5L71.5 24.5L88 24.5L104 26Q110 27 111 31L111 38" + ARCHES(38);

const HATCH =
  "M14 38L13 30Q13 24 17 21L27 14.5Q30 13 34 13L64 13Q70 13 74 16L84 24L100 26Q106 27 107 31L107 38" +
  ARCHES(38, 9, 30, 88) +
  "M24 22.5L29 17Q31 15.8 34 15.8L45 15.8L45 22.5ZM48 22.5L48 15.8L63 15.8Q68 15.8 71 18L76.5 22.5Z";

const SUV_PATH =
  "M10 38L9.5 28Q9.5 24 11 21L13.6 14.6Q14.8 12.2 18.4 12.4L70.5 12Q74.4 12 77 14.6L86 23.4L104 25.4Q110 26.4 111 30.4L111 38" +
  ARCHES(38) +
  "M16.2 23L18.2 16.4Q18.8 15.2 20.2 15.2L32 15L32 23ZM35 23L35 15L52 15L52 23ZM55 23L55 15L70.4 15Q73 15 74.8 16.8L80.6 23Z";

const PICKUP =
  "M10 38L9.5 24L46 24L46 23L48.5 13Q49 11.5 51.5 11.5L72 11.5Q75 11.5 78 14.5L86 22.5L105 24.5Q111 25.5 111 30L111 38" +
  ARCHES(38) +
  "M51.5 21L52.5 14.5L62 14.5L62 21ZM65 21L65 14.5L72 14.5Q74.5 14.5 76.6 16.6L81 21ZM13 27L44 27L44 28.5L13 28.5Z";

const VAN =
  "M8 38L8 14Q8 10 12 10L80 10Q84 10 87 13L96 23L108 25Q112 26 112 30L112 38" +
  ARCHES(38) +
  "M14 22L14 14L32 14L32 22ZM35 22L35 14L55 14L55 22ZM58 22L58 14L79.5 14Q82.5 14 84.6 16.2L90 22Z";

function Shape({ type }: { type: string }) {
  switch (type) {
    case "Sedán":
      return <Body d={SEDAN} />;
    case "Coupé":
      return <Body d={COUPE} />;
    case "Deportivo":
      return (
        <>
          <Body d={SPORT} />
          <Wheels y={37} />
        </>
      );
    case "Convertible":
      return <Body d={CONVERTIBLE} />;
    case "Hatchback":
      return (
        <>
          <Body d={HATCH} />
          <Wheels a={30} b={88} />
        </>
      );
    case "SUV":
      return <Body d={SUV_PATH} />;
    case "Pickup":
      return <Body d={PICKUP} />;
    case "Van":
      return <Body d={VAN} />;
    case "Recreativo":
      // Todoterreno de dos plazas: tina baja, jaula antivuelco y llantas grandes
      return (
        <>
          <Body
            d={
              "M12 34L14 27L38 27L43 22L84 22L92 27L106 28Q110 29 110 33L110 34" +
              "L101 34A10 10 0 0 0 81 34L39 34A10 10 0 0 0 19 34Z"
            }
          />
          <path
            d="M43 22L47 8L80 8L85 22M63 8L63 22M47 8L40 22"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Wheels y={36} a={29} b={91} r={8.4} />
        </>
      );
    case "Blindado":
      return (
        <>
          <Body d={SUV_PATH} />
          <path d="M103 1.5L110.5 4.2L110.5 9.6Q110.5 14.8 103 17.6Q95.5 14.8 95.5 9.6L95.5 4.2Z" className="fill-brand" />
          <path d="M99.6 9.4L102.2 12L106.6 7" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    default:
      return <Body d={SEDAN} />;
  }
}

const OWN_WHEELS = new Set(["Deportivo", "Hatchback", "Recreativo"]);

export function BodyIcon({ type, ...props }: P & { type: string }) {
  return (
    <svg viewBox="0 0 120 48" fill="currentColor" aria-hidden="true" {...props}>
      <Shape type={type} />
      {!OWN_WHEELS.has(type) && <Wheels />}
    </svg>
  );
}

// «Todos»: un auto visto de frente (distinto de las siluetas de perfil de cada tipo)
export function AllCarsIcon(props: P) {
  return (
    <svg viewBox="0 0 120 48" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d={
          "M47 8L73 8Q76 8 77.2 10.6L81 19.5L84 20Q86 20.6 86 23L86 34Q86 36 84 36L36 36Q34 36 34 34L34 23Q34 20.6 36 20L39 19.5L42.8 10.6Q44 8 47 8Z" +
          "M47.5 11L72.5 11Q74 11 74.6 12.4L77.6 19L42.4 19L45.4 12.4Q46 11 47.5 11Z" +
          "M39 24L50 25.2L50 28.4L39 28.4ZM81 24L70 25.2L70 28.4L81 28.4ZM54.5 26.5L65.5 26.5L65.5 30.5L54.5 30.5Z"
        }
      />
      <path d="M37.5 36L47 36L47 41Q47 42.5 45.5 42.5L39 42.5Q37.5 42.5 37.5 41ZM73 36L82.5 36L82.5 41Q82.5 42.5 81 42.5L74.5 42.5Q73 42.5 73 41Z" />
      <path d="M31.5 17.6L37.6 18.6L37.2 21.4L31.5 21Z M88.5 17.6L82.4 18.6L82.8 21.4L88.5 21Z" />
    </svg>
  );
}

export const BODY_ICON_TYPES = [
  "Sedán",
  "Coupé",
  "Deportivo",
  "Convertible",
  "Hatchback",
  "SUV",
  "Pickup",
  "Van",
  "Recreativo",
  "Blindado",
];
