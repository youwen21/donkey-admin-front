<template>
  <div class="user-list">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索登录名/真实名字/邮箱/手机号"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="status-select">
          <option value="">全部状态</option>
          <option value="1">在职</option>
          <option value="2">离职</option>
        </select>
        <!-- <select v-model="roleFilter" class="status-select">
          <option value="">全部角色</option>
          <option
            v-for="role in roleList"
            :key="role.id"
            :value="role.id"
          >
            {{ role.name }}
          </option>
        </select> -->
        <button class="btn btn-search" @click="handleSearch">
          查询
        </button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="handleAdd">
          <span class="btn-icon">+</span>
          新增用户
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>登录名</th>
            <th>真实名字</th>
            <th>是否Root</th>
            <th>是否员工</th>
            <th>员工号</th>
            <th>邮箱</th>
            <th>手机号</th>
            <th>状态</th>
            <th>角色</th>
            <th>所属组织</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="14" class="loading-cell">加载中...</td>
          </tr>
          <tr v-else-if="displayList.length === 0" class="empty-row">
            <td colspan="14" class="empty-cell">暂无数据</td>
          </tr>
          <tr
            v-else
            v-for="item in displayList"
            :key="item.id"
            :class="{ 'disabled-row': item.status !== 1 }"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.real_name || '-' }}</td>
            <td>
              <span :class="['status-badge', item.is_root === 1 ? 'status-active' : 'status-inactive']">
                {{ item.is_root === 1 ? '是' : '否' }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', item.is_staff === 1 ? 'status-active' : 'status-inactive']">
                {{ item.is_staff === 1 ? '是' : '否' }}
              </span>
            </td>
            <td>{{ item.staff_no || '-' }}</td>
            <td>{{ item.email || '-' }}</td>
            <td>{{ item.phone || '-' }}</td>
            <td>
              <span :class="['status-badge', item.status === 1 ? 'status-active' : 'status-inactive']">
                {{ item.status === 1 ? '在职' : '离职' }}
              </span>
            </td>
            <td>{{ getRoleName(item.role_id) }}</td>
            <td>{{ getOrgName(item.org_id) }}</td>
            <td>{{ formatDateTime(item.create_time) }}</td>
            <td>{{ formatDateTime(item.update_time) }}</td>
            <td class="action-cell">
              <button class="btn-action btn-edit" @click="handleEdit(item)">编辑</button>
              <button
                v-if="item.status !== 0"
                class="btn-action btn-delete"
                @click="handleSetStatus(item)"
              >
                {{ item.status === 1 ? '离职' : '在职' }}
              </button>
              <button
                class="btn-action btn-permission"
                @click="handlePermission(item)"
              >
                授权管理
              </button>
              <!-- <button
                v-if="item.status !== 0"
                class="btn-action btn-remove"
                @click="handleDeleteItem(item)"
              >
                删除
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total="total"
      :page-size="pageSize"
      :show="!loading && displayList.length > 0"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '@/apis/admin-api/user-api.js'
import { roleAPI } from '@/apis/admin-api/role-api.js'
import { orgAPI } from '@/apis/admin-api/organization-api.js'
import { formatDateTime } from '@/utils/date.js'
import { confirm, toastSuccess, toastError, toastException } from '@/utils/toast.js'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

// 数据
const userList = ref([])
const roleList = ref([])
const orgList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayList = computed(() => {
  // 直接使用后台返回的数据，不做前端过滤和分页
  return userList.value
})

// 方法
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    
    // 添加搜索参数
    // 搜索关键词可以匹配登录名、真实名字、邮箱、手机号
    // 后台可以根据关键词匹配多个字段
    if (searchKeyword.value) {
      params.search_key = searchKeyword.value
      // 如果后台支持多字段搜索，可以同时传递 real_name
      // 或者后台统一处理搜索关键词
    }
    
    if (statusFilter.value !== '') {
      params.status = parseInt(statusFilter.value)
    }
    
    if (roleFilter.value) {
      params.role_id = parseInt(roleFilter.value)
    }
    
    const response = await userAPI.query(params)

    // 支持响应格式：{ data: { list: [], total: 100 } }
    const data = response?.data || response
    if (data && typeof data === 'object' && 'list' in data) {
      userList.value = data.list
      total.value = data.total
    } else if (Array.isArray(data)) {
      userList.value = data
      total.value = data.length
    } else {
      userList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    userList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

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

// 获取角色名称
const getRoleName = (roleId) => {
  if (!roleId) return '-'
  const role = roleList.value.find(item => item.id === roleId)
  return role ? role.name : '-'
}

// 获取组织名称
const getOrgName = (orgId) => {
  if (!orgId) return '-'
  const org = orgList.value.find(item => item.id === orgId)
  return org ? org.name : '-'
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUserList()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchUserList()
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
  fetchUserList()
}

const handleAdd = () => {
  router.push({ name: 'admin.user.add' })
}

const handleEdit = (item) => {
  router.push({ name: 'admin.user.edit', params: { id: item.id } })
}

const handlePermission = (item) => {
  router.push({ name: 'admin.permission.user', params: { user_id: item.id } })
}

const handleSetStatus = async (item) => {
  const newStatus = item.status === 1 ? 0 : 1
  const action = item.status === 1 ? '离职' : '在职'
  
  if (await confirm(`确定要将用户"${item.name}"设置为${action}状态吗？`)) {
    try {
      await userAPI.setInfo({
        id: item.id,
        status: newStatus
      })
      // 更新成功后刷新列表
      await fetchUserList()
      toastSuccess(`设置${action}成功`)
    } catch (error) {
      console.error(`设置${action}失败:`, error)
      toastException(error, `设置${action}失败`)
    }
  }
}

const handleDeleteItem = async (item) => {
  if (await confirm(`确定要删除用户"${item.name}"吗？删除后无法恢复！`)) {
    try {
      const response = await userAPI.del({
        id: item.id
      })

      if (response.code !== 0) {
        toastError(response.msg)
        return
      }
  
      // 删除成功后刷新列表
      await fetchUserList()
      toastSuccess('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      toastException(error, '删除失败')
    }
  }
}

// 生命周期
onMounted(async () => {
  await Promise.all([
    fetchRoleList(),
    fetchOrgList(),
    fetchUserList()
  ])
})
</script>

<style scoped>
.user-list {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #1890ff;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.3s;
}

.status-select:focus {
  outline: none;
  border-color: #1890ff;
}

.toolbar-right {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-search {
  background: #fff;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-search:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table thead {
  background: #fafafa;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.data-table tbody tr.disabled-row {
  opacity: 0.6;
  background: #f5f5f5;
}

.loading-cell,
.empty-cell {
  text-align: center;
  color: #999;
  padding: 40px;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
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

.action-cell {
  white-space: nowrap;
}

.btn-action {
  padding: 4px 12px;
  margin-right: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-edit:hover {
  background: #e6f7ff;
}

.btn-delete:hover {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.btn-remove {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.btn-remove:hover {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.btn-permission {
  background: #f6ffed;
  color: #52c41a;
  border-color: #b7eb8f;
}

.btn-permission:hover {
  background: #d9f7be;
  border-color: #95de64;
  color: #389e0d;
}
</style>

