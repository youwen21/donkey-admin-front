import { reactive } from 'vue'

// SideMenu store
const sideMenuStore = reactive({
  // 当前激活的菜单项路径
  activeItemPath: null,

  // 设置激活的菜单项路径
  setActiveItemPath(path) {
    this.activeItemPath = path || null
  },

  // 设置激活的菜单项（通过菜单项对象）
  setActiveItem(item) {
    if (item) {
      this.activeItemPath = item.url || ''
    } else {
      this.activeItemPath = null
    }
  },

  // 清除激活状态
  clearActiveItem() {
    this.activeItemPath = null
  }
})

export default sideMenuStore

