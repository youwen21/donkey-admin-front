import adminAPIClient from '../request/admin-client.js'

// 我的相关 API 接口
export const myAPI = {
  /**
   * 获取员工信息
   * @returns {Promise<Object>} 返回员工信息的 Promise
   * @returns {Promise<Object>} response - 响应对象
   * @returns {number} response.code - 状态码
   * @returns {string} response.msg - 消息
   * @returns {Object} response.data - 员工信息数据
   * @returns {number} response.data.id - 员工ID
   * @returns {string} response.data.name - 登录名
   * @returns {string} response.data.avatar - 用户头像
   * @returns {string} response.data.real_name - 真实名字
   * @returns {string} response.data.email - 员工邮箱
   * @returns {string} response.data.phone - 员工手机号
   * @returns {number} response.data.role_id - 角色id
   * @returns {number} response.data.org_id - 所属组织
   * @returns {number} response.data.is_root - 是否root用户
   * @returns {number} response.data.is_staff - 是否内部员工
   * @returns {number} response.data.staff_no - 员工号
   * @returns {number} response.data.status - 是否在职，1:在职，0:离职
   */
  staffInfo: () => {
    return adminAPIClient.get('/admin-api/v1/my/staffInfo')
  },
}

// 默认导出
export default myAPI
