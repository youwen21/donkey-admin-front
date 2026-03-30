import type { APIResponse, OrderForm, PageForm } from '../types/libdto/common'
import type { User as UserModel } from '../types/model/user'

export type User = UserModel

/** Matches backend `UserQueryRes` (`list` of `model.User`). */
export interface UserQueryRes {
  total: number
  list: UserModel[]
}

/** Matches backend `UserExDTO` (embeds `model.User`). */
export interface UserExDTO extends UserModel {}

/** Matches backend `UserQueryResEx`. */
export interface UserQueryResEx {
  total: number
  list: UserExDTO[]
}

/** Matches backend `UserQueryForm`. */
export type UserQueryParams = Partial<UserModel> &
  Partial<PageForm> &
  Partial<OrderForm> & {
    search_key?: string
    ids?: string
    id_list?: number[]
  }

/** `user/query` — `APIResponse` wrapping `UserQueryResEx`. */
export type UserListResponse = APIResponse<UserQueryResEx>
