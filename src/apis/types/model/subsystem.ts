/** Matches backend `Subsystem` (field names align with existing API usage). */
export interface Subsystem {
  id?: number
  name?: string
  domain?: string
  syskey?: string
  secret?: string
  status?: number
  order_no?: number
  create_uid?: number
  /** ISO 8601 string from `time.Time` */
  create_time?: string | null
  update_uid?: number
  /** ISO 8601 string from `time.Time` */
  update_time?: string | null
}
