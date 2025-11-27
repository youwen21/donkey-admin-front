# Vue 3 响应式系统：reactive vs 普通变量

## 📋 核心概念

### reactive 的作用
`reactive` 是 Vue 3 提供的响应式 API，用于创建一个**响应式对象**。当对象的属性发生变化时，Vue 会自动追踪这些变化，并**自动更新**所有依赖这些属性的视图。

### 普通变量的特点
普通 JavaScript 变量是**非响应式**的，修改它们的值不会触发视图更新。

---

## 🔍 核心区别对比

| 特性 | reactive 对象 | 普通 JavaScript 变量 |
|------|---------------|---------------------|
| **响应式** | ✅ 是，自动追踪变化 | ❌ 否，不会触发更新 |
| **视图更新** | ✅ 自动更新 DOM | ❌ 需要手动更新 |
| **类型** | 必须是对象 | 可以是任何类型 |
| **访问方式** | 直接访问属性 | 直接访问 |
| **性能** | 有响应式开销 | 无额外开销 |
| **使用场景** | 需要响应式的对象 | 不需要响应式的数据 |

---

## 💡 实际代码对比

### 示例 1：基本使用对比

#### ❌ 使用普通变量（不会更新视图）

```vue
<template>
  <div>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
// 普通变量 - 不会触发视图更新
let count = 0

const increment = () => {
  count++  // 值改变了，但页面不会更新！
  console.log(count)  // 控制台显示 1, 2, 3...
  // 但页面上的 {{ count }} 仍然是 0
}
</script>
```

#### ✅ 使用 reactive（会自动更新视图）

```vue
<template>
  <div>
    <p>计数: {{ state.count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

// reactive 对象 - 会自动触发视图更新
const state = reactive({
  count: 0
})

const increment = () => {
  state.count++  // 值改变，页面自动更新！
  console.log(state.count)  // 控制台显示 1, 2, 3...
  // 页面上的 {{ state.count }} 也会自动更新为 1, 2, 3...
}
</script>
```

---

### 示例 2：项目中的实际应用

#### 项目中的 reactive 使用（`src/store/sideMenu.js`）

```js
import { reactive } from 'vue'

// 使用 reactive 创建响应式 store
const sideMenuStore = reactive({
  activeItemPath: null,
  
  setActiveItemPath(path) {
    this.activeItemPath = path  // 修改后，所有使用这个值的组件都会自动更新
  }
})

export default sideMenuStore
```

**为什么这里用 reactive？**
- 多个组件需要共享菜单激活状态
- 当 `activeItemPath` 改变时，所有使用它的组件（如 `SideMenu.vue`）需要自动更新
- 如果使用普通变量，需要手动通知所有组件，非常麻烦

#### 如果使用普通变量（需要手动更新）

```js
// ❌ 普通变量方式
let activeItemPath = null

// 需要手动维护所有依赖的组件
const subscribers = []

function setActiveItemPath(path) {
  activeItemPath = path
  // 必须手动通知所有组件更新
  subscribers.forEach(callback => callback(path))
}

// 每个组件都需要注册
function subscribe(callback) {
  subscribers.push(callback)
}
```

---

### 示例 3：表单数据对比

#### ❌ 使用普通对象（不会自动更新）

```vue
<template>
  <form>
    <input v-model="form.username" />
    <input v-model="form.password" />
    <p>用户名: {{ form.username }}</p>
  </form>
</template>

<script setup>
// 普通对象 - v-model 无法正常工作
const form = {
  username: '',
  password: ''
}
// 输入框的值改变了，但 {{ form.username }} 不会更新
</script>
```

#### ✅ 使用 reactive（自动双向绑定）

```vue
<template>
  <form>
    <input v-model="form.username" />
    <input v-model="form.password" />
    <p>用户名: {{ form.username }}</p>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

// reactive 对象 - v-model 正常工作
const form = reactive({
  username: '',
  password: ''
})
// 输入框的值改变时，{{ form.username }} 会自动更新
</script>
```

**项目中的实际例子**（`src/views/admin/LoginView.vue`）：

```js
// 使用 ref 包装对象（另一种响应式方式）
const form = ref({
  username: '',
  password: ''
})

// 或者使用 reactive（更直接）
const form = reactive({
  username: '',
  password: ''
})
```

---

## 🎯 reactive vs ref 的区别

### reactive
- **只能用于对象**（对象、数组、Map、Set）
- **直接访问属性**：`state.count`
- **不能替换整个对象**：`state = {}` 会失去响应式

```js
const state = reactive({ count: 0 })
state.count++  // ✅ 可以
state = { count: 1 }  // ❌ 失去响应式
```

### ref
- **可以用于任何类型**（基本类型、对象、数组等）
- **需要通过 `.value` 访问**：`count.value`
- **可以替换整个值**：`count.value = 1`

```js
const count = ref(0)
count.value++  // ✅ 可以
count.value = 1  // ✅ 可以
```

### 项目中的选择

```js
// 单个值 → 使用 ref
const loading = ref(false)
const currentPage = ref(1)

// 对象 → 可以使用 reactive 或 ref
const form = reactive({ username: '', password: '' })
// 或
const form = ref({ username: '', password: '' })
```

