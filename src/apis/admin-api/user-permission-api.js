import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// 菜单权限相关 API 接口
export const userPermissionAPI = {
  /**
   * 获取当前用户菜单权限配置
   * @param {Object} params - 查询参数
   * @param {number} params.system_id - 子系统ID
   * @returns {Promise} 返回当前用户权限配置的 Promise
   * 
   * 返回数据结构：
   * {
   *   isRoot: boolean,
   *   routesActions: Array<{
   *     path: string,
   *     actions: string[]
   *   }>
   * }
   * 
   * 示例：
   * {
   *   "isRoot": false,
   *   "routesActions": [
   *     {
   *       "path": "/admin/demo",
   *       "actions": ["add", "del"]
   *     }
   *   ]
   * }
   */
  my:(params) => {
    return adminAPIClient.get('/admin-api/v1/user_permission/my', params)
  },



  /**
   * 获取菜单权限详情
   * @param {Object} params - 查询参数
   * @param {number} params.system_id - 子系统ID
   * @param {number} params.user_id - 用户ID
   * @returns {Promise} 返回菜单权限详情的 Promise
   * 
   * 返回数据结构：
   * {
   *   form: { system_id: number, user_id: number },
   *   is_root: boolean,
   *   system_menu: Array<{
   *     // Menu 字段
   *     id: number,
   *     system_id: number,
   *     parent_id: number,
   *     name: string,
   *     level: number,
   *     node_path: string,
   *     url: string,
   *     status: number,
   *     order_no: number,
   *     // Operations 数组
   *     operations: Array<{
   *       id: number,
   *       system_id: number,
   *       menu_id: number,
   *       name: string,
   *       code: string,
   *       status: number,
   *       order_no: number
   *     }>
   *   }>,
   *   user_permissions: {
   *     menu_id_list: number[],
   *     operation_id_list: number[]
   *   }
   * }
   */
  config: (params) => {
    return adminAPIClient.get('/admin-api/v1/user_permission/config', params)
  },

  /**
   * 设置用户菜单权限
   * @param {Object} data - 权限数据
   * @param {number} data.system_id - 子系统ID
   * @param {number} data.user_id - 用户ID
   * @param {number[]} data.menu_id_list - 菜单ID列表
   * @param {number[]} data.operation_id_list - 操作ID列表
   * @returns {Promise} 返回设置结果的 Promise
   */
  save: (data) => {
    return adminAPIClient.post('/admin-api/v1/user_permission/save', data)
  },
}

/**
 * 获取菜单权限详情（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.system_id - 子系统ID
 * @param {number} params.user_id - 用户ID
 * @returns {Promise<Object|null>} 返回菜单权限详情，异常时返回 null
 */
const userPermissionConfig = async (params) => {
  try {
    const response = await userPermissionAPI.config(params)
    return response?.data || response
  } catch (error) {
    toastException(error, '获取菜单权限配置失败')
    return null
  }
}

// 默认导出
export default userPermissionAPI
export { userPermissionConfig }