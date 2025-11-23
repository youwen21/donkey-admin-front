<template>
  <div class="org-form">
    <div class="form-header">
      <h2>编辑组织</h2>
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
          <select v-model="formData.parent_id" class="form-select" :disabled="loading">
            <option :value="0">无（顶级组织）</option>
            <option
              v-for="org in filteredOrgList"
              :key="org.id"
              :value="org.id"
              :disabled="org.id === formData.id"
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

        <!-- <div class="form-info">
          <div class="info-item">
            <span class="info-label">组织级别：</span>
            <span class="info-value">{{ formData.level }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">组织路径：</span>
            <span class="info-value">{{ formData.node_path || '-' }}</span>
          </div>
        </div> -->

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
import { orgAPI } from '@/apis/admin-api/organization-api.js'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const orgList = ref([])

const formData = ref({
  id: 0,
  parent_id: 0,
  name: '',
  level: 0,
  node_path: '',
  status: 1,
  order_no: 0
})

// 过滤组织列表（排除当前组织及其子组织）
const filteredOrgList = computed(() => {
  const currentId = formData.value.id
  if (!currentId) return orgList.value

  // 递归查找所有子组织ID
  const findChildrenIds = (parentId) => {
    const children = orgList.value.filter(org => org.parent_id === parentId)
    const ids = [parentId]
    children.forEach(child => {
      ids.push(...findChildrenIds(child.id))
    })
    return ids
  }

  const excludeIds = new Set(findChildrenIds(currentId))
  return orgList.value.filter(org => !excludeIds.has(org.id))
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
    console.error('获取组织列表失败:', error)
    orgList.value = []
  }
}

// 获取组织详情
const fetchOrgDetail = async () => {
  const id = route.params.id
  if (!id) {
    alert('缺少组织ID')
    router.push({ name: 'admin.org.list' })
    return
  }

  loading.value = true
  try {
    const response = await orgAPI.get({ id: parseInt(id) })
    const data = response?.data || response
    if (data) {
      Object.assign(formData.value, {
        id: data.id || 0,
        parent_id: data.parent_id || 0,
        name: data.name || '',
        level: data.level || 0,
        node_path: data.node_path || '',
        status: data.status !== undefined ? data.status : 1,
        order_no: data.order_no || 0
      })
    }
  } catch (error) {
    console.error('获取组织详情失败:', error)
    alert('获取组织详情失败，请稍后重试')
    router.push({ name: 'admin.org.list' })
  } finally {
    loading.value = false
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
    alert('请输入组织名称')
    return
  }

  loading.value = true
  try {
    // 如果 parent_id 改变，需要重新计算 level 和 path 后台处理path字段
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

    await orgAPI.update(formData.value)
    alert('更新成功')
    router.push({ name: 'admin.org.list' })
  } catch (error) {
    console.error('更新组织失败:', error)
    alert('更新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.push({ name: 'admin.org.list' })
}

// 组件挂载时获取数据
onMounted(async () => {
  await fetchOrgList()
  await fetchOrgDetail()
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

.form-select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-info {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.info-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  margin-right: 8px;
}

.info-value {
  color: #333;
  font-weight: 500;
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

