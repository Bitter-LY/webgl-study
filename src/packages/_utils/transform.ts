function degreesToRadian(degrees: number): number {
  return (Math.PI * degrees) / 180
}

export function rotate(
  degrees: number,
  x: number,
  y: number,
  z = 0.0,
  w = 1.0
): [number, number, number, number] {
  const radian = degreesToRadian(degrees)
  const rx = x * Math.cos(radian) - y * Math.sin(radian)
  const ry = x * Math.sin(radian) + y * Math.cos(radian)

  return [rx, ry, z, w]
}
