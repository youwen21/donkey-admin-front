
// 通用 API 工具函数
export const apiUtils = {
  // 创建带查询参数的 URL
  createUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl, window.location.origin)
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })
    return url.pathname + url.search
  },

  // 处理分页参数
  handlePagination: (params = {}) => {
    const { page = 1, pageSize = 10, ...otherParams } = params
    return {
      page,
      pageSize,
      ...otherParams
    }
  },

  // 处理排序参数
  handleSorting: (params = {}) => {
    const { sortBy, sortOrder, ...otherParams } = params
    if (sortBy && sortOrder) {
      return {
        sortBy,
        sortOrder,
        ...otherParams
      }
    }
    return otherParams
  },

  // 处理搜索参数
  handleSearch: (params = {}) => {
    const { search, searchFields, ...otherParams } = params
    if (search) {
      return {
        search,
        searchFields: searchFields || ['name', 'email'],
        ...otherParams
      }
    }
    return otherParams
  }
}

// 导出所有 API
export default {
  utils: apiUtils
}
