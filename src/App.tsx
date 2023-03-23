import { defineComponent, ref, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import {
  NLayout,
  NLayoutSider,
  NLayoutFooter,
  NLayoutHeader,
  NMenu,
  type MenuOption
} from 'naive-ui'
import routes from './router/routes'

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const key = ref<string | null>(null)

    const menuOptions: MenuOption[] = routes.map((e) => {
      return {
        label: e.meta.sider?.label,
        key: e.name as string,
        routerParams: { name: e.name }
      }
    })

    const handleUpdateMenu = (v: string | null, item: MenuOption) => {
      key.value = v
      router.push(item.routerParams as RouteLocationRaw)
    }

    watchEffect(() => (key.value = route.name as string))

    return {
      key,
      menuOptions,
      handleUpdateMenu
    }
  },
  render() {
    return (
      <NLayout position="absolute">
        <NLayoutHeader
          class="LayoutHeader"
          bordered
        >
          <h3>WebGL Demo</h3>
        </NLayoutHeader>
        {/* Header */}

        <NLayout
          has-sider
          position="absolute"
          class="LayoutMain"
        >
          <NLayoutSider
            width={200}
            bordered
            content-style="padding: 15px"
          >
            <NMenu
              value={this.key}
              options={this.menuOptions}
              onUpdateValue={this.handleUpdateMenu}
            />
          </NLayoutSider>
          {/* Main Sider */}

          <div class="LayoutContent">
            <RouterView />
          </div>
          {/* Main Content */}
        </NLayout>
        {/* Main */}

        <NLayoutFooter
          bordered
          position="absolute"
          style="height: 30px"
        ></NLayoutFooter>
        {/* Footer */}
      </NLayout>
    )
  }
})
