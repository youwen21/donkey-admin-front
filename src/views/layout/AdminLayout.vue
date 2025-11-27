<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <AdminHeader />
    <div class="admin-container">
      <aside class="admin-sidebar">
        <SideMenu :menu-data="menuData" />
      </aside>
      <main class="admin-main">
        <!-- 在权限加载完成后再渲染子路由 -->
        <router-view v-if="permissionsReady" />
        <!-- 简单的加载占位 -->
        <div v-else class="admin-loading">
          正在加载数据，请稍候...
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideMenu from '@/components/admin/SideMenu.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import { menuAPI } from '@/apis/admin-api/menu-api.js'
import { userPermissionAPI } from '@/apis/admin-api/user-permission-api.js'

import { toastException } from '@/utils/toast.js'

import { permissionPlugInstance } from '@/plugins/permission.js'

// 菜单数据
const menuData = ref([])

// 权限是否已准备好（加载完成）
const permissionsReady = ref(false)

// 从 API 获取菜单数据
const fetchMenuData = async () => {
  try {
    const response = await menuAPI.getTree()

    // {"code":9999,"msg":"record not found","data":null}
    if (response.code !== 0) {
      toastException("获取菜单数据失败", response.msg)
      return
    }

    // 根据实际 API 响应结构调整
    // 如果响应是 { data: [...] }，使用 response.data
    // 如果响应直接是数组，使用 response
    menuData.value = response?.data || response || []
  } catch (error) {
    console.error('获取菜单数据失败:', error)
    // 失败时使用空数组，避免菜单组件报错
    menuData.value = []
  }
}

const fetchUserPermission = async () => {
  const response = await userPermissionAPI.my()
  if (response.code !== 0) {
    toastException("获取用户权限失败", response.msg)
    return
  }
  permissionPlugInstance.setPermissions(response.data)
}

// 初始化权限：如果尚未设置，则先从后端拉取
const initPermissions = async () => {
  try {
    if (!permissionPlugInstance.permissionsIsSet()) {
      await fetchUserPermission()
    }
  } finally {
    // 无论成功或失败，都标记为已完成，避免页面一直空白
    permissionsReady.value = true
  }
}

// 组件挂载时获取菜单数据和权限
onMounted(async () => {
  await Promise.all([
    fetchMenuData(),
    initPermissions(),
  ])
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
}

/* 顶部导航栏 */
.admin-layout> :first-child {
  flex-shrink: 0;
  z-index: 100;
}

/* 主体容器：左侧菜单 + 右侧内容 */
.admin-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* 左侧菜单 */
.admin-sidebar {
  flex-shrink: 0;
  width: 240px;
  background-color: #001529;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 右侧主内容区 */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  /* min-width: 0; */
  background-color: #f0f2f5;
}

.admin-loading {
  padding: 24px;
  color: #666;
  font-size: 14px;
}

/* 内容区域 */
/*
.admin-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  background-color: #f0f2f5;
}
*/
</style>