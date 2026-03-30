import adminAPIClient from '../request/admin-client'
import { toastException } from '@/utils/toast'
import type { PaginatedResponse } from '../types/libdto/common'
import type { APIResponse } from '../types/libdto/common'
import type { RoleExDTO, RoleQueryResEx, RoleQueryParams } from './role-types'
import type { Role } from '../types/model/role'

export const roleAPI = {
    query: (params: RoleQueryParams = {}): Promise<APIResponse<RoleQueryResEx>> => {
    return adminAPIClient.get<APIResponse<RoleQueryResEx>>(
      '/admin-api/v1/role/query',
      params as unknown as Record<string, unknown>,
    )
  },

  get: (params: Record<string, unknown>): Promise<APIResponse<Role>> => {
    return adminAPIClient.get('/admin-api/v1/role/get', params)
  },

  add: (data: Role): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/role/add', data)
  },

  update: (data: Role): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/role/update', data)
  },

  del: (data: Role): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/role/del', data)
  },

  setInfo: (data: Role): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/role/setInfo', data)
  },
}


export default roleAPI
