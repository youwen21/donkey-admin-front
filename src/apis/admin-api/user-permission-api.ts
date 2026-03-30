import adminAPIClient from '../request/admin-client'
import { toastException } from '@/utils/toast'
import type { APIResponse } from '../types/libdto/common'
import type {
  MenuPermission,
  MyPermissions,
  SetPermissionParams,
  UserPermissionConfigParams,
} from './user-permission-types'

export const userPermissionAPI = {
  my: (params: Record<string, unknown> = {}): Promise<APIResponse<MyPermissions>> => {
    return adminAPIClient.get<APIResponse<MyPermissions>>('/admin-api/v1/user_permission/my', params)
  },

  config: (params: UserPermissionConfigParams): Promise<APIResponse<MenuPermission>> => {
    return adminAPIClient.get<APIResponse<MenuPermission>>(
      '/admin-api/v1/user_permission/config',
      params as unknown as Record<string, unknown>,
    )
  },

  save: (data: SetPermissionParams): Promise<APIResponse<number>> => {
    return adminAPIClient.post<APIResponse<number>>('/admin-api/v1/user_permission/save', data)
  },
}

export default userPermissionAPI
