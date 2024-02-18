export function lerp(s: number, e: number, t: number): number {
  return s + (e - s) * t;
}

export function qbezier(s: number, c: number, e: number, t: number): number {
  const a = lerp(s, c, t);
  const b = lerp(c, e, t);
  return lerp(a, b, t);
}

export function conic(
  s: number,
  c: number,
  e: number,
  w: number,
  t: number,
): number {
  const t2 = t + t;
  const tt = t * t;
  const ot = 1 - t;
  const otot = ot * ot;
  const t2otw = t2 * ot * w;
  const n = otot * s + t2otw * c + tt * e;
  const d = otot + t2otw + tt;
  return n / d;
}

export function cbezier(
  s: number,
  c1: number,
  c2: number,
  e: number,
  t: number,
): number {
  const a = lerp(s, c1, t);
  const b = lerp(c1, c2, t);
  const c = lerp(c2, e, t);
  const aa = lerp(a, b, t);
  const bb = lerp(b, c, t);
  return lerp(aa, bb, t);
}

export function dcbezier(
  s: number,
  c1: number,
  c2: number,
  e: number,
  t: number,
) {
  const ot = 1 - t;
  return 3 * (ot * ot) * (c1 - s) +
    6 * ot * t * (c2 - c1) +
    3 * t * t * (e - c2);
}
