/**
 * 简单实现data的读写监听
 */

export default obj => {
  let queuedObservers = new Set()

  return new Proxy(obj, {
    get (target, prop, receiver) {
      console.log(`get property ${prop}`)
      return Reflect.get(target, prop, receiver)
    },

    set (target, prop, value) {
      console.log(`set property ${prop}: ${value}`)
      const result = Reflect.set(target, prop, value)
      queuedObservers.forEach(observer => {
        observer()
      })

      return result
    }
  })
}
