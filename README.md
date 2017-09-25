# 使用Proxy实现简单的Vue

> 尝试使用es6新特性，自己来实现一个mvvm及vue的各种特性。

## 功能

- [x] 使用proxy实现基本的数据驱动
- [x] 观察者模式订阅更新
- [x] 精准依赖收集
- [x] 异步更新队列
- [x] 深度监听
- [x] 简单模板渲染
- [x] 节点响应数据更新
- [x] 双向数据绑定
- [ ] style/class绑定
- [ ] computed\watch整合
- [ ] directive指令
- [ ] v-bind/v-if/v-for等简单指令
- [ ] 事件处理器
- [ ] 组件系统
- [ ] 插件系统
...

## 细节
### 1. 基本的数据驱动
观察数据，进行基本的响应

```
import Watcher, { observify } from './data.js'

let obj = observify({
  a: 1
})

new Watcher(obj, 'a', (newVal, oldVal) => {
  console.log(`a的值更新了，新值为：${newVal}, 旧值为：${oldVal}`)
})

obj.a = 2
```

### 2.观察者模式订阅更新
内部集成观察者模式，将订阅多个事件，在对象变化时，发布到多个观察者

```
let obj = observify({
  a: 1
})

new Watcher(obj, 'a', (newVal, oldVal) => {
  console.log(`a的值更新了，新值为：${newVal}, 旧值为：${oldVal}`)
})

new Watcher(obj, 'a', (newVal, oldVal) => {
  console.log(`a的值更新了，新值为：${newVal}, 旧值为：${oldVal}`)
})

obj.a = 2
```

### 3.精准依赖收集
仅仅对收集到的依赖进行更新，支持render函数模式

```
let obj = observify({
  a: 1,
  b: 2,
  c: 3
})

new Watcher(obj, 'a', (newVal, oldVal) => {
  console.log(`a的值更新了，新值为：${newVal}, 旧值为：${oldVal}`)
})

new Watcher(obj, () => {
  return obj.a + obj.b
}, (newVal, oldVal) => {
  console.log(`结果更新了，新值为：${newVal}, 旧值为：${oldVal}`)
})

obj.a = 2 // 触发watcher
obj.c = 10 // 并不会被触发
```

### 4.异步更新队列



