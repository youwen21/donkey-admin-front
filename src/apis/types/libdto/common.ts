/** Matches backend `APIResponse`. */
export interface APIResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  total: number
  list: T[]
  page?: number
  pageSize?: number
}


/** Matches backend `OrderForm`. */
export interface OrderForm {
  orderBy: string[]
  orderDirect: string
}

/** Matches backend `PageForm` (`page` / `pageSize` server defaults: 1 / 20). */
export interface PageForm {
  page: number
  pageSize: number
}
