import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// 用户相关 API 接口
export const userAPI = {
  /**
   * 查询用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.name - 登录名（搜索）
   * @param {string} params.real_name - 真实名字（搜索）
   * @param {number} params.status - 状态筛选 1:在职，0:离职
   * @param {number} params.org_id - 所属组织ID
   * @param {number} params.role_id - 角色ID
   * @returns {Promise} 返回用户列表的 Promise
   */
  query: (params = {}) => {
    return adminAPIClient.get('/admin-api/v1/user/query', params)
  },

  /**
   * 获取单个用户详情
   * @param {Object} params - 查询参数
   * @param {number} params.id - 用户ID
   * @returns {Promise} 返回用户详情的 Promise
   */
  get: (params) => {
    return adminAPIClient.get('/admin-api/v1/user/get', params)
  },

  /**
   * 新增用户
   * @param {Object} data - 用户数据
   * @param {string} data.name - 登录名
   * @param {string} data.password - 密码
   * @param {string} data.real_name - 真实名字
   * @param {number} data.is_root - 是否root用户 0:否 1:是
   * @param {number} data.is_staff - 是否内部员工 0:否 1:是
   * @param {number} data.staff_no - 员工号
   * @param {string} data.email - 员工邮箱
   * @param {string} data.phone - 员工手机号
   * @param {number} data.status - 是否在职 1:在职，0:离职
   * @param {string} data.avatar - 用户头像
   * @param {number} data.role_id - 角色id
   * @param {number} data.org_id - 所属组织
   * @returns {Promise} 返回新增结果的 Promise
   */
  add: (data) => {
    return adminAPIClient.post('/admin-api/v1/user/add', data)
  },

  /**
   * 更新用户
   * @param {Object} data - 用户数据
   * @param {number} data.id - 用户ID
   * @param {string} data.name - 登录名
   * @param {string} data.password - 密码（可选，不传则不更新）
   * @param {string} data.real_name - 真实名字
   * @param {number} data.is_root - 是否root用户 2:否 1:是
   * @param {number} data.is_staff - 是否内部员工 2:否 1:是
   * @param {number} data.staff_no - 员工号
   * @param {string} data.email - 员工邮箱
   * @param {string} data.phone - 员工手机号
   * @param {number} data.status - 是否在职 1:在职，2:离职
   * @param {string} data.avatar - 用户头像
   * @param {number} data.role_id - 角色id
   * @param {number} data.org_id - 所属组织
   * @returns {Promise} 返回更新结果的 Promise
   */
  update: (data) => {
    return adminAPIClient.post('/admin-api/v1/user/update', data)
  },

    /**
   * 删除用户
   * @param {Object} data - 删除参数
   * @param {number} data.id - 用户ID
   * @returns {Promise} 返回删除结果的 Promise
   */
    del: (data) => {
        return adminAPIClient.post('/admin-api/v1/user/del', data)
    },

    /**
   * 设置用户信息, 允许0和“”空字符串
   * @param {Object} data - 用户数据
   * @param {number} data.id - 用户ID
   * @param {string} data.name - 登录名
   * @param {string} data.real_name - 真实名字
   * @param {number} data.is_root - 是否root用户 2:否 1:是
   * @param {number} data.is_staff - 是否内部员工 2:否 1:是
   * @param {number} data.staff_no - 员工号
   * @param {string} data.email - 员工邮箱
   * @param {string} data.phone - 员工手机号
   * @param {number} data.status - 是否在职 1:在职，2:离职
   * @param {string} data.avatar - 用户头像
   * @param {number} data.role_id - 角色id
   * @param {number} data.org_id - 所属组织
   * @returns {Promise} 返回更新结果的 Promise
   */
  setInfo: (data) => {
    return adminAPIClient.post('/admin-api/v1/user/setInfo', data)
  },
}

/**
 * 获取用户详情（带 Toast 提示，自动处理异常）
 * @param {Object} params - 查询参数
 * @param {number} params.id - 用户ID
 * @returns {Promise<Object|null>} 返回用户详情，异常时返回 null
 */
const userGet = async (params) => {
  try {
    const response = await userAPI.get(params)
    return response?.data || response
  } catch (error) {
    toastException(error, '获取用户详情失败')
    return null
  }
}

// 默认导出
export default userAPI
export { userGet }

