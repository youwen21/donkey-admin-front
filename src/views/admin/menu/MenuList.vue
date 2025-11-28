<template>
  <div class="menu-list">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索菜单名称"
          @keyup.enter="handleSearch"
        /> -->
        <select v-model="statusFilter" class="status-select">
          <option value="">全部状态</option>
          <option value="1">有效</option>
          <option value="2">禁用</option>
        </select>
        <select v-model="systemFilter" class="status-select">
          <option value="">全部子系统</option>
          <option
            v-for="subsystem in subsystemList"
            :key="subsystem.id"
            :value="subsystem.id"
          >
            {{ subsystem.name }}
          </option>
        </select>
        <button class="btn btn-search" @click="handleSearch">
          查询
        </button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="handleAdd">
          <span class="btn-icon">+</span>
          新增菜单
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>菜单名称</th>
            <th>子系统</th>
            <th>上级菜单</th>
            <th>级别</th>
            <th>路径</th>
            <th>URL</th>
            <th>状态</th>
            <th>排序</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="12" class="loading-cell">加载中...</td>
          </tr>
          <tr v-else-if="displayList.length === 0" class="empty-row">
            <td colspan="12" class="empty-cell">暂无数据</td>
          </tr>
          <tr
            v-else
            v-for="item in displayList"
            :key="item.id"
            :class="{ 
              'disabled-row': item.status !== 1,
              'selected-row': selectedId === item.id
            }"
            @click="handleRowClick(item)"
          >
            <td>{{ item.id }}</td>
            <td>
              <span :style="{ paddingLeft: `${item.level * 20}px` }">
                <span v-if="item.level > 0" class="tree-indent">└─</span>
                {{ item.name }}
              </span>
            </td>
            <td>{{ getSubsystemName(item.system_id) }}</td>
            <td>{{ getParentName(item.parent_id) }}</td>
            <td>{{ item.level }}</td>
            <td class="path-cell">{{ item.node_path || '-' }}</td>
            <td class="path-cell">{{ item.url || '-' }}</td>
            <td>
              <span :class="['status-badge', item.status === 1 ? 'status-active' : 'status-inactive']">
                {{ item.status === 1 ? '有效' : '禁用' }}
              </span>
            </td>
            <td>{{ item.order_no || 0 }}</td>
            <td>{{ formatDateTime(item.create_time) }}</td>
            <td>{{ formatDateTime(item.update_time) }}</td>
            <td class="action-cell" @click.stop>
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
import { menuAPI, menuQuery } from '@/apis/admin-api/menu-api.js'
import { subsystemFetchList } from '@/apis/admin-api/subsystem-api.js'
import { formatDateTime } from '@/utils/date.js'
import { toastSuccess, toastError, toastException, confirm } from '@/utils/toast.js'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

// 数据
const menuList = ref([])
const subsystemList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const systemFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(200)
const total = ref(0)
const selectedId = ref(null)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayList = computed(() => {
  return menuList.value
})

// 方法
const fetchSubsystemList = async () => {
  try {
    const result = await subsystemFetchList()
    subsystemList.value = result.list || []
  } catch (error) {
    console.error('获取子系统列表失败:', error)
    subsystemList.value = []
  }
}

const fetchMenuList = async () => {
  loading.value = true
  try {
    const result = await menuQuery({
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchKeyword.value || "",
      status: statusFilter.value === '' ? 0 : parseInt(statusFilter.value),
      system_id: systemFilter.value === '' ? 0 : parseInt(systemFilter.value)
    })
    menuList.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

const getSubsystemName = (systemId) => {
  if (!systemId) return '-'
  const subsystem = subsystemList.value.find(item => item.id === systemId)
  return subsystem ? subsystem.name : '-'
}

const getParentName = (parentId) => {
  if (parentId === 0 || !parentId) return '-'
  const parent = menuList.value.find(item => item.id === parentId)
  return parent ? parent.name : '-'
}

const handleSearch = () => {
  currentPage.value = 1
  fetchMenuList()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchMenuList()
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
  fetchMenuList()
}

const handleAdd = () => {
  router.push({ name: 'admin.menu.add' })
}

const handleEdit = (item) => {
  router.push({ name: 'admin.menu.edit', params: { id: item.id } })
}

const handleSetStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1
  const action = item.status === 1 ? '禁用' : '启用'
  
  if (await confirm(`确定要${action}菜单"${item.name}"吗？`)) {
    try {
      await menuAPI.setInfo({
        id: item.id,
        status: newStatus
      })
      await fetchMenuList()
      toastSuccess(`${action}成功`)
    } catch (error) {
      toastException(error, `${action}失败`)
    }
  }
}

const handleDeleteItem = async (item) => {
  if (await confirm(`确定要删除菜单"${item.name}"吗？删除后无法恢复！`)) {
    try {
      const response = await menuAPI.del({
        id: item.id
      })

      if (response?.code !== 0) {
        toastError(response?.msg || '删除失败')
        return
      }
  
      // 如果删除的是选中的项，清空选中状态
      if (selectedId.value === item.id) {
        selectedId.value = null
      }
      
      await fetchMenuList()
      toastSuccess('删除成功')
    } catch (error) {
      toastException(error, '删除失败')
    }
  }
}

// 处理行点击选中
const handleRowClick = (item) => {
  // 如果点击的是已选中的行，则取消选中；否则选中该行
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}

// 生命周期
onMounted(async () => {
  await fetchSubsystemList()
  await fetchMenuList()
})
</script>

<style scoped>
.menu-list {
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
  overflow-y: visible;
  width: 100%;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: auto;
}

.data-table th {
  background: #fafafa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e8e8e8;
  white-space: nowrap;
}

.data-table th:nth-child(1) {
  min-width: 60px;
}

.data-table th:nth-child(2) {
  min-width: 220px;
}

.data-table th:nth-child(3),
.data-table th:nth-child(4) {
  min-width: 120px;
}

.data-table th:nth-child(5) {
  min-width: 60px;
}

.data-table th:nth-child(6) {
  min-width: 100px;
}

.data-table th:nth-child(7) {
  min-width: 200px;
}

.data-table th:nth-child(8) {
  min-width: 80px;
}

.data-table th:nth-child(9) {
  min-width: 60px;
}

.data-table th:nth-child(10),
.data-table th:nth-child(11) {
  min-width: 160px;
}

.data-table th:nth-child(12) {
  min-width: 180px;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e8e8e8;
  color: #666;
  white-space: nowrap;
}

.data-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background: #f5f5f5;
}

.data-table tbody tr.selected-row {
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
}

.data-table tbody tr.selected-row:hover {
  background: #bae7ff;
}

.disabled-row {
  opacity: 0.6;
}

.disabled-row.selected-row {
  opacity: 0.8;
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

.tree-indent {
  color: #999;
  margin-right: 4px;
}

.path-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
  font-size: 12px;
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


/* 按钮样式已提取到 assets/admin-ui.css */
</style>

