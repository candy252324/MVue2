import Compiler from './Compiler.mjs'

export default function mount(vm) {
  new Compiler(vm.$options.el, vm)  // 编译
}