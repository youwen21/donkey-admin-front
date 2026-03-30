/** Matches backend `Organization`. */
export interface Organization {
  id?: number
  /** 上级组织 ID */
  parent_id?: number
  /** 组织名称 */
  name?: string
  /** 组织级别 */
  level?: number
  /** 组织节点路径 */
  node_path?: string
  /** 状态：1 启用 2 禁用 0 删除 */
  status?: number
  /** 序号 */
  order_no?: number
  create_uid?: number
  /** ISO 8601 string from `time.Time` */
  create_time?: string | null
  update_uid?: number
  /** ISO 8601 string from `time.Time` */
  update_time?: string | null
}
