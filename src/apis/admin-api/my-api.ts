import adminAPIClient from '../request/admin-client'
import type { APIResponse } from '../types/libdto/common'
import type { StaffInfo } from '../types/model/user'

export const myAPI = {
  staffInfo: (): Promise<APIResponse<StaffInfo>> => {
    return adminAPIClient.get<APIResponse<StaffInfo>>('/admin-api/v1/my/staffInfo')
  },
}

export default myAPI
