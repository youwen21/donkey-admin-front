/**
 * Vue reactive vs 普通变量对比示例
 *
 * 这个文件展示了 reactive 和普通变量的核心区别
 * 可以在浏览器控制台中运行这些代码来理解差异
 */

const normalState = {
  count: 0,
  name: 'John',
}

normalState.count = 1
normalState.name = 'Jane'

console.log('普通变量:', normalState)

function incrementNormal() {
  let count = 0
  count++
}

function incrementReactive() {
  /* 在 Vue 组件中：
  const state = reactive({ count: 0 })
  state.count++
  */
}

const normalForm = {
  username: '',
  password: '',
}

const normalList = ['item1', 'item2']
normalList.push('item3')

export { normalState, incrementNormal, incrementReactive, normalForm, normalList }
