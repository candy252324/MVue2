
import Observer from './Observer.mjs'

/** 数据监听 */
export default function observe(value) {
  if (typeof value !== "object") return
  // 如果已经存在__ob__属性，说明已经是响应式对象了，不需要再做响应式处理了
  if (value.__ob__) return value.__ob__
  const ob = new Observer(value)
  return ob
}