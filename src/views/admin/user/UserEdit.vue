<template>
  <div class="user-form">
    <div class="form-header">
      <h2>编辑用户</h2>
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
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label class="form-label">密码</label>
          <input
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="留空则不修改密码"
          />
          <small class="form-hint">留空则不修改密码</small>
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
import { useRouter, useRoute } from 'vue-router'
import { userAPI } from '@/apis/admin-api/user-api'
import { roleAPI } from '@/apis/admin-api/role-api'
import { orgAPI } from '@/apis/admin-api/organization-api'
import { routeParam } from '@/utils/route'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const roleList = ref([])
const orgList = ref([])

const formData = ref({
  id: 0,
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

// 获取用户详情
const fetchUserDetail = async () => {
  const id = routeParam(route.params.id)
  if (!id) {
    alert('缺少用户ID')
    router.push({ name: 'admin.user.list' })
    return
  }

  loading.value = true
  try {
    const response = await userAPI.get({ id: parseInt(id, 10) })
    const data = response?.data || response
    if (data) {
      Object.assign(formData.value, {
        id: data.id || 0,
        name: data.name || '',
        password: '', // 密码不显示，留空
        real_name: data.real_name || '',
        is_root: data.is_root !== undefined ? data.is_root : 0,
        is_staff: data.is_staff !== undefined ? data.is_staff : 0,
        staff_no: data.staff_no || 0,
        email: data.email || '',
        phone: data.phone || '',
        status: data.status !== undefined ? data.status : 1,
        avatar: data.avatar || '',
        role_id: data.role_id || 0,
        org_id: data.org_id || 0
      })
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    alert('获取用户详情失败，请稍后重试')
    router.push({ name: 'admin.user.list' })
  } finally {
    loading.value = false
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

  loading.value = true
  try {
    // 使用 setInfo 方法，允许 0 和空字符串
    const submitData: Record<string, unknown> = {
      id: formData.value.id,
      name: formData.value.name.trim(),
      real_name: formData.value.real_name || '',
      is_root: formData.value.is_root !== undefined ? formData.value.is_root : 0,
      is_staff: formData.value.is_staff !== undefined ? formData.value.is_staff : 0,
      staff_no: formData.value.staff_no || 0,
      email: formData.value.email || '',
      phone: formData.value.phone || '',
      status: formData.value.status !== undefined ? formData.value.status : 1,
      avatar: formData.value.avatar || '',
      role_id: formData.value.role_id || 0,
      org_id: formData.value.org_id || 0,
    }

    // 如果密码不为空，则更新密码
    if (formData.value.password && formData.value.password.trim()) {
      submitData.password = formData.value.password
    }

    await userAPI.setInfo(submitData)
    alert('更新成功')
    router.push({ name: 'admin.user.list' })
  } catch (error) {
    console.error('更新用户失败:', error)
    alert('更新失败，请稍后重试')
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
  await fetchUserDetail()
})
</script>

<style scoped>
/* 样式已提取到 assets/admin-ui.css，此处仅保留页面特有的样式 */
</style>

