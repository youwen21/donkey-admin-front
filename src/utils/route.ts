/** 将 vue-router 的 params/query 单值规范为 string */
export function routeParam(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (Array.isArray(value)) return String(value[0] ?? '')
  if (typeof value === 'string') return value
  return String(value)
}
