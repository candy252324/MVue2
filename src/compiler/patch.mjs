export default function patch(oldVnode, vnode) {
  // 组件销毁，这个分支本项目不处理
  if (oldVnode && !vnode) {
    console.log("组件销毁！！！")
    return
  }
  // 子组件首次渲染
  if (!oldVnode) {

  } else {
    // 存在nodeType, 说明是真实节点，则是根节点首次渲染
    if (oldVnode.nodeType) {
      const parent = oldVnode.parentNode // 父节点 body
      const referNode = oldVnode.nextSibling  // 参考节点，第一个script 标签
      // 将vnode变成真实元素挂载到父节点内
      createElm(vnode, parent, referNode)
      // 移除老的vNode(模板节点)  
      parent.removeChild(oldVnode)
    } else {
      // 更新
      console.log("update!")
    }
  }
}


/**
 * 创建元素
 * @param {*} vnode VNode
 * @param {*} parent VNode 的父节点，真实节点
 * @param {*} referNode 参考节点
 */
function createElm(vnode, parent, referNode) {
  // 记录节点的父节点
  vnode.parent = parent
  // 如果是自定义组件<my-comp><my-comp/>, 
  if (createComponent(vnode)) return
  // 否则走接下来的原生标签逻辑
  const { attr, children, text } = vnode
  if (text) { // 文本节点
    // 创建文本节点，并插入到父节点内
    vnode.elm = createTextNode(vnode)
  } else { // 元素节点
    // 创建元素，在 vnode 上记录对应的 dom 节点
    vnode.elm = document.createElement(vnode.tag)
    // 给元素设置属性
    setAttribute(attr, vnode)
    // 递归创建子节点
    for (let i = 0, len = children.length; i < len; i++) {
      createElm(children[i], vnode.elm)
    }
  }
  // 如果存在 parent，则将创建的节点插入到父节点内
  if (parent) {
    const elm = vnode.elm
    if (referNode) {
      parent.insertBefore(elm, referNode)
    } else {
      parent.appendChild(elm)
    }
  }
}


function createComponent(vnode) {

}

/**
 * 创建文本节点
 * @param {*} textVNode 文本节点的 VNode
 */
function createTextNode(textVNode) {
  let { text } = textVNode
  let textNode = null
  if (text.expression) {
    // 存在表达式，这个表达式的值是一个响应式数据
    const value = textVNode.context[text.expression]
    textNode = document.createTextNode(typeof value === 'object' ? JSON.stringify(value) : String(value))
  } else {
    // 纯文本
    textNode = document.createTextNode(text.text)
  }
  return textNode
}


/**
 * 给节点设置属性
 * @param {*} attr 属性 Map 对象
 * @param {*} vnode
 */
function setAttribute(attr, vnode) {
  // 遍历属性，如果是普通属性，直接设置，如果是指令，则特殊处理
  for (let name in attr) {
    if (name === 'mModel') {
      // m-model 指令
      const { tag, value } = attr.mModel
      setMModel(tag, value, vnode)
    } else if (name === 'mBind') {
      // m-bind 指令
      setMBind(vnode)
    } else if (name === 'mOn') {
      // m-on 指令
      setMOn(vnode)
    } else {
      // 普通属性
      vnode.elm.setAttribute(name, attr[name])
    }
  }
}

/**
 * v-model 的原理
 * @param {*} tag 节点的标签名
 * @param {*} value 属性值
 * @param {*} node 节点
 */
function setMModel(tag, value, vnode) {
  const { context: vm, elm } = vnode
  if (tag === 'select') {
    // 下拉框，<select></select>
    Promise.resolve().then(() => {
      // 利用 promise 延迟设置，直接设置不行， 因为这会儿 option 元素还没创建
      elm.value = vm[value]
    })
    elm.addEventListener('change', function () {
      vm[value] = elm.value
    })
  } else if (tag === 'input' && vnode.elm.type === 'text') {
    // 文本框，<input type="text" />
    elm.value = vm[value]
    elm.addEventListener('input', function () {
      console.log(elm.value)
      vm[value] = elm.value
    })
  } else if (tag === 'input' && vnode.elm.type === 'checkbox') {
    // 选择框，<input type="checkbox" />
    elm.checked = vm[value]
    elm.addEventListener('change', function () {
      vm[value] = elm.checked
    })
  }
}

/**
 * v-bind 原理
 * <span v-bind:title="test"></span>
 * <span title="xxx"></span>
 * @param {*} vnode
 */
function setMBind(vnode) {
  const { attr: { mBind }, elm, context: vm } = vnode
  for (let attrName in mBind) {
    elm.setAttribute(attrName, vm[mBind[attrName]])
    elm.removeAttribute(`m-bind:${attrName}`)
  }
}
