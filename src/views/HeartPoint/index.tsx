import { defineComponent, onMounted } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { rectToWebGLCoords } from '@/packages/_utils/coords'
import { ColorGray, ColorRed } from '@/packages/_utils/gl-color'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'

const points: [number, number, number, number][] = []

function initPoints(canvas: any) {
  const a = 80
  let start = 0
  let x = 0
  let y = 0
  const acceleration = 0.01
  const max = 40
  while (start <= max) {
    const cal = 2 * start
    y = -a * (2 * Math.cos(start) - Math.cos(cal)) + 200
    x = a * (2 * Math.sin(start) - Math.sin(cal)) + 500
    const rp = rectToWebGLCoords(canvas, x, y)
    points.push([rp.x, rp.y, 0.0, 1.0])
    start = start + acceleration
  }
}

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  const aPointSize = gl.getAttribLocation(program, 'a_PointSize')
  if (aPointSize === -1) return
  const uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return

  gl.vertexAttrib1f(aPointSize, 10)

  points.forEach((e) => {
    gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
    gl.vertexAttrib4fv(aPosition, new Float32Array(e))
    gl.drawArrays(gl.POINTS, 0, 1)
  })
}

function main() {
  const canvas = getCanvas('#HeartPoint')
  if (!canvas) throw new Error('未获取到canvas！')
  layoutCanvas(canvas, canvas.clientWidth, canvas.clientHeight)

  const gl = getWebGLContext(canvas)
  if (!gl) throw new Error('未获取到gl！')

  const program = initShaders(gl, vshader, fshader)
  if (!program) throw new Error('未获取到program！')

  gl.clearColor(...ColorGray, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  initPoints(gl.canvas)
  draw(gl, program)
}

export default defineComponent({
  name: 'HeartPoint',
  setup() {
    onMounted(main)
  },
  render() {
    return (
      <canvas
        id="HeartPoint"
        class="demo-gl"
      ></canvas>
    )
  }
})
