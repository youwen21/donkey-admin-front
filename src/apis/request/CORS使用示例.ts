/**
 * CORS 响应头使用示例
 *
 * 本文件展示如何在前端代码中使用后端通过 CORS 暴露的自定义响应头
 */

import { adminAPIClient } from './admin-client'

/** 示例响应：业务体 + 文档中假设可能附带的暴露头（需拦截器合并后才可用） */
type SampleListResponse = {
  data?: unknown
  _headers?: Record<string, string>
  length?: number
}

// ========== 示例 1: 访问分页总数（X-Total-Count） ==========
async function getUserListWithPagination(page = 1, pageSize = 10) {
  try {
    const response = (await adminAPIClient.get('/api/users', {
      page,
      page_size: pageSize,
    })) as SampleListResponse

    const totalCount = response._headers?.['X-Total-Count']
    const users = (response.data || response) as { length: number }

    console.log('用户列表:', users)
    console.log('总数:', totalCount)

    return {
      list: users,
      total: totalCount ? parseInt(totalCount, 10) : users.length,
      page,
      pageSize,
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

// ========== 示例 2: 访问认证 Token（X-Auth-Token） ==========
async function login(username: string, password: string) {
  try {
    const response = (await adminAPIClient.post('/api/auth/login', {
      username,
      password,
    })) as SampleListResponse

    const newToken = response._headers?.['X-Auth-Token']
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
      console.log('已更新认证 Token')
    }

    return response
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// ========== 示例 3: 访问请求 ID（X-Request-Id）用于日志追踪 ==========
async function createUser(userData: unknown) {
  try {
    const response = (await adminAPIClient.post('/api/users', userData)) as SampleListResponse

    const requestId = response._headers?.['X-Request-Id']
    if (requestId) {
      console.log('请求 ID:', requestId)
    }

    return response
  } catch (error) {
    console.error('创建用户失败:', error)
    throw error
  }
}

// ========== 示例 4: 直接使用 fetch 访问响应头 ==========
async function getUserListWithFetch() {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
    const response = await fetch(`${baseURL}/api/users`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const totalCount = response.headers.get('X-Total-Count')
    const authToken = response.headers.get('X-Auth-Token')
    const requestId = response.headers.get('X-Request-Id')

    const data = await response.json()

    console.log('总数:', totalCount)
    console.log('Token:', authToken)
    console.log('请求 ID:', requestId)
    console.log('数据:', data)

    return {
      data,
      totalCount: totalCount ? parseInt(totalCount, 10) : null,
      authToken,
      requestId,
    }
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

export { getUserListWithPagination, login, createUser, getUserListWithFetch }
