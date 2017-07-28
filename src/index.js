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
      },
      a: 'ssss',
      arr: [1, 2, 3]
    }
  },
  render (dom) {
    console.log('render')

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
      this.a.toString()
    )
  }
})

// vm.test = { a: 3 }
// vm.test.d = 4
vm.a = 1
vm.a = 2
vm.a = 3
vm.a = 4
vm.a = 5
vm.msg = 'ssssss'

// vm.arr[1] = 'sdfsdf'
// vm.arr.push(1)
// console.log('splice=>>>>>')
// vm.arr.splice(0, 1, 2)
// console.log('pop=>>>>>')
// vm.arr.pop()
// console.log('reverse=>>>>>')
// vm.arr.reverse()
// setInterval(_ => {
//   vm.msg = 'hello world =>>>' + new Date()
// }, 1000)