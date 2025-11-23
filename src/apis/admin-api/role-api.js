import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// 角色相关 API 接口
export const roleAPI = {
  /**
   * 查询角色列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.name - 角色名称（搜索）
   * @param {number} params.status - 状态筛选 1:启用，2:禁用
   * @returns {Promise} 返回角色列表的 Promise
   */
  query: (params = {}) => {
    return adminAPIClient.get('/admin-api/v1/role/query', params)
  },

  /**
   * 获取单个角色详情
   * @param {Object} params - 查询参数
   * @param {number} params.id - 角色ID
   * @returns {Promise} 返回角色详情的 Promise
   */
  get: (params) => {
    return adminAPIClient.get('/admin-api/v1/role/get', params)
  },

  /**
   * 新增角色
   * @param {Object} data - 角色数据
   * @param {string} data.name - 角色名称
   * @param {number} data.status - 角色状态 1:启用，2:禁用
   * @returns {Promise} 返回新增结果的 Promise
   */
  add: (data) => {
    return adminAPIClient.post('/admin-api/v1/role/add', data)
  },

  /**
   * 更新角色
   * @param {Object} data - 角色数据
   * @param {number} data.id - 角色ID
   * @param {string} data.name - 角色名称
   * @param {number} data.status - 角色状态 1:启用，2:禁用
   * @returns {Promise} 返回更新结果的 Promise
   */
  update: (data) => {
    return adminAPIClient.post('/admin-api/v1/role/update', data)
  },

  /**
   * 删除角色
   * @param {Object} data - 删除参数
   * @param {number} data.id - 角色ID
   * @returns {Promise} 返回删除结果的 Promise
   */
  del: (data) => {
    return adminAPIClient.post('/admin-api/v1/role/del', data)
  },

  /**
   * 设置角色信息, 允许0和""空字符串
   * @param {Object} data - 角色数据
   * @param {number} data.id - 角色ID
   * @param {string} data.name - 角色名称
   * @param {number} data.status - 角色状态 1:启用，2:禁用
   * @returns {Promise} 返回更新结果的 Promise
   */
  setInfo: (data) => {
    return adminAPIClient.post('/admin-api/v1/role/setInfo', data)
  },
}

/**
 * 获取角色详情（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.id - 角色ID
 * @returns {Promise<Object|null>} 返回角色详情，异常时返回 null
 */
const roleGet = async (params) => {
  try {
    const response = await roleAPI.get(params)
    return response?.data || response
  } catch (error) {
    toastException(error, '获取角色详情失败')
    return null
  }
}

/**
 * 查询角色列表（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.name - 角色名称（搜索）
 * @param {number} params.status - 状态筛选 1:启用，2:禁用
 * @param {string} errorTitle - 错误提示标题，默认 '获取角色列表失败'
 * @returns {Promise<{list: Array, total: number}>} 返回角色列表和总数，异常时返回 {list: [], total: 0}
 */
const roleQuery = async (params = {}, errorTitle = '获取角色列表失败') => {
  try {
    const response = await roleAPI.query(params)
    // 支持响应格式：{ data: { list: [], total: 100 } } 或 { list: [], total: 100 }
    const data = response?.data || response
    if (data && typeof data === 'object' && 'list' in data) {
      return {
        list: data.list || [],
        total: data.total || 0
      }
    } else if (Array.isArray(data)) {
      return {
        list: data,
        total: data.length
      }
    }
    return { list: [], total: 0 }
  } catch (error) {
    toastException(error, errorTitle)
    return { list: [], total: 0 }
  }
}

// 默认导出
export default roleAPI
export { roleQuery, roleGet }

