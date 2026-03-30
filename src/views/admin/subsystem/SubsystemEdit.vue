<template>
  <div class="subsystem-form">
    <div class="form-header">
      <h2>编辑子系统</h2>
      <button class="btn btn-secondary" @click="handleCancel">返回</button>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span>名称
          </label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入子系统名称"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label class="form-label">域名</label>
          <input
            v-model="formData.domain"
            type="text"
            class="form-input"
            placeholder="请输入域名，如：example.com"
            :disabled="loading"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <span class="required">*</span>Key
            </label>
            <input
              v-model="formData.syskey"
              type="text"
              class="form-input"
              placeholder="请输入系统key"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="required">*</span>Secret
            </label>
            <input
              v-model="formData.secret"
              type="text"
              class="form-input"
              placeholder="请输入secret"
              required
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { subsystemAPI } from '@/apis/admin-api/subsystem-api'
import { toastSuccess, toastException } from '@/utils/toast'
import { routeParam } from '@/utils/route'

const router = useRouter()
const route = useRoute()

const loading = ref(false)

const formData = ref({
  id: 0,
  name: '',
  domain: '',
  syskey: '',
  secret: '',
  status: 1,
  order_no: 0
})

// 获取子系统详情
const fetchSubsystemDetail = async () => {
  const id = routeParam(route.params.id)
  if (!id) {
    toastException('缺少子系统ID', '参数错误')
    router.push({ name: 'admin.subsystem.list' })
    return
  }

  loading.value = true
  try {
    const response = await subsystemAPI.get({ id: parseInt(id, 10) })
    if (response.code !== 0) {
      toastException(response.message, '获取子系统详情失败')
      return
    }
    const data = response.data
    Object.assign(formData.value, data)
  } catch (error) {
    toastException(error, '获取子系统详情失败')
    router.push({ name: 'admin.subsystem.list' })
  } finally {
    loading.value = false
  }
}

// 处理提交
const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    toastException('请输入子系统名称', '表单验证失败')
    return
  }

  if (!formData.value.syskey.trim()) {
    toastException('请输入系统key', '表单验证失败')
    return
  }

  if (!formData.value.secret.trim()) {
    toastException('请输入secret', '表单验证失败')
    return
  }

  loading.value = true
  try {
    await subsystemAPI.setInfo({
      id: formData.value.id,
      name: formData.value.name.trim(),
      domain: formData.value.domain.trim() || '',
      syskey: formData.value.syskey.trim(),
      secret: formData.value.secret.trim(),
      status: formData.value.status !== undefined ? formData.value.status : 1,
      order_no: formData.value.order_no || 0
    })
    toastSuccess('更新成功')
    router.push({ name: 'admin.subsystem.list' })
  } catch (error) {
    toastException(error, '更新失败')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.push({ name: 'admin.subsystem.list' })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchSubsystemDetail()
})
</script>

<style scoped>
.subsystem-form {
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

