import adminAPIClient from '../request/admin-client'

export const demoAPI = {
  getWithQueryParams: (params: Record<string, unknown>) => {
    return adminAPIClient.get('/admin-api/v1/demo/query', params)
  },

  getWithCustomHeaders: (
    params: Record<string, unknown> = {},
    customHeaders: Record<string, string> = {},
  ) => {
    return adminAPIClient.get('/admin-api/v1/demo/get', params, {
      headers: {
        'X-Custom-Header': 'custom-value',
        'X-Request-ID': `req-${Date.now()}`,
        ...customHeaders,
      },
    })
  },

  postWithDataAndQueryAndHeaders: (
    data: unknown,
    queryParams: Record<string, unknown> = {},
    customHeaders: Record<string, string> = {},
  ) => {
    let url = '/admin-api/v1/demo/create'
    if (Object.keys(queryParams).length > 0) {
      const flat: Record<string, string> = {}
      for (const [k, v] of Object.entries(queryParams)) {
        if (v !== undefined && v !== null) flat[k] = String(v)
      }
      const queryString = new URLSearchParams(flat).toString()
      url = `${url}?${queryString}`
    }

    return adminAPIClient.post(url, data, {
      headers: {
        'X-Custom-Header': 'custom-value',
        'X-Request-ID': `req-${Date.now()}`,
        'X-Client-Version': '1.0.0',
        ...customHeaders,
      },
    })
  },
}

export default demoAPI
