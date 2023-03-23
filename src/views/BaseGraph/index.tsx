import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { ColorGray, ColorGreen, ColorRed } from '@/packages/_utils/gl-color'
import { initVertexBuffer } from '@/packages/_utils/vertex-buffer'
import RadioController, { type RadioControllerConfig } from '@/components/RadioController'
import { randomCoordsFloat32Array } from '@/packages/_utils/coords'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'

const controllerConfig = reactive<RadioControllerConfig>({
  value: 'POINTS',
  onChange(v) {
    controllerConfig.value = v
  },
  children: [
    {
      label: 'POINTS',
      value: 'POINTS'
    },
    {
      label: 'LINES',
      value: 'LINES'
    },
    {
      label: 'LINE_STRIP',
      value: 'LINE_STRIP'
    },
    {
      label: 'LINE_LOOP',
      value: 'LINE_LOOP'
    },
    {
      label: 'TRIANGLES',
      value: 'TRIANGLES'
    },
    {
      label: 'TRIANGLE_STRIP',
      value: 'TRIANGLE_STRIP'
    },
    {
      label: 'TRIANGLE_FAN',
      value: 'TRIANGLE_FAN'
    }
  ]
})

const renders = {
  POINTS(
    gl: WebGLRenderingContext,
    uFragColor: WebGLUniformLocation,
    aPosition: number,
    aPointSize: number
  ) {
    if (aPointSize === -1) return
    const size = 2
    const count = 3
    const data = randomCoordsFloat32Array(count * size)
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.vertexAttrib1f(aPointSize, 50.0)
    gl.uniform4fv(uFragColor, new Float32Array([...ColorGreen, 1.0]))

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, data.length / size)
  },
  LINES(gl: WebGLRenderingContext, uFragColor: WebGLUniformLocation, aPosition: number) {
    const size = 2
    const count = 4
    const data = randomCoordsFloat32Array(count * size)
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.uniform4fv(uFragColor, new Float32Array([...ColorGreen, 1.0]))

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.LINES, 0, data.length / size)
  },
  LINE_STRIP(gl: WebGLRenderingContext, uFragColor: WebGLUniformLocation, aPosition: number) {
    const size = 2
    const count = 3
    const data = randomCoordsFloat32Array(count * size)
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.uniform4fv(uFragColor, new Float32Array([...ColorGreen, 1.0]))

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.LINE_STRIP, 0, data.length / size)
  },
  LINE_LOOP(gl: WebGLRenderingContext, uFragColor: WebGLUniformLocation, aPosition: number) {
    const size = 2
    const count = 3
    const data = randomCoordsFloat32Array(count * size)
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.uniform4fv(uFragColor, new Float32Array([...ColorGreen, 1.0]))

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.LINE_LOOP, 0, data.length / size)
  },
  TRIANGLES(gl: WebGLRenderingContext, uFragColor: WebGLUniformLocation, aPosition: number) {
    const size = 2
    const data = new Float32Array([0.0, 0.5, 0.5, -0.5, -0.5, -0.5])
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
    gl.drawArrays(gl.TRIANGLES, 0, data.length / size)
  },
  TRIANGLE_STRIP(gl: WebGLRenderingContext, uFragColor: WebGLUniformLocation, aPosition: number) {
    const size = 2
    const data = new Float32Array([0.0, 0.5, 0.5, -0.5, -0.5, -0.5, 0.0, -0.8])
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, data.length / size)
  },
  TRIANGLE_FAN(gl: WebGLRenderingContext, uFragColor: WebGLUniformLocation, aPosition: number) {
    const size = 2
    const data = new Float32Array([0.0, 0.5, 0.5, -0.5, -0.5, -0.5, -0.7, 0.2])
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
    gl.drawArrays(gl.TRIANGLE_FAN, 0, data.length / size)
  }
}

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  const uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return

  switch (controllerConfig.value) {
    case 'POINTS':
      renders.POINTS(gl, uFragColor, aPosition, gl.getAttribLocation(program, 'a_PointSize'))
      break

    case 'LINES':
      renders.LINES(gl, uFragColor, aPosition)
      break

    case 'LINE_STRIP':
      renders.LINE_STRIP(gl, uFragColor, aPosition)
      break

    case 'LINE_LOOP':
      renders.LINE_LOOP(gl, uFragColor, aPosition)
      break

    case 'TRIANGLES':
      renders.TRIANGLES(gl, uFragColor, aPosition)
      break

    case 'TRIANGLE_STRIP':
      renders.TRIANGLE_STRIP(gl, uFragColor, aPosition)
      break

    case 'TRIANGLE_FAN':
      renders.TRIANGLE_FAN(gl, uFragColor, aPosition)
      break

    default:
      console.warn('No render found')
      break
  }
}

function main() {
  const canvas = getCanvas('#BaseGraph')
  if (!canvas) throw new Error('没有获取到canvas element！')
  layoutCanvas(canvas, canvas.clientWidth, canvas.clientHeight)

  const gl = getWebGLContext(canvas)
  if (!gl) throw new Error('没有获取到webgl context！')

  const program = initShaders(gl, vshader, fshader)
  if (!program) throw new Error('初始化shader失败！')

  gl.clearColor(...ColorGray, 1.0)
  draw(gl, program)

  // controller
  controllerConfig.onChange = (v) => {
    controllerConfig.value = v
    draw(gl, program)
  }
}

export default defineComponent({
  name: 'BaseGraph',
  setup() {
    onMounted(main)
    onUnmounted(() => (controllerConfig.value = 'POINTS'))
  },
  render() {
    return (
      <>
        <canvas
          id="BaseGraph"
          class="demo-gl"
        ></canvas>
        <RadioController config={controllerConfig} />
      </>
    )
  }
})
