export const formatDateTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return '-'
  return dateTime.replace('T', ' ').substring(0, 19)
}

export const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  return date.substring(0, 10)
}

export const formatTime = (time: string | null | undefined) => {
  if (!time) return '-'
  const match = time.match(/(\d{2}):(\d{2}):(\d{2})/)
  return match ? match[0] : '-'
}

export default {
  formatDateTime,
  formatDate,
  formatTime,
}
