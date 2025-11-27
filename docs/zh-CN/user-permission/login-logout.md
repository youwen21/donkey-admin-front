# 登录登出

## 登录功能

### 登录流程

1. 用户访问登录页面
2. 输入用户名和密码
3. 提交登录请求
4. 后端验证用户凭证
5. 返回认证信息（Token/Cookie）
6. 前端保存认证信息
7. 跳转到管理后台首页

### 登录接口

**接口地址**：`/admin-api/v1/auth/login`

**请求方式**：POST

**请求参数**：
```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应示例**：
```json
{
    "code": 0,
    "msg": "ok",
    "data": {
        "info": {
            "id": 1,
            "name": "admin",
            "avatar": ""
        },
        "token": "xxx"
    }
}
```

### 登录状态管理

- 登录成功后，认证信息会保存在 Cookie 中
- 后续请求会自动携带认证信息

## 登出功能

### 登出流程

1. 用户点击退出登录
2. 确认退出操作
3. 调用登出接口
4. 清除本地认证信息
5. 跳转到登录页面

### 登出接口

**接口地址**：`/admin-api/v1/auth/logout`

**请求方式**：POST

**响应示例**：
```json
{
  "code": 0,
  "msg": "退出登录成功",
  "data": null
}
```

## 认证机制

### Cookie 认证
- 使用 `withCredentials: true` 携带 Cookie
- 后端通过 Cookie 验证用户身份
- 无需手动管理 Token
