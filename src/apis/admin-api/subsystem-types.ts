import type { APIResponse, OrderForm, PageForm } from '../types/libdto/common'
import type { Subsystem as SubsystemModel } from '../types/model/subsystem'

export type Subsystem = SubsystemModel

/** Matches backend `SubsystemQueryRes` (`list` of `model.Subsystem`). */
export interface SubsystemQueryRes {
  total: number
  list: SubsystemModel[]
}

/** Matches backend `SubsystemExDTO` (embeds `model.Subsystem`). */
export interface SubsystemExDTO extends SubsystemModel {}

/** Matches backend `SubsystemQueryResEx`. */
export interface SubsystemQueryResEx {
  total: number
  list: SubsystemExDTO[]
}

/** Matches backend `SubsystemQueryForm`. */
export type SubsystemQueryParams = Partial<SubsystemModel> &
  Partial<PageForm> &
  Partial<OrderForm> & {
    search_key?: string
    ids?: string
    id_list?: number[]
  }

/** `subsystem/query` — `APIResponse` wrapping `SubsystemQueryResEx`. */
export type SubsystemListResponse = APIResponse<SubsystemQueryResEx>
