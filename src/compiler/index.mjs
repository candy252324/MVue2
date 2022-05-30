import compileToFunction from './compileToFunction.mjs'
import mountComponent from './mountComponent.mjs'

export default function mount(vm) {
  // 配置项上没有渲染函数，则进行编译
  if (!vm.$options.render) {
    let _template = ""
    const { el, template } = vm.$options
    if (template) {
      _template = template
    } else if (el) {  // 存在挂载点，拿到整个<div id="#app"></div>
      _template = document.querySelector(el).outerHTML
    }
    // 生成渲染函数,并挂在到$options上
    const render = compileToFunction(_template)
    vm.$options.render = render
  }
  mountComponent(vm)
}