import { defineComponent, onMounted, onUnmounted } from 'vue'
import {
  Viewer,
  GeometryInstance,
  Rectangle,
  Ion,
  Primitive,
  MaterialAppearance,
  VertexFormat,
  BoxGeometry,
  Cartesian3,
  Material,
  Color
} from 'cesium'
import { CesiumKey, CESIUM_BASE_URL } from '@/const'
import 'cesium/Build/Cesium/Widgets/widgets.css'

import fs from './material.glsl?raw'

window.CESIUM_BASE_URL = CESIUM_BASE_URL
Ion.defaultAccessToken = CesiumKey

// const matrix4 = new Matrix4()
const rectangle = Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0)

function main(viewer: Viewer) {
  const scene = viewer.scene
  const instance = new GeometryInstance({
    geometry: new BoxGeometry({
      vertexFormat: VertexFormat.POSITION_ONLY,
      maximum: new Cartesian3(250000.0, 250000.0, 250000.0),
      minimum: new Cartesian3(-250000.0, -250000.0, -250000.0)
    })
  })

  scene.primitives.add(
    new Primitive({
      geometryInstances: instance
      // appearance: new MaterialAppearance({
      //   material: new Material({
      //     fabric: {
      //       uniforms: {
      //         u_diffuse: new Color(1.0, 1.0, 0.0, 1.0)
      //       },
      //       source: fs
      //     }
      //   })
      // })
    })
  )

  // viewer.camera.flyTo({
  //   destination: rectangle
  // })
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
      ></div>
    )
  }
})
