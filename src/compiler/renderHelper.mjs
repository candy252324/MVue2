import VNode from './vnode.mjs'

/** 用于在vue实例上挂载 _c 和 _v 方法 */
export default function renderHelper(vm) {
  vm._c = createElement
  vm._v = createTextNode
  vm._t = renderSlot
}

/**
 * 根据标签信息创建 Vnode
 * @param {string} tag 标签名 
 * @param {Map} attr 标签的属性 Map 对象
 * @param {Array<Render>} children 所有的子节点的渲染函数
 */
function createElement(tag, attr, children) {
  return VNode(tag, attr, children, this)
}

/**
 * 生成文本节点的 VNode
 * @param {*} textAst 文本节点的 AST 对象
 */
function createTextNode(textAst) {
  return VNode(null, null, null, this, textAst)
}

/**
 * 生成插槽的的 VNode
 * @param {*} attrs 插槽的属性
 * @param {*} children 插槽所有子节点的 ast 组成的数组
 */
function renderSlot(attrs, children) {
  // 父组件 VNode 的 attr 信息
  const parentAttr = this._parentVnode.attr
  let vnode = null
  // 说明给当前组件的插槽传递了内容, 如：
  // <slot-comp>
  //  <template v-slot:default="slotProps">
  //    <span>{{slotProps}}</span>
  //  </template>
  // </slot-comp>
  if (parentAttr.scopedSlots) {
    // 获取插槽信息
    const slotName = attrs.name
    const slotInfo = parentAttr.scopedSlots[slotName]
    // 这里的逻辑稍微有点绕，建议打开调试，查看一下数据结构，理清对应的思路
    // 这里比较绕的逻辑完全是为了实现插槽这个功能，和插槽本身的原理没关系
    debugger
    this[slotInfo.scopeSlot] = this[Object.keys(attrs.vBind)[0]]
    vnode = genVNode(slotInfo.children, this)
  } else { // 插槽默认内容 ,没传内容 <slot-comp></slot-comp>
    // 将 children 变成 vnode 数组
    debugger
    vnode = genVNode(children, this)
  }

  // 如果 children 长度为 1，则说明插槽只有一个子节点
  if (children.length === 1) return vnode[0]
  return createElement.call(this, 'div', {}, vnode)
}

/**
 * 将一批 ast 节点(数组)转换成 vnode 数组
 * @param {Array<Ast>} childs 节点数组
 * @param {*} vm 组件实例
 * @returns vnode 数组
 */
function genVNode(childs, vm) {
  const vnode = []
  debugger
  for (let i = 0, len = childs.length; i < len; i++) {
    const { tag, attr, children, text } = childs[i]
    if (text) { // 文本节点
      if (typeof text === 'string') { // text 为字符串
        // 构造文本节点的 AST 对象
        const textAst = {
          type: 3,
          text,
        }
        if (text.match(/{{(.*)}}/)) {
          // 说明是表达式
          textAst.expression = RegExp.$1.trim()
        }
        vnode.push(createTextNode.call(vm, textAst))
      } else { // text 为文本节点的 ast 对象
        vnode.push(createTextNode.call(vm, text))
      }
    } else { // 元素节点
      vnode.push(createElement.call(vm, tag, attr, genVNode(children, vm)))
    }
  }
  return vnode
}
