<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">管理员登录</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="请输入用户名"
            required
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入密码"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
        </div>

        <!-- 7天免登录 -->
        <div class="form-group remember-group">
          <label for="remember" class="remember-label">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="remember-checkbox"
            />
            <span class="remember-text">7天免登录</span>
          </label>
        </div>
        
        <button
          type="submit"
          class="login-button"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '@/apis/admin-api/auth-api.js'

const router = useRouter()
const route = useRoute()

const form = ref({
  username: '',
  password: '',
  remember: false // 7天免登录选项
})

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!form.value.username || !form.value.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }
  
  loading.value = true
  
  try {
    const response = await authAPI.login({
      username: form.value.username,
      password: form.value.password,
      remember: form.value.remember // 传递7天免登录选项
    })
    
    if (response && response.code === 0) {
      // 登录成功，检查是否有redirect参数
      const redirect = route.query.redirect
      if (redirect) {
        // 如果存在redirect参数，跳转到指定路径
        router.push(decodeURIComponent(redirect))
      } else {
        // 否则跳转到默认的管理后台首页
        router.push({ name: 'admin.dashboard' })
      }
    } else {
      errorMessage.value = '登录失败，请检查用户名和密码'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.login-box {
  width: 480px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 60px 50px;
}

.login-title {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 40px;
  letter-spacing: 0.5px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fafafa;
}

.form-input:hover {
  border-color: #bbb;
  background-color: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  padding-right: 90px;
}

.password-toggle {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #667eea;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

.password-toggle:hover {
  background-color: #f0f0f0;
  color: #5568d3;
}

.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  letter-spacing: 0.5px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.remember-group {
  margin-top: -8px;
  margin-bottom: -8px;
}

.remember-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 8px;
}

.remember-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
  flex-shrink: 0;
}

.remember-text {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.remember-label:hover .remember-text {
  color: #333;
}

.error-message {
  margin-top: 20px;
  padding: 14px;
  background-color: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fcc;
  line-height: 1.5;
}
</style>
