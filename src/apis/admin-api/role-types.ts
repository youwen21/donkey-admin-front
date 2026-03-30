import type { APIResponse, OrderForm, PageForm } from '../types/libdto/common'
import type { Role as RoleModel } from '../types/model/role'

export type Role = RoleModel

/** Matches backend `RoleExDTO` (embeds `model.Role`). */
export interface RoleExDTO extends RoleModel {}

/** Matches backend `RoleQueryResEx`. */
export interface RoleQueryResEx {
  total: number
  list: RoleExDTO[]
}

/** Matches backend `RoleQueryForm`. */
export type RoleQueryParams = Partial<RoleModel> &
  Partial<PageForm> &
  Partial<OrderForm> & {
    search_key?: string
    ids?: string
    id_list?: number[]
  }

/** `role/query` — `APIResponse` wrapping `RoleQueryResEx`. */
export type RoleListResponse = APIResponse<RoleQueryResEx>
