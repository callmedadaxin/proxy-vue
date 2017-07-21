import createData from './data.js'

export default class Vue {
  constructor(config) {
    this._config = config
    this.initData(config.data)
    this.bindVM()
    this.appendDom()

    return this._vm
  }

  /**
   * 初始化data为observable
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  initData (data) {
    Object.assign(this, data())
    this._vm = createData(this, this.appendDom.bind(this))
  }

  /**
   * render函数
   * 后续需要进行diff操作，不整个更新dom
   */
  appendDom () {
    const { render, el } = this._config
    const targetEl = document.querySelector(el)
    const renderDom = render()
    
    targetEl.innerHTML = ''
    targetEl.appendChild(renderDom)
  }

  /**
   * 为所有的函数绑定this
   */
  bindVM () {
    const { _config } = this

    for(let key of Object.keys(_config)) {
      const val = _config[key]
      if (typeof(val) === 'function') {
        _config[key] = val.bind(this._vm)
      }
    }
  }
}