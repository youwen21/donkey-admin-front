// import { authController } from '../auth/index.js'

// 请求配置
const requestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  // withCredentials: true, // 请求携带cookie
  credentials: 'include', // fetch请求携带cookie
  headers: {
    'Content-Type': 'application/json'
  },
}

// 响应状态码配置
const responseCodes = {
  SUCCESS: 0,
  UNAUTHORIZED: 1,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  LOGIN_EXPIRED: 600 // 登录授权过期
}

// 分析：该类不仅是拦截器，还是完整的 HTTP 客户端，包含：
// 拦截器设置（请求、响应、错误）
// 状态码检查和处理
// HTTP 方法封装（get, post, put, delete, patch）
// 文件上传/下载
// 命名建议：
// 不建议使用 adminAPI：adminAPI 通常用于 API 接口集合（如 authAPI），而不是请求管理器。
// 更合适的命名：
// AdminAPIClient（推荐）：强调它是 HTTP 客户端
// AdminAPIInterceptor：如果强调拦截器功能
// AdminAPIRequestHandler：强调请求处理
// 创建请求实例
// 职责：设置请求 admin api 和返回状态码检查
class AdminAPIClient {
  constructor() {
    this.config = { ...requestConfig }
    this.setupInterceptors()
  }

  // 设置拦截器
  setupInterceptors() {
    // 请求拦截器
    this.requestInterceptor = (config) => {
      // 添加认证令牌
      // const token = authController.getToken()
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }

      // config.url 不是http开头，则添加 baseURL
      if (!config.url.startsWith('http')) {
        config.url = `${this.config.baseURL}${config.url}`
      }

      // 确保 config.headers 存在
      if (!config.headers) {
        config.headers = {}
      }

      // 如果config.headers 不是application/json，则添加 Content-Type: application/json
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json'
      }

      
      // 添加时间戳防止缓存
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now()
        }
      }
      
      return config
    }

    // 响应拦截器
    this.responseInterceptor = (response) => {
      const { data, status, headers } = response
      
      // 处理业务状态码
      if (data && typeof data.code !== 'undefined') {
        switch (data.code) {
          case responseCodes.SUCCESS:
            return data
          case responseCodes.LOGIN_EXPIRED:
            this.handleLoginExpired()
            return Promise.reject(new Error('登录已过期'))
          case responseCodes.UNAUTHORIZED:
            this.handleUnauthorized()
            return Promise.reject(new Error('未授权访问'))
          case responseCodes.FORBIDDEN:
            this.handleForbidden()
            return Promise.reject(new Error('权限不足'))
          default:
            return data
        }
      }
      
      // 处理HTTP状态码
      if (status >= 200 && status < 300) {
        return data
      } else {
        return Promise.reject(new Error(`HTTP错误: ${status}`))
      }
    }

    // 错误拦截器
    this.errorInterceptor = (error) => {
      console.error('请求错误:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        switch (status) {
          case responseCodes.UNAUTHORIZED:
            this.handleUnauthorized()
            break
          case responseCodes.FORBIDDEN:
            this.handleForbidden()
            break
          case responseCodes.NOT_FOUND:
            console.error('请求的资源不存在')
            break
          case responseCodes.SERVER_ERROR:
            console.error('服务器内部错误')
            break
          default:
            console.error(`请求失败: ${status}`)
        }
      } else if (error.request) {
        console.error('网络错误，请检查网络连接')
      } else {
        console.error('请求配置错误:', error.message)
      }
      
      return Promise.reject(error)
    }
  }

  // 处理登录过期
  async handleLoginExpired() {
    console.warn('登录已过期，正在清除登录信息...')
    
    try {
      // 清除登录信息
      // await authController.logout()
      
      // 跳转到登录页面
      this.redirectToLogin()
      
      // 显示提示信息
      this.showMessage('登录已过期，请重新登录', 'warning')
    } catch (error) {
      console.error('处理登录过期时出错:', error)
    }
  }

  // 处理未授权
  handleUnauthorized() {
    console.warn('未授权访问')
    this.showMessage('请先登录', 'warning')
    this.redirectToLogin()
  }

  // 处理权限不足
  handleForbidden() {
    console.warn('权限不足')
    this.showMessage('权限不足，无法访问该资源', 'error')
  }

  // 跳转到登录页面
  redirectToLogin() {
    try {
      // 获取当前路由信息
      const currentRoute = window.location.pathname + window.location.search
      
      // 跳转到登录页面，并保存当前页面路径
      window.location.href = `/login?redirect=${encodeURIComponent(currentRoute)}`
    } catch (error) {
      console.error('跳转登录页面失败:', error)
      // 备用方案：直接跳转到登录页
      window.location.href = '/login'
    }
  }

  // 显示消息提示
  showMessage(message, type = 'info') {
    // 这里可以集成消息提示组件，如 Element Plus 的 Message
    // 暂时使用 console 输出
    console.log(`[${type.toUpperCase()}] ${message}`)
    
    // 如果项目中使用了消息提示组件，可以这样调用：
    // import { ElMessage } from 'element-plus'
    // ElMessage[type](message)
  }

  // 发送请求
  async request(config) {
    try {
      // 应用请求拦截器
      const interceptedConfig = this.requestInterceptor(config)
      
      // 发送请求
      const fetchOptions = {
        method: interceptedConfig.method || 'GET',
        headers: interceptedConfig.headers,
        body: interceptedConfig.method !== 'GET' ? JSON.stringify(interceptedConfig.data) : undefined,
        signal: AbortSignal.timeout(interceptedConfig.timeout || this.config.timeout)
      }
      
      // 如果配置了 withCredentials，则携带 cookie
      if (this.config.credentials || interceptedConfig.credentials) {
        fetchOptions.credentials = 'include'
      }
      
      const response = await fetch(interceptedConfig.url, fetchOptions)
      
      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // 解析响应数据
      const data = await response.json()
      
      // 获取暴露的自定义响应头（需要后端设置 Access-Control-Expose-Headers）
      // 例如：X-Total-Count, X-Auth-Token, X-Request-Id 等
      const exposedHeaders = {}
      const headerNames = ['X-Total-Count', 'X-Auth-Token', 'X-Request-Id', 'X-Page-Size', 'X-Page-Number']
      headerNames.forEach(headerName => {
        const value = response.headers.get(headerName)
        if (value !== null) {
          exposedHeaders[headerName] = value
        }
      })
      
      // 应用响应拦截器，传递响应头和状态码
      return this.responseInterceptor({ 
        data, 
        status: response.status,
        headers: exposedHeaders,
        fullResponse: response // 保留完整响应对象，以便需要时访问其他信息
      })
      
    } catch (error) {
      // 应用错误拦截器
      return this.errorInterceptor(error)
    }
  }

  // GET 请求
  get(url, params = {}, config = {}) {
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    return this.request({
      url: fullUrl,
      method: 'GET',
      ...config
    })
  }

  // POST 请求
  post(url, data = {}, config = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  // PUT 请求
  put(url, data = {}, config = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  // DELETE 请求
  delete(url, config = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...config
    })
  }

  // PATCH 请求
  patch(url, data = {}, config = {}) {
    return this.request({
      url,
      method: 'PATCH',
      data,
      ...config
    })
  }

  // 上传文件
  upload(url, file, config = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.request({
      url,
      method: 'POST',
      data: formData,
      headers: {
        // 不设置 Content-Type，让浏览器自动设置
      },
      ...config
    })
  }

  // 下载文件
  download(url, filename = '', config = {}) {
    return this.request({
      url,
      method: 'GET',
      responseType: 'blob',
      ...config
    }).then(response => {
      const blob = new Blob([response])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }
}

// 创建请求管理器实例
const adminAPIClient = new AdminAPIClient()

// 导出
export {
  adminAPIClient,
  requestConfig,
  responseCodes
}

// 默认导出（保持向后兼容）
export default adminAPIClient
