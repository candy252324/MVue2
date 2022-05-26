import Dep from './Dep.mjs'
export default class Watcher {
  constructor(cb) {
    this._cb = cb
    Dep.target = this
    // 这里是精髓，执行回调函数时，回调函数里必须要有 this.xxx 的数据读取操作，读取操作会触发getter
    // 而getter里面调用了dep.depend()方法，由于此时Dep.target是存在的，于是往Dep实例中的 watchers 数组添加了一个依赖，也就是watcher实例。
    this._cb()
    Dep.target = null // 防止重复依赖收集
  }
  update() {
    console.log("update!!!")
    this._cb()  // 当响应式数据更新时，执行_cb函数，更新dom
  }
}