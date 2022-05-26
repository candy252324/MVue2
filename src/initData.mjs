import observe from './observe.mjs'
import proxyData from './proxyData.mjs'

export default function initData(vm) {
  observe(vm.$data)
  proxyData(vm, vm.$data)
}