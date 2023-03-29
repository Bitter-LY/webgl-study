interface Vector<T> {
  add(vec: T): T
}

// Vector2
export class Vector2 implements Vector<Vector2> {
  x: number
  y: number

  constructor(x: number = 0.0, y: number = 0.0) {
    this.x = x
    this.y = y
  }

  add(vec: Vector2): Vector2 {
    this.x += vec.x
    this.y += vec.y

    return this
  }
}

// Vector3
export class Vector3 implements Vector<Vector3> {
  x: number
  y: number
  z: number

  constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
    this.x = x
    this.y = y
    this.z = z
  }

  add(vec: Vector3): Vector3 {
    this.x += vec.x
    this.y += vec.y
    this.z += vec.z

    return this
  }
}

// Vector4
export class Vector4 implements Vector<Vector4> {
  x: number
  y: number
  z: number
  w: number

  constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  add(vec: Vector4): Vector4 {
    this.x += vec.x
    this.y += vec.y
    this.z += vec.z
    this.w += vec.w

    return this
  }
}
