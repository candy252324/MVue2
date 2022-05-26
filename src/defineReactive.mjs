import Dep from './Dep.mjs'
import observe from './observe.mjs'

/** 数据监听 */
export default function defineReactive(obj, key, value) {
  let childOb = observe(value) // value可能是个对象，需要进行监听
  const dep = new Dep()

  // 这里相当于是一个闭包，data中的每一个key,都对应一个dep实例，
  // 所以watcher的回调函数中的this.xxx的读取操作触发getter时，同一个key的依赖会被放到同一个dep实例中
  Object.defineProperty(obj, key, {
    get: () => {
      // 如果Dep已经实例化过
      if (Dep.target) {
        dep.depend()  // 收集依赖，当执行 this.arr=[xxx] 时，会触发这里的依赖更新
        // 如果存在子ob, 则顺道一起把子对象的依赖收集也完成
        if (childOb) {
          childOb.dep.depend()  // 当执行this.arr.push()操作时，会触发这里的依赖更新
        }
      }
      console.log("get value:", value)
      return value
    },
    set: (newValue) => {
      console.log("set value", key, ":", newValue)
      if (newValue === value) return
      value = newValue
      observe(value)  // set的值可能是个对象，需要进行监听
      dep.notify()  // 依赖通知更新
    }
  })
}
