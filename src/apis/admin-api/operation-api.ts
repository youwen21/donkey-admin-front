import adminAPIClient from '../request/admin-client'
import { toastException } from '@/utils/toast'
import type { APIResponse } from '../types/libdto/common'
import type { PaginatedResponse } from '../types/libdto/common'
import type {
  Operation,
  OperationExDTO,
  OperationGetParams,
  OperationQueryResEx,
  OperationQueryParams,
} from './operation-types'

export const operationAPI = {
  query: (params: OperationQueryParams = {}): Promise<APIResponse<OperationQueryResEx>> => {
    return adminAPIClient.get<APIResponse<OperationQueryResEx>>(
      '/admin-api/v1/operation/query',
      params as unknown as Record<string, unknown>,
    )
  },

  get: (params: OperationGetParams): Promise<APIResponse<Operation>> => {
    return adminAPIClient.get<APIResponse<Operation>>(
      '/admin-api/v1/operation/get',
      params as unknown as Record<string, unknown>,
    )
  },

  add: (data: Operation): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/operation/add', data)
  },

  update: (data: Operation): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/operation/update', data)
  },

  del: (data: Operation): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/operation/del', data)
  },

  setInfo: (data: Operation): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/operation/setInfo', data)
  },
}


export default operationAPI
