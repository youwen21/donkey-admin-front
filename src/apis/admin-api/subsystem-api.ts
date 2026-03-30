import adminAPIClient from '../request/admin-client'
import { toastException } from '@/utils/toast'
import type { PaginatedResponse } from '../types/libdto/common'
import type { APIResponse } from '../types/libdto/common'
import type {
  SubsystemExDTO,
  SubsystemQueryResEx,
  SubsystemQueryParams,
} from './subsystem-types'
import type { Subsystem } from '../types/model/subsystem'

export const subsystemAPI = {
  query: (params: SubsystemQueryParams = {}): Promise<APIResponse<SubsystemQueryResEx>> => {
    return adminAPIClient.get<APIResponse<SubsystemQueryResEx>>(
      '/admin-api/v1/subsystem/query',
      params as unknown as Record<string, unknown>,
    )
  },

  get: (params: Record<string, unknown>): Promise<APIResponse<Subsystem>> => {
    return adminAPIClient.get('/admin-api/v1/subsystem/get', params)
  },

  add: (data: Subsystem): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/subsystem/add', data)
  },

  update: (data: Subsystem): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/subsystem/update', data)
  },

  del: (data: Subsystem): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/subsystem/del', data)
  },

  setInfo: (data: Subsystem): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/subsystem/setInfo', data)
  },
}


export default subsystemAPI
