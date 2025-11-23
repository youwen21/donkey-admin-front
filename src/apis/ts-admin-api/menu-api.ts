import adminAPIClient from '../request/admin-client.js'
import { toastException } from '@/utils/toast.js'

// ==================== 类型定义 ====================

/**
 * 菜单查询参数
 */
export interface MenuQueryParams {
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 菜单名称（搜索） */
  name?: string
  /** 状态筛选 1:有效，2:禁用 */
  status?: number
  /** 子系统ID */
  system_id?: number
  /** 上级菜单ID */
  parent_id?: number
}

/**
 * 菜单数据模型
 */
export interface Menu {
  /** 菜单ID */
  id: number
  /** 子系统ID */
  system_id: number
  /** 上级菜单ID */
  parent_id: number
  /** 菜单名 */
  name: string
  /** 菜单级别 */
  level: number
  /** 菜单节点路径 */
  node_path: string
  /** URL */
  url: string
  /** 状态 1:有效，2:禁用 */
  status: number
  /** 菜单排序 */
  order_no: number
  /** 创建时间 */
  create_time?: string
  /** 更新时间 */
  update_time?: string
  /** 子菜单列表 */
  children?: Menu[]
}

/**
 * 新增/更新菜单数据
 */
export interface MenuFormData {
  /** 菜单ID（更新时必填） */
  id?: number
  /** 子系统ID */
  system_id: number
  /** 上级菜单ID */
  parent_id: number
  /** 菜单名 */
  name: string
  /** 菜单级别 */
  level: number
  /** 菜单节点路径 */
  node_path: string
  /** URL */
  url: string
  /** 状态 1:有效，2:禁用 */
  status: number
  /** 菜单排序 */
  order_no: number
}

/**
 * 删除菜单参数
 */
export interface MenuDeleteParams {
  /** 菜单ID */
  id: number
}

/**
 * 获取菜单详情参数
 */
export interface MenuGetParams {
  /** 菜单ID */
  id: number
}

/**
 * API 响应基础结构
 */
export interface APIResponse<T = any> {
  /** 响应码，0 表示成功 */
  code?: number
  /** 响应消息 */
  msg?: string
  /** 响应数据 */
  data?: T
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 总数 */
  total: number
}

/**
 * 菜单列表响应
 */
export type MenuListResponse = APIResponse<PaginatedResponse<Menu>> | PaginatedResponse<Menu>

// ==================== API 接口 ====================

/**
 * 菜单相关 API 接口
 */
export const menuAPI = {
  /**
   * 获取树形菜单列表
   * @returns {Promise<APIResponse<Menu[]>>} 返回菜单树数据
   */
  getTreeMenu: (): Promise<APIResponse<Menu[]>> => {
    return adminAPIClient.get(`/admin-api/v1/treeMenu`)
  },

  /**
   * 查询菜单列表
   * @param {MenuQueryParams} params - 查询参数
   * @returns {Promise<MenuListResponse>} 返回菜单列表
   */
  query: (params: MenuQueryParams = {}): Promise<MenuListResponse> => {
    return adminAPIClient.get('/admin-api/v1/menu/query', params)
  },

  /**
   * 获取单个菜单详情
   * @param {MenuGetParams} params - 查询参数
   * @returns {Promise<APIResponse<Menu>>} 返回菜单详情
   */
  get: (params: MenuGetParams): Promise<APIResponse<Menu>> => {
    return adminAPIClient.get('/admin-api/v1/menu/get', params)
  },

  /**
   * 新增菜单
   * @param {MenuFormData} data - 菜单数据
   * @returns {Promise<APIResponse>} 返回新增结果
   */
  add: (data: MenuFormData): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/menu/add', data)
  },

  /**
   * 更新菜单
   * @param {MenuFormData} data - 菜单数据（必须包含 id）
   * @returns {Promise<APIResponse>} 返回更新结果
   */
  update: (data: MenuFormData & { id: number }): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/menu/update', data)
  },

  /**
   * 删除菜单
   * @param {MenuDeleteParams} data - 删除参数
   * @returns {Promise<APIResponse>} 返回删除结果
   */
  del: (data: MenuDeleteParams): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/menu/del', data)
  },

  /**
   * 设置菜单信息, 允许0和""空字符串
   * @param {MenuFormData & { id: number }} data - 菜单数据（必须包含 id）
   * @returns {Promise<APIResponse>} 返回更新结果
   */
  setInfo: (data: MenuFormData & { id: number }): Promise<APIResponse> => {
    return adminAPIClient.post('/admin-api/v1/menu/setInfo', data)
  },
}

// ==================== 辅助方法 ====================

/**
 * 获取菜单详情（带 Toast 提示，自动处理异常）
 * @param {MenuGetParams} params - 查询参数
 * @returns {Promise<Menu | null>} 返回菜单详情，异常时返回 null
 */
export const menuGet = async (params: MenuGetParams): Promise<Menu | null> => {
  try {
    const response = await menuAPI.get(params)
    return (response?.data || response) as Menu
  } catch (error) {
    toastException(error, '获取菜单详情失败')
    return null
  }
}

/**
 * 查询菜单列表（带 Toast 提示，自动处理异常）
 * @param {MenuQueryParams} params - 查询参数
 * @param {string} errorTitle - 错误提示标题，默认 '获取菜单列表失败'
 * @returns {Promise<PaginatedResponse<Menu>>} 返回菜单列表和总数，异常时返回 {list: [], total: 0}
 */
export const menuQuery = async (
  params: MenuQueryParams = {},
  errorTitle: string = '获取菜单列表失败'
): Promise<PaginatedResponse<Menu>> => {
  try {
    const response = await menuAPI.query(params)
    // 支持响应格式：{ data: { list: [], total: 100 } } 或 { list: [], total: 100 }
    const data = (response as any)?.data || response
    if (data && typeof data === 'object' && 'list' in data) {
      return {
        list: (data as PaginatedResponse<Menu>).list || [],
        total: (data as PaginatedResponse<Menu>).total || 0
      }
    } else if (Array.isArray(data)) {
      return {
        list: data as Menu[],
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
 * @returns {Promise<PaginatedResponse<Menu>>} 返回菜单列表和总数
 */
export const menuFetchList = async (): Promise<PaginatedResponse<Menu>> => {
  const params: MenuQueryParams = {
    page: 1,
    pageSize: 1000
  }
  return menuQuery(params, '获取菜单列表失败')
}

// ==================== 默认导出 ====================

export default menuAPI

