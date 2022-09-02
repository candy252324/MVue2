import Watcher from "./Watcher.mjs"

export default function initComputed(vm) {
  const computed = vm.$options.computed
  let watcher = vm._watcher = Object.create(null)
  for (let key in computed) {
    watcher[key] = new Watcher(computed[key], { lazy: true }, vm)
    defineComputed(vm, key)
  }
}

/**
 * 将计算属性代理到 vue 实例上，使能通过 this.xxx 的方式访问计算属性
 * 并结合 watcher 实现 computed 缓存
 * @param {*} key 
 */
function defineComputed(vm, key) {
  Object.defineProperty(vm, key, {
    get() {
      const watcher = vm._watcher[key]
      // ditry 为true,说明 computed 回调函数在本次函数渲染周期内没有执行过
      if (watcher.dirty) {
        watcher.evalute() // 通知 watcher 执行 computed 回调函数
      }
      return watcher.value
    },
    set() {
      console.log("计算属性不能设置")
    }
  })
}