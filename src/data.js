import { isObject } from './util.js'
/**
 * 简单实现data的读写监听
 */
export default class Observer {
  constructor() {
    this._queuedObservers = new Set()
  }

  watch (obj) {
    if (!isObject(obj)) {
      return obj
    }

    Object.keys(obj).forEach(key => {
      obj[key] = this.watch(obj[key])
    })

    return new Proxy(obj, {
      get: (target, prop, receiver) => {
        return Reflect.get(target, prop, receiver)
      },

      set: (target, prop, value) => {
        const oldValue = Reflect.get(target, prop)

        // 重新监听新的对象
        target[prop] = this.watch(value)

        // 触发订阅
        this._notify(value, oldValue)

        return true
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
