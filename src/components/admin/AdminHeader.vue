<template>
  <div class="admin-header">
    <div class="header-left">
      <!-- Logo 或标题 -->
      <div class="logo">
        <span class="logo-text">管理系统</span>
      </div>
      <!-- 面包屑导航 -->
      <!-- <div class="breadcrumb">
        <template v-for="(item, index) in breadcrumbList" :key="index">
          <span v-if="index > 0" class="breadcrumb-separator">/</span>
          <span
            :class="['breadcrumb-item', { 'breadcrumb-active': index === breadcrumbList.length - 1 }]"
          >
            {{ item }}
          </span>
        </template>
      </div> -->
    </div>
    <div class="header-right">
      <!-- 快捷操作 -->
      <div class="header-actions">
        <!-- 通知 -->
        <div class="action-item" @click="handleNotification">
          <span class="action-icon">🔔</span>
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </div>
        <!-- 全屏 -->
        <div class="action-item" @click="handleFullscreen">
          <span class="action-icon">{{ isFullscreen ? '🔲' : '🔳' }}</span>
        </div>
      </div>
      <!-- 用户信息 -->
      <div class="user-info" @click="toggleUserMenu">
        <div class="user-avatar">
          <span class="avatar-text">{{ userInitial }}</span>
        </div>
        <div class="user-details">
          <span class="user-name">{{ currentUser.name || '管理员' }}</span>
          <span v-if="currentUser.real_name" class="user-real-name">{{ currentUser.real_name }}</span>
        </div>
        <span class="dropdown-icon">▼</span>
        <!-- 用户菜单下拉 -->
        <div v-if="showUserMenu" class="user-menu" @click.stop>
          <!-- <div class="menu-item" @click="handleProfile">
            <span class="menu-icon">👤</span>
            <span>个人中心</span>
          </div>
          <div class="menu-item" @click="handleSettings">
            <span class="menu-icon">⚙️</span>
            <span>系统设置</span>
          </div> -->
          <div class="menu-divider"></div>
          <div class="menu-item" @click="handleLogout">
            <span class="menu-icon">🚪</span>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authAPI } from '@/apis/admin-api/auth-api'
import myAPI from '@/apis/admin-api/my-api'
import { confirm, toastSuccess, toastException } from '@/utils/toast'

const route = useRoute()
const router = useRouter()

// 数据
const showUserMenu = ref(false)
const isFullscreen = ref(false)
const unreadCount = ref(5)
const currentUser = ref<Record<string, unknown>>({
  name: '',
  real_name: '',
})

// 计算属性
const userInitial = computed(() => {
  const real = currentUser.value.real_name
  if (typeof real === 'string' && real) {
    return real.charAt(0).toUpperCase()
  }
  const name = currentUser.value.name
  if (typeof name === 'string' && name) {
    return name.charAt(0).toUpperCase()
  }
  return 'A'
})

// 面包屑导航
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  if (matched.length === 0) {
    return ['首页']
  }
  return matched.map(item => item.meta.title || item.name)
})

// 方法
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleNotification = () => {
  console.log('查看通知')
  // TODO: 跳转到通知页面
  toastSuccess('通知功能开发中')
}

const handleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    })
  }
}

const handleProfile = () => {
  console.log('个人中心')
  showUserMenu.value = false
  // TODO: 跳转到个人中心页面
  toastSuccess('个人中心功能开发中')
}

const handleSettings = () => {
  console.log('系统设置')
  showUserMenu.value = false
  // TODO: 跳转到系统设置页面
  toastSuccess('系统设置功能开发中')
}

const handleLogout = async () => {
  showUserMenu.value = false
  
  if (await confirm('确定要退出登录吗？', '退出登录')) {
    try {
      await authAPI.logout()
      // toastSuccess('退出登录成功')
      router.push({ name: 'login' })
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使 API 失败也跳转到登录页
      router.push({ name: 'login' })
    }
  }
}

// 点击外部关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  const t = event.target as HTMLElement | null
  if (showUserMenu.value && t && !t.closest('.user-info')) {
    showUserMenu.value = false
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 获取当前用户信息
const fetchCurrentUser = async () => {
  try {
    const response = await myAPI.staffInfo()
    if (response && response.code === 0 && response.data) {
      currentUser.value = {
        id: response.data.id,
        name: response.data.name || '',
        real_name: response.data.real_name || '',
        avatar: response.data.avatar || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        role_id: response.data.role_id,
        org_id: response.data.org_id,
        is_root: response.data.is_root,
        is_staff: response.data.is_staff,
        staff_no: response.data.staff_no,
        status: response.data.status
      }
    // } else {
      // console.warn('获取用户信息失败:', response?.message || '未知错误')
      // 如果 API 失败，尝试从 localStorage 获取
      // const userStr = localStorage.getItem('currentUser')
      // if (userStr) {
      //   try {
      //     currentUser.value = JSON.parse(userStr)
      //   } catch (e) {
      //     console.error('解析用户信息失败:', e)
      //   }
      // }
    }
  } catch (error) {
    // console.error('获取用户信息异常:', error)
    toastException(error, '获取用户信息异常')
    // 如果 API 失败，尝试从 localStorage 获取
    // const userStr = localStorage.getItem('currentUser')
    // if (userStr) {
    //   try {
    //     currentUser.value = JSON.parse(userStr)
    //   } catch (e) {
    //     console.error('解析用户信息失败:', e)
    //   }
    // }
  }
}

// 生命周期
onMounted(() => {
  fetchCurrentUser()
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background: #001529;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.3);
  margin: 0 4px;
}

.breadcrumb-item {
  color: rgba(255, 255, 255, 0.65);
}

.breadcrumb-item.breadcrumb-active {
  color: #fff;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.action-icon {
  font-size: 18px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 8px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.2;
}

.user-real-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.2;
}

.dropdown-icon {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
  transition: transform 0.3s;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.3s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.menu-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0;
}
</style>

