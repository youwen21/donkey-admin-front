<template>
  <div class="role-form">
    <div class="form-header">
      <h2>编辑角色</h2>
      <button class="btn btn-secondary" @click="handleCancel">返回</button>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span>角色名称
          </label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入角色名称"
            required
            maxlength="32"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label class="form-label">状态</label>
          <select v-model="formData.status" class="form-select">
            <option :value="1">启用</option>
            <option :value="2">禁用</option>
          </select>
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
import { useRouter, useRoute } from 'vue-router'
import { roleAPI, roleGet } from '@/apis/admin-api/role-api.js'
import { toastSuccess, toastException } from '@/utils/toast.js'

const router = useRouter()
const route = useRoute()

const loading = ref(false)

const formData = ref({
  id: 0,
  name: '',
  status: 1
})

// 获取角色详情
const fetchRoleDetail = async () => {
  const id = route.params.id
  if (!id) {
    toastException('缺少角色ID', '参数错误')
    router.push({ name: 'admin.role.list' })
    return
  }

  loading.value = true
  try {
    const data = await roleGet({ id: parseInt(id) })
    if (data) {
      Object.assign(formData.value, {
        id: data.id || 0,
        name: data.name || '',
        status: data.status !== undefined ? data.status : 1
      })
    } else {
      toastException('获取角色详情失败', '数据错误')
      router.push({ name: 'admin.role.list' })
    }
  } catch (error) {
    toastException(error, '获取角色详情失败')
    router.push({ name: 'admin.role.list' })
  } finally {
    loading.value = false
  }
}

// 处理提交
const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    toastException('请输入角色名称', '表单验证失败')
    return
  }

  loading.value = true
  try {
    await roleAPI.setInfo({
      id: formData.value.id,
      name: formData.value.name.trim(),
      status: formData.value.status !== undefined ? formData.value.status : 1
    })
    toastSuccess('更新成功')
    router.push({ name: 'admin.role.list' })
  } catch (error) {
    toastException(error, '更新失败')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.push({ name: 'admin.role.list' })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchRoleDetail()
})
</script>

<style scoped>
.role-form {
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

