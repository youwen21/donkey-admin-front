<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-title">页面未找到</div>
      <div class="error-message">抱歉，您访问的页面不存在或已被移除</div>
      <div class="error-actions">
        <router-link to="/admin/dashboard" class="btn btn-primary">
          返回首页
        </router-link>
        <button class="btn btn-secondary" @click="goBack">
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'admin.dashboard' })
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.not-found-content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #1890ff;
  line-height: 1;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.error-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  background: #fff;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>

