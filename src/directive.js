import Vue from './vue.js'
import Observer from './data.js'

/**
 * 自定义指令
 */
export default (name, options) => {
  const { update } = options

  const cb = (el, binding, vm) => {
    // 当binding.value为实例的属性时，binding的更新触发属性的更新
    // TODO 模板中统一处理
    const { value } = binding
    const watcher = new Observer()

    if (typeof(value) === 'string') {
      binding.value = vm[value]
      binding = watcher.watch(binding)
      watcher.addWatcher(val => {
        vm[value] = val
      })
    }
    update && update.call(options, el, binding, vm)
  }

  Vue._directors.set(`$${name}`, cb)
}
