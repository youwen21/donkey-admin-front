import adminAPIClient from '../request/admin-client'
import { toastException } from '@/utils/toast'
import type { APIResponse, PaginatedResponse } from '../types/libdto/common'
import type {
  OrganizationExDTO,
  OrganizationQueryResEx,
  OrganizationQueryParams,
} from './organization-types'
import type { Organization } from '../types/model/organization'

export const orgAPI = {
  query: (params: OrganizationQueryParams = {}): Promise<APIResponse<OrganizationQueryResEx>> => {
    return adminAPIClient.get<APIResponse<OrganizationQueryResEx>>(
      '/admin-api/v1/organization/query',
      params as unknown as Record<string, unknown>,
    )
  },

  get: (params: Record<string, unknown>): Promise<APIResponse<Organization>> => {
    return adminAPIClient.get('/admin-api/v1/organization/get', params)
  },

  add: (data: Organization): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/organization/add', data)
  },

  update: (data: Organization): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/organization/update', data)
  },

  del: (data: Organization): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/organization/del', data)
  },

  setInfo: (data: Organization): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/organization/setInfo', data)
  },
}



export default orgAPI
