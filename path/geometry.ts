export class Point {
  constructor(public x: number, public y: number) {}
}

export class Line {
  constructor(public s: Point, public e: Point) {}
}

export class QBezier {
  constructor(public s: Point, public c: Point, public e: Point) {}
}

export class RQBezier {
  constructor(
    public s: Point,
    public c: Point,
    public e: Point,
    public w: number,
  ) {}
}

export class CBezier {
  constructor(
    public s: Point,
    public c1: Point,
    public c2: Point,
    public e: Point,
  ) {}
}

export class Contour {
  constructor(
    public d: (Line | QBezier | RQBezier | CBezier)[],
    public z: boolean,
  ) {}
}
