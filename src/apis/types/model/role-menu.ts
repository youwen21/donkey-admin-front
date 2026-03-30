/** Matches backend `RoleMenu`. */
export interface RoleMenu {
  id: number
  /** 角色 ID */
  role_id: number
  /** 系统 id */
  system_id: number
  /** 菜单 id */
  menu_id: number
  /** 菜单下的可用操作 */
  opera_ids: string
}
