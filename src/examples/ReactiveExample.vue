<template>
  <div class="reactive-example">
    <h2>Vue reactive vs 普通变量对比示例</h2>
    
    <!-- 示例 1: reactive 对象 -->
    <div class="example-section">
      <h3>✅ 使用 reactive（会自动更新）</h3>
      <div class="demo-box">
        <p>计数: <strong>{{ reactiveState.count }}</strong></p>
        <p>用户名: <strong>{{ reactiveState.user.name }}</strong></p>
        <p>列表长度: <strong>{{ reactiveState.items.length }}</strong></p>
        <div class="button-group">
          <button @click="incrementReactive">增加计数</button>
          <button @click="updateReactiveUser">更新用户名</button>
          <button @click="addReactiveItem">添加项目</button>
        </div>
      </div>
    </div>

    <!-- 示例 2: 普通变量 -->
    <div class="example-section">
      <h3>❌ 使用普通变量（不会自动更新）</h3>
      <div class="demo-box">
        <p>计数: <strong>{{ normalCount }}</strong></p>
        <p>用户名: <strong>{{ normalUser.name }}</strong></p>
        <p>列表长度: <strong>{{ normalItems.length }}</strong></p>
        <div class="button-group">
          <button @click="incrementNormal">增加计数</button>
          <button @click="updateNormalUser">更新用户名</button>
          <button @click="addNormalItem">添加项目</button>
        </div>
        <p class="warning">⚠️ 点击按钮后，值在控制台会改变，但页面不会更新！</p>
      </div>
    </div>

    <!-- 示例 3: 表单对比 -->
    <div class="example-section">
      <h3>表单数据对比</h3>
      <div class="form-demo">
        <div class="form-group">
          <label>✅ reactive 表单（v-model 正常工作）:</label>
          <input v-model="reactiveForm.username" placeholder="输入用户名" />
          <p>实时显示: {{ reactiveForm.username }}</p>
        </div>
        <div class="form-group">
          <label>❌ 普通对象表单（v-model 不工作）:</label>
          <input v-model="normalForm.username" placeholder="输入用户名" />
          <p>实时显示: {{ normalForm.username }}</p>
          <p class="warning">⚠️ 输入后，实时显示不会更新！</p>
        </div>
      </div>
    </div>

    <!-- 控制台输出 -->
    <div class="console-output">
      <h3>控制台输出（打开浏览器控制台查看）</h3>
      <p>点击按钮后，查看控制台的输出，对比 reactive 和普通变量的行为差异。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

// ========== 示例 1: reactive 对象（响应式） ==========
const reactiveState = reactive({
  count: 0,
  user: {
    name: 'John'
  },
  items: ['item1', 'item2']
})

const incrementReactive = () => {
  reactiveState.count++
  console.log('✅ reactive 计数:', reactiveState.count)
  console.log('✅ 页面会自动更新显示:', reactiveState.count)
}

const updateReactiveUser = () => {
  reactiveState.user.name = 'Jane'
  console.log('✅ reactive 用户名:', reactiveState.user.name)
  console.log('✅ 页面会自动更新显示:', reactiveState.user.name)
}

const addReactiveItem = () => {
  reactiveState.items.push(`item${reactiveState.items.length + 1}`)
  console.log('✅ reactive 列表:', reactiveState.items)
  console.log('✅ 页面会自动更新显示列表长度:', reactiveState.items.length)
}

// ========== 示例 2: 普通变量（非响应式） ==========
// 注意：在 Vue 3 的 setup 中，普通变量无法在模板中使用
// 这里使用 ref 来演示，但模拟普通变量的行为（需要手动更新）

// 普通变量（在真实场景中，这些是普通变量）
let normalCountValue = 0
const normalUserValue = { name: 'John' }
const normalItemsValue = ['item1', 'item2']

// 为了在模板中显示，我们需要用 ref 包装
// 但我们会直接修改原始变量，然后手动更新 ref（模拟普通变量的行为）
const normalCount = ref(0)
const normalUser = ref({ name: 'John' })
const normalItems = ref(['item1', 'item2'])

const incrementNormal = () => {
  normalCountValue++  // 修改普通变量
  normalCount.value = normalCountValue  // 手动更新 ref（模拟普通变量的行为）
  console.log('❌ 普通变量计数:', normalCountValue)
  console.log('❌ 但页面不会自动更新，需要手动更新 ref')
  console.log('❌ 这就是为什么需要 reactive 的原因！')
}

const updateNormalUser = () => {
  normalUserValue.name = 'Jane'  // 修改普通对象
  normalUser.value = { ...normalUserValue }  // 手动更新
  console.log('❌ 普通对象用户名:', normalUserValue.name)
  console.log('❌ 但页面不会自动更新，需要手动更新 ref')
}

const addNormalItem = () => {
  normalItemsValue.push(`item${normalItemsValue.length + 1}`)  // 修改普通数组
  normalItems.value = [...normalItemsValue]  // 手动更新
  console.log('❌ 普通数组列表:', normalItemsValue)
  console.log('❌ 但页面不会自动更新，需要手动更新 ref')
}

// ========== 示例 3: 表单对比 ==========
const reactiveForm = reactive({
  username: ''
})

// 普通对象（v-model 无法正常工作）
const normalForm = {
  username: ''
}

onMounted(() => {
  console.log('=== Vue reactive vs 普通变量对比 ===')
  console.log('1. reactive 对象修改后会自动更新视图')
  console.log('2. 普通变量修改后需要手动更新视图')
  console.log('3. 这就是 reactive 的核心作用：自动响应式更新')
})
</script>

<style scoped>
.reactive-example {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 24px;
}

.example-section {
  margin-bottom: 32px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.example-section h3 {
  margin-top: 0;
  color: #1890ff;
}

.demo-box {
  background: white;
  padding: 16px;
  border-radius: 4px;
  margin-top: 12px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

button {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

button:hover {
  background: #40a9ff;
}

.warning {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 8px;
  font-weight: 500;
}

.form-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;
}

.form-group {
  background: white;
  padding: 16px;
  border-radius: 4px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #1890ff;
}

.form-group p {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.console-output {
  background: #fffbe6;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #ffe58f;
}

.console-output h3 {
  margin-top: 0;
  color: #d48806;
}

.console-output p {
  margin: 8px 0;
  color: #666;
}
</style>