---

## 🔬 响应式原理（简化说明）

### 普通变量的工作方式

```js
let count = 0

// 修改值
count = 1

// JavaScript 只是改变了内存中的值
// 没有任何机制通知其他地方这个值改变了
// Vue 不知道需要更新视图
```

### reactive 的工作方式

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })

// Vue 内部做了什么：
// 1. 使用 Proxy 包装对象
// 2. 拦截属性的读取和设置操作
// 3. 当属性被读取时，记录依赖（哪个组件使用了这个属性）
// 4. 当属性被修改时，通知所有依赖的组件更新

state.count = 1
// Vue 检测到变化 → 找到所有使用 state.count 的组件 → 自动更新视图
```

### 内部实现（简化版）

```js
// Vue 内部类似这样实现（简化版）
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      // 读取属性时，记录依赖
      track(target, key)  // 记录：这个组件依赖这个属性
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      // 设置属性时，触发更新
      trigger(target, key)  // 通知：这个属性变了，更新所有依赖它的组件
      return true
    }
  })
}
```

---

## 📊 性能对比

### 普通变量
- ✅ **性能最优**：无额外开销
- ❌ **需要手动更新**：需要自己写更新逻辑

### reactive
- ⚠️ **有响应式开销**：Proxy 拦截、依赖追踪、更新调度
- ✅ **自动更新**：无需手动管理

**性能影响通常可以忽略**，除非处理大量数据（如 10万+ 条数据）。

---

## 🎨 使用场景建议

### 使用 reactive 的场景

1. **表单数据**（需要双向绑定）
   ```js
   const form = reactive({
     username: '',
     password: ''
   })
   ```

2. **共享状态**（多个组件使用）
   ```js
   // store/sideMenu.js
   const sideMenuStore = reactive({
     activeItemPath: null
   })
   ```

3. **复杂对象**（嵌套对象、数组）
   ```js
   const user = reactive({
     name: 'John',
     address: {
       city: 'Beijing',
       street: 'Main St'
     },
     hobbies: ['reading', 'coding']
   })
   ```

### 使用普通变量的场景

1. **不需要响应式的数据**
   ```js
   // 常量配置
   const API_BASE_URL = 'http://api.example.com'
   
   // 工具函数中的临时变量
   function formatDate(date) {
     const year = date.getFullYear()  // 不需要响应式
     return `${year}-01-01`
   }
   ```

2. **计算过程中的中间变量**
   ```js
   function calculateTotal(items) {
     let total = 0  // 不需要响应式
     items.forEach(item => {
       total += item.price
     })
     return total
   }
   ```

---

## 🚨 常见错误

### 错误 1：解构 reactive 对象

```js
// ❌ 错误：解构会失去响应式
const state = reactive({ count: 0, name: 'John' })
const { count, name } = state  // 解构后，count 和 name 不再是响应式的

// ✅ 正确：直接访问
const state = reactive({ count: 0, name: 'John' })
// 使用 state.count 和 state.name
```

### 错误 2：替换整个对象

```js
// ❌ 错误：替换整个对象会失去响应式
const state = reactive({ count: 0 })
state = { count: 1 }  // 失去响应式

// ✅ 正确：修改属性
const state = reactive({ count: 0 })
state.count = 1  // 保持响应式
```

### 错误 3：在模板中直接使用普通变量

```vue
<template>
  <!-- ❌ 错误：普通变量不会更新 -->
  <p>{{ count }}</p>
</template>

<script setup>
let count = 0
setTimeout(() => {
  count = 10  // 页面不会更新
}, 1000)
</script>
```

---

## 📝 项目中的最佳实践

### 1. 单个值使用 ref

```js
// ✅ 推荐
const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
```

### 2. 对象使用 reactive 或 ref

```js
// 方式 1：使用 reactive（直接访问属性）
const form = reactive({
  username: '',
  password: ''
})
// 访问：form.username

// 方式 2：使用 ref（需要通过 .value）
const form = ref({
  username: '',
  password: ''
})
// 访问：form.value.username
```

### 3. 共享状态使用 reactive

```js
// store/sideMenu.js
const sideMenuStore = reactive({
  activeItemPath: null,
  setActiveItemPath(path) {
    this.activeItemPath = path
  }
})
```

---

## 🔄 总结

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 单个基本值 | `ref` | 简单直接 |
| 对象/数组 | `reactive` 或 `ref` | 根据个人喜好 |
| 共享状态 | `reactive` | 多个组件共享 |
| 不需要响应式 | 普通变量 | 性能最优 |
| 表单数据 | `reactive` | 双向绑定方便 |

**核心原则**：
- 需要**自动更新视图** → 使用 `reactive` 或 `ref`
- 不需要响应式 → 使用普通变量
- 多个组件共享 → 使用 `reactive` 创建 store

---

## 🎓 进一步学习

- [Vue 3 官方文档 - 响应式基础](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 官方文档 - reactive](https://cn.vuejs.org/api/reactivity-core.html#reactive)
- [Vue 3 官方文档 - ref](https://cn.vuejs.org/api/reactivity-core.html#ref)

