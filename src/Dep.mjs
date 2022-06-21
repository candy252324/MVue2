export default class Dep {
  constructor() {
    this.watchers = []
  }
  depend() {
    this.watchers.push(Dep.target)
  }
  notify() {
    for (let watchers of this.watchers) {
      watchers.update()
    }
  }
}
Dep.target = null