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
  },
  {
    path: '/buffer-vertex',
    name: 'BufferVertex',
    component: () => import('@/views/BufferVertex'),
    meta: {
      title: 'BufferVertex',
      sider: {
        label: 'BufferVertex'
      }
    }
  },
  {
    path: '/base-graph',
    name: 'BaseGraph',
    component: () => import('@/views/BaseGraph'),
    meta: {
      title: 'BaseGraph',
      sider: {
        label: 'BaseGraph'
      }
    }
  },
  {
    path: '/derive-graph',
    name: 'DeriveGraph',
    component: () => import('@/views/DeriveGraph'),
    meta: {
      title: 'DeriveGraph',
      sider: {
        label: 'DeriveGraph'
      }
    }
  }
]

export default routes
