/**
 *
 * Layout[3x3]
 *  ---------------------------
 * | cos|scale,      -sin, x   |
 * |       sin, cos|scale, y   |
 * |       0.0,       0.0, 1.0 |
 *  ---------------------------
 *
 * Layout[4x4]
 *  ----------------------------------
 * | cos|scale,      -sin,   0.0, x   |
 * |       sin, cos|scale,   0.0, y   |
 * |       0.0,       0.0, scale, z   |
 * |       0.0,       0.0,   0.0, 1.0 |
 *  ----------------------------------
 *
 * Index[3x3]
 *  ----------
 * | 0, 4,  8 |
 * | 1, 5,  9 |
 * | 2, 6, 10 |
 * | 3, 7, 11 |
 *  ----------
 *
 * Index[4x4]
 *  --------------
 * | 0, 4,  8, 12 |
 * | 1, 5,  9, 13 |
 * | 2, 6, 10, 14 |
 * | 3, 7, 11, 15 |
 *  --------------
 *
 */

import type { Vector3 } from './Vector'

interface Matrix<T> {
  elements: Float32Array

  set(rm: number[]): T
  identity(): T
  scale(v: Vector3): T
}

export class Matrix4 implements Matrix<Matrix4> {
  elements: Float32Array

  constructor() {
    this.elements = new Float32Array([
      1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0
    ])
  }

  set(rm: number[]): Matrix4 {
    const te = this.elements

    te[0] = rm[0]
    te[1] = rm[4]
    te[2] = rm[8]
    te[3] = rm[12]

    te[4] = rm[1]
    te[5] = rm[5]
    te[6] = rm[9]
    te[7] = rm[13]

    te[8] = rm[2]
    te[9] = rm[6]
    te[10] = rm[10]
    te[11] = rm[14]

    te[12] = rm[3]
    te[13] = rm[7]
    te[14] = rm[11]
    te[15] = rm[15]

    return this
  }

  identity(): Matrix4 {
    return this.set([
      1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0
    ])
  }

  makeRotationX(radian: number): Matrix4 {
    this.set([
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      Math.cos(radian),
      -Math.sin(radian),
      0.0,
      0.0,
      Math.sin(radian),
      Math.cos(radian),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ])

    return this
  }

  makeRotationY(radian: number): Matrix4 {
    this.set([
      Math.cos(radian),
      0.0,
      Math.sin(radian),
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      -Math.sin(radian),
      0.0,
      Math.cos(radian),
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ])

    return this
  }

  makeRotationZ(radian: number): Matrix4 {
    this.set([
      Math.cos(radian),
      -Math.sin(radian),
      0.0,
      0.0,
      Math.sin(radian),
      Math.cos(radian),
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ])

    return this
  }

  makeTranslation(x: number, y: number, z: number): Matrix4 {
    this.set([1.0, 0.0, 0.0, x, 0.0, 1.0, 0.0, y, 0.0, 0.0, 1.0, z, 0.0, 0.0, 0.0, 1.0])

    return this
  }

  makeScale(x: number, y: number, z: number): Matrix4 {
    this.set([x, 0.0, 0.0, 0.0, 0.0, y, 0.0, 0.0, 0.0, 0.0, z, 0.0, 0.0, 0.0, 0.0, 1.0])

    return this
  }

  scale(v: Vector3): Matrix4 {
    const { x, y, z } = v
    const te = this.elements

    te[0] *= x
    te[1] *= x
    te[2] *= x
    te[3] *= x

    te[4] *= y
    te[5] *= y
    te[6] *= y
    te[7] *= y

    te[8] *= z
    te[9] *= z
    te[10] *= z
    te[11] *= z

    return this
  }

  translation(v: Vector3): Matrix4 {
    const { x, y, z } = v
    const te = this.elements

    te[12] = x
    te[13] = y
    te[14] = z

    return this
  }
}
