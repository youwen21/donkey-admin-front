/// <reference types="vite/client" />

import type { PermissionPlug } from './src/plugins/permission'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $permPlug: PermissionPlug
    $checkActionPerm: (action: string) => boolean
    $checkPathPerm: (path: string) => boolean
    $checkPathActionPerm: (path: string, action: string) => boolean
  }
}
