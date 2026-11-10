// Ayudas compartidas para textos traducibles de productores y catálogo.
// (Este archivo NO está dentro de las carpetas de idioma, así que i18n no lo carga como traducciones.)

export type TFn = (key: string, opts?: Record<string, unknown>) => string;

/** Cambia la abreviatura "msnm" / "m.s.n.m" por la del idioma activo (masl, m ü. M., m n. m.). */
export const fmtAlt = (text: string, t: TFn): string =>
  text.replace(/m\.s\.n\.m|msnm/g, t('unit_masl'));

/** Devuelve las primeras `n` oraciones de un texto, sin el punto final (para el popup del mapa). */
export const firstSentences = (text: string, n = 2): string => {
  const parts = text.match(/[^.!?]+[.!?]+["»”“]?\s*/g) ?? [text];
  return parts.slice(0, n).join('').trim().replace(/[.!?]+$/, '');
};
