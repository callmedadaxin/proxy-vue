import { isObject } from './util.js'
/**
 * 简单实现data的读写监听
 */
export default class Observer {
  constructor() {
    this._queuedObservers = new Set()
  }

  watch (obj, opt = {}) {
    const { deep = false } = opt

    if (!isObject(obj)) {
      return obj
    }

    if (deep) {
      Object.keys(obj).forEach(key => {
        obj[key] = this.watch(obj[key], opt)
      })
    }

    return new Proxy(obj, {
      get: (target, prop, receiver) => {
        return Reflect.get(target, prop, receiver)
      },

      set: (target, prop, value) => {
        const oldValue = Reflect.get(target, prop)

        // 重新监听新的对象
        deep ? target[prop] = this.watch(value, opt) : ''

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
