import VNode from './vnode.mjs'

/** 用于在vue实例上挂载 _c 和 _v 方法 */
export default function renderHelper(vm) {
  vm._c = createElement
  vm._v = createText
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
function createText(textAst) {
  return VNode(null, null, null, this, textAst)
}