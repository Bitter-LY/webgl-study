export function rectToWebGLCoords(
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): { x: number; y: number } {
  return {
    x: (2 * x) / canvas.width - 1,
    y: 1 - (2 * y) / canvas.height
  }
}

export function mouseToWebGLCoords(e: MouseEvent): { x: number; y: number } {
  const canvas = e.target as HTMLCanvasElement
  const { left, top } = canvas.getBoundingClientRect()
  return rectToWebGLCoords(canvas, e.clientX - left, e.clientY - top)
}
