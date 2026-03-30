/** Matches backend `UserRole`. */
export interface UserRole {
  id: number
  /** 用户 id */
  user_id: number
  /** 角色 id */
  role_id: number
  create_uid: number
  /** ISO 8601 string from `time.Time` */
  create_time: string | null
}
