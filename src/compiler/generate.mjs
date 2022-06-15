/**
 * 从 ast 生成渲染函数
 * @param {*} ast ast 语法树
 * @returns 渲染函数
 */
export default function generate(ast) {
  // 渲染函数字符串形式
  const renderStr = genElement(ast)
  // 通过 new Function 将字符串形式的函数变成可执行函数，并用 with 为渲染函数扩展作用域链
  return new Function(`with(this) { return ${renderStr} }`)
}

/**
 * 解析 ast 生成 渲染函数
 * @param {*} ast 语法树 
 * @returns {string} 渲染函数的字符串形式
 */
function genElement(ast) {
  const { tag, rawAttr, attr } = ast

  // 生成属性 Map 对象，静态属性 + 动态属性
  const attrs = { ...rawAttr, ...attr }
  // 处理子节点，得到一个所有子节点渲染函数组成的数组
  const children = genChildren(ast)
  // 插槽处理
  if (tag === "slot") {
    // 注：这里vue中没有使用 JSON.stringify，而是使用字符串拼接的方式做的，
    // 这里使用JSON.stringify导致在处理slot的时候出现了一个循环引用爆栈的问题，需要特殊处理（处理内容搜索"备注1"）
    return `_t(${JSON.stringify(attrs)}, [${children}])`
  }

  // 生成 VNode 的可执行方法, 元素节点，用_c处理
  return `_c('${tag}', ${JSON.stringify(attrs)}, [${children}])`
}

/**
 * 处理 ast 节点的子节点，将子节点变成渲染函数
 * @param {*} ast 节点的 ast 对象 
 * @returns [childNodeRender1, ....]
 */
function genChildren(ast) {
  const ret = [], { children } = ast
  // 遍历所有的子节点
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i]
    if (child.type === 3) {
      // 文本节点, 使用 _v 处理
      ret.push(`_v(${JSON.stringify(child)})`)
    } else if (child.type === 1) {
      // 元素节点
      ret.push(genElement(child))
    }
  }
  return ret
}
