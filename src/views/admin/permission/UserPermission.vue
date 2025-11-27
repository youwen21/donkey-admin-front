<template>
  <div class="user-permission">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="user-info-card" v-if="userInfo">
          <div class="user-info-header">
            <span class="user-label">用户信息：</span>
            <span class="user-name">{{ userInfo.name }}</span>
            <span class="user-real-name" v-if="userInfo.real_name">({{ userInfo.real_name }})</span>
            <span :class="['user-status-badge', userInfo.status === 1 ? 'status-active' : 'status-inactive']">
              {{ userInfo.status === 1 ? '在职' : '离职' }}
            </span>
            <span v-if="userInfo.is_root === 1" class="user-root-badge">Root</span>
          </div>
          <div class="user-info-details">
            <span v-if="userInfo.staff_no" class="info-item">
              <span class="info-label">员工号：</span>
              <span class="info-value">{{ userInfo.staff_no }}</span>
            </span>
            <span v-if="userInfo.email" class="info-item">
              <span class="info-label">邮箱：</span>
              <span class="info-value">{{ userInfo.email }}</span>
            </span>
            <span v-if="userInfo.phone" class="info-item">
              <span class="info-label">手机：</span>
              <span class="info-value">{{ userInfo.phone }}</span>
            </span>
            <span v-if="userInfo.is_staff === 1" class="info-item">
              <span class="info-label">类型：</span>
              <span class="info-value">内部员工</span>
            </span>
          </div>
        </div>
        <div class="form-group-inline">
          <label class="form-label">子系统：</label>
          <select v-model="selectedSystemId" class="form-select" @change="handleSystemChange">
            <option :value="0">请选择子系统</option>
            <option v-for="subsystem in subsystemList" :key="subsystem.id" :value="subsystem.id">
              {{ subsystem.name }}
            </option>
          </select>
        </div>
        <button class="btn btn-primary" @click="handleLoadPermission" :disabled="!canLoadPermission">
          加载权限
        </button>
      </div>
    </div>

    <!-- 权限信息展示 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-text">加载中...</div>
    </div>

    <div v-else-if="permissionData" class="permission-content">
      <!-- 管理员标识 -->
      <div class="admin-badge" v-if="permissionData.is_root">
        <span class="badge-icon">👑</span>
        <span class="badge-text">（Root）管理员权限</span>
      </div>

      <!-- 权限统计 -->
      <!-- <div class="permission-stats">
        <h3 class="section-title">权限统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">菜单权限数：</span>
            <span class="stat-value">{{ permissionData.user_permissions?.menu_id_list?.length || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">操作权限数：</span>
            <span class="stat-value">{{ permissionData.user_permissions?.operation_id_list?.length || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总菜单数：</span>
            <span class="stat-value">{{ permissionData.system_menu?.length || 0 }}</span>
          </div>
        </div>
      </div> -->

      <!-- 菜单权限树 -->
      <div class="menu-tree">
        <h3 class="section-title">菜单权限</h3>
        <div class="tree-container">
          <div v-for="menu in permissionData.system_menu" :key="menu.id" class="menu-item"
            :class="{ 'has-children': menu.operations && menu.operations.length > 0 }">
            <!-- 菜单项 -->
            <div class="menu-row">
              <div class="menu-info" :style="{ paddingLeft: `${menu.level * 20}px` }">
                <span class="menu-icon" v-if="menu.level > 0">└─</span>
                <span class="menu-name">{{ menu.name }}</span>
                <span class="menu-url" v-if="menu.url">({{ menu.url }})</span>
              </div>
              <div class="permission-status">
                <label class="menu-checkbox-label">
                  <input
                    :data-menu-id="menu.id"
                    type="checkbox"
                    :checked="isMenuPermitted(menu.id)"
                    @change="handleMenuPermissionChange(menu.id, $event)"
                    class="menu-checkbox"
                    :disabled="permissionData.is_root"
                  />
                  <span class="checkbox-text">{{ isMenuPermitted(menu.id) ? '已授权' : '未授权' }}</span>
                </label>
              </div>
            </div>

            <!-- 操作权限列表 -->
            <div v-if="menu.operations && menu.operations.length > 0" class="operations-list">
              <label v-for="operation in menu.operations" :key="operation.id" class="operation-item">
                <input 
                  :data-operation-id="operation.id" 
                  type="checkbox" 
                  :disabled="permissionData.is_root" 
                  :checked="isOperationPermitted(operation.id)" 
                  class="operation-checkbox" 
                  @change="handleOperationPermissionChange(operation.id, $event)"
                  />
                <span class="operation-name">{{ operation.name }}</span>
                <span class="operation-code">({{ operation.code }})</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-secondary" @click="handleCancel">取消</button>
          <button class="btn btn-primary" @click="savePermission">保存权限</button>
        </div>
      </div>


    </div>

    <div v-else class="empty-container">
      <div class="empty-text">请选择子系统，然后点击"加载权限"按钮</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { subsystemFetchList } from '@/apis/admin-api/subsystem-api.js'
import { userAPI, userGet } from '@/apis/admin-api/user-api.js'
import { userPermissionAPI, userPermissionConfig } from '@/apis/admin-api/user-permission-api.js'
import { confirm, toastSuccess, toastException, toastError } from '@/utils/toast.js'

const route = useRoute()
const router = useRouter()

// 数据
const subsystemList = ref([])
const userInfo = ref(null)
const selectedSystemId = ref(0)
const permissionData = ref(null)
const loading = ref(false)

// 从路由参数获取用户ID
const selectedUserId = computed(() => {
  const userId = route.params.user_id || route.query.user_id
  return userId ? parseInt(userId) : 0
})

// 计算属性
const canLoadPermission = computed(() => {
  return selectedSystemId.value > 0 && selectedUserId.value > 0
})

// 方法
// 获取子系统列表
const fetchSubsystemList = async () => {
  try {
    const result = await subsystemFetchList()
    subsystemList.value = result.list || []
    // 默认选择第一个子系统
    if (subsystemList.value.length > 0) {
      selectedSystemId.value = subsystemList.value[0].id
    }
  } catch (error) {
    console.error('获取子系统列表失败:', error)
    subsystemList.value = []
  }
}

// 获取用户信息
const fetchUserInfo = async () => {
  const userId = selectedUserId.value
  if (!userId || userId === 0) {
    toastError('缺少用户ID参数', '参数错误')
    return
  }

  try {
    const data = await userGet({ id: userId })
    if (data) {
      userInfo.value = data
    } else {
      toastError('获取用户信息失败', '数据错误')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    toastException(error, '获取用户信息失败')
  }
}

// 加载权限数据
const handleLoadPermission = async () => {
  if (!canLoadPermission.value) {
    return
  }

  loading.value = true
  try {
    const data = await userPermissionConfig({
      system_id: selectedSystemId.value,
      user_id: selectedUserId.value
    })
    permissionData.value = data
  } catch (error) {
    console.error('加载权限数据失败:', error)
    permissionData.value = null
  } finally {
    loading.value = false
  }
}

// 处理子系统变更
const handleSystemChange = () => {
  // 切换子系统时，清空权限数据
  permissionData.value = null
}


// 检查菜单是否已授权
const isMenuPermitted = (menuId) => {
  if (!permissionData.value?.user_permissions?.menu_id_list) {
    return false
  }
  return permissionData.value.user_permissions.menu_id_list.includes(menuId)
}

// 检查操作是否已授权
const isOperationPermitted = (operationId) => {
  if (!permissionData.value?.user_permissions?.operation_id_list) {
    return false
  }
  return permissionData.value.user_permissions.operation_id_list.includes(operationId)
}

// 处理菜单权限变更
const handleMenuPermissionChange = async (menuId, event) => {
  if (permissionData.value.is_root) {
    // event.target.checked = true
    toastError('管理员拥有所有权限，无法修改', '权限提示')
    return
  }


  let permData = toRaw(permissionData.value)
  const menu = permData.system_menu.find(m => m.id === menuId)
  if (!menu) {
    toastException('menu not found', 'data error')
    return
  }

  const isChecked = event.target.checked

  try {
    // 更新菜单权限列表
    const menuIdList = [...(permData.user_permissions.menu_id_list || [])]
    if (isChecked) {
      if (!menuIdList.includes(menuId)) {
        menuIdList.push(menuId)
      }
    } else {
      const index = menuIdList.indexOf(menuId)
      if (index > -1) {
        menuIdList.splice(index, 1)
      }
      // 取消菜单权限时，同时取消该菜单下的所有操作权限
      if (menu && menu.operations && menu.operations.length > 0) {
        const operationIdList = permData.user_permissions.operation_id_list || []
        menu.operations.forEach(op => {
          const opIndex = operationIdList.indexOf(op.id)
          if (opIndex > -1) {
            operationIdList.splice(opIndex, 1)
          }
        })
        permData.user_permissions.operation_id_list = operationIdList
      }
    }

    permData.user_permissions.menu_id_list = menuIdList
    
    // 强制触发 Vue 响应式更新，确保 checkbox 状态同步
    permissionData.value = {...permData}

  } catch (error) {
    // 更新失败，恢复checkbox状态
    // event.target.checked = !isChecked
    toastException(error, 'catch error: 操作失败')
  }
}

const handleOperationPermissionChange = async (operationId, event) => {
  if (permissionData.value.is_root) {
    toastError('管理员拥有所有权限，无法修改', '权限提示')
    return
  }

  let permData = toRaw(permissionData.value)
  let operationIdList = permData.user_permissions.operation_id_list
  if (operationIdList.includes(operationId)) {
    operationIdList.splice(operationIdList.indexOf(operationId), 1)
  } else {
    operationIdList.push(operationId)
  }
  permData.user_permissions.operation_id_list = operationIdList
  permissionData.value = {...permData}
}
  

const savePermission = async () => {
  if (!permissionData.value) {
    toastError('请先加载权限数据', '操作提示')
    return
  }

  try {
    // 调用API更新权限
    await userPermissionAPI.save({
      system_id: selectedSystemId.value,
      user_id: selectedUserId.value,
      menu_id_list: permissionData.value.user_permissions.menu_id_list || [],
      operation_id_list: permissionData.value.user_permissions.operation_id_list || []
    })
    toastSuccess('保存权限成功')
  } catch (error) {
    // 更新失败
    toastException(error, '保存权限失败')
  }
}

// 处理取消，返回用户列表
const handleCancel = () => {
  router.push({ name: 'admin.user.list' })
}

// 监听子系统选择，自动加载权限（如果已选择用户）
watch(selectedSystemId, (newVal) => {
  if (newVal > 0 && selectedUserId.value > 0) {
    handleLoadPermission()
  }
})

// 监听用户ID变化（从路由参数）
watch(selectedUserId, (newVal) => {
  if (newVal > 0) {
    fetchUserInfo()
    if (selectedSystemId.value > 0) {
      handleLoadPermission()
    }
  }
}, { immediate: true })

// 生命周期
onMounted(async () => {
  await fetchSubsystemList()
  if (selectedUserId.value > 0) {
    await fetchUserInfo()
  }
})
</script>

<style scoped>
.user-permission {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f5ff;
  border-radius: 4px;
  border: 1px solid #adc6ff;
  min-width: 300px;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.user-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.user-name {
  font-size: 14px;
  color: #1890ff;
  font-weight: 600;
}

.user-real-name {
  font-size: 14px;
  color: #999;
}

.user-status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
}

.user-status-badge.status-active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.user-status-badge.status-inactive {
  background: #fff2e8;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.user-root-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.user-info-details {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 4px;
  border-top: 1px solid #d6e4ff;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
}

.form-group-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

.form-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.3s;
  min-width: 200px;
}

.form-select:focus {
  outline: none;
  border-color: #1890ff;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  background: #fafafa;
  border-color: #40a9ff;
  color: #1890ff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.loading-container,
.empty-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-text,
.empty-text {
  color: #999;
  font-size: 14px;
}

.permission-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  color: #fa8c16;
  font-size: 14px;
  font-weight: 500;
}

.badge-icon {
  font-size: 18px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.menu-tree {
  background: #fafafa;
  border-radius: 4px;
  padding: 20px;
}

.tree-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  background: #fff;
  border-radius: 4px;
  padding: 12px;
  border: 1px solid #e8e8e8;
}

.menu-item.has-children {
  border-left: 3px solid #1890ff;
}

.menu-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.menu-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.menu-icon {
  color: #999;
  font-size: 12px;
}

.menu-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.menu-url {
  font-size: 12px;
  color: #999;
}

.permission-status {
  flex-shrink: 0;
}

.menu-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.menu-checkbox {
  margin: 0;
  cursor: pointer;
}

.menu-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-text {
  font-size: 13px;
  color: #666;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-inactive {
  background: #fff2e8;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.operations-list {
  margin-top: 8px;
  padding-left: 24px;
  border-left: 2px dashed #e8e8e8;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.operation-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #fafafa;
  border-radius: 4px;
  cursor: default;
  user-select: none;
}

.operation-checkbox {
  margin: 0;
  cursor: default;
  flex-shrink: 0;
}

.operation-name {
  font-size: 13px;
  color: #666;
}

.operation-code {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.permission-stats {
  background: #fafafa;
  border-radius: 4px;
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}
</style>
