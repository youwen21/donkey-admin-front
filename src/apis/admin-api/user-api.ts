import adminAPIClient from '../request/admin-client'
import { toastException } from '@/utils/toast'
import type { APIResponse } from '../types/libdto/common'
import type { UserQueryResEx, UserQueryParams } from './user-types'
import type { User } from '../types/model/user'

export const userAPI = {
  query: (params: UserQueryParams = {}): Promise<APIResponse<UserQueryResEx>> => {
    return adminAPIClient.get<APIResponse<UserQueryResEx>>(
      '/admin-api/v1/user/query',
      params as unknown as Record<string, unknown>,
    )
  },

  get: (params: Record<string, unknown>): Promise<APIResponse<User>> => {
    return adminAPIClient.get('/admin-api/v1/user/get', params)
  },

  add: (data: User): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/user/add', data)
  },

  update: (data: User): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/user/update', data)
  },

  del: (data: User): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/user/del', data)
  },

  setInfo: (data: User): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/user/setInfo', data)
  },
}


export default userAPI
