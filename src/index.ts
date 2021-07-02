import { App, Plugin } from 'vue'

import RefreshableScrollView from './components/refreshable-scroll-view'

export function install(app: App) {
  app.component('RefreshableScrollView', RefreshableScrollView)
}

if (typeof window !== 'undefined' && (window as any).Vue) {
  install((window as any).Vue)
}

const plugin: Plugin = {
  install,
}

export default plugin

// re-define: https://github.com/vitejs/vite/issues/2117
export interface RefreshableScrollViewOption {}

export { RefreshableScrollView }
