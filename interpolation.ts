export function lerp(s: number, e: number, t: number): number {
  return s + (e - s) * t;
}

export function qbezier(s: number, c: number, e: number, t: number): number {
  const a = lerp(s, c, t);
  const b = lerp(c, e, t);
  return lerp(a, b, t);
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
