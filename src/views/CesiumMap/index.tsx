import { defineComponent, onMounted, onUnmounted } from 'vue'
import {
  Viewer,
  GeometryInstance,
  Rectangle,
  Ion,
  RectangleGeometry,
  EllipsoidSurfaceAppearance,
  Material,
  Primitive
} from 'cesium'
import { CesiumKey, CESIUM_BASE_URL } from '@/const'
import 'cesium/Build/Cesium/Widgets/widgets.css'

import fshader from './fshader.glsl?raw'

window.CESIUM_BASE_URL = CESIUM_BASE_URL
Ion.defaultAccessToken = CesiumKey

function main(viewer: Viewer) {
  const scene = viewer.scene
  const material = new Material({} as any)
  material.shaderSource = fshader

  const instance = new GeometryInstance({
    geometry: new RectangleGeometry({
      rectangle: Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
      vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT
    })
  })

  scene.primitives.add(
    new Primitive({
      geometryInstances: instance,
      appearance: new EllipsoidSurfaceAppearance({
        material
      })
    })
  )
}

export default defineComponent({
  name: 'CesiumMap',
  setup() {
    let viewer: Viewer | null = null

    const init = () => {
      const div = document.querySelector('#CesiumMap')
      if (!div) return

      viewer = new Viewer(div, {
        requestRenderMode: true,
        targetFrameRate: 60
      })
      viewer.scene.debugShowFramesPerSecond = true
      main(viewer)
    }

    const destroy = () => {
      viewer?.destroy()
    }

    onMounted(init)
    onUnmounted(destroy)
  },
  render() {
    return (
      <div
        id="CesiumMap"
        class="demo-gl"
      >
        CesiumMap
      </div>
    )
  }
})
