<template>
  <div class="approval-list">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索流程标题/申请人"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="status-select">
          <option value="">全部状态</option>
          <option value="pending">待审批</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
          <option value="cancelled">已取消</option>
        </select>
        <button class="btn btn-search" @click="handleSearch">
          查询
        </button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="handleAdd">
          <span class="btn-icon">+</span>
          新建流程
        </button>
      </div>
    </div>

    <!-- 审批流程列表 -->
    <div class="approval-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>
      <div v-else-if="displayList.length === 0" class="empty-container">
        <div class="empty-text">暂无数据</div>
      </div>
      <div v-else class="approval-cards">
        <div
          v-for="item in displayList"
          :key="item.id"
          class="approval-card"
          :class="getStatusClass(item.status)"
        >
          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="card-title">
              <span class="title-text">{{ item.title }}</span>
              <span :class="['status-badge', getStatusBadgeClass(item.status)]">
                {{ getStatusText(item.status) }}
              </span>
            </div>
            <div class="card-meta">
              <span class="meta-item">流程ID: {{ item.id }}</span>
              <span class="meta-item">类型: {{ item.type }}</span>
            </div>
          </div>

          <!-- 流程步骤 -->
          <div class="workflow-steps">
            <div
              v-for="(step, index) in item.steps"
              :key="step.id"
              class="workflow-step"
              :class="getStepClass(step, index, item.steps.length)"
            >
              <div class="step-indicator">
                <div class="step-circle" :class="getStepCircleClass(step.status)">
                  <span v-if="step.status === 'completed'" class="step-check">✓</span>
                  <span v-else-if="step.status === 'rejected'" class="step-x">✗</span>
                  <span v-else class="step-number">{{ index + 1 }}</span>
                </div>
                <div
                  v-if="index < item.steps.length - 1"
                  class="step-line"
                  :class="getStepLineClass(step.status)"
                ></div>
              </div>
              <div class="step-content">
                <div class="step-title">{{ step.name }}</div>
                <div class="step-info">
                  <span class="step-approver">审批人: {{ step.approver }}</span>
                  <span v-if="step.comment" class="step-comment">备注: {{ step.comment }}</span>
                </div>
                <div v-if="step.status === 'completed'" class="step-time">
                  完成时间: {{ formatDateTime(step.completed_at) }}
                </div>
                <div v-else-if="step.status === 'rejected'" class="step-time">
                  拒绝时间: {{ formatDateTime(step.completed_at) }}
                </div>
                <div v-else-if="step.status === 'current'" class="step-time current">
                  等待审批中...
                </div>
              </div>
            </div>
          </div>

          <!-- 卡片底部 -->
          <div class="card-footer">
            <div class="footer-info">
              <span class="info-item">
                <span class="info-label">申请人：</span>
                <span class="info-value">{{ item.applicant }}</span>
              </span>
              <span class="info-item">
                <span class="info-label">申请时间：</span>
                <span class="info-value">{{ formatDateTime(item.created_at) }}</span>
              </span>
              <span v-if="item.completed_at" class="info-item">
                <span class="info-label">完成时间：</span>
                <span class="info-value">{{ formatDateTime(item.completed_at) }}</span>
              </span>
            </div>
            <div class="card-actions">
              <button
                v-if="item.status === 'pending'"
                class="btn-action btn-edit"
                @click="handleView(item)"
              >
                查看详情
              </button>
              <button
                v-if="item.status === 'pending'"
                class="btn-action btn-delete"
                @click="handleCancel(item)"
              >
                取消流程
              </button>
              <button
                v-else
                class="btn-action btn-edit"
                @click="handleView(item)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
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
import { formatDateTime } from '@/utils/date.js'
import Pagination from '@/components/Pagination.vue'

// 数据
const approvalList = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const displayList = computed(() => {
  let list = approvalList.value

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.applicant.toLowerCase().includes(keyword)
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    list = list.filter(item => item.status === statusFilter.value)
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  total.value = list.length
  return list.slice(start, end)
})

