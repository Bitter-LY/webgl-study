import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { ColorGray, ColorRed } from '@/packages/_utils/gl-color'
import { initVertexBuffer } from '@/packages/_utils/vertex-buffer'
import RadioController, { type RadioControllerConfig } from '@/components/RadioController'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'

const controllerConfig = reactive<RadioControllerConfig>({
  value: 'Rect',
  onChange(v) {
    controllerConfig.value = v
  },
  children: [
    {
      label: 'Rect',
      value: 'Rect'
    }
  ]
})

const renders = {
  Rect(gl: WebGLRenderingContext, uFragColor: WebGLUniformLocation, aPosition: number) {
    const size = 2
    const data = new Float32Array([0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5])
    if (!initVertexBuffer(gl, data, size, aPosition)) return

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, data.length / size)
  }
}

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  const uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return

  switch (controllerConfig.value) {
    case 'Rect':
      renders.Rect(gl, uFragColor, aPosition)
      break

    default:
      console.warn('No render found')
      break
  }
}

function main() {
  const canvas = getCanvas('#DeriveGraph')
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
  name: 'DeriveGraph',
  setup() {
    onMounted(main)
    onUnmounted(() => (controllerConfig.value = 'Rect'))
  },
  render() {
    return (
      <>
        <canvas
          id="DeriveGraph"
          class="demo-gl"
        ></canvas>
        <RadioController config={controllerConfig} />
      </>
    )
  }
})
