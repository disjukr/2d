import { lerp, qbezier } from "../interpolation.ts";

export class Point {
  constructor(public x: number, public y: number) {}
}

export abstract class Line {
  abstract slice(t1: number, t2: number): Line;
  // get length
  // chopAt t
  // pointAt t
  // tangetAt t
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
  // intersectWithStraight line
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
    throw "todo";
  }
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
    throw "todo";
  }
}

export class Contour {
  constructor(public d: Line[], public z: boolean) {}
}
