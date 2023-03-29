import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { getCanvas, getWebGLContext, layoutCanvas } from '@/packages/_utils/canvas'
import { initShaders } from '@/packages/_utils/shader'
import { ColorGray, ColorRed } from '@/packages/_utils/gl-color'
import { initVertexBuffer } from '@/packages/_utils/vertex-buffer'
import RadioController, { type RadioControllerConfig } from '@/components/RadioController'

import vshader from './vshader.glsl?raw'
import fshader from './fshader.glsl?raw'
import { Matrix4 } from '@/packages/base/Matrix'
import { Vector3 } from '@/packages/base/Vector'

class WebGLState {
  readonly programMap = new Map<string, WebGLBuffer>()
  readonly vertexBufferMap = new Map<string, WebGLBuffer>()
  readonly vshaderMap = new Map<string, WebGLShader>()
  readonly fshaderMap = new Map<string, WebGLShader>()
  readonly attributeMap = new Map<string, number>()
  readonly uniformMap = new Map<string, WebGLUniformLocation>()
  private _gl: WebGLRenderingContext | null = null

  setGL(gl: WebGLRenderingContext): void {
    this._gl = gl
  }

  getGL(): WebGLRenderingContext | null {
    return this._gl
  }
}

const size = 2
const position = new Float32Array([0.2, -0.2, -0.2, -0.2, 0.0, 0.2])
const count = position.length / size
const webGLState = new WebGLState()
const matrix4 = new Matrix4()

const controllerConfig = reactive<RadioControllerConfig>({
  value: 'Translate',
  onChange(v) {
    controllerConfig.value = v
    draw()
  },
  children: [
    {
      label: 'Default',
      value: 'Default'
    },
    {
      label: 'Rotate',
      value: 'Rotate'
    },
    {
      label: 'Translate',
      value: 'Translate'
    },
    {
      label: 'Scale',
      value: 'Scale'
    }
  ]
})

const renders = {
  Default(gl: WebGLRenderingContext, uMatrix4: WebGLUniformLocation) {
    matrix4.identity()
    gl.uniformMatrix4fv(uMatrix4, false, new Float32Array(matrix4.elements))
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, count)
  },
  Translate(gl: WebGLRenderingContext, uMatrix4: WebGLUniformLocation) {
    matrix4.makeTranslation(0.5, 0.0, 0.0)
    gl.uniformMatrix4fv(uMatrix4, false, new Float32Array(matrix4.elements))
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, count)
  },
  Rotate(gl: WebGLRenderingContext, aPosition: number, uMatrix4: WebGLUniformLocation) {
    matrix4.makeRotationZ((Math.PI * 180) / 180)
    gl.uniformMatrix4fv(uMatrix4, false, new Float32Array(matrix4.elements))
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, count)
  },
  Scale(gl: WebGLRenderingContext, aPosition: number, uMatrix4: WebGLUniformLocation) {
    matrix4.scale(new Vector3(2, 1, 1))
    gl.uniformMatrix4fv(uMatrix4, false, new Float32Array(matrix4.elements))
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, count)
  }
}

function draw() {
  const gl = webGLState.getGL()
  if (!gl) return
  const aPosition = webGLState.attributeMap.get('aPosition')
  if (aPosition === undefined) return
  const uMatrix4 = webGLState.uniformMap.get('uMatrix4')
  if (uMatrix4 === undefined) return

  switch (controllerConfig.value) {
    case 'Default':
      renders.Default(gl, uMatrix4)
      break

    case 'Translate':
      renders.Translate(gl, uMatrix4)
      break

    case 'Rotate':
      renders.Rotate(gl, aPosition, uMatrix4)
      break

    case 'Scale':
      renders.Scale(gl, aPosition, uMatrix4)
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

  const aPosition = gl.getAttribLocation(program, 'a_Position')
  if (aPosition === -1) return
  const uFragColor = gl.getUniformLocation(program, 'u_FragColor')
  if (uFragColor === null) return
  const uMatrix4 = gl.getUniformLocation(program, 'u_Matrix4')
  if (uMatrix4 === null) return

  const buffer = initVertexBuffer(gl, new Float32Array(), size, aPosition)
  if (!buffer) return

  webGLState.setGL(gl)
  webGLState.programMap.set('default', program)
  webGLState.attributeMap.set('aPosition', aPosition)
  webGLState.uniformMap.set('uFragColor', uFragColor)
  webGLState.uniformMap.set('uMatrix4', uMatrix4)
  webGLState.vertexBufferMap.set('default', buffer)

  gl.clearColor(...ColorGray, 1.0)
  gl.uniform4fv(uFragColor, new Float32Array([...ColorRed, 1.0]))
  gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
  draw()
}

export default defineComponent({
  name: 'TransformGraph',
  setup() {
    onMounted(main)
    onUnmounted(() => (controllerConfig.value = 'Translate'))
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
