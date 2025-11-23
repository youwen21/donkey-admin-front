import adminAPIClient from '../request/admin-client.js'


// 认证相关 API 接口
export const authAPI = {
  /**
   * 用户登录
   * @param {Object} params - 登录凭证
   * @param {string} params.username - 用户名
   * @param {string} params.password - 密码
   * @returns {Promise} 登录请求的 Promise
   */
  login: (params) => {
    return adminAPIClient.post(`/admin-api/v1/login`, params)
  },

  // 用户登出
  logout: () => {
    return adminAPIClient.post(`/admin-api/v1/logout`)
  },

}

// 认证相关的常量
export const authConstants = {
  // 登录状态
  LOGIN_STATUS: {
    SUCCESS: 'success',
    FAILED: 'failed',
    PENDING: 'pending'
  },

  // 用户状态
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending'
  },

  // 权限级别
  PERMISSION_LEVEL: {
    READ: 'read',
    WRITE: 'write',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  },

  // 双因素认证类型
  TWO_FACTOR_TYPE: {
    TOTP: 'totp',
    SMS: 'sms',
    EMAIL: 'email'
  },

  // 安全设置类型
  SECURITY_SETTINGS: {
    PASSWORD_CHANGE: 'password_change',
    LOGIN_NOTIFICATION: 'login_notification',
    TWO_FACTOR: 'two_factor',
    SESSION_TIMEOUT: 'session_timeout'
  }
}

// 默认导出
export default authAPI
