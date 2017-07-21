import { hasProperty } from './util.js'

class Dom {
  constructor () {
    return new Proxy({}, {
      get: this._getDom.bind(this)
    })
  }

  _getDom (target, tagName) {
    return (attrs = {}, ...childrens) => {
      this._elem = document.createElement(tagName)
      this._attrs = attrs
      this._childrens = childrens
      this._bindAttrs()
      this._addChildrens()

      return this._elem
    }
  }

  /**
   * 属性
   * @return {[type]} [description]
   */
  _bindAttrs () {
    const { _attrs, _elem } = this

    for (let attr in _attrs) {
      if (hasProperty(_attrs, attr)) {

        // 事件绑定
        if (attr.indexOf('@') === 0) {
          this._bindEvents(attr)
        } else if (attr.indexOf('$') === 0) {
          this.__bindDirectives(attr)
        } else {
          _elem.setAttribute(attr, _attrs[attr])
        }
      }
    }
  }

  /**
   * 指令
   * @return {[type]} [description]
   */
  _bindDirectives (attr) {
    const { attrs, _elem } = this

    // TODO 将绑定directives单独抽离，
    // 这样可以在其中访问到vm实例，并进行后续操作
  }

  /**
   * 事件绑定
   * @return {[type]} [description]
   */
  _bindEvents (attr) {
    this._elem.addEventListener(attr.substr(1), attrs[attr], false)
  }

  /**
   * 渲染子节点
   */
  _addChildrens () {
    const { _childrens, _elem } = this
    
    _childrens.forEach(children => {
      const child = typeof children === 'string' ? document.createTextNode(children) : children
      _elem.appendChild(child)
    })
  }
}

export default new Dom()
