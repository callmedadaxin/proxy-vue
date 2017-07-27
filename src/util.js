export const hasProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export const isObject = obj => Object(obj) === obj