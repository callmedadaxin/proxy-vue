import { isObject } from './util.js'
import Dep from './dep'
import pushQueue from './batcher'

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
    this.vm = vm
    this.cb = cb
    this.expFn = expFn
    this.value = this.subscribeAndGetVaule()
  }

  update () {
    pushQueue(this)
  }

  run () {
    const val = this.get()
    this.cb.call(this.vm, val, this.value)
    this.value = val
  }

  subscribeAndGetVaule () {
    // 暂存依赖
    Dep.target = this
    this.value = this.get()
    Dep.target = null
  }
  /**
   * 根据expFn获取对应的值
   * 支持function, string
   * function: () => vm.a + vm.b
   * string: a.b
   */
  get () {
    const fn = this.expFn
    if (typeof fn === 'function') {
      return fn.call(this.vm)
    } else {
      const expArr = fn.split('.')
      let val = this.vm
      expArr.forEach(prop => {
        val = val[prop]
      })
      return val
    }
  }
}
