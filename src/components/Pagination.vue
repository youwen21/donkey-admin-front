<template>
  <div v-if="show" class="pagination">
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="handlePrev"
    >
      上一页
    </button>
    <span class="page-info">
      第 {{ currentPage }} / {{ totalPages }} 页，共 {{ total }} 条
    </span>
    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="handleNext"
    >
      下一页
    </button>
    <div class="page-size-selector">
      <label class="page-size-label">每页：</label>
      <select v-model="localPageSize" class="page-size-select" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
        <option :value="200">200</option>
        <option :value="500">500</option>
        <option :value="1000">1000</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 20
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['page-change', 'page-size-change'])

const localPageSize = ref(props.pageSize)

// 监听外部 pageSize 变化
watch(() => props.pageSize, (newVal) => {
  localPageSize.value = newVal
})

const handlePrev = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const handleNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}

const handlePageSizeChange = () => {
  emit('page-size-change', localPageSize.value)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
}

.page-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.page-size-label {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.page-size-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.page-size-select:focus {
  outline: none;
  border-color: #1890ff;
}

.page-size-select:hover {
  border-color: #1890ff;
}
</style>

