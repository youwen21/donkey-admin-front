# 权限

## 权限系统概述

采用 ACL 权限控制模型。

---

## ACL权限模型

基础元素：
 - 用户
 - 菜单和按钮

关系：
 - 用户权限（用户已授权菜单和按钮）

--- 

## 权限
 - 菜单权限，用户可见哪些菜单
 - 按钮权限，前端代码校验，用户可见哪些按钮
 - 行为权限，后端代码校验，用户是否有权请求接口

### 菜单权限
菜单权限由后台控制，接口返回当前已登录用户有权限的菜单。

**接口地址**：GET `/admin-api/v1/menu/tree`

### 按钮权限
系统支持按钮权限控制，用户只可见、可操作有权限的按钮
 
#### 按钮权限案例
```javascript
// 检查按钮权限
// 为指定路由，默认取值 route.path
<button class="btn btn-primary" @click="handleAdd" v-if="$checkActionPerm('btn-add')">
  <span class="btn-icon">+</span>
  新增组织
</button>

// 指定路由 检查按钮权限
// 检查 menu.url 是 /admin/org/list 菜单，btn-add的按钮权限
<button class="btn btn-primary" @click="handleAdd" v-if="$checkPathActionPerm('/admin/org/list','btn-add')">
  <span class="btn-icon">+</span>
  新增组织
</button>

```



## permission插件

插件位置：`src/plugins/permission.js`

插件注册全局方法：
 - $checkActionPerm, 检查当前路由的 按钮权限
 - $checkPathActionPerm 检查指定路由的 按钮权限
 - $checkPathPerm, 检查指定的 路由权限

### 初始化

初始化位置: `src/views/layout/AdminLayout.vue`
```javascript
permissionPlugInstance.setPermissions(permissionsData)

```

permissionsData 数据格式
```
{
    "isRoot": false, // isRoot 为 true 时，menuActions 内容为空
    "menuActions": [
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
                "btn-add", "btn-edit"
            ]
        }
    ]
}
```


## 最佳实践

1. **权限检查**
   - 前端权限控制用于用户体验优化
   - 后端必须进行权限验证
   - 不要仅依赖前端权限控制

2. **权限粒度**
   - 权限粒度要适中
   - 避免权限过多导致管理困难
   - 避免权限过少导致控制不灵活

3. **性能优化**
   - 权限数据缓存
   - 避免频繁权限检查
   - 使用权限插件统一管理

4. **错误处理**
   - 权限获取失败的处理
   - 无权限访问的提示
   - 权限过期的处理

