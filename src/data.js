/**
 * 简单实现data的读写监听
 */
export default (obj, fn) => {
  let queuedObservers = new Set()

  const observable = new Proxy(obj, {
    get (target, prop, receiver) {
      return Reflect.get(target, prop, receiver)
    },

    set (target, prop, value) {
      const result = Reflect.set(target, prop, value)
      queuedObservers.forEach(observer => {
        observer(value)
      })

      return result
    }
  })

  const observe = fn => queuedObservers.add(fn)

  observe(fn)

  return observable
}
