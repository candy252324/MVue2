/**
 * 生成指定节点的VNode
 * @param {*} tag 标签名
 * @param {*} attr 属性 Map 对象
 * @param {*} children 子节点组成的 VNode数组
 * @param {*} context Vue 实例
 * @param {*} text 文本节点的 ast 对象
 * @returns VNode
 */
export default function vnode(tag, attr, children, context = null, text = null) {
  return {
    tag,
    attr,
    parent: null,    // 当前节点的父节点，这是真实的dom节点
    children,
    text,
    elm: null,   // Vnode 的真实节点
    context
  }
}