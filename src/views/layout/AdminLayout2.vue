<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <SideMenu :menu-data="menuData" />
    </aside>
    <main class="admin-main">
      <!-- 顶部导航栏 -->
      <AdminHeader />
      <!-- 内容区域 -->
      <div class="admin-content">
      <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SideMenu from '@/components/admin/SideMenu.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import { menuAPI } from '@/apis/admin-api/menu-api'

// 菜单数据
const menuData = ref([])

// 从 API 获取菜单数据
const fetchMenuData = async () => {
  try {
    const response = await menuAPI.getTree()
    const raw = response?.data ?? response
    menuData.value = Array.isArray(raw) ? raw : []
  } catch (error) {
    console.error('获取菜单数据失败:', error)
    // 失败时使用空数组，避免菜单组件报错
    menuData.value = []
  }
}

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuData()
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  flex-shrink: 0;
  background-color: #001529;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
  padding: 24px;
}
</style>