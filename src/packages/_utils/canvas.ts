export function getCanvas(selector: string): HTMLCanvasElement | null {
  return document.querySelector(selector)
}

export function layoutCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
  canvas.width = width
  canvas.height = height
}

export function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  return canvas.getContext('webgl')
}
