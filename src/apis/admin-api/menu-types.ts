import type { APIResponse, OrderForm, PageForm, PaginatedResponse } from '../types/libdto/common'
import type { Menu  } from '../types/model/menu'


/** Matches backend `MenuExDTO` (embeds `model.Menu`; add extend fields when API adds them). */
export interface MenuExDTO extends Menu {}

/** Matches backend `MenuQueryResEx`. */
export interface MenuQueryResEx {
  total: number
  list: MenuExDTO[]
}

/** Matches backend `TreeMenu` (embeds `model.Menu`, JSON `children`). */
export interface TreeMenu extends Menu {
  children?: TreeMenu[]
}

/** Matches backend `MenuQueryForm` (embeds `model.Menu`, `PageForm`, `OrderForm`). */
export type MenuQueryParams = Partial<Menu> &
  Partial<PageForm> &
  Partial<OrderForm> & {
    search_key?: string
    ids?: string
    id_list?: number[]
  }

export interface MenuFormData {
  id?: number
  system_id: number
  parent_id: number
  name: string
  level: number
  node_path?: string
  url: string
  status: number
  order_no: number
}

export interface MenuDeleteParams {
  id: number
}

export interface MenuGetParams {
  id: number
}

