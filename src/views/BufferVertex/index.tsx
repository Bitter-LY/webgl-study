import { defineComponent, onMounted } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { ColorGray, ColorRed } from '@/packages/_utils/gl-color'
import { randomCoordsFloat32Array } from '@/packages/_utils/coords'
import { initVertexBuffer } from '@/packages/_utils/vertex-buffer'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  const aPointSize = gl.getAttribLocation(program, 'a_PointSize')
  if (aPointSize === -1) return
  const uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return

  const size = 2
  const count = 3
  const data = randomCoordsFloat32Array(count * size)
  if (!initVertexBuffer(gl, data, size, aPosition)) return

  gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
  gl.vertexAttrib1f(aPointSize, 30.0)
  gl.drawArrays(gl.POINTS, 0, data.length / size)
}

function main() {
  const canvas = getCanvas('#BufferVertex')
  if (!canvas) throw new Error('没有获取到canvas element！')
  layoutCanvas(canvas, canvas.clientWidth, canvas.clientHeight)

  const gl = getWebGLContext(canvas)
  if (!gl) throw new Error('没有获取到webgl context！')

  const program = initShaders(gl, vshader, fshader)
  if (!program) throw new Error('初始化shader失败！')

  gl.clearColor(...ColorGray, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  draw(gl, program)
}

export default defineComponent({
  name: 'BufferVertex',
  setup() {
    onMounted(main)
  },
  render() {
    return (
      <canvas
        id="BufferVertex"
        class="demo-gl"
      ></canvas>
    )
  }
})
