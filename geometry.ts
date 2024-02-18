export class Point {
  constructor(public x: number, public y: number) {}
  norm() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

// Point3D, Matrix3D ?

// Matrix