// 初始化 Demo 数据
const initDemoData = () => {
  approvalList.value = [
    {
      id: 1,
      title: '请假申请 - 年假3天',
      type: '请假申请',
      status: 'pending',
      applicant: '张三',
      applicant_id: 101,
      created_at: '2024-01-15 09:30:00',
      completed_at: null,
      steps: [
        {
          id: 1,
          name: '部门经理审批',
          approver: '李经理',
          status: 'completed',
          comment: '同意，注意工作交接',
          completed_at: '2024-01-15 10:15:00'
        },
        {
          id: 2,
          name: '人事部审批',
          approver: '王主管',
          status: 'current',
          comment: null,
          completed_at: null
        },
        {
          id: 3,
          name: '总经理审批',
          approver: '赵总',
          status: 'pending',
          comment: null,
          completed_at: null
        }
      ]
    },
    {
      id: 2,
      title: '采购申请 - 办公用品',
      type: '采购申请',
      status: 'approved',
      applicant: '王五',
      applicant_id: 102,
      created_at: '2024-01-14 14:20:00',
      completed_at: '2024-01-15 16:45:00',
      steps: [
        {
          id: 1,
          name: '部门经理审批',
          approver: '李经理',
          status: 'completed',
          comment: '同意采购',
          completed_at: '2024-01-14 15:30:00'
        },
        {
          id: 2,
          name: '财务部审批',
          approver: '钱会计',
          status: 'completed',
          comment: '预算充足，同意',
          completed_at: '2024-01-15 09:20:00'
        },
        {
          id: 3,
          name: '总经理审批',
          approver: '赵总',
          status: 'completed',
          comment: '批准',
          completed_at: '2024-01-15 16:45:00'
        }
      ]
    },
    {
      id: 3,
      title: '报销申请 - 差旅费',
      type: '报销申请',
      status: 'rejected',
      applicant: '赵六',
      applicant_id: 103,
      created_at: '2024-01-13 11:00:00',
      completed_at: '2024-01-14 10:30:00',
      steps: [
        {
          id: 1,
          name: '部门经理审批',
          approver: '李经理',
          status: 'completed',
          comment: '已审核',
          completed_at: '2024-01-13 14:20:00'
        },
        {
          id: 2,
          name: '财务部审批',
          approver: '钱会计',
          status: 'rejected',
          comment: '发票不符合要求，请重新提交',
          completed_at: '2024-01-14 10:30:00'
        }
      ]
    },
    {
      id: 4,
      title: '用印申请 - 合同盖章',
      type: '用印申请',
      status: 'pending',
      applicant: '孙七',
      applicant_id: 104,
      created_at: '2024-01-15 08:00:00',
      completed_at: null,
      steps: [
        {
          id: 1,
          name: '部门经理审批',
          approver: '李经理',
          status: 'current',
          comment: null,
          completed_at: null
        },
        {
          id: 2,
          name: '法务部审批',
          approver: '周律师',
          status: 'pending',
          comment: null,
          completed_at: null
        },
        {
          id: 3,
          name: '总经理审批',
          approver: '赵总',
          status: 'pending',
          comment: null,
          completed_at: null
        }
      ]
    },
    {
      id: 5,
      title: '转正申请 - 试用期员工',
      type: '转正申请',
      status: 'cancelled',
      applicant: '吴八',
      applicant_id: 105,
      created_at: '2024-01-10 09:00:00',
      completed_at: '2024-01-12 15:00:00',
      steps: [
        {
          id: 1,
          name: '部门经理审批',
          approver: '李经理',
          status: 'completed',
          comment: '同意转正',
          completed_at: '2024-01-11 10:00:00'
        },
        {
          id: 2,
          name: '人事部审批',
          approver: '王主管',
          status: 'pending',
          comment: null,
          completed_at: null
        }
      ]
    },
    {
      id: 6,
      title: '设备采购申请 - 服务器',
      type: '采购申请',
      status: 'approved',
      applicant: '郑九',
      applicant_id: 106,
      created_at: '2024-01-12 13:30:00',
      completed_at: '2024-01-14 17:00:00',
      steps: [
        {
          id: 1,
          name: '部门经理审批',
          approver: '李经理',
          status: 'completed',
          comment: '同意',
          completed_at: '2024-01-12 16:00:00'
        },
        {
          id: 2,
          name: '技术部审批',
          approver: '周工',
          status: 'completed',
          comment: '技术规格符合要求',
          completed_at: '2024-01-13 09:00:00'
        },
        {
          id: 3,
          name: '财务部审批',
          approver: '钱会计',
          status: 'completed',
          comment: '预算已批准',
          completed_at: '2024-01-14 11:00:00'
        },
        {
          id: 4,
          name: '总经理审批',
          approver: '赵总',
          status: 'completed',
          comment: '批准采购',
          completed_at: '2024-01-14 17:00:00'
        }
      ]
    }
  ]
  total.value = approvalList.value.length
}

