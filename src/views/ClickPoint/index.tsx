import { defineComponent, onUnmounted, ref } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { mouseToWebGLCoords } from '@/packages/_utils/coords'
import { ColorGray, randomRGBColor } from '@/packages/_utils/gl-color'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'

const isStart = ref(false)
let aPosition: number
let aPointSize: number
let uFragColor: WebGLUniformLocation | null
let points: [number, number, number, number][] = []

function draw(gl: WebGLRenderingContext, program: WebGLProgram, e: MouseEvent) {
  const { x, y } = mouseToWebGLCoords(e)
  points.push([x, y, 0.0, 1.0])

  aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  aPointSize = gl.getAttribLocation(program, 'a_PointSize')
  if (aPointSize === -1) return
  uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return

  gl.vertexAttrib1f(aPointSize, 50)
  gl.clear(gl.COLOR_BUFFER_BIT)

  points.forEach((e) => {
    gl.uniform4fv(uFragColor, new Float32Array(randomRGBColor().concat(1.0)))
    gl.vertexAttrib4fv(aPosition, new Float32Array(e))
    gl.drawArrays(gl.POINTS, 0, 1)
  })
}

function main() {
  const canvas = getCanvas('#ClickPoint')
  if (!canvas) throw new Error('未获取到canvas！')
  layoutCanvas(canvas, canvas.clientWidth, canvas.clientHeight)

  const gl = getWebGLContext(canvas)
  if (!gl) throw new Error('未获取到gl！')

  const program = initShaders(gl, vshader, fshader)
  if (!program) throw new Error('未获取到program！')

  gl.clearColor(...ColorGray, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  canvas.addEventListener('click', (e) => draw(gl, program, e))
}

export default defineComponent({
  name: 'ClickPoint',
  setup() {
    onUnmounted(() => {
      points = []
      isStart.value = false
    })
  },
  render() {
    return (
      <>
        <div
          class="demo-gl"
          style={{
            display: isStart.value ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => {
            isStart.value = true
            this.$nextTick(main)
          }}
        >
          <h1>点击开始绘制</h1>
        </div>
        <canvas
          id="ClickPoint"
          class="demo-gl"
          style={{
            display: isStart.value ? 'block' : 'none',
            cursor: 'pointer'
          }}
        ></canvas>
      </>
    )
  }
})
