# 开发引导

## 快速开始

### 环境要求
- Node.js ^20.19.0 || >=22.12.0
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发运行
```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动（默认端口）。

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

---

## 开发说明

### API 请求
项目使用统一的请求客户端封装，支持请求/响应拦截和错误处理。详见 `src/apis/request/`。

### 权限控制
权限系统通过插件方式集成，支持页面级和按钮级权限控制。详见 `src/plugins/permission.js`。

### 路由配置
路由配置在 `src/router/index.js`，支持动态路由和权限验证。

### 后台接口请求配置
配置在 `src/apis/request/admin-client.js`
```
// 请求配置
const requestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  credentials: 'include', // fetch 请求携带 cookie
  headers: {
    'Content-Type': 'application/json'
  },
}
```

