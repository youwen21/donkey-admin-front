<template>
  <div class="dashboard-view">
    <!-- 页面标题 -->
    <div class="dashboard-header">
      <h1>仪表盘</h1>
      <p class="dashboard-subtitle">欢迎回来，这里是系统概览</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card stat-card-primary">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">总用户数</div>
          <div class="stat-trend">
            <span class="trend-up">↑ 12%</span>
            <span class="trend-text">较上月</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-success">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalRoles }}</div>
          <div class="stat-label">角色数量</div>
          <div class="stat-trend">
            <span class="trend-up">↑ 3</span>
            <span class="trend-text">较上月</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-warning">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalMenus }}</div>
          <div class="stat-label">菜单数量</div>
          <div class="stat-trend">
            <span class="trend-up">↑ 5</span>
            <span class="trend-text">较上月</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-info">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalOrgs }}</div>
          <div class="stat-label">组织数量</div>
          <div class="stat-trend">
            <span class="trend-up">↑ 2</span>
            <span class="trend-text">较上月</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <!-- 左侧：图表和快速操作 -->
      <div class="dashboard-left">
        <!-- 数据趋势图表 -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>数据趋势</h3>
            <div class="card-actions">
              <button class="btn-text">本周</button>
              <button class="btn-text active">本月</button>
              <button class="btn-text">本年</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div v-for="(value, index) in chartData" :key="index" class="chart-bar">
                <div class="bar-fill" :style="{ height: value + '%' }"></div>
                <div class="bar-label">{{ index + 1 }}月</div>
              </div>
            </div>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color" style="background: #1890ff;"></span>
                用户增长
              </span>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>快速操作</h3>
          </div>
          <div class="quick-actions">
            <router-link to="/admin/users" class="quick-action-item">
              <div class="action-icon action-icon-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="action-content">
                <div class="action-title">用户管理</div>
                <div class="action-desc">管理系统用户</div>
              </div>
            </router-link>

            <router-link to="/admin/roles" class="quick-action-item">
              <div class="action-icon action-icon-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div class="action-content">
                <div class="action-title">角色管理</div>
                <div class="action-desc">配置系统角色</div>
              </div>
            </router-link>

            <router-link to="/admin/menus" class="quick-action-item">
              <div class="action-icon action-icon-warning">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                </svg>
              </div>
              <div class="action-content">
                <div class="action-title">菜单管理</div>
                <div class="action-desc">管理系统菜单</div>
              </div>
            </router-link>

            <router-link to="/admin/orgs" class="quick-action-item">
              <div class="action-icon action-icon-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="action-content">
                <div class="action-title">组织管理</div>
                <div class="action-desc">管理组织架构</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 右侧：最近活动 -->
      <div class="dashboard-right">
        <div class="dashboard-card">
          <div class="card-header">
            <h3>最近活动</h3>
            <router-link to="/admin/operations" class="btn-text">查看全部</router-link>
          </div>
          <div class="activity-list">
            <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <span>{{ activity.icon }}</span>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 系统信息 -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>系统信息</h3>
          </div>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统版本</span>
              <span class="info-value">v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">运行时间</span>
              <span class="info-value">15 天</span>
            </div>
            <div class="info-item">
              <span class="info-label">在线用户</span>
              <span class="info-value">{{ stats.onlineUsers }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">今日访问</span>
              <span class="info-value">{{ stats.todayVisits }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 统计数据
const stats = ref({
  totalUsers: 128,
  totalRoles: 12,
  totalMenus: 45,
  totalOrgs: 8,
  onlineUsers: 23,
  todayVisits: 156
})

// 图表数据（模拟）
const chartData = ref([65, 72, 68, 85, 78, 92, 88, 95, 82, 90, 87, 93])

// 最近活动
const recentActivities = ref([
  {
    icon: '👤',
    title: '新增用户：张三',
    time: '2 分钟前',
    type: 'user'
  },
  {
    icon: '🔐',
    title: '角色权限更新：管理员',
    time: '15 分钟前',
    type: 'role'
  },
  {
    icon: '📋',
    title: '菜单配置修改',
    time: '1 小时前',
    type: 'menu'
  },
  {
    icon: '🏢',
    title: '组织架构调整',
    time: '2 小时前',
    type: 'org'
  },
  {
    icon: '👤',
    title: '用户登录：李四',
    time: '3 小时前',
    type: 'user'
  }
])
</script>

<style scoped>
.dashboard-view {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100%;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.dashboard-subtitle {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-card-primary .stat-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.stat-card-success .stat-icon {
  background: #f6ffed;
  color: #52c41a;
}

.stat-card-warning .stat-icon {
  background: #fffbe6;
  color: #faad14;
}

.stat-card-info .stat-icon {
  background: #e6f7ff;
  color: #13c2c2;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.trend-up {
  color: #52c41a;
  font-weight: 500;
}

.trend-text {
  color: #999;
}

/* 主要内容区域 */
.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.dashboard-left,
.dashboard-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-text {
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-text:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.btn-text.active {
  background: #e6f7ff;
  color: #1890ff;
}

/* 图表占位符 */
.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 240px;
  padding: 20px 0;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0 4px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #1890ff, #40a9ff);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  transition: height 0.3s;
}

.bar-label {
  font-size: 12px;
  color: #666;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* 快速操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-action-item:hover {
  border-color: #1890ff;
  background: #f6f9ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 20px;
  height: 20px;
}

.action-icon-primary {
  background: #e6f7ff;
  color: #1890ff;
}

.action-icon-success {
  background: #f6ffed;
  color: #52c41a;
}

.action-icon-warning {
  background: #fffbe6;
  color: #faad14;
}

.action-icon-info {
  background: #e6f7ff;
  color: #13c2c2;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: #999;
}

/* 活动列表 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: #f5f5f5;
}

.activity-icon.user {
  background: #e6f7ff;
}

.activity-icon.role {
  background: #f6ffed;
}

.activity-icon.menu {
  background: #fffbe6;
}

.activity-icon.org {
  background: #f0f5ff;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* 系统信息 */
.system-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
