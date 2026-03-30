import adminAPIClient from '../request/admin-client'
import { toastException } from '@/utils/toast'
import type { APIResponse, PaginatedResponse } from '../types/libdto/common'
import type { Menu } from '../types/model/menu'
import type {
  MenuExDTO,
  MenuQueryParams,
  MenuGetParams,
  MenuFormData,
  MenuDeleteParams,
  MenuQueryResEx,
  TreeMenu,
} from './menu-types'

export const menuAPI = {
  getTree: (): Promise<APIResponse<TreeMenu[]>> => {
    return adminAPIClient.get<APIResponse<TreeMenu[]>>(`/admin-api/v1/menu/tree`)
  },

  query: (params: MenuQueryParams = {}): Promise<APIResponse<MenuQueryResEx>> => {
    return adminAPIClient.get<APIResponse<MenuQueryResEx>>(
      '/admin-api/v1/menu/query',
      params as unknown as Record<string, unknown>,
    )
  },

  get: (params: MenuGetParams): Promise<APIResponse<Menu>> => {
    return adminAPIClient.get('/admin-api/v1/menu/get', params as unknown as Record<string, unknown>)
  },

  add: (data: MenuFormData): Promise<APIResponse<Menu>> => {
    return adminAPIClient.post('/admin-api/v1/menu/add', data)
  },

  update: (data: MenuFormData & { id: number }): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/menu/update', data)
  },

  del: (data: MenuDeleteParams): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/menu/del', data)
  },

  setInfo: (data: Partial<MenuFormData> & { id: number }): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/menu/setInfo', data)
  },
}


export default menuAPI
