/** 代理，使不仅能通过this.$data.name 获取/设置响应式数据，还能通过this.name 获取/设置数据 */
export default function proxyData(vm, data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(vm, key, {
      get: () => {
        return vm.$data[key]
      },
      set: (newVal) => {
        vm.$data[key] = newVal
      }
    })
  })
}