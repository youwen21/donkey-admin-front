import type { App } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface MenuAction {
  id?: number
  url: string
  name?: string
  node_path?: string
  actions: string[] | null
}

export interface PermissionsState {
  isRoot?: boolean
  menuActions?: MenuAction[]
  [key: string]: unknown
}

export interface PermissionPlugOptions {
  env?: string
  storageKey?: string
}

export type PermissionPlug = ReturnType<typeof createPermissionPlug>

export const createPermissionPlug = (opts: PermissionPlugOptions) => {
  const plug = {
    app: null as App | null,
    options: opts as PermissionPlugOptions,
    permissions: {} as PermissionsState,

    install(app: App, options?: PermissionPlugOptions) {
      this.options = { ...opts, ...options }
      this.initByStorage()

      if (this.isDev()) {
        console.log('permission install', options)
      }

      const self = this
      app.directive('check-action-perm', (el, binding) => {
        if (self.checkActionPerm(binding.value as string)) {
          ;(el as HTMLElement).style.display = 'block'
        } else {
          ;(el as HTMLElement).style.display = 'none'
        }
      })

      app.config.globalProperties.$permPlug = this
      this.app = app

      app.config.globalProperties.$checkActionPerm = (action: string) =>
        this.checkActionPerm(action)
      app.config.globalProperties.$checkPathPerm = (path: string) => this.checkPathPerm(path)
      app.config.globalProperties.$checkPathActionPerm = (path: string, action: string) =>
        this.checkPathActionPerm(path, action)
    },

    isDev() {
      return this.options.env === 'dev'
    },

    initByStorage() {
      if (typeof this.options.storageKey === 'string') {
        const permission = localStorage.getItem(this.options.storageKey)
        if (permission) {
          this.setPermissions(JSON.parse(permission) as PermissionsState)
        }
      }
    },

    saveToStorage(permissions: PermissionsState) {
      if (typeof this.options.storageKey === 'string') {
        localStorage.setItem(this.options.storageKey, JSON.stringify(permissions))
      }
    },

    setPermissions(permissions: PermissionsState) {
      this.permissions = permissions
      this.saveToStorage(permissions)
      if (this.isDev()) {
        console.log('set permission', permissions)
      }
    },

    permissionsIsSet() {
      if (this.isDev()) {
        console.log('permissionsIsSet', this.permissions)
      }

      return this.permissions && Object.keys(this.permissions).length > 0
    },

    checkPathPerm(path: string) {
      if (this.isDev()) {
        console.log('check route path permission', path)
        console.log('permission data', this.permissions)
      }

      if (!this.permissionsIsSet()) {
        return false
      }
      if (this.permissions.isRoot) {
        return true
      }

      const menus = this.permissions.menuActions
      if (!menus) return false

      for (const menuAction of menus) {
        const menuPath = this.getMenuPath(menuAction.url)
        if (menuPath === path) {
          return true
        }
      }
      return false
    },

    checkActionPerm(action: string) {
      const route = this.app?.config.globalProperties.$route as
        | RouteLocationNormalizedLoaded
        | undefined
      if (!route) return false
      return this.checkPathActionPerm(route.path, action)
    },

    checkPathActionPerm(path: string, action: string) {
      if (this.isDev()) {
        console.log('check route path button permission', path, action)
        console.log('permission data', this.permissions)
      }

      if (!this.permissionsIsSet()) {
        return false
      }
      if (this.permissions.isRoot) {
        return true
      }

      if (!this.permissions.menuActions) {
        return false
      }

      const menuAction = this.permissions.menuActions.find((item) => {
        const menuPath = this.getMenuPath(item.url)
        return menuPath === path
      })
      if (!menuAction) {
        return false
      }

      if (!menuAction.actions) {
        return false
      }
      return menuAction.actions.includes(action)
    },

    getMenuPath(menuUrl: string) {
      if (menuUrl.includes('?')) {
        return menuUrl.split('?')[0]
      }
      return menuUrl
    },
  }
  return plug
}

export const permissionPlugInstance = createPermissionPlug({})
