<template>
  <div class="subsystem-list">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索名称/域名/key"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="status-select">
          <option value="">全部状态</option>
          <option value="1">有效</option>
          <option value="2">禁用</option>
        </select>
        <button class="btn btn-search" @click="handleSearch">
          查询
        </button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="handleAdd">
          <span class="btn-icon">+</span>
          新增子系统
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>域名</th>
            <th>Key</th>
            <th>状态</th>
            <th>排序</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="9" class="loading-cell">加载中...</td>
          </tr>
          <tr v-else-if="displayList.length === 0" class="empty-row">
            <td colspan="9" class="empty-cell">暂无数据</td>
          </tr>
          <tr
            v-else
            v-for="item in displayList"
            :key="item.id"
            :class="{ 'disabled-row': item.status !== 1 }"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.domain || '-' }}</td>
            <td class="key-cell">{{ item.syskey || '-' }}</td>
            <td>
              <span :class="['status-badge', item.status === 1 ? 'status-active' : 'status-inactive']">
                {{ item.status === 1 ? '有效' : '禁用' }}
              </span>
            </td>
            <td>{{ item.order_no || 0 }}</td>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { subsystemAPI, subsystemQuery } from '@/apis/admin-api/subsystem-api.js'
import { formatDateTime } from '@/utils/date.js'
import { toastSuccess, toastError, toastException, confirm } from '@/utils/toast.js'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

// 数据
const subsystemList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayList = computed(() => {
  return subsystemList.value
})

// 方法
const fetchSubsystemList = async () => {
  loading.value = true
  try {
    const result = await subsystemQuery({
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchKeyword.value || "",
      status: statusFilter.value === '' ? 0 : parseInt(statusFilter.value)
    })
    subsystemList.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchSubsystemList()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchSubsystemList()
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
  fetchSubsystemList()
}

const handleAdd = () => {
  router.push({ name: 'admin.subsystem.add' })
}

const handleEdit = (item) => {
  router.push({ name: 'admin.subsystem.edit', params: { id: item.id } })
}

const handleSetStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1
  const action = item.status === 1 ? '禁用' : '启用'
  
  if (await confirm(`确定要${action}子系统"${item.name}"吗？`)) {
    try {
      await subsystemAPI.setInfo({
        id: item.id,
        status: newStatus
      })
      await fetchSubsystemList()
      toastSuccess(`${action}成功`)
    } catch (error) {
      toastException(error, `${action}失败`)
    }
  }
}

const handleDeleteItem = async (item) => {
  if (await confirm(`确定要删除子系统"${item.name}"吗？删除后无法恢复！`)) {
    try {
      const response = await subsystemAPI.del({
        id: item.id
      })

      if (response?.code !== 0) {
        toastError(response?.msg || '删除失败')
        return
      }
  
      await fetchSubsystemList()
      toastSuccess('删除成功')
    } catch (error) {
      toastException(error, '删除失败')
    }
  }
}

// 生命周期
onMounted(() => {
  fetchSubsystemList()
})
</script>

<style scoped>
.subsystem-list {
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
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  background: #fafafa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e8e8e8;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e8e8e8;
  color: #666;
}

.data-table tbody tr:hover {
  background: #f5f5f5;
}

.disabled-row {
  opacity: 0.6;
}

.loading-row,
.empty-row {
  text-align: center;
}

.loading-cell,
.empty-cell {
  padding: 40px;
  color: #999;
}

.key-cell {
  font-family: monospace;
  font-size: 12px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
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
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background: #e6f7ff;
  color: #1890ff;
}

.btn-edit:hover {
  background: #bae7ff;
}

.btn-delete {
  background: #fff7e6;
  color: #fa8c16;
}

.btn-delete:hover {
  background: #ffe7ba;
}

.btn-remove {
  background: #fff1f0;
  color: #ff4d4f;
}

.btn-remove:hover {
  background: #ffccc7;
}
</style>

