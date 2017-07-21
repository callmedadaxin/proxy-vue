import Vue from './vue.js'
import dom from './dom.js'

const vm = new Vue({
  el: 'body',
  data () {
    return {
      msg: 'hello world'
    }
  },
  render () {
    return dom.div({
      class: 'test'
    },
      dom.p({}, 'test'),
      dom.a({
        href: 'https://www.baidu.com'
      }, this.msg)
    )
  }
})

console.log(vm.msg)

setInterval(_ => {
  vm.msg = 'hello world =>>>' + new Date()
}, 1000)