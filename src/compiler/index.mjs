import compileToFunction from './compileToFunction.mjs'
import mountComponent from './mountComponent.mjs'

export default function mount(vm) {
  // 配置项上没有渲染函数，则进行编译
  if (!vm.$options.render) {
    let _template = ""
    const { el, template } = vm.$options
    // 存在template 或者 子组件挂载走这个分支
    if (template) {
      _template = template
    } else if (el) {  // 存在挂载点，拿到整个<div id="#app"></div>
      vm.$el = document.querySelector(el)
      _template = vm.$el.outerHTML
    }
    // 生成渲染函数,并挂在到$options上
    const render = compileToFunction(_template)
    vm.$options.render = render
  } else {
    // 存在render 函数的情况
  }
  mountComponent(vm)
}