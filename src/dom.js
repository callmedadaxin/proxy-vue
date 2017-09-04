import { hasProperty } from './util.js'
import Watcher from './data'
import Vue from './vue.js'

export default class Dom {
  constructor (vm) {
    // 确定每次节点都能访问到vm实例
    this._vm = vm

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
          this._bindDirectives(attr)
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
    const { _attrs, _elem, _vm } = this

    // 绑定指令
    const directive = Vue._directors.get(attr)
    directive.call(this, this._elem, {
      name: attr.substr(1),
      value: _attrs[attr]
    }, _vm)
  }

  /**
   * 事件绑定
   * @return {[type]} [description]
   */
  _bindEvents (attr) {
    // TODO event decorator
    this._elem.addEventListener(attr.substr(1), this._attrs[attr], false)
  }

  /**
   * 渲染子节点
   */
  _addChildrens () {
    const { _childrens, _elem } = this
    
    _childrens.forEach(children => {
      const child = typeof children === 'function' ? this._getDomContent(children, _elem) : children
      _elem.appendChild(child)
    })
  }

  _getDomContent (fn, _elem) {
    let node = document.createTextNode(fn())
    new Watcher(this._vm, fn, (val) => {
      node.textContent = val
    })
    
    return node
  }
}
