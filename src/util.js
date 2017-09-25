export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export const isObject = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]"
}

export const isFunction = obj => {
  return typeof obj === 'function'
}

export const isString = obj => {
  return typeof obj === 'string'
}

export const toCamelCase = str => {
  return str.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase)
}

export const toKebabCase = str => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter}`).toLowerCase()
}
