import Vue from './vue.js'

// v-model
Vue.directive('model', {
  update (el, binding, vm) {
    el.value = binding.value

    el.addEventListener('input', e => {
      binding.value = e.target.value

      // 更新dom后，保持focus状态
      this._focus = true
    })

    vm.nextTick(_ => {
      if (this._focus) {
        el.focus()
      }
    })
  }
})

const vm = new Vue({
  el: 'body',
  data () {
    return {
      msg: 'hello world',
      test: {
        a: 1
      }
    }
  },
  render (dom) {
    return dom.div({
      class: 'test'
    },
      dom.p({
        '@click': (e) => alert('you click this p node!')
      }, this.msg),
      dom.input({
        '$model': 'msg',
        type: 'text'
      }),
      this.test.a.toString()
    )
  }
})

// setInterval(_ => {
//   vm.msg = 'hello world =>>>' + new Date()
// }, 1000)