// 方法
const getStatusText = (status) => {
  const statusMap = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status) => {
  const classMap = {
    pending: 'status-inactive',
    approved: 'status-active',
    rejected: 'status-inactive',
    cancelled: 'status-inactive'
  }
  return classMap[status] || 'status-inactive'
}

const getStatusClass = (status) => {
  return `status-${status}`
}

const getStepClass = (step, index, total) => {
  const classes = []
  if (step.status === 'completed') classes.push('step-completed')
  if (step.status === 'current') classes.push('step-current')
  if (step.status === 'rejected') classes.push('step-rejected')
  if (step.status === 'pending') classes.push('step-pending')
  if (index === 0) classes.push('step-first')
  if (index === total - 1) classes.push('step-last')
  return classes.join(' ')
}

const getStepCircleClass = (status) => {
  const classMap = {
    completed: 'circle-completed',
    current: 'circle-current',
    rejected: 'circle-rejected',
    pending: 'circle-pending'
  }
  return classMap[status] || 'circle-pending'
}

const getStepLineClass = (status) => {
  if (status === 'completed') return 'line-completed'
  if (status === 'rejected') return 'line-rejected'
  return 'line-pending'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
}

const handleAdd = () => {
  console.log('新建流程')
  // TODO: 跳转到新建流程页面
}

const handleView = (item) => {
  console.log('查看详情', item)
  // TODO: 跳转到详情页面
}

const handleCancel = (item) => {
  console.log('取消流程', item)
  // TODO: 取消流程逻辑
}

// 生命周期
onMounted(() => {
  initDemoData()
})
</script>

<style scoped>
.approval-list {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.approval-container {
  margin-top: 20px;
}

.loading-container,
.empty-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-text,
.empty-text {
  color: #999;
  font-size: 14px;
}

.approval-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.approval-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

.approval-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

.approval-card.status-pending {
  border-left: 4px solid #fa8c16;
}

.approval-card.status-approved {
  border-left: 4px solid #52c41a;
}

.approval-card.status-rejected {
  border-left: 4px solid #ff4d4f;
}

.approval-card.status-cancelled {
  border-left: 4px solid #999;
  opacity: 0.7;
}

.card-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.card-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
}

.workflow-steps {
  margin: 20px 0;
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
}

.workflow-step {
  display: flex;
  margin-bottom: 24px;
  position: relative;
}

.workflow-step:last-child {
  margin-bottom: 0;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  position: relative;
  z-index: 1;
}

.step-circle.circle-completed {
  background: #52c41a;
  border: 2px solid #52c41a;
}

.step-circle.circle-current {
  background: #1890ff;
  border: 2px solid #1890ff;
  animation: pulse 2s infinite;
}

.step-circle.circle-rejected {
  background: #ff4d4f;
  border: 2px solid #ff4d4f;
}

.step-circle.circle-pending {
  background: #d9d9d9;
  border: 2px solid #d9d9d9;
  color: #999;
}

.step-check,
.step-x {
  font-size: 18px;
  font-weight: bold;
}

.step-line {
  width: 2px;
  flex: 1;
  min-height: 40px;
  margin-top: 4px;
}

.step-line.line-completed {
  background: #52c41a;
}

.step-line.line-rejected {
  background: #ff4d4f;
}

.step-line.line-pending {
  background: #e8e8e8;
}

.step-content {
  flex: 1;
  padding-bottom: 8px;
}

.step-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.step-approver {
  font-size: 13px;
  color: #666;
}

.step-comment {
  font-size: 13px;
  color: #1890ff;
  font-style: italic;
}

.step-time {
  font-size: 12px;
  color: #999;
}

.step-time.current {
  color: #1890ff;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
}

.footer-info {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>

