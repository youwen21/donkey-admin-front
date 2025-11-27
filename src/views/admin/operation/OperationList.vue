<template>
  <div class="operation-list">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索操作名称/编号"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="status-select">
          <option value="">全部状态</option>
          <option value="1">有效</option>
          <option value="2">禁用</option>
        </select>
        <select v-model="systemFilter" class="status-select" @change="handleSystemChange">
          <option value="">全部子系统</option>
          <option
            v-for="subsystem in subsystemList"
            :key="subsystem.id"
            :value="subsystem.id"
          >
            {{ subsystem.name }}
          </option>
        </select>
        <select v-model="menuFilter" class="status-select">
          <option value="">全部菜单</option>
          <option
            v-for="menu in filteredMenuList"
            :key="menu.id"
            :value="menu.id"
          >
            {{ getMenuDisplayName(menu) }}
          </option>
        </select>
        <button class="btn btn-search" @click="handleSearch">
          查询
        </button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="handleAdd">
          <span class="btn-icon">+</span>
          新增操作
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>操作名称</th>
            <th>操作编号</th>
            <th>子系统</th>
            <th>菜单</th>
            <th>状态</th>
            <th>排序</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="11" class="loading-cell">加载中...</td>
          </tr>
          <tr v-else-if="displayList.length === 0" class="empty-row">
            <td colspan="11" class="empty-cell">暂无数据</td>
          </tr>
          <tr
            v-else
            v-for="item in displayList"
            :key="item.id"
            :class="{ 'disabled-row': item.status !== 1 }"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td class="code-cell">{{ item.code || '-' }}</td>
            <td>{{ getSubsystemName(item.system_id) }}</td>
            <td>{{ getMenuName(item.menu_id) }}</td>
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
import { operationAPI, operationQuery } from '@/apis/admin-api/operation-api.js'
import { subsystemFetchList } from '@/apis/admin-api/subsystem-api.js'
import { menuFetchList } from '@/apis/admin-api/menu-api.js'
import { formatDateTime } from '@/utils/date.js'
import { toastSuccess, toastException, confirm } from '@/utils/toast.js'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

// 数据
const operationList = ref([])
const subsystemList = ref([])
const menuList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const systemFilter = ref('')
const menuFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayList = computed(() => {
  return operationList.value
})

// 根据选择的子系统过滤菜单列表
const filteredMenuList = computed(() => {
  if (systemFilter.value === '' || systemFilter.value === '0') {
    return menuList.value
  }
  return menuList.value.filter(menu => menu.system_id === parseInt(systemFilter.value))
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
  try {
    const result = await menuFetchList()
    menuList.value = result.list || []
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    menuList.value = []
  }
}

const fetchOperationList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: statusFilter.value === '' ? 0 : parseInt(statusFilter.value),
      system_id: systemFilter.value === '' ? 0 : parseInt(systemFilter.value),
      menu_id: menuFilter.value === '' ? 0 : parseInt(menuFilter.value)
    }
    // 如果有关键词，同时搜索名称和编号
    if (searchKeyword.value) {
      params.name = searchKeyword.value
      params.code = searchKeyword.value
    }
    const result = await operationQuery(params)
    operationList.value = result.list
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


const getMenuName = (menuId) => {
  if (menuId === 0 || !menuId) return '-'
  const menu = menuList.value.find(item => item.id === menuId)
  return menu ? menu.name : '-'
}

// 获取菜单显示名称（带层级缩进）
const getMenuDisplayName = (menu) => {
  // const indent = '  '.repeat(menu.level || 0)
  // const prefix = menu.level > 0 ? '└─ ' : ''
  // return `${indent}${prefix}${menu.name}`

  if (menu.level === 0) {
    return menu.name
  }
  // 使用非断行空格（\u00A0）实现缩进，每级缩进 4 个非断行空格
  const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(menu.level)
  const prefix = '└─ '
  return `${indent}${prefix}${menu.name}`
}

// 处理子系统变更
const handleSystemChange = () => {
  // 切换子系统时，重置菜单筛选
  menuFilter.value = ''
}

const handleSearch = () => {
  currentPage.value = 1
  fetchOperationList()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchOperationList()
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
  fetchOperationList()
}

const handleAdd = () => {
  router.push({ name: 'admin.operation.add' })
}

const handleEdit = (item) => {
  router.push({ name: 'admin.operation.edit', params: { id: item.id } })
}

const handleSetStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1
  const action = item.status === 1 ? '禁用' : '启用'
  
  if (await confirm(`确定要${action}操作"${item.name}"吗？`)) {
    try {
      await operationAPI.setInfo({
        id: item.id,
        status: newStatus
      })
      await fetchOperationList()
      toastSuccess(`${action}成功`)
    } catch (error) {
      toastException(error, `${action}失败`)
    }
  }
}

const handleDeleteItem = async (item) => {
  if (await confirm(`确定要删除操作"${item.name}"吗？删除后无法恢复！`)) {
    try {
      const response = await operationAPI.del({
        id: item.id
      })

      if (response?.code !== 0) {
        toastException(response?.msg || '删除失败')
        return
      }
  
      await fetchOperationList()
      toastSuccess('删除成功')
    } catch (error) {
      toastException(error, '删除失败')
    }
  }
}

// 生命周期
onMounted(async () => {
  await Promise.all([
    fetchSubsystemList(),
    fetchMenuList()
  ])
  await fetchOperationList()
})
</script>

<style scoped>
.operation-list {
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
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.data-table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: auto;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
  color: #666;
  white-space: nowrap;
}

.data-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e8e8e8;
}

.data-table th:nth-child(1),
.data-table td:nth-child(1) { min-width: 60px; }
.data-table th:nth-child(2),
.data-table td:nth-child(2) { min-width: 150px; }
.data-table th:nth-child(3),
.data-table td:nth-child(3) { min-width: 150px; }
.data-table th:nth-child(4),
.data-table td:nth-child(4) { min-width: 120px; }
.data-table th:nth-child(5),
.data-table td:nth-child(5) { min-width: 120px; }
.data-table th:nth-child(6),
.data-table td:nth-child(6) { min-width: 120px; }
.data-table th:nth-child(7),
.data-table td:nth-child(7) { min-width: 80px; }
.data-table th:nth-child(8),
.data-table td:nth-child(8) { min-width: 60px; }
.data-table th:nth-child(9),
.data-table td:nth-child(9) { min-width: 160px; }
.data-table th:nth-child(10),
.data-table td:nth-child(10) { min-width: 160px; }
.data-table th:nth-child(11),
.data-table td:nth-child(11) { min-width: 180px; }

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

.code-cell {
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

