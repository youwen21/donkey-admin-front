import type { APIResponse } from '../types/libdto/common'
import type { Menu } from '../types/model/menu'
import type { Operation } from '../types/model/operation'

/** Matches backend `ConfigParams` (request query + `MenuPermission.form`). */
export interface ConfigParams {
  system_id: number
  user_id: number
}

export type UserPermissionConfigParams = ConfigParams

/** Matches backend `UserPermissions`. */
export interface UserPermissions {
  menu_id_list: number[]
  operation_id_list: number[]
}

/** Matches backend `SetPermissionParams` (embeds `ConfigParams`, `UserPermissions`). */
export type SetPermissionParams = ConfigParams &
  UserPermissions & {
    /** 操作人用户 id */
    operator_uid: number
  }

/** Matches backend `MenuOperation` (embeds `model.Menu` + `operations`). */
export interface MenuOperation extends Menu {
  operations: Operation[]
}

/** Matches backend `MenuPermission`. */
export interface MenuPermission {
  form: ConfigParams | null
  is_root: boolean
  system_menu: MenuOperation[]
  user_permissions: UserPermissions | null
}

export type MenuPermissionResponse = APIResponse<MenuPermission>

/** Matches backend `MenuActions` (`id` = menu id). */
export interface MenuActions {
  id: number
  url: string
  name: string
  node_path: string
  actions: string[]
}

/** Matches backend `MyPermissions`. */
export interface MyPermissions {
  isRoot: boolean
  menuActions: MenuActions[]
}

export type MyPermissionsResponse = APIResponse<MyPermissions>
