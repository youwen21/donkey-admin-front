/** Matches backend `UserBaseInfo`. */
export interface UserBaseInfo {
  id: number
  /** 登录名 */
  name: string
  /** 用户头像 */
  avatar: string
}

/** Matches backend `StaffInfo`. */
export interface StaffInfo {
  /** 真实名字 */
  real_name: string
  /** 员工邮箱 */
  email: string
  /** 员工手机号 */
  phone: string
  /** 角色 id */
  role_id: number
  /** 所属组织 */
  org_id: number
  /** 是否 root 用户 */
  is_root: number
  /** 是否内部员工 */
  is_staff: number
  /** 员工号 */
  staff_no: number
  /** 是否在职：1 在职，0 离职 */
  status: number
}

/** Matches backend `User` (embedded structs flatten in JSON). */
export interface User extends UserBaseInfo, StaffInfo {
  password: string
  create_uid: number
  /** ISO 8601 string from `time.Time` */
  create_time: string | null
  update_uid: number
  /** ISO 8601 string from `time.Time` */
  update_time: string | null
}
