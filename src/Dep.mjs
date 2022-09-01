export default class Dep {
  constructor() {
    this.watchers = []
  }
  depend() {
    // 防止 watcher 被重复收集
    if (this.watchers.includes(Dep.target)) return
    this.watchers.push(Dep.target)
  }
  notify() {
    for (let watchers of this.watchers) {
      watchers.update()
    }
  }
}
Dep.target = null