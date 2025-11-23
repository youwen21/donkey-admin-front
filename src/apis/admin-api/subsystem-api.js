import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// 子系统相关 API 接口
export const subsystemAPI = {
  /**
   * 查询子系统列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.name - 子系统名称（搜索）
   * @param {string} params.domain - 域名（搜索）
   * @param {string} params.syskey - 系统key（搜索）
   * @param {number} params.status - 状态筛选 1:有效，2:禁用
   * @returns {Promise} 返回子系统列表的 Promise
   */
  query: (params = {}) => {
    return adminAPIClient.get('/admin-api/v1/subsystem/query', params)
  },

  /**
   * 获取单个子系统详情
   * @param {Object} params - 查询参数
   * @param {number} params.id - 子系统ID
   * @returns {Promise} 返回子系统详情的 Promise
   */
  get: (params) => {
    return adminAPIClient.get('/admin-api/v1/subsystem/get', params)
  },

  /**
   * 新增子系统
   * @param {Object} data - 子系统数据
   * @param {string} data.name - 名称
   * @param {string} data.domain - 域名
   * @param {string} data.syskey - key
   * @param {string} data.secret - secret
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 排序
   * @returns {Promise} 返回新增结果的 Promise
   */
  add: (data) => {
    return adminAPIClient.post('/admin-api/v1/subsystem/add', data)
  },

  /**
   * 更新子系统
   * @param {Object} data - 子系统数据
   * @param {number} data.id - 子系统ID
   * @param {string} data.name - 名称
   * @param {string} data.domain - 域名
   * @param {string} data.syskey - key
   * @param {string} data.secret - secret
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 排序
   * @returns {Promise} 返回更新结果的 Promise
   */
  update: (data) => {
    return adminAPIClient.post('/admin-api/v1/subsystem/update', data)
  },

  /**
   * 删除子系统
   * @param {Object} data - 删除参数
   * @param {number} data.id - 子系统ID
   * @returns {Promise} 返回删除结果的 Promise
   */
  del: (data) => {
    return adminAPIClient.post('/admin-api/v1/subsystem/del', data)
  },

  /**
   * 设置子系统信息, 允许0和""空字符串
   * @param {Object} data - 子系统数据
   * @param {number} data.id - 子系统ID
   * @param {string} data.name - 名称
   * @param {string} data.domain - 域名
   * @param {string} data.syskey - key
   * @param {string} data.secret - secret
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 排序
   * @returns {Promise} 返回更新结果的 Promise
   */
  setInfo: (data) => {
    return adminAPIClient.post('/admin-api/v1/subsystem/setInfo', data)
  },
}

/**
 * 获取子系统详情（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.id - 子系统ID
 * @returns {Promise<Object|null>} 返回子系统详情，异常时返回 null
 */
const subsystemGet = async (params) => {
  try {
    const response = await subsystemAPI.get(params)
    return response?.data || response
  } catch (error) {
    toastException(error, '获取子系统详情失败')
    return null
  }
}

/**
 * 查询子系统列表（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.name - 子系统名称（搜索）
 * @param {string} params.domain - 域名（搜索）
 * @param {string} params.syskey - 系统key（搜索）
 * @param {number} params.status - 状态筛选 1:有效，2:禁用
 * @param {string} errorTitle - 错误提示标题，默认 '获取子系统列表失败'
 * @returns {Promise<{list: Array, total: number}>} 返回子系统列表和总数，异常时返回 {list: [], total: 0}
 */
const subsystemQuery = async (params = {}, errorTitle = '获取子系统列表失败') => {
  try {
    const response = await subsystemAPI.query(params)
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

/**
 * 获取所有子系统列表（用于下拉选择）
 * @returns {Promise<{list: Array, total: number}>} 返回子系统列表和总数
 */
const subsystemFetchList = async () => {
  const params = {
    page: 1,
    pageSize: 1000
  }
  return subsystemQuery(params, '获取子系统列表失败')
}

// 默认导出
export default subsystemAPI
export { subsystemQuery, subsystemGet, subsystemFetchList }
