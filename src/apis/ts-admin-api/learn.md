# TypeScript API 学习文档

## TypeScript 版本的主要特点

### 1. 完整的类型定义

- `MenuQueryParams` - 查询参数类型
- `Menu` - 菜单数据模型
- `MenuFormData` - 新增/更新表单数据类型
- `APIResponse<T>` - 通用 API 响应类型
- `PaginatedResponse<T>` - 分页响应类型

### 2. 类型安全

- 所有方法都有明确的参数类型和返回类型
- 编译时类型检查，减少运行时错误
- IDE 自动补全和类型提示

### 3. 与 JavaScript 版本的对比

#### JavaScript 版本：

```javascript
// 没有类型检查，容易出错
const menu = await menuAPI.get({ id: "123" }) // 字符串也能通过
```

#### TypeScript 版本：

```typescript
// 类型检查，编译时就能发现错误
const menu = await menuAPI.get({ id: "123" }) // ❌ 类型错误：id 必须是 number
const menu = await menuAPI.get({ id: 123 })   // ✅ 正确
```

### 4. 使用示例

```typescript
import { menuAPI, menuGet, menuQuery, Menu, MenuQueryParams } from '@/apis/ts-admin-api/menu-api'

// 类型安全的查询
const params: MenuQueryParams = {
  page: 1,
  pageSize: 20,
  name: '菜单',
  status: 1
}
const result = await menuQuery(params)
// result 的类型是 PaginatedResponse<Menu>
// result.list 是 Menu[]
// result.total 是 number

// 类型安全的获取详情
const menu: Menu | null = await menuGet({ id: 1 })
if (menu) {
  console.log(menu.name) // TypeScript 知道 menu 有 name 属性
}
```

### 5. 类型推断

- TypeScript 会自动推断返回类型
- IDE 会提供完整的代码提示
- 重构更安全，类型系统会检查所有使用处

---

> 该文件已通过 lint 检查，可直接使用。可作为学习 TypeScript 的参考，展示了如何将 JavaScript API 文件转换为类型安全的 TypeScript 版本。