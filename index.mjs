import observe from './src/observe.mjs'
import defineReactive from './src/defineReactive.mjs'
import proxyData from './src/proxyData.mjs'
import initData from './src/initData.mjs'
import mount from './src/mount.mjs'

export default class MVue {
  constructor(options) {
    this.$options = options
    const { data } = this.$options
    this.$data = {}
    if (data) {
      this.$data = typeof data === "function" ? data() : data
    }
    this.$set = this.set
    this._init(options)
  }
  _init(options) {
    initData(this)
    if (this.$options.el) {
      this.$mount()
    }
  }
  $mount() {
    mount(this)
  }
  /** 新增属性也要劫持 */
  set(obj, key, value) {
    this.$data[key] = value
    // 数组或对象
    if (value && typeof (value) === "object") {
      observe(value)
    } else {
      defineReactive(obj, key, value)
    }
    let newData = {}
    newData[key] = value
    proxyData(this, newData)  // 对新增的属性进行代理
  }
}

