import type { APIResponse, OrderForm, PageForm } from '../types/libdto/common'
import type { Operation as OperationModel } from '../types/model/operation'

export type Operation = OperationModel

/** Matches backend `OperationExDTO` (embeds `model.Operation`). */
export interface OperationExDTO extends OperationModel {}

/** Matches backend `OperationQueryResEx`. */
export interface OperationQueryResEx {
  total: number
  list: OperationExDTO[]
}

/** Matches backend `OperationQueryForm`. */
export type OperationQueryParams = Partial<OperationModel> &
  Partial<PageForm> &
  Partial<OrderForm> & {
    search_key?: string
    ids?: string
    id_list?: number[]
  }

/** `operation/query` — `APIResponse` wrapping `OperationQueryResEx`. */
export type OperationListResponse = APIResponse<OperationQueryResEx>

export interface OperationGetParams {
  id: number
}

/** `operation/get` — `APIResponse` wrapping `model.Operation`. */
export type OperationGetResponse = APIResponse<Operation>
