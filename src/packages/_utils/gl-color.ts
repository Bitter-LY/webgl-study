export type WebGLColorRGB = [number, number, number]

export const ColorGreen: WebGLColorRGB = hexToRGB(0x1abc9c)
export const ColorGray: WebGLColorRGB = hexToRGB(0xd2dae2)
export const ColorRed: WebGLColorRGB = hexToRGB(0xf53b57)

export function randomRGBColor(): WebGLColorRGB {
  return [Math.random(), Math.random(), Math.random()]
}

export function hexToRGB(hex: number): WebGLColorRGB {
  hex = Math.floor(hex)
  return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255]
}
