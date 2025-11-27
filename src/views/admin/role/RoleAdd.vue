<template>
  <div class="role-form">
    <div class="form-header">
      <h2>新增角色</h2>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { roleAPI } from '@/apis/admin-api/role-api.js'
import { toastSuccess, toastException } from '@/utils/toast.js'

const router = useRouter()

const loading = ref(false)

const formData = ref({
  name: '',
  status: 1
})

// 处理提交
const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    toastException('请输入角色名称', '表单验证失败')
    return
  }

  loading.value = true
  try {
    await roleAPI.add({
      name: formData.value.name.trim(),
      status: formData.value.status !== undefined ? formData.value.status : 1
    })
    toastSuccess('新增成功')
    router.push({ name: 'admin.role.list' })
  } catch (error) {
    toastException(error, '新增失败')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.push({ name: 'admin.role.list' })
}
</script>

<style scoped>
/* 样式已提取到 assets/admin-ui.css，此处仅保留页面特有的样式 */
</style>

