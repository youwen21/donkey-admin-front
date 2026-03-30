<template>
  <div class="menu-form">
    <div class="form-header">
      <h2>新增菜单</h2>
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

        <!-- <div class="form-row">
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
        </div> -->

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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { menuAPI } from '@/apis/admin-api/menu-api'
import { subsystemAPI } from '@/apis/admin-api/subsystem-api'
import { toastSuccess, toastException } from '@/utils/toast'
import type { SubsystemExDTO } from '@/apis/admin-api/subsystem-types'
import type { MenuExDTO } from '@/apis/admin-api/menu-types'

const router = useRouter()

const loading = ref(false)
const subsystemList = ref<SubsystemExDTO[]>([])
const menuList = ref<MenuExDTO[]> ([])


const formData = ref({
  system_id: 0,
  parent_id: 0,
  name: '',
  level: 0,
  url: '',
  status: 1,
  order_no: 0
})

// 根据选择的子系统过滤菜单列表
const filteredMenuList = computed(() => {
  if (formData.value.system_id === 0) {
    return []
  }
  return menuList.value.filter(menu => menu.system_id === formData.value.system_id)
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
    const response = await subsystemAPI.query({ page: 1, pageSize: 1000 })
    if (response.code !== 0) {
      toastException(response.message, '获取子系统列表失败')
      return
    }
    subsystemList.value = response.data.list ?? []
  } catch (error) {
    toastException(error, '获取子系统列表失败')
    subsystemList.value = []
  }
}

// 获取菜单列表（用于选择上级菜单）
const fetchMenuList = async () => {
  try {
    const response = await menuAPI.query({ page: 1, pageSize: 1000 })
    if (response.code !== 0) {
      toastException(response.message, '获取菜单列表失败')
      return
    }
    menuList.value = response.data.list ?? []
  } catch (error) {
    toastException(error, '获取菜单列表失败')
    menuList.value = []
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

    const response = await menuAPI.add({
      system_id: formData.value.system_id,
      parent_id: formData.value.parent_id || 0,
      name: formData.value.name.trim(),
      level: level,
      // node_path: formData.value.node_path.trim() || '',
      url: formData.value.url.trim() || '',
      status: formData.value.status !== undefined ? formData.value.status : 1,
      order_no: formData.value.order_no || 0
    })
    if (response.code !== 0) {
      toastException(response.message, '新增失败')
      return
    }
    toastSuccess('新增成功')
    router.push({ name: 'admin.menu.list' })
  } catch (error) {
    toastException(error, '新增失败')
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

