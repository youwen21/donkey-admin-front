<template>
  <div class="org-form">
    <div class="form-header">
      <h2>新增组织</h2>
      <button class="btn btn-secondary" @click="handleCancel">返回</button>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span>组织名称
          </label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入组织名称"
            required
            maxlength="32"
          />
        </div>

        <div class="form-group">
          <label class="form-label">上级组织</label>
          <select v-model="formData.parent_id" class="form-select">
            <option :value="0">无（顶级组织）</option>
            <option
              v-for="org in orgList"
              :key="org.id"
              :value="org.id"
            >
              {{ getOrgDisplayName(org) }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">状态</label>
          <select v-model="formData.status" class="form-select">
            <option :value="1">启用</option>
            <option :value="2">禁用</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">序号</label>
          <input
            v-model.number="formData.order_no"
            type="number"
            class="form-input"
            placeholder="请输入序号"
            min="0"
          />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orgAPI } from '@/apis/admin-api/organization-api.js'
import { toastSuccess, toastError, toastException } from '@/utils/toast.js'

const router = useRouter()

const loading = ref(false)
const orgList = ref([])

const formData = ref({
  parent_id: 0,
  name: '',
  level: 0,
  node_path: '',
  status: 1,
  order_no: 0
})

// 获取组织列表（用于选择上级组织）
const fetchOrgList = async () => {
  try {
    const response = await orgAPI.query({
      page: 1,
      pageSize: 1000
    })
    const data = response?.data || response
    if (data && typeof data === 'object' && 'list' in data) {
      orgList.value = data.list || []
    } else if (Array.isArray(data)) {
      orgList.value = data
    }
  } catch (error) {
    toastException(error, '获取组织列表失败:')
    // console.error('获取组织列表失败:', error)
    orgList.value = []
  }
}

// 获取组织显示名称（带层级缩进）
const getOrgDisplayName = (org) => {
  // const indent = '  '.repeat(org.level || 0)
  // const prefix = org.level > 0 ? '└─ ' : ''
  // return `${indent}${prefix}${org.name}`

  if (org.level === 0) {
    return org.name
  }
  // 使用非断行空格（\u00A0）实现缩进，每级缩进 4 个非断行空格
  const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(org.level)
  const prefix = '└─ '
  return `${indent}${prefix}${org.name}`
}

// 处理提交
const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    toastError('请输入组织名称')
    return
  }

  loading.value = true
  try {
    // 根据 parent_id 计算 level 和 path 后台处理path字段
    // if (formData.value.parent_id > 0) {
    //   const parent = orgList.value.find(org => org.id === formData.value.parent_id)
    //   if (parent) {
    //     formData.value.level = (parent.level || 0) + 1
    //     formData.value.node_path = parent.node_path ? `${parent.node_path}/${parent.id}` : `${parent.id}`
    //   }
    // } else {
    //   formData.value.level = 0
    //   formData.value.node_path = ''
    // }

    await orgAPI.add(formData.value)
    toastSuccess('新增成功')
    router.push({ name: 'admin.org.list' })
  } catch (error) {
    toastException(error, '新增组织失败:')
    // console.error('新增组织失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.push({ name: 'admin.org.list' })
}

// 组件挂载时获取组织列表
onMounted(() => {
  fetchOrgList()
})
</script>

<style scoped>
.org-form {
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
  max-width: 600px;
}

.form-group {
  margin-bottom: 24px;
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

