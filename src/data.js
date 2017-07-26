/**
 * 简单实现data的读写监听
 */
export default class Observer {
  constructor() {
    this._queuedObservers = new Set()
  }

  watch (obj) {
    return new Proxy(obj, {
      get: (target, prop, receiver) => {
        return Reflect.get(target, prop, receiver)
      },

      set: (target, prop, value) => {
        const oldValue = Reflect.get(target, prop)
        const result = Reflect.set(target, prop, value)
        
        this._notify(value, oldValue)

        return result
      }
    })
  }

  /**
   * 添加订阅
   */
  addWatcher (fn) {
    this._queuedObservers.add(fn)
  }

  /**
   * 触发订阅
   */
  _notify (value, oldValue) {
    this._queuedObservers.forEach(observer => {
      observer(value, oldValue)
    })
  }
}