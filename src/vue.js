import createData from './data.js'

export default class Vue {
  constructor(config) {
    for(let key of Object.keys(config)) {
      const val = config[key]
      if (typeof(val) === 'function') {
        config[key] = val.bind(this)
      }
    }

    this._config = config
    this.initData(config.data)
    this.appendDom()

    return this._vm
  }

  initData (data) {
    Object.assign(this, data())
    this._vm = createData(this, this.appendDom.bind(this))
  }

  appendDom () {
    const { render, el } = this._config
    const targetEl = document.querySelector(el)
    const renderDom = render()
    
    targetEl.innerHTML = ''
    targetEl.appendChild(renderDom)
  }
}