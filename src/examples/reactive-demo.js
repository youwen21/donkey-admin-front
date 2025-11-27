/**
 * Vue reactive vs 普通变量对比示例
 * 
 * 这个文件展示了 reactive 和普通变量的核心区别
 * 可以在浏览器控制台中运行这些代码来理解差异
 */

// ========== 普通变量（非响应式） ==========

// 普通 JavaScript 对象
const normalState = {
  count: 0,
  name: 'John'
}

// 修改普通对象
normalState.count = 1
normalState.name = 'Jane'

console.log('普通变量:', normalState)
// 输出: { count: 1, name: 'Jane' }
// 但是：如果这个对象在 Vue 模板中使用，修改后页面不会自动更新！

// ========== reactive 对象（响应式） ==========

// 注意：这个文件需要在 Vue 组件中运行，或者使用 Vue 的响应式 API
// 以下是概念演示

/*
import { reactive } from 'vue'

// reactive 对象
const reactiveState = reactive({
  count: 0,
  name: 'John'
})

// 修改 reactive 对象
reactiveState.count = 1
reactiveState.name = 'Jane'

console.log('reactive 对象:', reactiveState)
// 输出: { count: 1, name: 'Jane' }
// 关键区别：如果这个对象在 Vue 模板中使用，修改后页面会自动更新！
*/

// ========== 核心区别演示 ==========

/**
 * 场景：用户点击按钮，计数 +1
 */

// ❌ 使用普通变量
function incrementNormal() {
  let count = 0
  count++  // count 现在是 1
  // 但是：页面上的 {{ count }} 仍然是 0，不会更新！
  // 需要手动更新 DOM：
  // document.querySelector('.count').textContent = count
}

// ✅ 使用 reactive
function incrementReactive() {
  // 在 Vue 组件中：
  /*
  const state = reactive({ count: 0 })
  state.count++  // count 现在是 1
  // 页面上的 {{ state.count }} 会自动更新为 1！
  // 不需要手动操作 DOM
  */
}

// ========== 实际应用场景 ==========

/**
 * 场景 1: 表单数据
 */

// ❌ 普通对象 - v-model 无法正常工作
const normalForm = {
  username: '',
  password: ''
}
// 用户输入后，normalForm.username 会改变
// 但是页面上的 {{ normalForm.username }} 不会更新

// ✅ reactive 对象 - v-model 正常工作
/*
const reactiveForm = reactive({
  username: '',
  password: ''
})
// 用户输入后，reactiveForm.username 会改变
// 页面上的 {{ reactiveForm.username }} 会自动更新
*/

/**
 * 场景 2: 列表数据
 */

// ❌ 普通数组 - 添加项目后页面不更新
const normalList = ['item1', 'item2']
normalList.push('item3')
// 页面上的列表不会自动显示新项目

// ✅ reactive 数组 - 添加项目后页面自动更新
/*
const reactiveList = reactive(['item1', 'item2'])
reactiveList.push('item3')
// 页面上的列表会自动显示新项目
*/

/**
 * 场景 3: 共享状态（多个组件使用）
 */

// ❌ 普通变量 - 需要手动通知所有组件
let sharedCount = 0
const subscribers = []

function setSharedCount(value) {
  sharedCount = value
  // 必须手动通知所有订阅者
  subscribers.forEach(callback => callback(value))
}

// ✅ reactive - 自动通知所有使用它的组件
/*
const sharedState = reactive({ count: 0 })
sharedState.count = 10
// 所有使用 sharedState.count 的组件都会自动更新
// 不需要手动通知
*/

// ========== 性能对比 ==========

/**
 * 普通变量：
 * - 性能最优，无额外开销
 * - 但需要手动管理更新
 * 
 * reactive：
 * - 有响应式系统开销（Proxy、依赖追踪等）
 * - 但自动管理更新，开发效率高
 * 
 * 结论：
 * - 需要响应式 → 使用 reactive
 * - 不需要响应式 → 使用普通变量
 */

// ========== 总结 ==========

/**
 * reactive 的核心作用：
 * 
 * 1. 自动追踪依赖
 *    - 当组件读取 reactive 对象的属性时，Vue 会记录这个依赖关系
 * 
 * 2. 自动触发更新
 *    - 当 reactive 对象的属性被修改时，Vue 会自动更新所有依赖这个属性的组件
 * 
 * 3. 无需手动操作 DOM
 *    - 不需要手动调用 document.querySelector 或 innerHTML
 *    - Vue 会自动更新视图
 * 
 * 普通变量的特点：
 * 
 * 1. 性能最优
 *    - 无响应式系统开销
 * 
 * 2. 需要手动更新
 *    - 修改值后，需要手动更新 DOM 或通知其他部分
 * 
 * 3. 适合不需要响应式的场景
 *    - 常量、配置、工具函数中的临时变量等
 */

export {
  normalState,
  // reactiveState 需要在 Vue 组件中使用
}

