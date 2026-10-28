// Ajustes que el dueño cambia en el panel (/admin/ajustes).

export type TrustStat = {
  value: number;
  /** p. ej. «+» o «< » */
  prefix?: string;
  /** p. ej. « min» */
  suffix?: string;
  label: string;
};

// Números de EJEMPLO para ver el diseño (decisión del dueño, 28-oct: «inventa y luego ponemos los reales»).
// Solo se muestran en desarrollo. En el sitio publicado la sección aparece cuando el dueño guarda los
// números reales en el panel.
export const EXAMPLE_STATS: TrustStat[] = [
  { prefix: "+", value: 500, label: "Autos entregados" },
  { value: 10, label: "Años de experiencia" },
  { prefix: "< ", value: 5, suffix: " min", label: "Tiempo de respuesta por WhatsApp" },
];
