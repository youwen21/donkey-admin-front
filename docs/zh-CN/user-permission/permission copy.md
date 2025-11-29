# 权限

## 权限系统概述

采用 ACL 权限控制模型。

## 权限模型

基本元素：
 - 用户
 - 菜单和按钮

关系：
 - 用户权限（用户可见菜单和按钮）

## 权限验证
 - 菜单权限校验， 用户可见已授权菜单
 - 按钮权限校验， 用户可见已授权按钮
 - 行为权限校验， 用户可请求已授权接口

## 按钮权限控制

### 获取当前用户权限

**接口地址**：`/admin-api/v1/user-permission/my`

**请求方式**：GET

**响应示例**：
```json
{
    "code": 0,
    "msg": "ok",
    "data": {
        "isRoot": false,
        "routesActions": [
            {
                "id": 1,
                "url": "",
                "name": "基础管理",
                "node_path": "/",
                "actions": null
            },
            {
                "id": 4,
                "url": "/admin/org/list",
                "name": "组织",
                "node_path": "/1/",
                "actions": [
                    "btn-add",
                    "btn-edit"
                ]
            },
            {
                "id": 5,
                "url": "/admin/user/list",
                "name": "用户",
                "node_path": "/1/",
                "actions": null
            }
        ]
    }
}

isRoot 等于true时，routesActions 为空，表示用户有全部权限
isRoot 等于false时, routesActions 指示具体权限
```

### 权限初始化

在 `AdminLayout.vue` 中，组件挂载时会自动获取用户权限：

```javascript
const fetchUserPermission = async () => {
  const response = await userPermissionAPI.my()
  if (response.code !== 0) {
    toastException("获取用户权限失败", response.message)
    return
  }
  permissionPlugInstance.setPermissions(response.data)
}

// 权限加载完成后才渲染路由视图
if (!permissionPlugInstance.permissionsIsSet()) {
  await fetchUserPermission()
}
```

## 权限插件

### 权限插件实例

位置：`src/plugins/permission.js`

### 主要方法

#### setPermissions(data)
设置用户权限数据

```javascript
permissionPlugInstance.setPermissions({
  permissions: ['user:view', 'user:add'],
  roles: ['admin']
})
```

#### hasPermission(permission)
检查是否拥有指定权限

```javascript
if (permissionPlugInstance.hasPermission('user:edit')) {
  // 显示编辑按钮
}
```

#### hasRole(role)
检查是否拥有指定角色

```javascript
if (permissionPlugInstance.hasRole('admin')) {
  // 显示管理员功能
}
```

#### permissionsIsSet()
检查权限是否已设置

```javascript
if (permissionPlugInstance.permissionsIsSet()) {
  // 权限已加载
}
```

## 路由权限控制

### 路由守卫

在路由配置中，可以通过 `meta.permission` 或 `meta.role` 控制路由访问：

```javascript
{
  path: '/admin/user',
  name: 'admin.user',
  component: () => import('@/views/admin/user/UserList.vue'),
  meta: {
    title: '用户管理',
    permission: 'user:view',  // 需要 user:view 权限
    role: 'admin'              // 或需要 admin 角色
  }
}
```

### 动态路由注册

- 根据用户权限动态注册路由
- 无权限的路由不会显示在菜单中
- 直接访问无权限路由会被拦截

## 菜单权限控制

### 菜单显示控制

菜单组件会根据用户权限动态显示/隐藏菜单项：

```vue
<SideMenu :menu-data="menuData" />
```

- 菜单数据从后端获取
- 根据用户权限过滤菜单项
- 无权限的菜单项自动隐藏

## 组件内权限控制

### 使用权限指令

在组件中使用权限判断：

```vue
<template>
  <div>
    <button v-if="hasPermission('user:add')">新增用户</button>
    <button v-if="hasPermission('user:edit')">编辑</button>
    <button v-if="hasPermission('user:delete')">删除</button>
  </div>
</template>

<script setup>
import { permissionPlugInstance } from '@/plugins/permission.js'

const hasPermission = (permission) => {
  return permissionPlugInstance.hasPermission(permission)
}
</script>
```

## 权限命名规范

### 操作权限格式
`资源:操作`

示例：
- `user:view` - 查看用户
- `user:add` - 新增用户
- `user:edit` - 编辑用户
- `user:delete` - 删除用户

### 资源权限格式
`资源:*` - 拥有该资源的所有权限

示例：
- `user:*` - 用户的所有权限
