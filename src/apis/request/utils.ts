export const apiUtils = {
  createUrl: (baseUrl: string, params: Record<string, string | number | boolean | null | undefined> = {}) => {
    const url = new URL(baseUrl, window.location.origin)
    Object.keys(params).forEach((key) => {
      const v = params[key]
      if (v !== undefined && v !== null) {
        url.searchParams.append(key, String(v))
      }
    })
    return url.pathname + url.search
  },

  handlePagination: (params: Record<string, unknown> = {}) => {
    const { page = 1, pageSize = 10, ...otherParams } = params
    return {
      page,
      pageSize,
      ...otherParams,
    }
  },

  handleSorting: (params: Record<string, unknown> = {}) => {
    const { sortBy, sortOrder, ...otherParams } = params
    if (sortBy && sortOrder) {
      return {
        sortBy,
        sortOrder,
        ...otherParams,
      }
    }
    return otherParams
  },

  handleSearch: (params: Record<string, unknown> = {}) => {
    const { search, searchFields, ...otherParams } = params
    if (search) {
      return {
        search,
        searchFields: searchFields || ['name', 'email'],
        ...otherParams,
      }
    }
    return otherParams
  },
}

export default {
  utils: apiUtils,
}
