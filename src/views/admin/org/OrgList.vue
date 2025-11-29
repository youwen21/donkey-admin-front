<template>
  
  <div class="org-list">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索组织名称"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="status-select">
          <option value="">全部状态</option>
          <option value="1">启用</option>
          <option value="2">禁用</option>
        </select>
        <button class="btn btn-search" @click="handleSearch">
          查询
        </button> -->
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="handleAdd" v-if="$checkActionPerm('btn-add')">
          <span class="btn-icon">+</span>
          新增组织
        </button>
      </div>
    </div>
 
    <!-- 表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>组织名称</th>
            <th>上级组织</th>
            <th>级别</th>
            <th>路径</th>
            <th>状态</th>
            <th>序号</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="10" class="loading-cell">加载中...</td>
          </tr>
          <tr v-else-if="displayList.length === 0" class="empty-row">
            <td colspan="10" class="empty-cell">暂无数据</td>
          </tr>
          <tr
            v-else
            v-for="item in displayList"
            :key="item.id"
            :class="{ 'disabled-row': item.status !== 1 }"
          >
            <td>{{ item.id }}</td>
            <td>
              <span :style="{ paddingLeft: `${item.level * 20}px` }">
                <span v-if="item.level > 0" class="tree-indent">└─</span>
                {{ item.name }}
              </span>
            </td>
            <td>{{ getParentName(item.parent_id) }}</td>
            <td>{{ item.level }}</td>
            <td class="path-cell">{{ item.node_path }}</td>
            <td>
              <span :class="['status-badge', item.status === 1 ? 'status-active' : 'status-inactive']">
                {{ item.status === 1 ? '启用' : item.status === 2 ? '禁用' : '已删除' }}
              </span>
            </td>
            <td>{{ item.order_no }}</td>
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
              <template v-if="$checkActionPerm('btn-del')">
                <button
                  v-if="item.status !== 0"
                  class="btn-action btn-remove"
                  @click="handleDeleteItem(item)"
                >
                  删除
                </button>
              </template>
              
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
import { orgAPI, orgQuery } from '@/apis/admin-api/organization-api.js'
import { formatDateTime } from '@/utils/date.js'
import { confirm, toastSuccess, toastError, toastException } from '@/utils/toast.js'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

// 数据
const orgList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(200)
const total = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayList = computed(() => {
  // 直接使用后台返回的数据，不做前端过滤和分页
  return orgList.value
})

// 方法
const fetchOrgList = async () => {
  loading.value = true
  try {
    const result = await orgQuery({
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchKeyword.value || "",
      status: statusFilter.value || 0
    })
    orgList.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

const getParentName = (parentId) => {
  if (parentId === 0) return '-'
  const parent = orgList.value.find(item => item.id === parentId)
  return parent ? parent.name : '-'
}

const handleSearch = () => {
  currentPage.value = 1
  fetchOrgList()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchOrgList()
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
  fetchOrgList()
}

const handleAdd = () => {
  router.push({ name: 'admin.org.add' })
}

const handleEdit = (item) => {
  router.push({ name: 'admin.org.edit', params: { id: item.id } })
}

const handleSetStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1
  const action = item.status === 1 ? '禁用' : '启用'
  
  if (await confirm(`确定要${action}组织"${item.name}"吗？`)) {
    try {
      await orgAPI.update({
        id: item.id,
        status: newStatus
      })
      // 更新成功后刷新列表
      await fetchOrgList()
      toastSuccess(`${action}成功`)
    } catch (error) {
      console.error(`${action}失败:`, error)
      toastException(error, `${action}失败`)
    }
  }
}

const handleDeleteItem = async (item) => {
  if (await confirm(`确定要删除组织"${item.name}"吗？删除后无法恢复！`)) {
    try {
      const response = await orgAPI.del({
        id: item.id
      })

      if (response.code !== 0) {
        toastError(response.message)
        return
      }
  
      // 删除成功后刷新列表
      await fetchOrgList()
      toastSuccess('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      toastException(error, '删除失败')
    }
  }
}

// 生命周期
onMounted(() => {
  fetchOrgList()
})
</script>

<style scoped>
/* 样式已提取到 assets/admin-ui.css，此处仅保留页面特有的样式 */
</style>
