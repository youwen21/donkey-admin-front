/** Matches backend `Role`. */
export interface Role {
  id?: number
  /** 角色名称 */
  name?: string
  /** 角色状态：1 启用，2 禁用 */
  status?: number
  create_uid?: number
  /** ISO 8601 string from `time.Time` */
  create_time?: string | null
  update_uid?: number
  /** ISO 8601 string from `time.Time` */
  update_time?: string | null
}
