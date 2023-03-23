import { defineComponent, onMounted } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { ColorGray, ColorRed } from '@/packages/_utils/gl-color'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  const aPointSize = gl.getAttribLocation(program, 'a_PointSize')
  if (aPointSize === -1) return
  const uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return

  gl.uniform4fv(uFragColor, new Float32Array([0.0, 0.0, 0.0, 1.0]))
  gl.vertexAttrib1f(aPointSize, 70.0)
  gl.vertexAttrib4fv(aPosition, new Float32Array([0.0, 0.0, 0.0, 1.0]))
  gl.drawArrays(gl.POINTS, 0, 1)

  gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
  gl.vertexAttrib1f(aPointSize, 30.0)
  gl.drawArrays(gl.POINTS, 0, 1)
}

function main() {
  const canvas = getCanvas('#HelloWorld')
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
  name: 'HelloWorld',
  setup() {
    onMounted(main)
  },
  render() {
    return (
      <canvas
        id="HelloWorld"
        class="demo-gl"
      ></canvas>
    )
  }
})
