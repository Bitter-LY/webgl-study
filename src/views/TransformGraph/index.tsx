import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { ColorGray, ColorRed } from '@/packages/_utils/gl-color'
import { initVertexBuffer } from '@/packages/_utils/vertex-buffer'
import RadioController, { type RadioControllerConfig } from '@/components/RadioController'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'

const size = 2
const positions = new Float32Array([0.2, -0.2, -0.2, -0.2, 0.0, 0.2])
const translateVal = new Float32Array([0.1, 0.0, 0.0, 0.0])
const count = positions.length / size

const controllerConfig = reactive<RadioControllerConfig>({
  value: 'Default',
  onChange(v) {
    controllerConfig.value = v
  },
  children: [
    {
      label: 'Default',
      value: 'Default'
    },
    {
      label: 'Translate',
      value: 'Translate'
    }
  ]
})

const renders = {
  Default(gl: WebGLRenderingContext, aPosition: number, uTranslate: WebGLUniformLocation) {
    gl.uniform4fv(uTranslate, new Float32Array([0.0, 0.0, 0.0, 0.0]))
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, count)
  },
  Translate(gl: WebGLRenderingContext, aPosition: number, uTranslate: WebGLUniformLocation) {
    gl.uniform4fv(uTranslate, translateVal)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, count)
  }
}

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  const uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return
  const uTranslate = gl.getUniformLocation(program, 'u_Translate')
  if (uTranslate === null) return

  gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
  if (!initVertexBuffer(gl, positions, size, aPosition)) return

  switch (controllerConfig.value) {
    case 'Default':
      renders.Default(gl, aPosition, uTranslate)
      break

    case 'Translate':
      renders.Translate(gl, aPosition, uTranslate)
      break

    default:
      console.warn('No render found')
      break
  }
}

function main() {
  const canvas = getCanvas('#TransformGraph')
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
  name: 'TransformGraph',
  setup() {
    onMounted(main)
    onUnmounted(() => (controllerConfig.value = 'Default'))
  },
  render() {
    return (
      <>
        <canvas
          id="TransformGraph"
          class="demo-gl"
        ></canvas>
        <RadioController config={controllerConfig} />
      </>
    )
  }
})
