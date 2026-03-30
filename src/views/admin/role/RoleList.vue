<template>
  <div class="role-list">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索角色名称"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="status-select">
          <option value="">全部状态</option>
          <option value="1">启用</option>
          <option value="2">禁用</option>
        </select>
        <button class="btn btn-search" @click="handleSearch">
          查询
        </button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="handleAdd">
          <span class="btn-icon">+</span>
          新增角色
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>角色名称</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="6" class="loading-cell">加载中...</td>
          </tr>
          <tr v-else-if="displayList.length === 0" class="empty-row">
            <td colspan="6" class="empty-cell">暂无数据</td>
          </tr>
          <tr
            v-else
            v-for="item in displayList"
            :key="item.id"
            :class="{ 'disabled-row': item.status !== 1 }"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <span :class="['status-badge', item.status === 1 ? 'status-active' : 'status-inactive']">
                {{ item.status === 1 ? '启用' : '禁用' }}
              </span>
            </td>
            <td>{{ formatDateTime(item.create_time) }}</td>
            <td>{{ formatDateTime(item.update_time) }}</td>
            <td class="action-cell">
              <button class="btn-action btn-edit" @click="handleEdit(item)">编辑</button>
              <button
                v-if="item.status !== 0"
                class="btn-action btn-delete"
                @click="handleSetStatus(item)"
              >
                {{ item.status === 1 ? '禁用' : '启用' }}
              </button>
              <button
                v-if="item.status !== 0"
                class="btn-action btn-remove"
                @click="handleDeleteItem(item)"
              >
                删除
              </button>
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { roleAPI } from '@/apis/admin-api/role-api'
import { formatDateTime } from '@/utils/date'
import { toastSuccess, toastError, toastException, confirm } from '@/utils/toast'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

// 数据
const roleList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(200)
const total = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayList = computed(() => {
  return roleList.value
})

// 方法
const fetchRoleList = async () => {
  loading.value = true
  try {
    const response = await roleAPI.query({
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchKeyword.value || "",
      status: statusFilter.value === '' ? 0 : parseInt(statusFilter.value)
    })
    if (response.code !== 0) {
      toastException(response.message, '获取角色列表失败')
      return
    }
    roleList.value = response.data.list ?? []
    total.value = response.data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchRoleList()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchRoleList()
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
  fetchRoleList()
}

const handleAdd = () => {
  router.push({ name: 'admin.role.add' })
}

const handleEdit = (item) => {
  router.push({ name: 'admin.role.edit', params: { id: item.id } })
}

const handleSetStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1
  const action = item.status === 1 ? '禁用' : '启用'
  
  if (await confirm(`确定要${action}角色"${item.name}"吗？`)) {
    try {
      const response = await roleAPI.setInfo({
        id: item.id,
        status: newStatus
      })
      if (response.code !== 0) {
        toastException(response.message, `${action}失败`)
        return
      }
      await fetchRoleList()
      toastSuccess(`${action}成功`)
    } catch (error) {
      toastException(error, `${action}失败`)
    }
  }
}

const handleDeleteItem = async (item) => {
  if (await confirm(`确定要删除角色"${item.name}"吗？删除后无法恢复！`)) {
    try {
      const response = await roleAPI.del({
        id: item.id
      })

      if (response?.code !== 0) {
        toastError(response?.message || '删除失败')
        return
      }
  
      await fetchRoleList()
      toastSuccess('删除成功')
    } catch (error) {
      toastException(error, '删除失败')
    }
  }
}

// 生命周期
onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped>
/* 样式已提取到 assets/admin-ui.css，此处仅保留页面特有的样式 */
</style>

