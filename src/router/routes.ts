import type { RouteRecordRaw } from 'vue-router'
import HelloWorld from '../views/HelloWorld'

type _RouteRecordRaw = RouteRecordRaw & {
  meta: {
    title: string
    sider?: {
      label: string
    }
  }
}

const routes: _RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    meta: {
      title: 'HelloWorld',
      sider: {
        label: 'HelloWorld'
      }
    }
  },
  {
    path: '/heart-point',
    name: 'HeartPoint',
    component: () => import('@/views/HeartPoint'),
    meta: {
      title: 'HeartPoint',
      sider: {
        label: 'HeartPoint'
      }
    }
  },
  {
    path: '/click-point',
    name: 'ClickPoint',
    component: () => import('@/views/ClickPoint'),
    meta: {
      title: 'ClickPoint',
      sider: {
        label: 'ClickPoint'
      }
    }
  }
]

export default routes
