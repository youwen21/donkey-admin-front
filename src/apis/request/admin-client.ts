export interface RequestConfig {
  url: string
  method?: string
  headers?: Record<string, string>
  data?: unknown
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
  credentials?: RequestCredentials
  responseType?: string
}

export interface InterceptedResponse<T = unknown> {
  data: T
  status: number
  headers: Record<string, string>
  fullResponse?: Response
}

const requestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
}

const responseCodes = {
  SUCCESS: 0,
  UNAUTHORIZED: 1,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  LOGIN_EXPIRED: 600,
}

type ApiResponseBody = {
  code?: number
  [key: string]: unknown
}

class AdminAPIClient {
  config: typeof requestConfig
  requestInterceptor!: (config: RequestConfig) => RequestConfig
  responseInterceptor!: <T>(response: InterceptedResponse<T>) => T | Promise<T>
  errorInterceptor!: (error: unknown, config: RequestConfig) => Promise<never>

  constructor() {
    this.config = { ...requestConfig }
    this.setupInterceptors()
  }

  setupInterceptors() {
    this.requestInterceptor = (config: RequestConfig) => {
      if (!config.url.startsWith('http')) {
        config.url = `${this.config.baseURL}${config.url}`
      }

      if (!config.headers) {
        config.headers = {}
      }

      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json'
      }

      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }
      }

      return config
    }

    this.responseInterceptor = <T>(response: InterceptedResponse<T>) => {
      const { data, status } = response
      const body = data as ApiResponseBody

      if (data && typeof body === 'object' && body !== null && typeof body.code !== 'undefined') {
        switch (body.code) {
          case responseCodes.SUCCESS:
            return data
          case responseCodes.LOGIN_EXPIRED:
            void this.handleLoginExpired()
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

      if (status >= 200 && status < 300) {
        return data
      }
      return Promise.reject(new Error(`HTTP错误: ${status}`))
    }

    this.errorInterceptor = (error: unknown, config: RequestConfig) => {
      const err = error as {
        response?: { status: number; data?: unknown }
        request?: unknown
        message?: string
      }

      if (err.response) {
        const { status } = err.response
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
      } else if (err.request) {
        console.error('网络错误，请检查网络连接')
      } else {
        console.error('请求异常:', err.message)
      }

      return Promise.reject(error)
    }
  }

  async handleLoginExpired() {
    console.warn('登录已过期，正在清除登录信息...')
    try {
      this.redirectToLogin()
      this.showMessage('登录已过期，请重新登录', 'warning')
    } catch (e) {
      console.error('处理登录过期时出错:', e)
    }
  }

  handleUnauthorized() {
    console.warn('未授权访问')
    this.showMessage('请先登录', 'warning')
    this.redirectToLogin()
  }

  handleForbidden() {
    console.warn('权限不足')
    this.showMessage('权限不足，无法访问该资源', 'error')
  }

  redirectToLogin() {
    try {
      const currentRoute = window.location.pathname + window.location.search
      window.location.href = `/login?redirect=${encodeURIComponent(currentRoute)}`
    } catch (e) {
      console.error('跳转登录页面失败:', e)
      window.location.href = '/login'
    }
  }

  showMessage(message: string, type: string = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      const interceptedConfig = this.requestInterceptor(config)

      const fetchOptions: RequestInit = {
        method: interceptedConfig.method || 'GET',
        headers: interceptedConfig.headers,
        body:
          interceptedConfig.method !== 'GET'
            ? JSON.stringify(interceptedConfig.data)
            : undefined,
        signal: AbortSignal.timeout(interceptedConfig.timeout || this.config.timeout),
      }

      if (this.config.credentials || interceptedConfig.credentials) {
        fetchOptions.credentials = 'include'
      }

      const response = await fetch(interceptedConfig.url, fetchOptions)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = (await response.json()) as T

      const exposedHeaders: Record<string, string> = {}
      const headerNames = [
        'X-Total-Count',
        'X-Auth-Token',
        'X-Request-Id',
        'X-Page-Size',
        'X-Page-Number',
      ] as const
      headerNames.forEach((headerName) => {
        const value = response.headers.get(headerName)
        if (value !== null) {
          exposedHeaders[headerName] = value
        }
      })

      return await Promise.resolve(
        this.responseInterceptor({
          data,
          status: response.status,
          headers: exposedHeaders,
          fullResponse: response,
        }),
      )
    } catch (error) {
      return this.errorInterceptor(error, config)
    }
  }

  get<T = any>(
    url: string,
    params: Record<string, unknown> = {},
    config: Partial<RequestConfig> = {},
  ) {
    const flat: Record<string, string> = {}
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) flat[k] = String(v)
    }
    const queryString = new URLSearchParams(flat).toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url

    return this.request<T>({
      url: fullUrl,
      method: 'GET',
      ...config,
    })
  }

  post<T = any>(url: string, data: unknown = {}, config: Partial<RequestConfig> = {}) {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config,
    })
  }

  put<T = any>(url: string, data: unknown = {}, config: Partial<RequestConfig> = {}) {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config,
    })
  }

  delete<T = any>(url: string, config: Partial<RequestConfig> = {}) {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config,
    })
  }

  patch<T = any>(url: string, data: unknown = {}, config: Partial<RequestConfig> = {}) {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...config,
    })
  }

  upload<T = any>(url: string, file: File | Blob, config: Partial<RequestConfig> = {}) {
    const formData = new FormData()
    formData.append('file', file)

    return this.request<T>({
      url,
      method: 'POST',
      data: formData,
      headers: {},
      ...config,
    })
  }

  download(url: string, filename: string = '', config: Partial<RequestConfig> = {}) {
    return this.request<Blob | ArrayBuffer | string>({
      url,
      method: 'GET',
      responseType: 'blob',
      ...config,
    }).then((response) => {
      const blob = new Blob([response as BlobPart])
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

const adminAPIClient = new AdminAPIClient()

export { adminAPIClient, requestConfig, responseCodes }
export default adminAPIClient
