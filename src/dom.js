import { hasProperty } from './util.js'

/**
 * 简单的dom操作
 */
export const dom = new Proxy({}, {
  get(target, tagName) {
    return (attrs = {}, ...childrens) => {
      const elem = document.createElement(tagName)

      // 添加attr
      for (let attr in attrs) {
        if (hasProperty(attrs, attr)) {

          // 事件绑定
          if (attr.indexOf('@') === 0) {
            // TODO 参数验证
            // TODO 绑定参数
            elem.addEventListener(attr.substr(1), attrs[attr], false)
          } else {
            elem.setAttribute(attr, attrs[attr])
          }
        }
      }

      // 渲染字节点
      childrens.forEach(children => {
        const child = typeof children === 'string' ? document.createTextNode(children) : children

        elem.appendChild(child)
      })
      
      return elem
    }
  }
})
