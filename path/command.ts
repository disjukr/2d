export class M {
  constructor(public x: number, public y: number, public relative = false) {}
}

export class L {
  constructor(public x: number, public y: number, public relative = false) {}
}

export class H {
  constructor(public x: number, public relative = false) {}
}

export class V {
  constructor(public y: number, public relative = false) {}
}

export class C {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
    public x: number,
    public y: number,
    public relative = false,
  ) {}
}

export class S {
  constructor(
    public x2: number,
    public y2: number,
    public x: number,
    public y: number,
    public relative = false,
  ) {}
}

export class Q {
  constructor(
    public x1: number,
    public y1: number,
    public x: number,
    public y: number,
    public relative = false,
  ) {}
}

export class T {
  constructor(public x: number, public y: number, public relative = false) {}
}

export class A {
  constructor(
    public rx: number,
    public ry: number,
    public angle: number,
    public largeArcFlag: boolean,
    public sweepFlag: boolean,
    public x: number,
    public y: number,
    public relative = false,
  ) {}
}

export class Z {
  constructor(public relative = false) {}
}
