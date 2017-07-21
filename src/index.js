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
    return dom.div({}, dom.p({}, 'test'), dom.a({}, this.msg))
  }
})

console.log(vm.msg)

setInterval(_ => {
  vm.msg = 'hello world =>>>' + new Date()
}, 1000)