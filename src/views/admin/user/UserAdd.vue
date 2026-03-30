<template>
  <div class="user-form">
    <div class="form-header">
      <h2>新增用户</h2>
      <button class="btn btn-secondary" @click="handleCancel">返回</button>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span>登录名
          </label>
          <input
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入登录名"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span>密码
          </label>
          <input
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="请输入密码"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">真实名字</label>
          <input
            v-model="formData.real_name"
            type="text"
            class="form-input"
            placeholder="请输入真实名字"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">是否Root用户</label>
            <select v-model="formData.is_root" class="form-select">
              <option :value="0">否</option>
              <option :value="1">是</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">是否内部员工</label>
            <select v-model="formData.is_staff" class="form-select">
              <option :value="0">否</option>
              <option :value="1">是</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">员工号</label>
          <input
            v-model.number="formData.staff_no"
            type="number"
            class="form-input"
            placeholder="请输入员工号"
            min="0"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input
              v-model="formData.email"
              type="email"
              class="form-input"
              placeholder="请输入邮箱"
            />
          </div>

          <div class="form-group">
            <label class="form-label">手机号</label>
            <input
              v-model="formData.phone"
              type="tel"
              class="form-input"
              placeholder="请输入手机号"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">角色</label>
            <select v-model="formData.role_id" class="form-select">
              <option :value="0">请选择角色</option>
              <option
                v-for="role in roleList"
                :key="role.id"
                :value="role.id"
              >
                {{ role.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">所属组织</label>
            <select v-model="formData.org_id" class="form-select">
              <option :value="0">请选择组织</option>
              <option
                v-for="org in orgList"
                :key="org.id"
                :value="org.id"
              >
                {{ getOrgDisplayName(org) }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">状态</label>
          <select v-model="formData.status" class="form-select">
            <option :value="1">在职</option>
            <option :value="0">离职</option>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '@/apis/admin-api/user-api'
import { roleAPI } from '@/apis/admin-api/role-api'
import { orgAPI } from '@/apis/admin-api/organization-api'

const router = useRouter()

const loading = ref(false)
const roleList = ref([])
const orgList = ref([])

const formData = ref({
  name: '',
  password: '',
  real_name: '',
  is_root: 0,
  is_staff: 0,
  staff_no: 0,
  email: '',
  phone: '',
  status: 1,
  avatar: '',
  role_id: 0,
  org_id: 0
})

// 获取角色列表
const fetchRoleList = async () => {
  try {
    const response = await roleAPI.query({
      page: 1,
      pageSize: 1000
    })
    const data = response?.data || response
    if (data && typeof data === 'object' && 'list' in data) {
      roleList.value = data.list || []
    } else if (Array.isArray(data)) {
      roleList.value = data
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    roleList.value = []
  }
}

// 获取组织列表
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

// 获取组织显示名称（带层级缩进，使用非断行空格优化显示）
const getOrgDisplayName = (org) => {
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
    alert('请输入登录名')
    return
  }

  if (!formData.value.password.trim()) {
    alert('请输入密码')
    return
  }

  loading.value = true
  try {
    // 处理空值，将空字符串转换为 0 或 undefined
    const submitData = {
      name: formData.value.name.trim(),
      password: formData.value.password,
      real_name: formData.value.real_name || '',
      is_root: formData.value.is_root || 0,
      is_staff: formData.value.is_staff || 0,
      staff_no: formData.value.staff_no || 0,
      email: formData.value.email || '',
      phone: formData.value.phone || '',
      status: formData.value.status !== undefined ? formData.value.status : 1,
      avatar: formData.value.avatar || '',
      role_id: formData.value.role_id || 0,
      org_id: formData.value.org_id || 0
    }

    await userAPI.add(submitData)
    alert('新增成功')
    router.push({ name: 'admin.user.list' })
  } catch (error) {
    console.error('新增用户失败:', error)
    alert('新增失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  router.push({ name: 'admin.user.list' })
}

// 组件挂载时获取数据
onMounted(async () => {
  await Promise.all([
    fetchRoleList(),
    fetchOrgList()
  ])
})
</script>

<style scoped>
/* 样式已提取到 assets/admin-ui.css，此处仅保留页面特有的样式 */
</style>

