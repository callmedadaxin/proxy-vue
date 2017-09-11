import Vue from './vue.js'

const vm = new Vue({
  el: 'body',
  data () {
    return {
      msg: 'hello world',
      test: {
        a: 1
      },
      a: 1,
      b: 2,
      arr: [1, 2, 3],
      style: {
        color: 'red'
      },
      showBtn: true
    }
  },
  render (dom) {
    return dom.div({
      class: 'test'
    },
      dom.p({
        '@click': (e) => alert('you click this p node!'),
      }, () => {
        return `a + b = ${this.a + this.b}`
      }),
      dom.input({
        '$model': 'test.a',
        type: 'text'
      }),
      () => this.msg,
      () => this.test.a
    )
  }
})

// vm.test = { a: 3 }
// vm.test.a = 4
vm.a = 1
vm.a = 2
vm.a = 3
vm.a = 4
vm.a = 5
vm.b = 10
// vm.msg = 'sssss'
// vm.msg = '2222'

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