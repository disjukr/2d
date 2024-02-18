import { cbezier, dcbezier, lerp, qbezier } from "../interpolation.ts";
import { Point } from "../geometry.ts";
import integrate from "../numerical/integrate.ts";

export abstract class Line {
  abstract slice(t1: number, t2: number): Line;
  // get minX
  // get minY
  // get maxX
  // get maxY
  // get length
  // lengthToT length
  // lengthAt t
  // chopAt t
  // pointAt t
  // tangentAt t
}

export class LinePair {
  constructor(public l1: Line, public l2: Line) {}
}

export class Straight extends Line {
  constructor(public s: Point, public e: Point) {
    super();
  }
  slice(t1: number, t2: number): Straight {
    if (t1 === 0 && t2 === 1) return this;
    const sx = this.s.x;
    const sy = this.s.y;
    const ex = this.e.x;
    const ey = this.e.y;
    if (t1 === 0) {
      return new Straight(
        this.s,
        new Point(lerp(sx, ex, t2), lerp(sy, ey, t2)),
      );
    }
    if (t2 === 1) {
      return new Straight(
        new Point(lerp(sx, ex, t1), lerp(sy, ey, t1)),
        this.e,
      );
    }
    return new Straight(
      new Point(lerp(sx, ex, t1), lerp(sy, ey, t1)),
      new Point(lerp(sx, ex, t2), lerp(sy, ey, t2)),
    );
  }
  get length() {
    const dx = this.e.x - this.s.x;
    const dy = this.e.y - this.s.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  lengthAt(t: number): number {
    return this.length * t;
  }
  pointAt(t: number): Point {
    return new Point(lerp(this.s.x, this.e.x, t), lerp(this.s.y, this.e.y, t));
  }
  tangentAt(): Point {
    return new Point(this.e.x - this.s.x, this.e.y - this.s.y);
  }
  // elevateToQBezier
  // intersectWithStraight line
  // intersectWithQBezier line
  // intersectWithConic line
  // intersectWithCBezier line
}

export class QBezier extends Line {
  constructor(public s: Point, public c: Point, public e: Point) {
    super();
  }
  slice(t1: number, t2: number): QBezier {
    if (t1 === 0 && t2 === 1) return this;
    const sx = this.s.x;
    const sy = this.s.y;
    const cx = this.c.x;
    const cy = this.c.y;
    const ex = this.e.x;
    const ey = this.e.y;
    const t3 = (t1 + t2) / 2;
    const px = qbezier(sx, cx, ex, t3);
    const py = qbezier(sy, cy, ey, t3);
    const s = new Point(qbezier(sx, cx, ex, t1), qbezier(sy, cy, ey, t1));
    const e = new Point(qbezier(sx, cx, ex, t2), qbezier(sy, cy, ey, t2));
    const c = new Point(
      (px + px) - (s.x + e.x) / 2,
      (py + py) - (s.y + e.y) / 2,
    );
    return new QBezier(s, c, e);
  }
  // elevateToCBezier
  // intersectWithStraight line
  // intersectWithQBezier line
  // intersectWithConic line
  // intersectWithCBezier line
}

export class Conic extends Line {
  constructor(
    public s: Point,
    public c: Point,
    public e: Point,
    public w: number,
  ) {
    super();
  }
  slice(t1: number, t2: number): Conic {
    if (t1 === 0 && t2 === 1) return this;
    const sx = this.s.x;
    const sy = this.s.y;
    const cx = this.c.x;
    const cy = this.c.y;
    const ex = this.e.x;
    const ey = this.e.y;
    const w = this.w;
    const t3 = (t1 + t2) / 2;
    const sd = Conic.d(w, t1);
    const ed = Conic.d(w, t2);
    const pd = Conic.d(w, t3);
    const cd = ((pd + pd) - (sd + ed) / 2) || 1;
    const snx = Conic.n(sx, cx, ex, w, t1);
    const sny = Conic.n(sy, cy, ey, w, t1);
    const enx = Conic.n(sx, cx, ex, w, t2);
    const eny = Conic.n(sy, cy, ey, w, t2);
    const pnx = Conic.n(sx, cx, ex, w, t3);
    const pny = Conic.n(sy, cy, ey, w, t3);
    const cnx = (pnx + pnx) - (snx + enx) / 2;
    const cny = (pny + pny) - (sny + eny) / 2;
    const s = new Point(snx / sd, sny / sd);
    const e = new Point(enx / ed, eny / ed);
    const c = new Point(cnx / cd, cny / cd);
    return new Conic(s, c, e, cd / Math.sqrt(sd * ed));
  }
  private static n(
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
    return otot * s + t2otw * c + tt * e;
  }
  private static d(w: number, t: number) {
    const t2 = t + t;
    const tt = t * t;
    const ot = 1 - t;
    const otot = ot * ot;
    const t2otw = t2 * ot * w;
    return otot + t2otw + tt;
  }
  // intersectWithStraight line
  // intersectWithQBezier line
  // intersectWithConic line
  // intersectWithCBezier line
}

export class CBezier extends Line {
  constructor(
    public s: Point,
    public c1: Point,
    public c2: Point,
    public e: Point,
  ) {
    super();
  }
  slice(t1: number, t2: number): CBezier {
    if (t1 === 0 && t2 === 1) return this;
    const sx = this.s.x;
    const sy = this.s.y;
    const c1x = this.c1.x;
    const c1y = this.c1.y;
    const c2x = this.c2.x;
    const c2y = this.c2.y;
    const ex = this.e.x;
    const ey = this.e.y;
    const t3 = (t1 + t1 + t2) / 3;
    const t4 = (t1 + t2 + t2) / 3;
    const s = new Point(
      cbezier(sx, c1x, c2x, ex, t1),
      cbezier(sy, c1y, c2y, ey, t1),
    );
    const e = new Point(
      cbezier(sx, c1x, c2x, ex, t2),
      cbezier(sy, c1y, c2y, ey, t2),
    );
    const p1x = cbezier(sx, c1x, c2x, ex, t3);
    const p1y = cbezier(sy, c1y, c2y, ey, t3);
    const p2x = cbezier(sx, c1x, c2x, ex, t4);
    const p2y = cbezier(sy, c1y, c2y, ey, t4);
    const p3x = p1x * 27 - s.x * 8 - e.x;
    const p3y = p1y * 27 - s.y * 8 - e.y;
    const p4x = p2x * 27 - s.x - e.x * 8;
    const p4y = p2y * 27 - s.y - e.y * 8;
    const c1 = new Point(
      (p3x + p3x - p4x) / 18,
      (p3y + p3y - p4y) / 18,
    );
    const c2 = new Point(
      (p4x + p4x - p3x) / 18,
      (p4y + p4y - p3y) / 18,
    );
    return new CBezier(s, c1, c2, e);
  }
  get length() {
    return integrate((t) => this.tangentAt(t).norm(), 0, 1);
  }
  lengthAt(t: number): number {
    return integrate((t) => this.tangentAt(t).norm(), 0, t);
  }
  pointAt(t: number): Point {
    return new Point(
      cbezier(this.s.x, this.c1.x, this.c2.x, this.e.x, t),
      cbezier(this.s.y, this.c1.y, this.c2.y, this.e.y, t),
    );
  }
  tangentAt(t: number): Point {
    return new Point(
      dcbezier(this.s.x, this.c1.x, this.c2.x, this.e.x, t),
      dcbezier(this.s.y, this.c1.y, this.c2.y, this.e.y, t),
    );
  }
  // get isSelfIntersecting
  // get selfIntersectingT
  // intersectWithStraight line
  // intersectWithQBezier line
  // intersectWithConic line
  // intersectWithCBezier line
}

export class Contour {
  constructor(public d: Line[], public z: boolean) {}
}
