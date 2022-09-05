import Dep from './Dep.mjs'
import queueWatcher from './asyncUpdateQueue.mjs'
let uid = 0

export default class Watcher {
  constructor(cb, options = {}, vm = null) {
    this.uid = uid++
    this._cb = cb
    this.options = options
    !options.lazy && this.get()
    this.vm = vm
    this.dirty = true
    this.value = null  // watcher 中 cb 的执行结果
  }
  get() {
    Dep.target = this
    // 执行回调函数时，回调函数里必须要有 this.xxx 的数据读取操作，读取操作会触发getter
    // 而getter里面调用了dep.depend()方法，由于此时Dep.target是存在的，于是往Dep实例中的 watchers 数组添加了一个依赖，也就是watcher实例。
    // 为什么这里要绑定作用域为 vm? 这里如果直接执行this._cb的话，如果 cb 是计算属性的回调函数，那么回调函数里的 this 指向当前 watcher 实例，取不到 vue 实例上的 data
    this.value = this._cb.apply(this.vm)
    Dep.target = null // 防止重复依赖收集
  }
  // 当响应式数据更新时，update
  update() {
    // 懒执行
    if (this.options.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  evalute() {
    // 触发 cb 执行
    this.get()
    // dirty 置为false, 实现一次刷新周期内 computed 计算属性只执行一次
    this.dirty = false
  }
  //  由刷新 watcher 队列的函数调用，负责执行 watcher.get 方法
  run() {
    this.get()
  }
}