
const permissionsDemo = {
    "isRoot": false,
    "routesActions": [
        {
            "id": 1,
            "url": "",
            "name": "基础管理",
            "node_path": "/",
            "actions": null
        },
        {
            "id": 4,
            "url": "/admin/org/list",
            "name": "组织",
            "node_path": "/1/",
            "actions": [
                "testt"
            ]
        },
        {
            "id": 5,
            "url": "/admin/user/list",
            "name": "用户",
            "node_path": "/1/",
            "actions": null
        },
        {
            "id": 6,
            "url": "/admin/role/list",
            "name": "角色",
            "node_path": "/1/",
            "actions": null
        }
    ]
}

export const createPermissionPlug = (opts) => {
    return {
        app: null,
        options: opts, // 初始配置

        permissions: {},

        install(app, options) {
            this.options = { ...opts, ...options } // 合并配置，后者的配置会覆盖前者
            this.initByStorage()

            if (this.isDev()) {
                console.log("permission install", options)
            }

            // 注册全局组件
            // app.component('my-component', {
            //   template: '<div>My Custom Component</div>'
            // });

            // 注册全局指令
            app.directive('check-action-perm', (el, binding) => {
              if (permissionPlugInstance.checkActionPerm(binding.value)) {
                el.style.display = 'block';
              } else {
                el.style.display = 'none';
              }
            });


            // 全局配置
            app.config.globalProperties.$permPlug = this
            this.app = app

            // 提供全局方法 (函数)
            app.config.globalProperties.$checkActionPerm = (action) => this.checkActionPerm(action)
            app.config.globalProperties.$checkRoutePerm = (path) => this.checkRoutePerm(path)
            app.config.globalProperties.$checkRouteActionPerm = (path, action) => this.checkRouteActionPerm(path, action)

            // 注入一个全局可用的 $translate() 方法
            // app.config.globalProperties.$translate = (key) => {
            //   // 获取 `options` 对象的深层属性
            //   // 使用 `key` 作为索引
            //   return key.split('.').reduce((o, i) => {
            //     if (o) return o[i]
            //   }, options)
            // }
        },

        isDev() {
            return this.options.env === 'dev'
        },

        initByStorage() {
            if (typeof this.options.storageKey === 'string') {
                const permission = localStorage.getItem(this.options.storageKey)
                if (permission) {
                    this.setPermissions(JSON.parse(permission))
                }
            }
        },

        saveToStorage(permissions) {
            if (typeof this.options.storageKey === 'string') {
                localStorage.setItem(this.options.storageKey, JSON.stringify(permissions))
            }
        },

        setPermissions(permissions) {
            this.permissions = permissions
            this.saveToStorage(permissions)
            if (this.isDev()) {
                console.log("set permission", permissions)
            }
        },

        permissionsIsSet() {
            console.log("permissionsIsSet", this.permissions)
            
            return this.permissions && Object.keys(this.permissions).length > 0
        },

        checkRoutePerm(path) {
            if (this.isDev()) {
                console.log('check route permission', path);
                console.log("permission data", this.permissions)
            }

            if (!this.permissionsIsSet()) {
                return false
            }
            if (this.permissions.isRoot) {
                return true
            }

            const permissions = this.permissions
            const routesActions = permissions.routesActions
            for (const routeAction of routesActions) {
                const menuPath = this.getMenuPath(routeAction.url)
                if (menuPath === path) {
                    return true
                }
            }
            return false
        },

        checkActionPerm(action) {
            const currentRoute = this.app.config.globalProperties.$route
            return this.checkRouteActionPerm(currentRoute.path, action)
        },

        checkRouteActionPerm(path, action) {
            if (this.isDev()) {
                console.log('check route button permission', path, action);
                console.log("permission data", this.permissions)
            }

            if (!this.permissionsIsSet()) {
                return false
            }
            if (this.permissions.isRoot) {
                return true
            }

            if (!this.permissions.routesActions) {
                return false
            }

            
            const routerPerm = this.permissions.routesActions.find(routeAction => {
                const menuPath = this.getMenuPath(routeAction.url)
                return menuPath === path
            })
            if (!routerPerm) {
                return false
            }

            const actions = routerPerm.actions
            return actions.includes(action)
        },

        // 获取菜单路径, item.url格式 是 /xxx/xxx 或者  /xxx/xxx?param=value, 返回 /xxx/xxx
        getMenuPath(menuUrl) {
            // 如果 url 包含 ?，则返回 url 的 path
            if (menuUrl.includes('?')) {
                return menuUrl.split('?')[0]
            }

            // 否则返回 url
            return menuUrl
        }
    }
}

const permissionPlugInstance = createPermissionPlug({})

export { permissionPlugInstance }