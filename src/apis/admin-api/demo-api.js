import adminAPIClient from '../request/admin-client.js'

// Demo API 示例接口
export const demoAPI = {
  /**
   * 示例1: GET 请求带 query params 参数
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词
   * @returns {Promise} 返回请求的 Promise
   */
  getWithQueryParams: (params) => {
    return adminAPIClient.get('/admin-api/v1/demo/query', params)
  },

  /**
   * 示例2: GET 请求带自定义 header
   * @param {Object} params - 查询参数（可选）
   * @param {Object} customHeaders - 自定义请求头
   * @returns {Promise} 返回请求的 Promise
   */
  getWithCustomHeaders: (params = {}, customHeaders = {}) => {
    return adminAPIClient.get('/admin-api/v1/demo/get', params, {
      headers: {
        'X-Custom-Header': 'custom-value',
        'X-Request-ID': `req-${Date.now()}`,
        ...customHeaders // 允许传入额外的自定义 header
      }
    })
  },

  /**
   * 示例3: POST 请求带 data、query params 和自定义 header
   * @param {Object} data - 请求体数据
   * @param {Object} queryParams - 查询参数（可选）
   * @param {Object} customHeaders - 自定义请求头（可选）
   * @returns {Promise} 返回请求的 Promise
   */
  postWithDataAndQueryAndHeaders: (data, queryParams = {}, customHeaders = {}) => {
    // 构建带 query params 的 URL
    let url = '/admin-api/v1/demo/create'
    if (Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString()
      url = `${url}?${queryString}`
    }

    return adminAPIClient.post(url, data, {
      headers: {
        'X-Custom-Header': 'custom-value',
        'X-Request-ID': `req-${Date.now()}`,
        'X-Client-Version': '1.0.0',
        ...customHeaders // 允许传入额外的自定义 header
      }
    })
  },
}

// 使用示例（注释形式）
/*
// 示例1: GET 请求带 query params
demoAPI.getWithQueryParams({
  page: 1,
  pageSize: 10,
  keyword: 'search'
})

// 示例2: GET 请求带自定义 header
demoAPI.getWithCustomHeaders(
  { id: 123 }, // query params
  { 'X-User-ID': 'user123' } // 额外的自定义 header
)

// 示例3: POST 请求带 data、query params 和自定义 header
demoAPI.postWithDataAndQueryAndHeaders(
  { // data - 请求体
    name: 'test',
    age: 18
  },
  { // query params
    source: 'web',
    version: 'v1'
  },
  { // 自定义 header
    'X-User-ID': 'user123',
    'X-Client-Type': 'web'
  }
)
*/

// 默认导出
export default demoAPI

