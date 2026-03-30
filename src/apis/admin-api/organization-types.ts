import type { APIResponse, OrderForm, PageForm } from '../types/libdto/common'
import type { Organization as OrganizationModel } from '../types/model/organization'

export type Organization = OrganizationModel

/** Matches backend `OrganizationExDTO` (embeds `model.Organization`). */
export interface OrganizationExDTO extends OrganizationModel {}

/** Matches backend `OrganizationQueryResEx`. */
export interface OrganizationQueryResEx {
  total: number
  list: OrganizationExDTO[]
}

/** Matches backend `OrganizationQueryForm`. */
export type OrganizationQueryParams = Partial<OrganizationModel> &
  Partial<PageForm> &
  Partial<OrderForm> & {
    search_key?: string
    ids?: string
    id_list?: number[]
  }

/** `organization/query` — `APIResponse` wrapping `OrganizationQueryResEx`. */
export type OrganizationListResponse = APIResponse<OrganizationQueryResEx>
