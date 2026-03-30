import adminAPIClient from '../request/admin-client'
import type { APIResponse } from '../types/libdto/common'
import type { UserBaseInfo } from '../types/model/user'
import type { LoginForm } from './auth-types'

export const authAPI = {
  login: (params: LoginForm): Promise<APIResponse<UserBaseInfo>> => {
    return adminAPIClient.post<APIResponse<UserBaseInfo>>(`/admin-api/v1/login`, params)
  },

  logout: () => {
    return adminAPIClient.post(`/admin-api/v1/logout`)
  },
}

export const authConstants = {}

export default authAPI
