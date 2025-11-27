/**
 * CORS 响应头使用示例
 * 
 * 本文件展示如何在前端代码中使用后端通过 CORS 暴露的自定义响应头
 */

import { adminAPIClient } from './admin-client.js'

// ========== 示例 1: 访问分页总数（X-Total-Count） ==========
async function getUserListWithPagination(page = 1, pageSize = 10) {
  try {
    const response = await adminAPIClient.get('/api/users', {
      page,
      page_size: pageSize
    })
    
    // 如果后端设置了 Access-Control-Expose-Headers: X-Total-Count
    // 响应数据中会包含 _headers 字段
    const totalCount = response._headers?.['X-Total-Count']
    const users = response.data || response
    
    console.log('用户列表:', users)
    console.log('总数:', totalCount)
    
    return {
      list: users,
      total: totalCount ? parseInt(totalCount) : users.length,
      page,
      pageSize
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

// ========== 示例 2: 访问认证 Token（X-Auth-Token） ==========
async function login(username, password) {
  try {
    const response = await adminAPIClient.post('/api/auth/login', {
      username,
      password
    })
    
    // 如果后端在响应头中返回新的 token
    const newToken = response._headers?.['X-Auth-Token']
    if (newToken) {
      // 保存新的 token
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
async function createUser(userData) {
  try {
    const response = await adminAPIClient.post('/api/users', userData)
    
    // 获取请求 ID，用于日志追踪和问题排查
    const requestId = response._headers?.['X-Request-Id']
    if (requestId) {
      console.log('请求 ID:', requestId)
      // 可以将 requestId 保存到日志系统
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
      credentials: 'include', // 携带 cookie
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    // 直接访问响应头（需要后端设置 Access-Control-Expose-Headers）
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
      totalCount: totalCount ? parseInt(totalCount) : null,
      authToken,
      requestId
    }
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

// ========== 示例 5: 在 Vue 组件中使用 ==========
/*
<template>
  <div>
    <div>总数: {{ totalCount }}</div>
    <div>请求 ID: {{ requestId }}</div>
    <button @click="loadUsers">加载用户</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { adminAPIClient } from '@/apis/request/admin-client.js'

const totalCount = ref(0)
const requestId = ref('')

async function loadUsers() {
  try {
    const response = await adminAPIClient.get('/api/users')
    
    // 访问暴露的响应头
    totalCount.value = response._headers?.['X-Total-Count'] || 0
    requestId.value = response._headers?.['X-Request-Id'] || ''
    
    console.log('用户数据:', response.data || response)
  } catch (error) {
    console.error('加载失败:', error)
  }
}
</script>
*/

// ========== 导出示例函数 ==========
export {
  getUserListWithPagination,
  login,
  createUser,
  getUserListWithFetch
}

