<template>
  <div class="menu-form">
    <div class="form-header">
      <h2>编辑菜单</h2>
      <button class="btn btn-secondary" @click="handleCancel">返回</button>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <span class="required">*</span>子系统
            </label>
            <select v-model="formData.system_id" class="form-select" :disabled="loading" @change="handleSystemChange">
              <option :value="0">请选择子系统</option>
              <option
                v-for="subsystem in subsystemList"
                :key="subsystem.id"
                :value="subsystem.id"
              >
                {{ subsystem.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">上级菜单</label>
            <select v-model="formData.parent_id" class="form-select" :disabled="loading">
              <option :value="0">无（顶级菜单）</option>
              <option
                v-for="menu in filteredMenuList"
                :key="menu.id"
                :value="menu.id"
                :disabled="menu.id === formData.id"
              >
                {{ getMenuDisplayName(menu) }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span>菜单名称
          </label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入菜单名称"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">菜单路径</label>
            <input
              v-model="formData.node_path"
              type="text"
              class="form-input"
              placeholder="请输入菜单路径"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">URL</label>
            <input
              v-model="formData.url"
              type="text"
              class="form-input"
              placeholder="请输入URL"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">状态</label>
            <select v-model="formData.status" class="form-select">
              <option :value="1">有效</option>
              <option :value="2">禁用</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">排序</label>
            <input
              v-model.number="formData.order_no"
              type="number"
              class="form-input"
              placeholder="请输入排序号"
              min="0"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleCancel">
            取消
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '提交中...' : '提交' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { menuAPI, menuGet, menuFetchList } from '@/apis/admin-api/menu-api.js'
import { subsystemFetchList } from '@/apis/admin-api/subsystem-api.js'
import { toastSuccess, toastException } from '@/utils/toast.js'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const subsystemList = ref([])
const menuList = ref([])

const formData = ref({
  id: 0,
  system_id: 0,
  parent_id: 0,
  name: '',
  level: 0,
  node_path: '',
  url: '',
  status: 1,
  order_no: 0
})

// 根据选择的子系统过滤菜单列表，并排除当前菜单及其子菜单
const filteredMenuList = computed(() => {
  if (formData.value.system_id === 0) {
    return []
  }
  return menuList.value.filter(menu => {
    // 只显示同一子系统的菜单
    if (menu.system_id !== formData.value.system_id) {
      return false
    }
    // 排除当前菜单
    if (menu.id === formData.value.id) {
      return false
    }
    // 排除当前菜单的子菜单（通过路径判断）
    const currentPath = formData.value.node_path || ''
    if (currentPath && menu.node_path && menu.node_path.startsWith(currentPath + '/')) {
      return false
    }
    return true
  })
})

// 获取菜单显示名称（带层级缩进）
const getMenuDisplayName = (menu) => {
  // const indent = '  '.repeat(menu.level || 0)
  // const prefix = menu.level > 0 ? '└─ ' : ''
  // return `${indent}${prefix}${menu.name}`
  if (menu.level === 0) {
    return menu.name
  }
  // 使用非断行空格（\u00A0）实现缩进，每级缩进 4 个非断行空格
  const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(menu.level)
  const prefix = '└─ '
  return `${indent}${prefix}${menu.name}`
}

// 处理子系统变更
const handleSystemChange = () => {
  // 切换子系统时，重置上级菜单
  formData.value.parent_id = 0
}

// 获取子系统列表
const fetchSubsystemList = async () => {
  try {
    const result = await subsystemFetchList()
    subsystemList.value = result.list || []
  } catch (error) {
    console.error('获取子系统列表失败:', error)
    subsystemList.value = []
  }
}

// 获取菜单列表（用于选择上级菜单）
const fetchMenuList = async () => {
  try {
    const result = await menuFetchList()
    menuList.value = result.list || []
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    menuList.value = []
  }
}

// 获取菜单详情
const fetchMenuDetail = async () => {
  const id = route.params.id
  if (!id) {
    toastException('缺少菜单ID', '参数错误')
    router.push({ name: 'admin.menu.list' })
    return
  }

  loading.value = true
  try {
    const data = await menuGet({ id: parseInt(id) })
    if (data) {
      Object.assign(formData.value, {
        id: data.id || 0,
        system_id: data.system_id || 0,
        parent_id: data.parent_id || 0,
        name: data.name || '',
        level: data.level || 0,
        node_path: data.node_path || '',
        url: data.url || '',
        status: data.status !== undefined ? data.status : 1,
        order_no: data.order_no || 0
      })
    } else {
      toastException('获取菜单详情失败', '数据错误')
      router.push({ name: 'admin.menu.list' })
    }
  } catch (error) {
    toastException(error, '获取菜单详情失败')
    router.push({ name: 'admin.menu.list' })
  } finally {
    loading.value = false
  }
}

// 处理提交
const handleSubmit = async () => {
  if (!formData.value.system_id || formData.value.system_id === 0) {
    toastException('请选择子系统', '表单验证失败')
    return
  }

  if (!formData.value.name.trim()) {
    toastException('请输入菜单名称', '表单验证失败')
    return
  }

  loading.value = true
  try {
    // 根据 parent_id 计算 level
    let level = 0
    if (formData.value.parent_id > 0) {
      const parent = menuList.value.find(menu => menu.id === formData.value.parent_id)
      if (parent) {
        level = (parent.level || 0) + 1
      }
    }

    await menuAPI.setInfo({
      id: formData.value.id,
      system_id: formData.value.system_id,
      parent_id: formData.value.parent_id || 0,
      name: formData.value.name.trim(),
      level: level,
      node_path: formData.value.node_path.trim() || '',
      url: formData.value.url.trim() || '',
      status: formData.value.status !== undefined ? formData.value.status : 1,
      order_no: formData.value.order_no || 0
    })
    toastSuccess('更新成功')
    router.push({ name: 'admin.menu.list' })
  } catch (error) {
    toastException(error, '更新失败')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.push({ name: 'admin.menu.list' })
}

// 组件挂载时获取数据
onMounted(async () => {
  await Promise.all([
    fetchSubsystemList(),
    fetchMenuList()
  ])
  await fetchMenuDetail()
})
</script>

<style scoped>
.menu-form {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.form-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.form-container {
  max-width: 800px;
}

.form-group {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.required {
  color: #ff4d4f;
  margin-right: 4px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #1890ff;
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-select {
  background: #fff;
  cursor: pointer;
}

.form-select option:disabled {
  color: #999;
  background: #f5f5f5;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
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
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>

