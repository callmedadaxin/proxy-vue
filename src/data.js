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
  constructor() {
    this._subscribes = new Map()
  }

  notify (prop) {
    const subscribes = this._subscribes.get(prop)
    if (subscribes) {
      subscribes.forEach(subscribe => {
        subscribe.update()
      })
    }
  }

  addSub (prop, subscribe) {
    const subscribes = this._subscribes.get(prop)
    if (subscribes) {
      subscribes.push(subscribe)
    } else {
      this._subscribes.set(prop, [subscribe])
    }
  }
}

/**
 * 将对象转为监听对象
 * @param {*} obj 要监听的对象
 */
export const observify = (obj) => {
  if (!isObject(obj)) {
    return obj
  }

  // 深度监听
  Object.keys(obj).forEach(key => {
    obj[key] = observify(obj[key])
  })

  return defineReactive(obj)
}

function defineReactive (obj) {
  const dep = new Dep()
  
  return new Proxy(obj, {
    get: (target, prop, receiver) => {
      // 为每个属性订阅自己的事件
      if (Dep.target) {
        dep.addSub(prop, Dep.target)
      }
      return Reflect.get(target, prop, receiver)
    },

    set: (target, prop, value) => {
      const result = Reflect.set(target, prop, observify(value))
      // 触发订阅
      dep.notify(prop)
      return result  
    }
  })
}

/**
 * 简单实现data的读写监听
 */
export default class Watcher {
  constructor(vm, expFn, cb) {
    this.expFn = expFn
    this.cb = cb
    this.vm = vm
    this.value = this.subscribeAndGetVaule()
  }

  update () {
    const val = this.expFn.call(this.vm)
    this.cb.call(this.vm, val, this.value)
    this.value = val
  }

  subscribeAndGetVaule () {
    // 暂存依赖
    Dep.target = this
    this.value = this.expFn.call(this.vm)
    Dep.target = null
  }
}
