import { isObject } from './util.js'

let queue = new Set()

function flushQueue (args) {
  queue.forEach(fn => {
    fn(args)
    // 清空队列
    queue = new Set()
  })
}

function pushQueue (fn, args) {
  queue.add(fn)
  Promise.resolve().then(()=> flushQueue(args))
}

/**
 * 实现订阅及依赖收集
 */
class Dep {
  constructor(observers) {
    this._observers = observers 
    this._collections = new Set()
  }

  notify (prop, oldValue, getValue) {
    // 仅触发被订阅的prop
    this._collections.has(prop) && this._observers.forEach(observer => {
      
      pushQueue(observer, {
        prop,
        oldValue,
        getValue
      })
    })
  }

  pub (prop, val) {
    this._collections.add(prop)
  }
}

/**
 * 简单实现data的读写监听
 */
export default class Observer {
  constructor() {
    this._queuedObservers = new Set()
    this._value = {}
  }

  /**
   * 暴露对外的watch函数，将对象变为Proxy,并监听set事件
   * @param  {Object} obj     转换对象
   * @param  {Object} opt     options
   * @param  {Object} baseObj 缓存的纯净对象
   * @return {Proxy}         具有监听的Proxy对象
   */
  watch (obj, opt = {}, baseObj = obj) {
    const { deep = false } = opt

    if (!isObject(obj)) {
      return obj
    }

    // 深度监听
    if (deep) {
      Object.keys(obj).forEach(key => {
        obj[key] = this.watch(baseObj[key], opt, baseObj[key])
      })
    }

    return this._defineReactive(obj, opt, obj)
  }

  /**
   * 添加响应的回调
   * 当回调频繁被触发时，去除重复数据
   * @param {Function} fn 订阅的回调
   */
  addWatcher (fn) {
    this._queuedObservers.add(({prop, oldValue, getValue}) => {
      const val = getValue()
      const oldVal = this._value[prop]

      if (val !== this._value[prop]) {
        fn(val, oldVal)
        this._value[prop] = val
      }
    })
  }

  /**
   * 将对象转为Proxy对象
   * @param  {Object} obj     转换对象
   * @param  {Object} opt     options
   * @param  {Object} baseObj 缓存的纯净对象
   * @return {Proxy}         具有监听的Proxy对象
   */
  _defineReactive(obj, opt, baseObj) {
    const dep = new Dep(this._queuedObservers)

    return new Proxy(obj, {
      get: (target, prop, receiver) => {
        // 为每个属性订阅自己的事件
        dep.pub(prop, target[prop])
        return Reflect.get(target, prop, receiver)
      },

      set: (target, prop, value) => {
        const oldValue = Reflect.get(target, prop)
        
        baseObj[prop] = value

        // 重新监听新的对象
        if (opt.deep) {
          target[prop] = this.watch(baseObj[prop], opt, baseObj[prop])
        }

        // 触发订阅
        dep.notify(prop, oldValue, () => obj[prop])

        return Reflect.set(target, prop, value)
      }
    })
  }
}
