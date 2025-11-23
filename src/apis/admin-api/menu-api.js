import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// 菜单相关 API 接口
export const menuAPI = {
  /**
   * 获取树形菜单列表
   * @returns {Promise} 返回菜单树数据的 Promise
   */
  getTreeMenu: () => {
    return adminAPIClient.get(`/admin-api/v1/treeMenu`)
  },

  /**
   * 查询菜单列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.name - 菜单名称（搜索）
   * @param {number} params.status - 状态筛选 1:有效，2:禁用
   * @param {number} params.system_id - 子系统ID
   * @param {number} params.parent_id - 上级菜单ID
   * @returns {Promise} 返回菜单列表的 Promise
   */
  query: (params = {}) => {
    return adminAPIClient.get('/admin-api/v1/menu/query', params)
  },

  /**
   * 获取单个菜单详情
   * @param {Object} params - 查询参数
   * @param {number} params.id - 菜单ID
   * @returns {Promise} 返回菜单详情的 Promise
   */
  get: (params) => {
    return adminAPIClient.get('/admin-api/v1/menu/get', params)
  },

  /**
   * 新增菜单
   * @param {Object} data - 菜单数据
   * @param {number} data.system_id - 子系统ID
   * @param {number} data.parent_id - 上级菜单ID
   * @param {string} data.name - 菜单名
   * @param {number} data.level - 菜单级别
   * @param {string} data.node_path - 菜单节点路径
   * @param {string} data.url - url
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 菜单排序
   * @returns {Promise} 返回新增结果的 Promise
   */
  add: (data) => {
    return adminAPIClient.post('/admin-api/v1/menu/add', data)
  },

  /**
   * 更新菜单
   * @param {Object} data - 菜单数据
   * @param {number} data.id - 菜单ID
   * @param {number} data.system_id - 子系统ID
   * @param {number} data.parent_id - 上级菜单ID
   * @param {string} data.name - 菜单名
   * @param {number} data.level - 菜单级别
   * @param {string} data.node_path - 菜单节点路径
   * @param {string} data.url - url
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 菜单排序
   * @returns {Promise} 返回更新结果的 Promise
   */
  update: (data) => {
    return adminAPIClient.post('/admin-api/v1/menu/update', data)
  },

  /**
   * 删除菜单
   * @param {Object} data - 删除参数
   * @param {number} data.id - 菜单ID
   * @returns {Promise} 返回删除结果的 Promise
   */
  del: (data) => {
    return adminAPIClient.post('/admin-api/v1/menu/del', data)
  },

  /**
   * 设置菜单信息, 允许0和""空字符串
   * @param {Object} data - 菜单数据
   * @param {number} data.id - 菜单ID
   * @param {number} data.system_id - 子系统ID
   * @param {number} data.parent_id - 上级菜单ID
   * @param {string} data.name - 菜单名
   * @param {number} data.level - 菜单级别
   * @param {string} data.node_path - 菜单节点路径
   * @param {string} data.url - url
   * @param {number} data.status - 状态 1:有效，2:禁用
   * @param {number} data.order_no - 菜单排序
   * @returns {Promise} 返回更新结果的 Promise
   */
  setInfo: (data) => {
    return adminAPIClient.post('/admin-api/v1/menu/setInfo', data)
  },
}

/**
 * 获取菜单详情（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.id - 菜单ID
 * @returns {Promise<Object|null>} 返回菜单详情，异常时返回 null
 */
const menuGet = async (params) => {
  try {
    const response = await menuAPI.get(params)
    return response?.data || response
  } catch (error) {
    toastException(error, '获取菜单详情失败')
    return null
  }
}

/**
 * 查询菜单列表（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.name - 菜单名称（搜索）
 * @param {number} params.status - 状态筛选 1:有效，2:禁用
 * @param {number} params.system_id - 子系统ID
 * @param {number} params.parent_id - 上级菜单ID
 * @param {string} errorTitle - 错误提示标题，默认 '获取菜单列表失败'
 * @returns {Promise<{list: Array, total: number}>} 返回菜单列表和总数，异常时返回 {list: [], total: 0}
 */
const menuQuery = async (params = {}, errorTitle = '获取菜单列表失败') => {
  try {
    const response = await menuAPI.query(params)
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
 * 获取所有菜单列表（用于下拉选择）
 * @returns {Promise<{list: Array, total: number}>} 返回菜单列表和总数
 */
const menuFetchList = async () => {
  const params = {
    page: 1,
    pageSize: 1000
  }
  return menuQuery(params, '获取菜单列表失败')
}

// 默认导出
export default menuAPI
export { menuQuery, menuGet, menuFetchList }

