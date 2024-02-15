export default function integrate(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerance: number = 1e-2,
): number {
  const fa = f(a);
  const fm = f((a + b) * 0.5);
  const fb = f(b);
  const v0 = (fa + (4 * fm) + fb) * (b - a) / 6;
  if (isNaN(v0)) return NaN;
  return adsimp(a, b, fa, fm, fb, v0, tolerance);
  function adsimp(
    a: number,
    b: number,
    fa: number,
    fm: number,
    fb: number,
    v0: number,
    tolerance: number,
  ): number {
    const h = b - a;
    const qh = h / 4;
    const f1 = f(a + qh);
    if (isNaN(f1)) return NaN;
    const f2 = f(b - qh);
    if (isNaN(f2)) return NaN;
    const sl = h * (fa + (4 * f1) + fm) / 12;
    const sr = h * (fm + (4 * f2) + fb) / 12;
    const s2 = sl + sr;
    const error = (s2 - v0) / 15;
    if (Math.abs(error) < tolerance) return s2 + error;
    const ht = tolerance * 0.5;
    const m = a + (h * 0.5);
    const v1 = adsimp(a, m, fa, f1, fm, sl, ht);
    if (isNaN(v1)) return NaN;
    const v2 = adsimp(m, b, fm, f2, fb, sr, ht);
    if (isNaN(v2)) return NaN;
    return v1 + v2;
  }
}
