import Vue from './vue.js'

Vue.directive('model', {
  update (el, binding) {
    el.value = binding.value

    el.addEventListener('input', e => {
      console.log(binding)
      binding.value = e.target.value
    })

    el.focus()
  }
})

const vm = new Vue({
  el: 'body',
  data () {
    return {
      msg: 'hello world'
    }
  },
  render () {
    return (dom) => dom.div({
      class: 'test'
    },
      dom.p({
        '@click': (e) => alert('you click this p node!')
      }, this.msg),
      dom.input({
        '$model': 'msg',
        type: 'text'
      })
    )
  }
})

// setInterval(_ => {
//   vm.msg = 'hello world =>>>' + new Date()
// }, 1000)