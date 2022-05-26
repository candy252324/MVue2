import defineReactive from './defineReactive.mjs'
import Dep from './Dep.mjs'
import protoArray from './protoArray.mjs'
import observe from './observe.mjs'

/** 数据监听 */
export default class Observer {
  constructor(obj) {
    // 给vm.$data里嵌套的每一个对象和数组都添加一个__ob__属性，并且在__ob__属性上再添加一个dep属性
    // 目的：当data里的数组发生变化时，用于通知更新
    Object.defineProperty(obj, "__ob__", {
      value: this,
      // 防止递归的时候处理__ob__，导致无限递归
      // 在页面显示的时候，不想显示__ob__属性
      enumerable: false,
      writable: true,
      configurable: true
    })
    obj.__ob__.dep = new Dep()

    // 如果是数组，修改原型链并进行响应式处理
    if (Array.isArray(obj)) {
      protoArray(obj)
      this.observerArray(obj)
    } else if (Object.prototype.toString.call(obj) === '[object Object]') {
      this.walk(obj)
    }
  }
  walk(obj) {
    for (let key in obj) {
      defineReactive(obj, key, obj[key])
    }
  }
  /** 使数组中的对象具备响应式
   * arr=[ 1, 2, { name: "cxx" }]
   * this.arr[2].name="newVal"
   */
  observerArray(arr) {
    for (let item of arr) {
      observe(item)
    }
  }
}