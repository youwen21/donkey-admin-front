/** Matches backend `Operation`. */
export interface Operation {
  id?: number
  /** 子系统 ID */
  system_id?: number
  /** 菜单 ID */
  menu_id?: number
  /** 操作名称 */
  name?: string
  /**
   * 操作编号：对应页面 class（按钮显隐）、后台接口操作编号与权限校验
   */
  code?: string
  /** 1: 有效 2: 禁用 */
  status?: number
  /** 排序 */
  order_no?: number
  /** 创建人 id */
  create_uid?: number
  /** ISO 8601 string from `time.Time` */
  create_time?: string | null
  /** 更新用户 id */
  update_uid?: number
  /** ISO 8601 string from `time.Time` */
  update_time?: string | null
}
