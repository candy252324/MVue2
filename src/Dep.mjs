export default class Dep {
  constructor() {
    this.watchers = []
  }
  depend() {
    this.watchers.push(Dep.target)
    console.log("depend:watchers!!!!!!")
    console.log(this.watchers)
  }
  notify() {
    console.log("notify:watchers!!!!!!")
    console.log(this.watchers)
    for (let watchers of this.watchers) {
      watchers.update()
    }
  }
}
Dep.target = null