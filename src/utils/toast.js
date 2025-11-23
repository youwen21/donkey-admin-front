import Swal from 'sweetalert2'

// 名称规则 学习
// https://cloud.tencent.com/developer/article/1025695

// 文档
// https://github.com/sweetalert2/sweetalert2
// https://sweetalert2.github.io/

/**
 * Toast 配置
 */
const defaultToastConfig = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
}

/**
 * 成功提示
 * @param {string} message - 提示消息
 * @param {string} title - 标题，可选
 * @returns {Promise}
 */
export const toastSuccess = (message = '操作成功', title = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'success',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 错误提示
 * @param {string} message - 提示消息
 * @param {string} title - 标题，可选
 * @returns {Promise}
 */
export const toastError = (message = '操作失败', title = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'error',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 警告提示
 * @param {string} message - 提示消息
 * @param {string} title - 标题，可选
 * @returns {Promise}
 */
export const toastWarning = (message = '警告', title = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'warning',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 信息提示
 * @param {string} message - 提示消息
 * @param {string} title - 标题，可选
 * @returns {Promise}
 */
export const toastInfo = (message = '提示', title = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'info',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 确认对话框
 * @param {string} title - 标题
 * @param {string} text - 内容
 * @param {string} confirmButtonText - 确认按钮文字，默认 '确定'
 * @param {string} cancelButtonText - 取消按钮文字，默认 '取消'
 * @param {string} icon - 图标类型，默认 'warning'
 * @returns {Promise<boolean>} 返回 true 表示确认，false 表示取消
 */
export const confirm = async (
  title = '确认操作',
  text = '确定要执行此操作吗？',
  confirmButtonText = '确定',
  cancelButtonText = '取消',
  icon = 'warning'
) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: '#1890ff',
    cancelButtonColor: '#999'
  })
  return result.isConfirmed
}

/**
 * 处理异常信息并显示错误提示
 * @param {Error|Object|string} error - 异常对象或错误信息
 * @param {string} title - 标题，默认 '操作失败'
 * @returns {Promise}
 */
export const toastException = (error, title = '操作失败') => {
  let message = '操作失败，请稍后重试'

  // 如果是字符串，直接使用
  if (typeof error === 'string') {
    message = error
  }
  // 如果是 Error 对象， Exception 异常
  else if (error instanceof Error) {
    message = error.message || message
  }
  // 如果是对象
  else if (error && typeof error === 'object') {
    // 优先取 response.data.msg（API 响应错误）
    if (error.response?.data?.msg) {
      message = error.response.data.msg
    }
    // 其次取 response.data.message
    else if (error.response?.data?.message) {
      message = error.response.data.message
    }
    // 取 data.msg
    else if (error.data?.msg) {
      message = error.data.msg
    }
    // 取 data.message
    else if (error.data?.message) {
      message = error.data.message
    }
    // 取 msg
    else if (error.msg) {
      message = error.msg
    }
    // 取 message
    else if (error.message) {
      message = error.message
    }
    // 取 response.statusText
    else if (error.response?.statusText) {
      message = error.response.statusText
    }
  }

  return Swal.fire({
    ...defaultToastConfig,
    icon: 'error',
    title,
    text: message
  })
}

/**
 * 自定义 Toast
 * @param {Object} options - Swal 配置选项
 * @returns {Promise}
 */
export const toast = (options) => {
  return Swal.fire({
    ...defaultToastConfig,
    ...options
  })
}

// 默认导出所有方法
export default {
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  confirm,
  exception: toastException,
  toast
}
