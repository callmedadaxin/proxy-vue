export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export const isObject = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]"
}

export const toCamelCase = str => {
  return str.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase)
}

export const toKebabCase = str => {
  return str.replace(/[A-Z]/g, '-$1').toLowerCase()
}
