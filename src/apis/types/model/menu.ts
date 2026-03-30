/** Matches backend `Menu`. */
export interface Menu {
  id: number
  /** 子系统 ID */
  system_id: number
  /** 上级菜单 ID */
  parent_id: number
  /** 菜单名 */
  name: string
  /** 菜单级别 */
  level: number
  /** 菜单路径 */
  node_path: string
  url: string
  /** 1: 有效 2: 禁用 */
  status: number
  /** 菜单排序 */
  order_no: number
  create_uid: number
  /** ISO 8601 string from `time.Time` */
  create_time: string | null
  update_uid: number
  /** ISO 8601 string from `time.Time` */
  update_time: string | null
}
