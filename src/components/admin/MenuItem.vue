<template>
  <div class="menu-item">
    <div
      class="menu-item-content"
      :class="{ 
        'is-active': isActive,
        'has-active-child': hasActiveChild && !isActive
      }"
      :style="{ paddingLeft: `${16 + level * 20}px` }"
      @click="handleClick"
    >
      <span class="menu-item-icon" v-if="item.children && item.children.length > 0">
        <svg
          class="arrow-icon"
          :class="{ 'is-expanded': isExpanded }"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M4.5 3L7.5 6L4.5 9"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="menu-item-text" :style="{ paddingLeft: level > 0 ? `${level * 20}px` : '0' }">
        <span v-if="level > 0" class="tree-indent">└─</span>
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  hasActiveChild: {
    type: Boolean,
    default: false
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['item-click'])

const router = useRouter()

// 处理菜单点击
const handleClick = () => {
  // 触发点击事件，由父组件处理展开/折叠逻辑
  emit('item-click', props.item)
  
  // 如果没有子菜单，直接跳转路由
  if (!props.item.children || props.item.children.length === 0) {
    router.push(props.item.url)
  }
}
</script>

<style scoped>
.menu-item {
  user-select: none;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-item-content:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
}

.menu-item-content.is-active {
  background-color: #1890ff;
  color: #fff;
}

.menu-item-content.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #1890ff;
}

.menu-item-content.has-active-child {
  color: rgba(255, 255, 255, 0.95);
  background-color: rgba(24, 144, 255, 0.15);
}

.menu-item-content.has-active-child .menu-item-icon {
  color: rgba(255, 255, 255, 0.95);
}

.menu-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: rgba(255, 255, 255, 0.65);
  transition: transform 0.3s;
}

.menu-item-content.is-active .menu-item-icon {
  color: #fff;
}

.arrow-icon {
  transition: transform 0.3s;
  transform: rotate(0deg);
}

.arrow-icon.is-expanded {
  transform: rotate(90deg);
}

.menu-item-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  align-items: center;
}

.tree-indent {
  color: rgba(255, 255, 255, 0.3);
  margin-right: 4px;
  font-size: 12px;
}

</style>
