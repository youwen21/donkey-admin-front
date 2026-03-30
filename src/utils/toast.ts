import Swal from 'sweetalert2'
import type { SweetAlertOptions } from 'sweetalert2'

const defaultToastConfig: SweetAlertOptions = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
}

export const toastSuccess = (message: string = '操作成功', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'success',
    title: title || message,
    text: title ? message : '',
  })
}

export const toastError = (message: string = '操作失败', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'error',
    title: title || message,
    text: title ? message : '',
  })
}

export const toastWarning = (message: string = '警告', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'warning',
    title: title || message,
    text: title ? message : '',
  })
}

export const toastInfo = (message: string = '提示', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'info',
    title: title || message,
    text: title ? message : '',
  })
}

export const confirm = async (
  title: string = '确认操作',
  text: string = '确定要执行此操作吗？',
  confirmButtonText: string = '确定',
  cancelButtonText: string = '取消',
  icon: SweetAlertOptions['icon'] = 'warning',
) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: '#1890ff',
    cancelButtonColor: '#999',
  })
  return result.isConfirmed
}

type ExceptionLike = {
  response?: { data?: { message?: string }; statusText?: string }
  data?: { message?: string }
  message?: string
}

export const toastException = (error: unknown, title: string = '操作失败') => {
  let message = '操作失败，请稍后重试'

  if (typeof error === 'string') {
    message = error
  } else if (error instanceof Error) {
    message = error.message || message
  } else if (error && typeof error === 'object') {
    const e = error as ExceptionLike
    if (e.response?.data?.message) {
      message = e.response.data.message
    } else if (e.data?.message) {
      message = e.data.message
    } else if (e.message) {
      message = e.message
    } else if (e.response?.statusText) {
      message = e.response.statusText
    }
  }

  return Swal.fire({
    ...defaultToastConfig,
    icon: 'error',
    title,
    text: message,
  })
}

export const toast = (options: SweetAlertOptions) => {
  return Swal.fire({
    ...defaultToastConfig,
    ...options,
  } as SweetAlertOptions)
}

export default {
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  confirm,
  exception: toastException,
  toast,
}
