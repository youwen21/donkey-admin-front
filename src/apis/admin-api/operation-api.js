import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// 操作相关 API 接口
export const operationAPI = {
  /**
   * 查询操作列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.name - 操作名称（搜索）
   * @param {string} params.code - 操作编号（搜索）
   * @param {number} params.status - 状态筛选 1:有效，2:禁用
   * @param {number} params.system_id - 子系统ID
   * @param {number} params.parent_id - 一级菜单ID
   * @param {number} params.menu_id - 菜单ID
   * @returns {Promise} 返回操作列表的 Promise
   */
  query: (params = {}) => {
    return adminAPIClient.get('/admin-api/v1/operation/query', params)
  },

  /**
   * 获取单个操作详情
   * @param {Object} params - 查询参数
   * @param {number} params.id - 操作ID
   * @returns {Promise} 返回操作详情的 Promise
   */
  get: (params) => {
    return adminAPIClient.get('/admin-api/v1/operation/get', params)
  },

  /**
   * 新增操作
   * @param {Object} data - 操作数据
   * @param {number} data.system_id - 子系统ID
   * @param {number} data.menu_id - 菜单ID
   * @param {string} data.name - 操作名称
   * @param {string} data.code - 操作编号，此编号对应页面class，用来控制按钮是否显示，也对应后台接口操作编号，校验用户是否有此操作权限
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 排序
   * @returns {Promise} 返回新增结果的 Promise
   */
  add: (data) => {
    return adminAPIClient.post('/admin-api/v1/operation/add', data)
  },

  /**
   * 更新操作
   * @param {Object} data - 操作数据
   * @param {number} data.id - 操作ID
   * @param {number} data.system_id - 子系统ID
   * @param {number} data.menu_id - 菜单ID
   * @param {string} data.name - 操作名称
   * @param {string} data.code - 操作编号，此编号对应页面class，用来控制按钮是否显示，也对应后台接口操作编号，校验用户是否有此操作权限
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 排序
   * @returns {Promise} 返回更新结果的 Promise
   */
  update: (data) => {
    return adminAPIClient.post('/admin-api/v1/operation/update', data)
  },

  /**
   * 删除操作
   * @param {Object} data - 删除参数
   * @param {number} data.id - 操作ID
   * @returns {Promise} 返回删除结果的 Promise
   */
  del: (data) => {
    return adminAPIClient.post('/admin-api/v1/operation/del', data)
  },

  /**
   * 设置操作信息, 允许0和""空字符串
   * @param {Object} data - 操作数据
   * @param {number} data.id - 操作ID
   * @param {number} data.system_id - 子系统ID
   * @param {number} data.menu_id - 菜单ID
   * @param {string} data.name - 操作名称
   * @param {string} data.code - 操作编号，此编号对应页面class，用来控制按钮是否显示，也对应后台接口操作编号，校验用户是否有此操作权限
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 排序
   * @returns {Promise} 返回更新结果的 Promise
   */
  setInfo: (data) => {
    return adminAPIClient.post('/admin-api/v1/operation/setInfo', data)
  },
}

/**
 * 获取操作详情（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.id - 操作ID
 * @returns {Promise<Object|null>} 返回操作详情，异常时返回 null
 */
const operationGet = async (params) => {
  try {
    const response = await operationAPI.get(params)
    return response?.data || response
  } catch (error) {
    toastException(error, '获取操作详情失败')
    return null
  }
}

/**
 * 查询操作列表（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.name - 操作名称（搜索）
 * @param {string} params.code - 操作编号（搜索）
 * @param {number} params.status - 状态筛选 1:有效，2:禁用
 * @param {number} params.system_id - 子系统ID
 * @param {number} params.menu_id - 菜单ID
 * @param {string} errorTitle - 错误提示标题，默认 '获取操作列表失败'
 * @returns {Promise<{list: Array, total: number}>} 返回操作列表和总数，异常时返回 {list: [], total: 0}
 */
const operationQuery = async (params = {}, errorTitle = '获取操作列表失败') => {
  try {
    const response = await operationAPI.query(params)
    const data = response?.data || response
    if (data && typeof data === 'object' && 'list' in data) {
      return { list: data.list || [], total: data.total || 0 }
    } else if (Array.isArray(data)) {
      return { list: data, total: data.length }
    }
    return { list: [], total: 0 }
  } catch (error) {
    toastException(error, errorTitle)
    return { list: [], total: 0 }
  }
}

/**
 * 获取所有操作列表（用于下拉选择）
 * @returns {Promise<{list: Array, total: number}>} 返回操作列表和总数
 */
const operationFetchList = async () => {
  const params = { page: 1, pageSize: 1000 }
  return operationQuery(params, '获取所有操作列表失败')
}

// 默认导出
export default operationAPI
export { operationQuery, operationGet, operationFetchList }

