import Watcher from './Watcher.mjs'
/** 模板编译 */
export default class Compiler {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)
    if (this.$el) {
      this.compile(this.$el)
    }
  }
  compile(el) {
    el.childNodes.forEach(node => {
      // 元素
      if (node.nodeType === 1) {
        this.compileElement(node)
      }
      // 是否插值表达式 {{ }}
      else if (node.nodeType === 3 && /\{\{.*?\}\}/.test(node.textContent)) {
        this.compileText(node)
      }
      if (node.hasChildNodes()) {
        this.compile(node)
      }
    })
  }
  // 渲染插值表达式,  "我的名字是{{name}},我的爱好是{{hobby}}" 
  compileText(node) {
    let nodeTextStr = node.textContent
    const matchArr = new Set(nodeTextStr.match(/\{\{.*?\}\}/g))  // ["{{name}}","{{hobby}}"] 
    matchArr.forEach(matchStr => {
      const cb = (originTextStr) => {
        matchArr.forEach(matchStr => {
          const exp = matchStr.replace(/\{/g, "").replace(/\}/g, "").trim()   // 取到插值里表达式： "name" or "hobby"
          const value = this.$vm[exp]  // 将"{{name}}" 替换成"name"的值
          originTextStr = originTextStr.replace(new RegExp(matchStr, "g"), typeof (value) === "object" ? JSON.stringify(value) : value)
        })
        node.textContent = originTextStr  // 所有的插值表达式都被替换了
      }
      // ！！！！注意：Watcher 的回调函数中必须要有 this.xxx 的数据读取操作，用于触发getter，收集依赖
      // cjh todo 这里有个依赖被重复收集的问题：
      // new Watcher写在forEach循环中，有n个插值表达式，则循环n次，产生n个watcher实例，这里没有问题
      // 但是cb函数中也需要通过forEach循环去遍历替换插值表达式，导致产生n次this.xxx的数据读取操作，触发n次getter,进而导致触发n次依赖收集
      // 如何优化？
      new Watcher(() => {
        cb(nodeTextStr)
      })
    })
  }
  // 编译元素
  compileElement(node) {
    let attrList = node.attributes
    Array.from(attrList).forEach(attr => {
      // m-text="name"
      const attrName = attr.name  //  m-text
      const exp = attr.value   //  name

      // <button m-onclick="foo"/>
      if (attrName.match(/m-on:click/) || attrName.match(/@click/)) {
        const fn = this.$vm.$options.methods[exp]
        node.addEventListener("click", () => {
          fn.apply(this.$vm)
        })
      }
      // <span m-bind:title="xxx"></span>
      else if (attrName.match(/m-bind:/)) {
        // cjh todo
      }
      // <input type="text" v-model="name">
      else if (attrName.match(/m-model/)) {
        let tagName = node.tagName.toLowerCase()
        if (tagName === "input" && node.type === "text") {
          node.addEventListener("input", (e) => {
            this.$vm[exp] = e.target.value
          })
          new Watcher(() => {
            node.value = this.$vm[exp]
          })
        } else if (tagName === "input" && node.type === "checkbox") {
          node.addEventListener("input", (e) => {
            this.$vm[exp] = e.target.checked
          })
          new Watcher(() => {
            node.checked = this.$vm[exp]
          })
        } else if (tagName === "select") {

        }

      }
      // <span m-text="name"></span>
      else if (attrName.match(/m-text/)) {
        new Watcher(() => {
          node.textContent = this.$vm[exp]
        })
      }
      // <span m-html="name"></span>
      else if (attrName.match(/m-html/)) {
        new Watcher(() => {
          node.innerHTML = this.$vm[exp]
        })
      }
    })
  }
}