<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <SideMenu :menu-data="menuData" />
    </aside>
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideMenu from '@/components/admin/SideMenu.vue'
import { menuAPI } from '@/apis/admin-api/menu-api.js'

// 菜单数据
const menuData = ref([])

// 从 API 获取菜单数据
const fetchMenuData = async () => {
  try {
    const response = await menuAPI.getTreeMenu()
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

.admin-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
  padding: 24px;
}
</style>