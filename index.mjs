import observe from './src/observe.mjs'
import defineReactive from './src/defineReactive.mjs'
import proxyData from './src/proxyData.mjs'
import initData from './src/initData.mjs'
import initComputed from './src/initComputed.mjs'
import mount from './src/compiler/index.mjs'
import renderHelper from './src/compiler/renderHelper.mjs'
import patch from './src/compiler/patch.mjs'

export default function MVue(options) {
  this.$options = options
  const { data } = this.$options
  this.$data = {}
  if (data) {
    this.$data = typeof data === "function" ? data() : data
  }
  this.$set = this.set
  this._init(options)
}
MVue.prototype._init = function (options) {
  initData(this)
  initComputed(this)
  renderHelper(this)
  this.__patch__ = patch  // 在vue上挂一个__patch__方法
  if (this.$options.el) {
    this.$mount()
  }
}
MVue.prototype.$mount = function () {
  mount(this)
}

// cjh todo  class 写法导致在mountComponent中拿不到Vue??
// export default class MVue {
//   constructor(options) {
//     this.$options = options
//     const { data } = this.$options
//     this.$data = {}
//     if (data) {
//       this.$data = typeof data === "function" ? data() : data
//     }
//     this.$set = this.set
//     this._init(options)
//   }
//   _init(options) {
//     initData(this)
//     renderHelper(this)
//     if (this.$options.el) {
//       this.$mount()
//     }
//   }
//   $mount() {
//     mount(this)
//   }
//   /** 新增属性也要劫持 */
//   set(obj, key, value) {
//     this.$data[key] = value
//     // 数组或对象
//     if (value && typeof (value) === "object") {
//       observe(value)
//     } else {
//       defineReactive(obj, key, value)
//     }
//     let newData = {}
//     newData[key] = value
//     proxyData(this, newData)  // 对新增的属性进行代理
//   }
// }

