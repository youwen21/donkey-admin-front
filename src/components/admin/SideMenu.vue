<template>
  <div class="side-menu">
    <div class="menu-list">
      <template v-for="item in menuList" :key="item.id">
        <!-- 一级菜单 -->
        <MenuItem
          :item="item"
          :level="0"
          :is-active="isItemActive(item)"
          :has-active-child="hasItemActiveChild(item)"
          :is-expanded="expandedItems.has(item.id)"
          @item-click="handleItemClick"
        />
        <!-- 二级菜单（当父菜单展开时显示） -->
        <template v-if="item.children && item.children.length > 0 && expandedItems.has(item.id)">
          <MenuItem
            v-for="child in getFilteredChildren(item)"
            :key="child.id"
            :item="child"
            :level="1"
            :is-active="isItemActive(child)"
            :has-active-child="hasItemActiveChild(child)"
            @item-click="handleItemClick"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import MenuItem from './MenuItem.vue'
import sideMenuStore from '@/store/sideMenu.js'

const props = defineProps({
  menuData: {
    type: Array,
    default: () => []
  }
})

const route = useRoute()

// 展开的菜单项 ID 集合
const expandedItems = ref(new Set())

// 过滤并排序一级菜单数据
const menuList = computed(() => {
  return props.menuData
    .filter(item => item.status === 1) // 只显示启用状态的菜单
    .sort((a, b) => (a.order_no || 0) - (b.order_no || 0))
})

// 获取过滤并排序后的子菜单
const getFilteredChildren = (item) => {
  if (!item.children || item.children.length === 0) {
    return []
  }
  return item.children
    .filter(child => child.status === 1) // 只显示启用状态的菜单
    .sort((a, b) => (a.order_no || 0) - (b.order_no || 0))
}

// 获取菜单路径
const getMenuPath = (item) => {
  return item.url || ''
}

// 判断菜单项是否激活
const isItemActive = (item) => {
  const menuPath = getMenuPath(item)
  if (!menuPath) return false

  if (item.url == '/') {
    return false
  }
  
  // 如果 store 中有激活路径，使用 store 的值
  if (sideMenuStore.activeItemPath) {
    // 精确匹配
    if (sideMenuStore.activeItemPath === menuPath) {
      return true
    }
    // 路径前缀匹配（但排除父路径）
    if (sideMenuStore.activeItemPath.startsWith(menuPath + '/')) {
      // 检查是否有子菜单，如果有子菜单，需要检查是否有激活的子菜单
      if (item.children && item.children.length > 0) {
        const hasActive = hasItemActiveChild(item)
        return !hasActive
      }
      return true
    }
    return false
  }
  
  // 如果 store 中没有值，使用路由路径判断
  const currentPath = route.path
  
  // 精确匹配
  if (currentPath === menuPath) {
    return true
  }
  
  // 路径前缀匹配（但排除父路径）
  if (currentPath.startsWith(menuPath + '/')) {
    // 检查是否有子菜单
    if (item.children && item.children.length > 0) {
      const hasActive = hasItemActiveChild(item)
      return !hasActive
    }
    return true
  }
  
  return false
}

// 检查菜单项是否有激活的子菜单
const hasItemActiveChild = (item) => {
  if (!item.children || item.children.length === 0) return false
  
  const activePath = sideMenuStore.activeItemPath || route.path
  
  return item.children.some(child => {
    if (child.status !== 1) return false
    
    const childPath = getMenuPath(child)
    if (childPath && (activePath === childPath || activePath.startsWith(childPath + '/'))) {
      return true
    }
    // 递归检查子菜单的子菜单
    if (child.children && child.children.length > 0) {
      return hasItemActiveChild(child)
    }
    return false
  })
}

// 处理菜单项点击
const handleItemClick = (item) => {
  const itemPath = getMenuPath(item)
  if (itemPath && itemPath != '/') {
    sideMenuStore.setActiveItemPath(itemPath)
  }
  
  // 如果有子菜单，切换展开/折叠状态
  if (item.children && item.children.length > 0) {
    if (expandedItems.value.has(item.id)) {
      expandedItems.value.delete(item.id)
    } else {
      expandedItems.value.add(item.id)
    }
  }
}

// 递归查找匹配路径的菜单项
const findMenuItemByPath = (items, targetPath) => {
  for (const item of items) {
    if (item.status !== 1) continue
    
    const itemPath = getMenuPath(item)
    if (itemPath) {
      // 精确匹配
      if (targetPath === itemPath) {
        return item
      }
      // 路径前缀匹配
      if (targetPath.startsWith(itemPath + '/')) {
        // 如果有子菜单，继续在子菜单中查找
        if (item.children && item.children.length > 0) {
          const found = findMenuItemByPath(item.children, targetPath)
          if (found) return found
        }
        // 如果没有子菜单或子菜单中没找到，返回当前项
        if (!item.children || item.children.length === 0) {
          return item
        }
      }
    }
    
    // 递归检查子菜单
    if (item.children && item.children.length > 0) {
      const found = findMenuItemByPath(item.children, targetPath)
      if (found) return found
    }
  }
  return null
}

// 递归展开包含激活项的父菜单
const expandParentMenus = (items, targetPath, parentIds = []) => {
  for (const item of items) {
    if (item.status !== 1) continue
    
    const itemPath = getMenuPath(item)
    if (itemPath && (targetPath === itemPath || targetPath.startsWith(itemPath + '/'))) {
      // 如果匹配，展开所有父菜单
      parentIds.forEach(id => expandedItems.value.add(id))
      return true
    }
    
    // 递归检查子菜单
    if (item.children && item.children.length > 0) {
      const newParentIds = [...parentIds, item.id]
      if (expandParentMenus(item.children, targetPath, newParentIds)) {
        return true
      }
    }
  }
  return false
}

// 根据路由路径初始化激活项
const initActiveItemByRoute = () => {
  // 如果 store 中已有激活路径，不覆盖
  if (sideMenuStore.activeItemPath) {
    // 展开包含激活项的父菜单
    expandParentMenus(menuList.value, sideMenuStore.activeItemPath)
    return
  }
  
  const currentPath = route.path
  const matchedItem = findMenuItemByPath(menuList.value, currentPath)
  if (matchedItem) {
    const matchedPath = getMenuPath(matchedItem)
    if (matchedPath) {
      sideMenuStore.setActiveItemPath(matchedPath)
      // 展开包含激活项的父菜单
      expandParentMenus(menuList.value, matchedPath)
    }
  }
}

// 监听路由变化，当 store 为空时根据路由设置激活项
watch(
  () => route.path,
  () => {
    // 只有当 store 中没有激活路径时，才根据路由设置
    if (!sideMenuStore.activeItemPath) {
      initActiveItemByRoute()
    } else {
      // 如果 store 中有值，也要展开父菜单
      expandParentMenus(menuList.value, sideMenuStore.activeItemPath)
    }
  },
  { immediate: true }
)

// 监听菜单数据变化，初始化激活项
watch(
  () => props.menuData,
  () => {
    if (props.menuData && props.menuData.length > 0) {
      initActiveItemByRoute()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.side-menu {
  width: 240px;
  height: 100vh;
  background-color: #001529;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-list {
  padding: 16px 0;
}

/* 滚动条样式 */
.side-menu::-webkit-scrollbar {
  width: 6px;
}

.side-menu::-webkit-scrollbar-track {
  background: #001529;
}

.side-menu::-webkit-scrollbar-thumb {
  background: #434343;
  border-radius: 3px;
}

.side-menu::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
