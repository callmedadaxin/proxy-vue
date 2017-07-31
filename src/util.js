export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export const isObject = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]"
}