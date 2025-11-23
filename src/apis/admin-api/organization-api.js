import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// 组织相关 API 接口
export const orgAPI = {
  /**
   * 查询组织列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.name - 组织名称（搜索）
   * @param {number} params.status - 状态筛选
   * @returns {Promise} 返回组织列表的 Promise
   */
  query: (params = {}) => {
    return adminAPIClient.get('/admin-api/v1/organization/query', params)
  },

  /**
   * 获取单个组织详情
   * @param {Object} params - 查询参数
   * @param {number} params.id - 组织ID
   * @returns {Promise} 返回组织详情的 Promise
   */
  get: (params) => {
    return adminAPIClient.get('/admin-api/v1/organization/get', params)
  },

  /**
   * 新增组织
   * @param {Object} data - 组织数据
   * @param {number} data.parent_id - 上级组织ID
   * @param {string} data.name - 组织名称
   * @param {number} data.level - 组织级别
   * @param {string} data.node_path - 组织节点路径
   * @param {number} data.status - 状态 1启用 2禁用
   * @param {number} data.order_no - 序号
   * @returns {Promise} 返回新增结果的 Promise
   */
  add: (data) => {
    return adminAPIClient.post('/admin-api/v1/organization/add', data)
  },

  /**
   * 更新组织
   * @param {Object} data - 组织数据
   * @param {number} data.id - 组织ID
   * @param {number} data.parent_id - 上级组织ID
   * @param {string} data.name - 组织名称
   * @param {number} data.level - 组织级别
   * @param {string} data.node_path - 组织节点路径
   * @param {number} data.status - 状态 1启用 2禁用
   * @param {number} data.order_no - 序号
   * @returns {Promise} 返回更新结果的 Promise
   */
  update: (data) => {
    return adminAPIClient.post('/admin-api/v1/organization/update', data)
  },

  /**
   * 删除组织
   * @param {Object} data - 删除参数
   * @param {number} data.id - 组织ID
   * @returns {Promise} 返回删除结果的 Promise
   */
  del: (data) => {
    return adminAPIClient.post('/admin-api/v1/organization/del', data)
  },

  /**
   * 设置组织信息, 允许0和""空字符串
   * @param {Object} data - 组织数据
   * @param {number} data.id - 组织ID
   * @param {number} data.parent_id - 上级组织ID
   * @param {string} data.name - 组织名称
   * @param {number} data.level - 组织级别
   * @param {string} data.node_path - 组织节点路径
   * @param {number} data.status - 状态 1启用 2禁用
   * @param {number} data.order_no - 序号
   * @returns {Promise} 返回更新结果的 Promise
   */
  setInfo: (data) => {
    return adminAPIClient.post('/admin-api/v1/organization/setInfo', data)
  },


}

const orgGet = async (params) => {
  try {
    const response = await adminAPIClient.get('/admin-api/v1/organization/get', params)
    return response?.data || response
  } catch (error) {
    toastException(error, '获取组织详情失败')
    return null
  }
}

/**
 * 查询组织列表（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.name - 组织名称（搜索）
 * @param {number} params.status - 状态筛选
 * @param {string} errorTitle - 错误提示标题，默认 '获取组织列表失败'
 * @returns {Promise<{list: Array, total: number}>} 返回组织列表和总数，异常时返回 {list: [], total: 0}
 */
const orgQuery = async (params = {}, errorTitle = '获取组织列表失败') => {
  try {
    const response = await orgAPI.query(params)
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

const orgFetchList = async () => {
  const params = {
    page: 1,
    pageSize: 1000
  }
  return orgQuery(params)
  }

// 默认导出
export default orgAPI
export { orgQuery, orgGet, orgFetchList }
