import { hasProperty } from './util.js'
import Watcher from './data'
import Vue from './vue.js'

const updater = {
  text (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },
  model (node, value) {
    node.value = typeof value === 'undefined' ? '' : value
  }
}

const compileUtil = {
  /**
   * 统一绑定watcher
   */
  bind (node, vm, exp, type) {
    const update = updater[type]

    update && update(node, this.getVal(vm, exp))

    new Watcher(vm, exp, (value) => {
      update && update(node, this.getVal(vm, exp))
    })
  },
  text (node, vm, exp) {
    
  },
  model (node, vm, exp) {
    this.bind(node, vm, exp, 'model')

    node.addEventListener('input', (e) => {
      const value = e.target.value
      updater.model(node, value)
      this.setVal(vm, exp, value)
    })
  },
  getVal (vm, exp) {
    // 解析a.b.c这种
    const expArr = exp.split('.')
    let val = vm

    expArr.forEach(prop => {
      val = val[prop]
    })
    return val
  },
  setVal (vm, exp, value) {
    let val = vm
    const expArr = exp.split('.')
    const len = expArr.length
    expArr.forEach((key, index) => {
      if (index >= len - 1) {
        val[key] = value
      } else {
        val = val[key]
      }
    })
  }
}

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
          this._bindDirectives(attr, _elem)
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
  _bindDirectives (attr, _elem) {
    const { _attrs, _vm } = this

    // 绑定指令
    const exp = _attrs[attr]
    const type = attr.slice(1)
    compileUtil[type] && compileUtil[type](_elem, this._vm, exp)
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
      const type = typeof children
      let child

      switch (type) {
        case 'function': 
          child = this._getDomContent(children, _elem)
          break
        case 'string':
          child = document.createTextNode(children)
          break
        default:
          child = children
      }
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
