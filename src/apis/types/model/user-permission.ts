/** Matches backend `UserPermission`. */
export interface UserPermission {
  id: number
  /** 用户 id */
  user_id: number
  /** 系统 id */
  system_id: number
  /** 菜单 id */
  menu_id: number
  /** 菜单下的可用操作 */
  opera_ids: string
  /** 创建人 id */
  create_uid: number
  /** ISO 8601 string from `time.Time` */
  create_time: string | null
  /** 更新用户 id */
  update_uid: number
  /** ISO 8601 string from `time.Time` */
  update_time: string | null
}
