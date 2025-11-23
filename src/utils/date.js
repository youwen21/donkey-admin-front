/**
 * 日期时间格式化工具函数
 */

/**
 * 格式化日期时间字符串
 * 将 ISO 格式的日期时间字符串转换为 "YYYY-MM-DD HH:mm:ss" 格式
 * @param {string} dateTime - 日期时间字符串，如 "2024-01-01T12:00:00" 或 "2024-01-01T12:00:00Z"
 * @returns {string} 格式化后的日期时间字符串，如 "2024-01-01 12:00:00"，如果输入为空则返回 "-"
 */
export const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  return dateTime.replace('T', ' ').substring(0, 19)
}

/**
 * 格式化日期字符串
 * 将日期字符串转换为 "YYYY-MM-DD" 格式
 * @param {string} date - 日期字符串
 * @returns {string} 格式化后的日期字符串，如 "2024-01-01"，如果输入为空则返回 "-"
 */
export const formatDate = (date) => {
  if (!date) return '-'
  return date.substring(0, 10)
}

/**
 * 格式化时间字符串
 * 将时间字符串转换为 "HH:mm:ss" 格式
 * @param {string} time - 时间字符串
 * @returns {string} 格式化后的时间字符串，如 "12:00:00"，如果输入为空则返回 "-"
 */
export const formatTime = (time) => {
  if (!time) return '-'
  const match = time.match(/(\d{2}):(\d{2}):(\d{2})/)
  return match ? match[0] : '-'
}

// 默认导出
export default {
  formatDateTime,
  formatDate,
  formatTime
}

