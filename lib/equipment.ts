// Equipamiento con lista fija (decisión del 28-oct). El dueño marca en el panel solo lo que tiene cada auto.
// Para agregar una opción nueva basta con sumarla aquí (clave en minúsculas, sin acentos).
import {
  Armchair,
  BatteryCharging,
  Camera,
  CircleDot,
  Flame,
  Gauge,
  KeyRound,
  Lightbulb,
  LifeBuoy,
  Map as MapIcon,
  PanelTop,
  Radar,
  Rotate3d,
  ScanEye,
  ShieldPlus,
  Smartphone,
  Snowflake,
  Speaker,
  Sun,
  SunDim,
  TabletSmartphone,
  ThermometerSnowflake,
  Users,
  Wind,
  type LucideIcon,
} from "lucide-react";

export const EQUIPMENT_GROUPS = ["Confort", "Tecnología", "Seguridad", "Exterior"] as const;
export type EquipmentGroup = (typeof EQUIPMENT_GROUPS)[number];

type Item = {
  key: string;
  label: string;
  group: EquipmentGroup;
  Icon: LucideIcon;
  /** Textos de «Lo que destaca» que dicen lo mismo (para no repetirlos en la ficha) */
  aliases?: string[];
};

export const EQUIPMENT: Item[] = [
  { key: "piel", label: "Asientos de piel", group: "Confort", Icon: Armchair, aliases: ["interior en piel", "interiores en piel", "asientos en piel"] },
  { key: "asientos-electricos", label: "Asientos eléctricos", group: "Confort", Icon: Armchair },
  { key: "asientos-calefaccion", label: "Asientos con calefacción", group: "Confort", Icon: Flame, aliases: ["asientos con calefaccion y ventilacion"] },
  { key: "asientos-ventilados", label: "Asientos ventilados", group: "Confort", Icon: Wind },
  { key: "quemacocos", label: "Quemacocos", group: "Confort", Icon: Sun },
  { key: "techo-panoramico", label: "Techo o quemacocos panorámico", group: "Confort", Icon: PanelTop, aliases: ["techo panoramico", "quemacocos panoramico"] },
  { key: "clima-automatico", label: "Clima automático", group: "Confort", Icon: ThermometerSnowflake, aliases: ["aire acondicionado automatico"] },
  { key: "aire-acondicionado", label: "Aire acondicionado", group: "Confort", Icon: Snowflake },
  { key: "tercera-fila", label: "Tercera fila de asientos", group: "Confort", Icon: Users },
  { key: "pantalla", label: "Pantalla táctil", group: "Tecnología", Icon: TabletSmartphone },
  { key: "carplay", label: "Apple CarPlay / Android Auto", group: "Tecnología", Icon: Smartphone, aliases: ["carplay / android auto", "carplay / android auto inalambrico"] },
  { key: "navegacion", label: "Navegación GPS", group: "Tecnología", Icon: MapIcon, aliases: ["navegacion"] },
  { key: "sonido-premium", label: "Sonido premium", group: "Tecnología", Icon: Speaker },
  { key: "cargador-inalambrico", label: "Cargador inalámbrico", group: "Tecnología", Icon: BatteryCharging },
  { key: "sin-llave", label: "Encendido sin llave", group: "Tecnología", Icon: KeyRound },
  { key: "camara-reversa", label: "Cámara de reversa", group: "Seguridad", Icon: Camera },
  { key: "camara-360", label: "Cámara 360°", group: "Seguridad", Icon: Rotate3d },
  { key: "sensores", label: "Sensores de estacionamiento", group: "Seguridad", Icon: Radar },
  { key: "punto-ciego", label: "Alerta de punto ciego", group: "Seguridad", Icon: ScanEye },
  { key: "control-crucero", label: "Control crucero", group: "Seguridad", Icon: Gauge },
  { key: "asistencias", label: "Asistencias de conducción", group: "Seguridad", Icon: LifeBuoy },
  { key: "rines-aluminio", label: "Rines de aluminio", group: "Exterior", Icon: CircleDot },
  { key: "faros-led", label: "Faros LED", group: "Exterior", Icon: Lightbulb },
  { key: "control-solar", label: "Control solar en cristales", group: "Exterior", Icon: SunDim, aliases: ["control solar"] },
  { key: "proteccion-pintura", label: "Protección de pintura (PPF o cerámico)", group: "Exterior", Icon: ShieldPlus, aliases: ["ppf en pintura", "ceramico en carroceria"] },
];

const BY_KEY = new Map(EQUIPMENT.map((e) => [e.key, e]));

export function isEquipmentKey(key: unknown): key is string {
  return typeof key === "string" && BY_KEY.has(key);
}

// Lo que tiene el auto, agrupado y en el orden de la lista
export function equipmentByGroup(keys: string[] = []) {
  const set = new Set(keys);
  return EQUIPMENT_GROUPS.map((group) => ({
    group,
    items: EQUIPMENT.filter((e) => e.group === group && set.has(e.key)),
  })).filter((g) => g.items.length > 0);
}

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// «Lo que destaca» sin repetir lo que ya aparece en el equipamiento marcado
export function featuresWithoutEquipment(features: string[], keys: string[] = []) {
  const said = new Set(
    keys.flatMap((k) => {
      const e = BY_KEY.get(k);
      return e ? [normalize(e.label), ...(e.aliases ?? [])] : [];
    }),
  );
  return features.filter((f) => !said.has(normalize(f)));
}

// ---------- Fotos por sección ----------

export const PHOTO_SECTIONS = ["exterior", "interior", "motor", "detalles"] as const;
export type PhotoSection = (typeof PHOTO_SECTIONS)[number];
export const PHOTO_SECTION_LABEL: Record<PhotoSection, string> = {
  exterior: "Exterior",
  interior: "Interior",
  motor: "Motor",
  detalles: "Detalles",
};

export function isPhotoSection(v: unknown): v is PhotoSection {
  return typeof v === "string" && (PHOTO_SECTIONS as readonly string[]).includes(v);
}

// Pestañas de fotos: «Todas» y cada sección con al menos una foto (índices dentro de images)
export function photoTabs(images: string[], sections: Record<string, PhotoSection> = {}) {
  const tabs = PHOTO_SECTIONS.map((s) => ({
    key: s as string,
    label: PHOTO_SECTION_LABEL[s],
    indexes: images.flatMap((src, i) => (sections[src] === s ? [i] : [])),
  })).filter((t) => t.indexes.length > 0);
  if (!tabs.length) return [];
  return [{ key: "todas", label: "Todas", indexes: images.map((_, i) => i) }, ...tabs];
}
